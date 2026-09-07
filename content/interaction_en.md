# Beyond Turn-Taking: Toward Models That Listen, Speak, and Act

*Originally written May 14, 2026 · An earlier exploration of interactive AI*

[Read the Chinese edition →](https://app.notion.com/p/3c57bc231a8281cf8d2dc6d209f67002)

## 1. Interaction models, full duplex, and the limits of turn-taking

In May 2026, Thinking Machines Lab published [Interaction Models: A Scalable Approach to Human-AI Collaboration](https://thinkingmachines.ai/blog/interaction-models/). Its demos showed a model listening, watching a user's activity, entering the conversation at the right moment, and using tools while the interaction continued. At a time when much of the field was optimizing long-horizon agentic tasks, TML made a different bet: interactivity itself deserves to scale.

The motivation is simple. A conventional chatbot imposes a rigid protocol: I finish my message, the model computes, the model finishes its answer, and only then can I respond. This alternation is convenient for a text interface, but it is not how people naturally collaborate. In a real conversation, we overlap, hesitate, backchannel, interrupt, point at things, correct ourselves, and act before a sentence is complete. Silence is meaningful. Timing is part of the message.

Many “real-time” assistants still place a turn-taking harness around an essentially turn-based model. Voice-activity detection decides when the user has stopped; automatic speech recognition converts the completed utterance into text; the language model produces a response; text-to-speech renders it back into audio. The underlying model does not necessarily learn the joint dynamics of listening and speaking; it receives completed transactions.

A full-duplex model changes the modeling problem. It continuously receives the user's stream while continuously producing its own stream—where the output may be speech, a backchannel, or natural silence. It does not need a privileged “end of turn” event. Overlap and interruption become patterns in the training distribution rather than exceptions handled by external logic.

TML extends this idea beyond speech. Its interaction model processes time-aligned 200 ms micro-turns across audio, video, and text. A second, asynchronous background model handles sustained reasoning, browsing, tool use, and longer-horizon work. The two systems are complementary: the interaction model stays present while the background model thinks.

This is the key architectural idea in this essay:

> Interactive intelligence runs on at least two clocks: a fast clock for presence and a slower clock for deliberation.

The most serious open implementation of the fast-clock idea that I had studied before TML's release was Kyutai's Moshi. Moshi makes the abstraction concrete enough to inspect: what is a conversational “moment,” which streams are predicted, and where does latency actually come from?

## 2. Moshi: making conversation a joint stream

[Moshi](https://arxiv.org/abs/2410.00037) is a 7B speech-text foundation model built from three main components: Helium, a text language model trained on 2.1 trillion public English tokens; Mimi, a causal neural audio codec; and a hierarchical Transformer that models text and audio streams together.

The codec is the first important design choice. Mimi converts 24 kHz audio into eight discrete codebooks at 12.5 frames per second. One frame therefore represents 80 ms of audio. The first codebook is trained to carry high-level semantic information distilled from WavLM; the remaining seven progressively carry acoustic detail. Each codebook has 2,048 entries. This is dramatically slower in time than common high-rate audio tokenizations, which makes streaming autoregressive modeling tractable.

Moshi then separates modeling across time from modeling within a frame:

- A 32-layer Temporal Transformer advances at 12.5 Hz and carries the conversational history.
- A smaller six-layer Depth Transformer resolves the codebooks within each 80 ms frame.

One easy source of confusion is the number 4,096. Helium's original text model has a context length of 4,096 text tokens, and Moshi's Temporal Transformer also has model dimension 4,096. Neither number is Moshi's temporal audio context. For speech training, the paper reports a context of 3,000 temporal steps—about four minutes at 12.5 Hz. The released system is evaluated on conversations of roughly five minutes.

The stream accounting also deserves precision. With Inner Monologue enabled, Moshi represents 17 aligned streams at each temporal step:

1. one text stream aligned to Moshi's own speech;
2. eight audio-codebook streams for Moshi; and
3. eight audio-codebook streams for the user.

But “17 streams” does not mean that the deployed model sequentially invents 17 new tokens before it can advance. At inference time, the eight user tokens are observations supplied by the live audio stream. The system samples nine model-side outputs: one text token and eight Moshi audio tokens. The joint 17-stream representation is useful during training—among other things, it lets the model generate both sides of a simulated conversation—but application-time user predictions are ignored. The Temporal Transformer moves once per frame; the Depth Transformer handles the within-frame structure.

This distinction matters because it explains how Moshi can model overlap without flattening every stream into a prohibitively long sequence. At each time step, the model conditions on both speakers' recent audio. There is no explicit turn variable. When Moshi should not speak, its own audio stream generates near-silence and its text stream emits padding. When the user interrupts, that input enters the next joint state rather than waiting for Moshi's current sentence to end.

### Inner Monologue is a scaffold, not hidden reasoning

Moshi's “Inner Monologue” is a time-aligned textual representation of its own generated speech. It is best understood as a linguistic scaffold, not as an unobserved chain of thought. The model jointly predicts the words it is saying and the audio that realizes them. It does not transcribe the user's stream inside the original end-to-end model.

The scaffold matters empirically. On the paper's spoken question-answering evaluations, Moshi with Inner Monologue scored 26.6 on WebQuestions, 62.3 on Llama Questions, and 22.8 on TriviaQA; removing it reduced the scores to 9.2, 21.0, and 7.3. Yet audio post-training still costs some text capability: Helium scored 54.3 on MMLU, compared with 49.7 for the final multi-stream Moshi.

Moshi reports 160 ms theoretical latency and about 200 ms in practice. The theoretical figure comes from the 80 ms codec frame plus one 80 ms acoustic-delay step in the final model. It should not be confused with total conversational latency across microphone capture, networking, scheduling, and playback. Still, it is low enough to put the model inside the timing regime of human conversation rather than merely speeding up a turn-based pipeline.

That achievement exposes the next problem. A compact model can remain present in real time, but it cannot hold the same factual knowledge or spend the same test-time compute as a large reasoning model. Scaling the front end naively increases both quality and latency. MoshiRAG asks whether those two quantities have to remain coupled.

## 3. MoshiRAG: retrieve while speaking

[MoshiRAG](https://arxiv.org/abs/2604.12928) adds asynchronous knowledge retrieval to the full-duplex front end. The system contains a 7B Moshi, a separate 1B streaming ASR model with approximately 0.5 s latency, a frozen reference-text encoder, and a replaceable retrieval back end. The back end can be a larger local model such as Gemma 3 27B, an API model such as GPT-4.1, or web search such as Tavily.

The central observation is temporal. The first sound in an answer is not usually the fact that resolves the question. A speaker may begin with a grammatical lead—“In the Netflix series…”—before saying the key answer—“Chicago.” MoshiRAG distinguishes:

- time to first audio token;
- keyword delay, from the start of the response to the key information; and
- end-to-end keyword delay, the sum of the two.

In the paper's measurements, existing speech models often had more than three seconds of end-to-end keyword delay. MoshiRAG uses that interval as a compute budget. When the front end predicts a special `<ret>` token, the current transcript is sent to the back end. Moshi does not stop. It produces a short pre-retrieval lead while the back end finds or computes the answer. When the result arrives, a reference encoder turns it into embeddings that are added to the ongoing temporal stream, and Moshi grounds the body of the same spoken response in the new information.

Retrieval does not become instantaneous. The system overlaps it with speech so perceived responsiveness and time-to-information are no longer the same metric.

The training data mirrors that structure. Knowledge-intensive responses are synthesized as a lead, a reference-grounded body, and an optional tail. The published corpus contains about 1.9 million synthetic conversation instances. MoshiRAG is initialized from Moshi and trained for 100,000 updates, with retrieval delays randomized so the model learns to absorb evidence arriving at different points.

### What Table 1 actually reports

The main factuality table reports two scores for each MoshiRAG condition: **reference accuracy | final spoken-response accuracy**. Collapsing those columns would hide the integration loss between what the back end knows and what the speech model ultimately says.

| Back end | LlamaQ | WebQ | TriviaQA | HaluEval |
|---|---:|---:|---:|---:|
| Gemma 3 27B | 83.0 \| 80.3 | 71.5 \| 67.2 | 73.7 \| 69.6 | 42.0 \| 36.3 |
| GPT-4.1 | 87.8 \| 80.6 | 77.7 \| 68.9 | 86.8 \| 78.2 | 61.2 \| 51.3 |
| Tavily | 84.6 \| 78.2 | 73.5 \| 66.1 | 84.9 \| 77.5 | 54.3 \| 47.0 |
| Vanilla Moshi, response only | 62.3 | 26.6 | 22.8 | 10.5 |

With Gemma 3 27B, the table also reports 0.0 s time to first audio token, 3.1 s keyword delay, 3.1 s end-to-end keyword delay, and 0.37 × 10^12 FLOPs per generated audio second. The “zero” is a benchmark convention for content-generation onset, not zero end-to-end system latency. Across the displayed back ends and QA datasets, retrieved-reference accuracy exceeds final-response accuracy by 2.7 to 9.9 percentage points. The back end is therefore both an enabler and an upper bound.

MoshiRAG also generalized beyond its primarily question-answering training distribution. On GSM8K, for example, vanilla Moshi scored 2.1, while MoshiRAG with the Gemma back end scored 33.9; summarizing the retrieved reasoning before injection raised it to 51.2. This is suggestive, but it does not make MoshiRAG a frontier mathematical reasoner: the authors explicitly note that it remains behind models trained for speech reasoning.

## 4. One system, two clocks

MoshiRAG and TML's Interaction Models are not the same system. MoshiRAG is a compact, open, speech-first architecture whose slow path is selective retrieval. TML trains a much larger native audio-video-text interaction model—TML-Interaction-Small is a 276B mixture-of-experts model with 12B active parameters—and pairs it with a general background agent for reasoning and tools.

But they converge on the same systems principle: do not force the component responsible for social timing to also finish every expensive cognitive operation before it can respond.

The fast model maintains common ground. It tracks whether the user is still speaking, whether an interruption is a correction, what is visible now, and whether a short acknowledgment is appropriate. The slow model searches, plans, verifies, and operates tools. Results return as a stream, and the front end decides when and how to integrate them given what has happened in the meantime.

This division is more subtle than “small model for latency, large model for intelligence.” Coordination becomes part of the learning problem. What context should be delegated? When should a background result be canceled because the user changed direction? How should the fast model express uncertainty before evidence arrives? Who owns the final action? A useful interaction architecture must learn arbitration, not merely connect two endpoints.

## 5. Limits that the demos do not remove

First, conversational fluency can disguise rather than solve latency. A three-second lead feels better than three seconds of silence, but users still wait three seconds for the key fact. Filler that becomes repetitive or manipulative would be a failure mode, not a capability.

Second, retrieval quality does not equal response quality. MoshiRAG's reference-response gap shows that a correct document can be compressed, misread, or poorly verbalized. The separate ASR also makes the retrieval path modular, but it reintroduces a text bottleneck: prosody and nonverbal context available to Moshi are not necessarily passed to the back end.

Third, the evidence base is still narrow. MoshiRAG is trained largely on synthetic conversations, while major evaluations are single-turn spoken QA with model-based judges. The paper notes that there is no consensus on the right amount of backchanneling. Its retrieval trigger is learned from training examples rather than calibrated directly to query difficulty or optimized with reinforcement learning. Robustness to bad retrieval remains open.

Fourth, full-duplex systems create new safety problems. A model that can interrupt, react to a camera feed, or act through tools has more opportunities to help—and more opportunities to act at the wrong moment. Real-time presence can also increase anthropomorphic trust. Both Kyutai and TML identify misinformation, over-reliance, long-session robustness, alignment, and deployment reliability as unresolved.

Finally, scale is constrained by the wall clock. TML reports strong interaction results, including 0.40 s turn-taking latency on FD-Bench V1 and 77.8 on FD-Bench V1.5, but also says its larger pretrained models are currently too slow for this setting. Its post is a research release rather than a peer-reviewed paper, and some reported results use the background agent. The broader claim—that interactivity will improve smoothly with scale—remains a research bet, not yet a scaling law.

## 6. From conversation to robotics

The deeper reason I care about this line of work is that physical systems have never been turn-based. A robot cannot freeze perception while a planner thinks. It must keep sensing, maintain balance, monitor people, and revise its action as the world changes. The natural architecture is already multi-rate: high-frequency control, medium-frequency perception and interaction, slower planning and retrieval.

The analogy should not be taken too literally. A speech model can buy two seconds with “Let me check.” A robot arm cannot hide an unsafe trajectory behind a conversational lead. Embodied interaction requires hard constraints, interruptible policies, calibrated uncertainty, and a clear hierarchy between fast reflexes and slow plans. But the systems question is shared: how do we preserve a coherent state while perception, communication, reasoning, and action proceed concurrently?

That is why I see full-duplex speech models as more than a voice-interface niche. They are a relatively safe laboratory for learning temporal coordination. Moshi shows how to represent simultaneous streams. MoshiRAG shows how to inject delayed computation without stopping the stream. Interaction Models generalize the pattern to vision and tools. Robotics is where the same pattern will meet the consequences of action.

The next generation of useful models will not simply answer faster after we finish speaking. They will remain present while the world moves: listening, speaking, checking, acting, and revising at the same time. The hard problem is no longer only what token comes next. It is what should happen next—and on which clock.

## References

1. Thinking Machines Lab. [Interaction Models: A Scalable Approach to Human-AI Collaboration](https://thinkingmachines.ai/blog/interaction-models/). May 11, 2026. DOI: 10.64434/tml.20260511.
2. Alexandre Défossez, Laurent Mazaré, Manu Orsini, Amélie Royer, Patrick Pérez, Hervé Jégou, Edouard Grave, and Neil Zeghidour. [Moshi: a speech-text foundation model for real-time dialogue](https://arxiv.org/abs/2410.00037). 2024.
3. Chung-Ming Chien, Manu Orsini, Eugene Kharitonov, Neil Zeghidour, Karen Livescu, and Alexandre Défossez. [MoshiRAG: Asynchronous Knowledge Retrieval for Full-Duplex Speech Language Models](https://arxiv.org/abs/2604.12928). 2026.
4. Tu Anh Nguyen et al. [Generative Spoken Dialogue Language Modeling](https://aclanthology.org/2023.tacl-1.15/). Transactions of the Association for Computational Linguistics, 2023.
5. Bandhav Veluri, Benjamin N. Peloquin, Bokai Yu, Hongyu Gong, and Shyamnath Gollakota. [Beyond Turn-Based Interfaces: Synchronous LLMs as Full-Duplex Dialogue Agents](https://aclanthology.org/2024.emnlp-main.1192/). EMNLP, 2024.
