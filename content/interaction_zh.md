# 超越轮次：走向能边听、边说、边行动的模型

*原作于 2026 年 5 月 14 日 · 中文修订版 2026 年 8 月 · 一次较早期的方向探索*

[English edition](https://app.notion.com/p/3c57bc231a8281288c72f5909e2a669d)

> 这篇文章记录的是我在 2026 年 5 月对交互式 AI 的一阶段思考，不代表一个封闭的研究议程。实时多模态学习、异步推理、工具使用和行动之间如何协同，仍会随着模型进入 robotics 与 embodied systems 而持续演化。

## 一、Interaction Model、Full Duplex 与 turn-based LLM

2026 年 5 月，Thinking Machines Lab 发布了 [Interaction Models](https://thinkingmachines.ai/blog/interaction-models/)。在 demo 里，模型可以同时倾听、观看用户正在做什么、选择合适的时机介入，并在互动持续进行时调用工具。当整个行业都在推进 agentic long-horizon tasks 时，TML 选择押注另一条同样重要的轴：**interactivity 本身也应该被 scale。**

原因并不复杂。今天的 chatbot 基本遵循固定协议：我说完，模型计算；模型答完，我再继续。这种一来一回的 turn-based 形式很适合文字界面，却不是人和人自然协作的方式。真实交流里会有重叠、迟疑、附和、打断、指向、临时改口，也会在一句话尚未结束时根据情境采取行动。沉默有信息，时机也是信息。

很多“实时”语音助手，底层仍是一个 turn-based model，外面套上 VAD、ASR 和 TTS。VAD 判断用户是不是说完了，ASR 把完整语音转成文字，LLM 生成回答，TTS 再把回答读出来。这样的系统可以做得很快，也可以在产品层支持 interrupt，但模型本身未必学到了“边听边说”的联合动态；它看到的仍是一串已经切好边界的交易。

Full-duplex model 改变的是建模问题本身。模型持续接收用户流，同时持续产生自己的流；输出可以是说话、backchannel，也可以是自然的安静。系统不再依赖一个特权化的“轮次结束”事件。重叠和打断不再是外部逻辑处理的 exception，而是训练分布里可以直接学习的模式。

TML 把这个思路从语音进一步扩展到 audio、video 和 text。它的 Interaction Model 以 200 ms 的 time-aligned micro-turn 持续处理多模态流；另一个异步 Background Model 在后台做长程推理、浏览、工具调用与规划。两套模型互补而不对立：前者始终在场，后者负责深思。

我认为这套架构最值得记住的一句话是：

> 交互智能至少运行在两个时钟上：一个快速时钟维持 presence，一个较慢时钟完成 deliberation。

在 TML 发布之前，我见过的最扎实、也最适合拆解这一思想的开源实现，是 Kyutai 的 Moshi。它把问题落到了足够具体的层面：对话中的一个“时刻”是什么？哪些 stream 由模型生成？延迟究竟从哪里产生？

## 二、Moshi：把对话建模成联合数据流

[Moshi](https://arxiv.org/abs/2410.00037) 是一个 7B speech-text foundation model，主要由三部分组成：在 2.1T public English tokens 上训练的文本模型 Helium、因果神经音频 codec Mimi，以及联合建模文本和音频流的 hierarchical Transformer。

第一处关键设计是 audio tokenization。Mimi 把 24 kHz 音频编码成八个离散 codebooks，帧率为 12.5 Hz，所以每帧恰好对应 80 ms。第一个 codebook 通过从 WavLM 蒸馏而获得较高层的语义信息，后七个 codebooks 逐层补充声学细节；每个 codebook 有 2,048 个条目。相较于高帧率音频表示，这样的时间压缩让 streaming autoregressive modeling 变得可行。

Moshi 随后把“沿时间建模”和“同一帧内建模”拆开：

- 32 层 Temporal Transformer 以 12.5 Hz 推进，维护对话历史；
- 一个更小的 6 层 Depth Transformer，在每个 80 ms 帧内部处理多个 codebooks。

这里有一个容易误读的数字：4,096。Helium 文本模型的 context length 是 4,096 text tokens；Moshi Temporal Transformer 的 model dimension 也刚好是 4,096。但这两个数字都不是 Moshi 的音频时间上下文。论文给出的 speech training context 是 3,000 个 temporal steps，也就是在 12.5 Hz 下约四分钟；系统评测覆盖约五分钟对话。

Stream 的计数同样需要说清。加入 Inner Monologue 后，Moshi 在每个时间点联合表示 17 条对齐的 stream：

1. 一条与 Moshi 自己语音对齐的 text stream；
2. 八条 Moshi audio-codebook streams；
3. 八条 user audio-codebook streams。

但“17 条 stream”不等于部署时模型必须串行生成 17 个新 token 才能进入下一帧。实时推理中，用户的八个 audio tokens 是从现场音频观测到的输入；真正采样的是九个 model-side outputs——一个 text token 加八个 Moshi audio tokens。17-stream representation 在训练时很有价值，它也允许模型离线生成对话双方；但实际应用里，模型对用户 stream 的预测会被真实输入替换。Temporal Transformer 每帧只推进一次，Depth Transformer 负责帧内结构。

这正是 Moshi 能处理 overlap 的原因。每个时间点，模型都同时条件于双方最近的音频，不需要显式的 turn variable。Moshi 不该说话时，它自己的 audio stream 生成接近安静的波形，text stream 生成 padding；用户突然打断时，新输入直接进入下一个 joint state，而不必等待 Moshi 把当前句子说完。

### Inner Monologue 不是隐藏的 chain of thought

Moshi 的 Inner Monologue，是与自身语音时间对齐的文本表征。它更像 linguistic scaffold，而不是不可见的推理过程。模型联合预测“自己正在说的词”和实现这些词的音频；原始端到端 Moshi 并不会在内部先把用户语音转录成文字。

这个 scaffold 的效果很明显。在 spoken QA 上，带 Inner Monologue 的 Moshi 在 WebQuestions、Llama Questions 和 TriviaQA 上分别得到 26.6、62.3、22.8；去掉之后分别只有 9.2、21.0、7.3。不过，音频 post-training 也带来了文本能力损失：Helium 的 MMLU 是 54.3，最终 multi-stream Moshi 是 49.7。

Moshi 报告的理论延迟是 160 ms，实际约 200 ms。理论值来自 80 ms codec frame 加最终模型一个 80 ms acoustic-delay step。它不等于包含麦克风、网络、调度与播放在内的完整产品延迟，但已经足够让模型进入人类对话的时间尺度，而不只是把 turn-based pipeline 做得更快。

这也暴露了下一层矛盾：小模型可以保持实时 presence，却很难拥有大模型同等的事实知识和 test-time compute；直接放大前端，质量和延迟又会一起增长。MoshiRAG 要回答的问题是：这两者是否必须绑定？

## 三、MoshiRAG：边说边检索

[MoshiRAG](https://arxiv.org/abs/2604.12928) 在 full-duplex 前端上加入了异步知识检索。整个系统包括 7B Moshi、一个延迟约 0.5 秒的 1B streaming ASR、冻结的 reference-text encoder，以及可替换的 retrieval back end。后端可以是 Gemma 3 27B 这样的本地大模型，也可以是 GPT-4.1 API，或者 Tavily web search。

它的核心观察来自口语的时间结构：一句回答发出的第一个声音，通常还不是解决问题的关键事实。人可能先说“In the Netflix series…”，之后才给出“Chicago”这个关键信息。MoshiRAG 因此区分三个指标：

- time to first audio token；
- 从回答开始到关键信息出现的 keyword delay；
- 两者之和，即 end-to-end keyword delay。

论文观察到，很多语音模型的 end-to-end keyword delay 超过三秒。MoshiRAG 把这段时间变成异步计算预算：当前端判断问题需要外部知识并预测特殊的 &lt;ret&gt; token 时，系统把当前 transcript 发给后端；Moshi 不停下来，而是先说一小段不依赖专门知识的 lead。检索结果返回后，reference encoder 把文本转成 embeddings，注入仍在进行的 temporal stream，Moshi 再用这些信息完成同一个回答的主体。

它并没有让检索瞬间完成。真正的变化是：检索和表达发生重叠，因此“听起来马上有回应”与“关键事实何时到达”不再是同一个指标。

训练数据也对应这一结构。知识密集型回答被合成为 lead、reference-grounded body 和可选 tail。公开论文报告约 190 万条 synthetic conversation instances；模型从 Moshi 初始化，训练 100,000 updates，并随机化 retrieval delay，让前端学会吸收在不同时间到达的证据。

### Table 1 应该怎样读

MoshiRAG 主表对每个后端都给出两个数字：**检索到的 reference accuracy | 最终 spoken-response accuracy**。如果把二者混成一个数字，就看不到后端知识进入语音模型后的 integration loss。

| Back end | LlamaQ | WebQ | TriviaQA | HaluEval |
|---|---:|---:|---:|---:|
| Gemma 3 27B | 83.0 \| 80.3 | 71.5 \| 67.2 | 73.7 \| 69.6 | 42.0 \| 36.3 |
| GPT-4.1 | 87.8 \| 80.6 | 77.7 \| 68.9 | 86.8 \| 78.2 | 61.2 \| 51.3 |
| Tavily | 84.6 \| 78.2 | 73.5 \| 66.1 | 84.9 \| 77.5 | 54.3 \| 47.0 |
| Vanilla Moshi，仅 response | 62.3 | 26.6 | 22.8 | 10.5 |

Gemma 3 27B 条件下，表中还报告了 0.0 秒 TTFAT、3.1 秒 keyword delay、3.1 秒 E2EKD，以及每生成一秒音频 0.37 × 10^12 FLOPs。这里的“0.0”是 content-generation onset 的评测约定，不是完整系统真的零延迟。在表中展示的不同后端与 QA 数据集上，reference accuracy 比最终回答高 2.7 到 9.9 个百分点，所以后端既是能力来源，也是上限。

MoshiRAG 还显示出一定的 out-of-distribution tool-use generalization。例如在 GSM8K 上，vanilla Moshi 只有 2.1，Gemma 后端的 MoshiRAG 达到 33.9；先压缩、总结检索到的推理再注入，分数提高到 51.2。但这并不意味着它已经是 frontier math reasoner。作者明确指出，它仍弱于专门为语音推理训练的模型。

## 四、一个系统，两个时钟

MoshiRAG 和 TML Interaction Models 并不是同一套系统。前者是 compact、open、speech-first 的架构，慢路径主要负责 selective retrieval；后者训练了原生 audio-video-text model——TML-Interaction-Small 是 276B 参数、12B active 的 MoE——并把更一般的 reasoning 和 tool use 交给 background agent。

但两者收敛到同一个 systems principle：**不要强迫负责社交时机的组件，在做出任何反应之前，先完成所有昂贵的认知操作。**

快速模型负责维持 common ground：用户是不是还在说，这次打断是不是纠错，眼前的画面发生了什么，现在是否应该简短回应。慢速模型负责搜索、规划、验证和操作工具。结果以 stream 返回，前端再根据期间发生的新情况决定何时、以何种方式整合。

这比“小模型管延迟，大模型管智能”更复杂。真正需要学习的是 coordination：什么上下文值得 delegate？用户改变方向后，后台任务何时应该 cancel？证据回来之前，前端如何表达 uncertainty？最终 action 的 ownership 在谁手里？一个有效的交互架构必须学习 arbitration，而不只是把两个 endpoint 接起来。

## 五、Demo 没有消除的限制

第一，流畅表达可能只是隐藏延迟，而不是解决延迟。三秒的 lead 比三秒静音体验更好，但用户仍然要等三秒才拿到关键事实。如果 filler 变得机械、重复，甚至被用来制造“模型已经知道答案”的错觉，那是失败而不是能力。

第二，retrieval quality 不等于 response quality。MoshiRAG 的 reference-response gap 说明，即便文档正确，也可能在压缩、理解或口头表达时丢失。独立 ASR 让检索路径易于替换，却也重新引入 text bottleneck：Moshi 能感知的语调与非语言线索，不一定被传递给后端。

第三，目前证据仍然有限。MoshiRAG 大量依赖 synthetic conversations，主要评测是 single-turn spoken QA 和 model-based judges；full-duplex benchmark 对“多少 backchannel 才合适”也没有共识。检索触发目前从训练数据中学习，而不是直接按 query difficulty 校准或用 RL 优化；对错误检索的 robustness 仍未解决。

第四，full duplex 带来新的 safety 问题。一个能打断用户、对摄像头画面主动反应、并调用工具行动的模型，有更多机会帮助，也有更多机会在错误时刻行动。更强的实时 presence 也可能放大 anthropomorphic trust。Kyutai 与 TML 都把 misinformation、over-reliance、长会话 robustness、alignment 和部署可靠性列为未解决问题。

最后，scale 仍被 wall clock 约束。TML 报告了 FD-Bench V1 0.40 秒 turn-taking latency 和 FD-Bench V1.5 77.8，但也明确表示更大的 pretrained models 当前太慢，无法在该设置下服务。它的发布是一篇 research post 而不是 peer-reviewed paper，部分指标还启用了 background agent。“interactivity 会随规模平滑提升”目前仍是研究押注，而不是已经建立的 scaling law。

## 六、从对话走向 Robotics

我真正关注这条路线，是因为物理世界从来不是 turn-based。机器人不可能在 planner 思考时冻结 perception；它必须持续感知、保持平衡、监控周围的人，并随着世界变化修正动作。自然的系统本来就是 multi-rate：高频 control、中频 perception 与 interaction、更慢的 planning 与 retrieval。

但这个类比不能机械照搬。语音模型可以用“我查一下”换两秒时间，robot arm 不能用一句 lead 掩盖不安全轨迹。Embodied interaction 需要硬约束、可中断 policy、校准过的不确定性，以及 fast reflex 与 slow plan 之间清晰的优先级。两类系统共享的核心问题是：当 perception、communication、reasoning 和 action 并发发生时，怎样维持一致的状态？

因此，我不把 full-duplex speech model 只看作一个 voice-interface niche。它更像学习 temporal coordination 的低风险实验场：Moshi 说明怎样表示 simultaneous streams；MoshiRAG 说明怎样在不停止数据流的情况下接入延迟计算；Interaction Models 把这个模式扩展到视觉和工具；robotics 则会让同一模式真正面对 action 的后果。

下一代有用的模型，不只是等我们说完之后更快地回答。它们会在世界持续变化时保持在场：边听、边说、边验证、边行动，也边修正。困难的问题不再只是“下一个 token 是什么”，而是“接下来应该发生什么——以及它应该运行在哪一个时钟上”。

## References

1. Thinking Machines Lab. [Interaction Models: A Scalable Approach to Human-AI Collaboration](https://thinkingmachines.ai/blog/interaction-models/). May 11, 2026. DOI: 10.64434/tml.20260511.
2. Alexandre Défossez, Laurent Mazaré, Manu Orsini, Amélie Royer, Patrick Pérez, Hervé Jégou, Edouard Grave, and Neil Zeghidour. [Moshi: a speech-text foundation model for real-time dialogue](https://arxiv.org/abs/2410.00037). 2024.
3. Chung-Ming Chien, Manu Orsini, Eugene Kharitonov, Neil Zeghidour, Karen Livescu, and Alexandre Défossez. [MoshiRAG: Asynchronous Knowledge Retrieval for Full-Duplex Speech Language Models](https://arxiv.org/abs/2604.12928). 2026.
4. Tu Anh Nguyen et al. [Generative Spoken Dialogue Language Modeling](https://aclanthology.org/2023.tacl-1.15/). TACL, 2023.
5. Bandhav Veluri, Benjamin N. Peloquin, Bokai Yu, Hongyu Gong, and Shyamnath Gollakota. [Beyond Turn-Based Interfaces: Synchronous LLMs as Full-Duplex Dialogue Agents](https://aclanthology.org/2024.emnlp-main.1192/). EMNLP, 2024.
