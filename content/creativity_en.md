# What Is Creativity When AI Can Generate Anything?

> **Research Note**
> Originally written April 17, 2026 · Revised English edition August 2026
> This essay records an earlier line of inquiry. It is not an exhaustive statement of my current or future research agenda.
> [Read the Chinese version →](https://app.notion.com/p/3c57bc231a8281ab93f9df80e84acf66)

Execution is getting cheaper.

Tasks that once required hours before there was anything concrete to evaluate can now yield a plausible first pass in seconds. Execution is not literally free—verification, integration, and accountability remain expensive—but the bottleneck is moving.

When producing an artifact becomes easier, choosing *which* artifact should exist becomes more important. So do problem selection, taste, and the ability to recognize an idea worth pursuing.

This is often compressed into a comforting claim: AI can execute, but humans remain creative. The evidence is less tidy. LLMs match or exceed average human scores on some narrow divergent-thinking and writing tasks ([Bellemare-Pepin et al., 2024](https://arxiv.org/abs/2405.13012)), yet no single creativity test predicts model performance across writing, divergent thinking, and scientific ideation ([Schapiro et al., 2026](https://arxiv.org/abs/2605.13450)). Test performance is not creativity in the broader sense.

The interesting question is therefore not whether a model “has creativity.” It is what operations we are grouping under that word, which of them current models perform, and where judgment enters the system.

Four frameworks help separate candidate generation from conceptual connection, search from rule change, and private novelty from social acceptance. They are not a complete theory.

## 1. Guilford: creativity as divergent thinking

J. P. Guilford’s 1950 presidential address to the American Psychological Association is commonly treated as a starting point for modern psychometric creativity research ([Guilford, 1950](https://doi.org/10.1037/h0063487)). Its most durable distinction is between two modes of thought:

- **Convergent thinking** combines available information to reach one answer: solve the equation, locate the bug, identify the most likely cause.
- **Divergent thinking** responds to an open problem by producing multiple possible answers: how many uses can you find for a paperclip?

Guilford’s tradition decomposes divergent production into four observable dimensions:

- **Fluency:** how many ideas are produced.
- **Flexibility:** how many categories those ideas cross.
- **Originality:** how statistically unusual they are relative to a comparison set.
- **Elaboration:** how fully an idea is developed.

This made creativity more measurable—and made it tempting to equate the measurable part with the whole. An Alternative Uses Task does not tell us whether someone chose an important problem, produced something useful, or changed a field. **Divergent thinking is a component and a proxy, not a synonym for creativity.**

The distinction matters for LLMs. Models can generate, restyle, and elaborate candidates at remarkable scale. Strong benchmark results still leave the evaluation baseline unresolved:

- Are the outputs flexible across genuinely different conceptual regions, or are they variations inside a dense, familiar basin?
- Is originality measured against other samples, against the training corpus, or against the history of a domain?
- Does an evaluator reward surprise alone, or surprise that remains useful and coherent?
- What happens to diversity when many people draw from the same model and similar prompts?

The last question is not hypothetical. In an experiment on short-story writing, access to GPT-4-generated starting ideas improved average ratings of individual stories, especially for writers with lower baseline creativity, while making the collection of AI-assisted stories more similar to one another ([Doshi & Hauser, 2024](https://doi.org/10.1126/sciadv.adn5290)). Individual novelty and population-level diversity can move in opposite directions.

## 2. Koestler: creativity as bisociation

Arthur Koestler’s *The Act of Creation* proposed a more structural account. Humor, scientific discovery, and art, he argued, share a basic operation: two previously separate frames of reference become active at once. He called this **bisociation** ([Koestler, 1964](https://books.google.com/books/about/The_Act_of_Creation.html?id=tJC5pDXFY8oC)).

Koestler organized the idea around three reactions: *Ha-ha*, *Aha!*, and *Ah…*

### Ha-ha: collision

A joke guides the listener through one interpretation, then switches at the punch line. In one example attributed to John von Neumann, an Oedipus-complex diagnosis collides with another mother’s ordinary judgment that loving one’s mother makes a good son. The incompatible frames create the joke.

### Aha!: synthesis

In scientific insight, two frames can become one explanatory system: Newton connected terrestrial and celestial motion; Darwin related selective breeding to variation in nature. Real discovery was messier, but the form matters—one structure comes to represent two bodies of observations.

### Ah…: resonance

Art often preserves both frames. A metaphor remains powerful because neither meaning disappears. Science tends toward integration; art sustains productive ambiguity. A theory may displace an older explanation, while a new painting does not make the *Mona Lisa* obsolete.

Koestler also assigned distinct emotional and physiological modes to the three forms. I treat that as a mid-century hypothesis, not an established mechanism. His more durable idea is computationally suggestive: creativity may depend less on generating tokens than on finding non-obvious mappings between representations.

Foundation models encode structure across many domains, but access is not enough. Useful analogy preserves relations rather than surface attributes—the core of Gentner’s structure-mapping account ([Gentner, 1983](https://doi.org/10.1207/s15516709cog0702_3)). “Transformers are like brains” is broad association; specifying corresponding routing constraints, predictions, and failure points is closer to scientific bisociation.

I suspect conventional post-training favors legible, safe, immediately defensible connections, improving usefulness while narrowing the tails. That is an inference, not a settled result; sampling, retrieval, and search can alter the space. In any case, rare association is not automatically good. Bisociation still needs selection.

## 3. Boden: three ways to be creative

Margaret Boden’s framework is particularly useful for thinking about machines because it describes creativity in terms of a **conceptual space**—a set of representations, constraints, and operations that make some moves possible and others invalid ([Boden, 2004](https://www.routledge.com/The-Creative-Mind-Myths-and-Mechanisms-2nd-Edition/Boden/p/book/9780203508527)). She distinguishes three forms:

1. **Combinational creativity** joins familiar elements in an unfamiliar way. Metaphors, jokes, and many design concepts fit here.
2. **Exploratory creativity** searches a structured conceptual space for regions that have not been visited. A new proof within a formal system or a new piece within an established musical grammar can be exploratory.
3. **Transformational creativity** changes one of the constraints defining the space. A move that was previously impossible becomes admissible. Non-Euclidean geometry and atonal composition are standard illustrations.

The third category is the hardest to evaluate because a transformation is visible only relative to a prior rule system. Generating ten thousand stylistic variants may explore a space extremely well without changing its grammar.

Boden adds another distinction:

- **P-creativity** is psychological novelty: the idea is new to the person who has it.
- **H-creativity** is historical novelty: the idea is new in human history.

This prevents a category error: a rediscovery can be P-creative, while a never-seen string need not be meaningfully H-creative.

Applying P-creativity literally to an LLM is awkward because “psychologically new to the model” is unclear. Better tests ask whether an output is absent from known training data, surprises experts with a valid solution, or changes the space subsequent work can search. Sample novelty answers none of these by itself.

Models combine powerfully and increasingly explore with tools, verifiers, and search. Reliable transformational or H-creative work remains open: the capability is uncertain, historical novelty is hard to establish, and domain change is usually recognized retrospectively.

## 4. Csikszentmihalyi: creativity as a system

Mihaly Csikszentmihalyi moved the unit of analysis outside the individual mind. In his systems view, creativity emerges through interaction among three components ([Csikszentmihalyi, 1988](https://books.google.com/books/about/Society_Culture_and_Person_a_Systems_Vie.html?id=9x3qSAAACAAJ)):

- The **person** produces a variation.
- The **domain** supplies the symbols, rules, and accumulated knowledge in which the variation can be understood: mathematics, jazz, molecular biology, Chinese calligraphy.
- The **field** selects what enters the domain: reviewers, editors, curators, practitioners, institutions, or markets.

Consider an AI-generated abstract ink painting that resembles calligraphy. A contemporary-art curator might see a productive combination of digital methods and East Asian aesthetics. A trained calligrapher might see malformed stroke structure with no command of the tradition. The pixels are the same. The domain knowledge and the field’s criteria are not.

This is more than relativism. A field can be conservative, biased, or wrong, but without some selection process, novelty does not become part of a shared domain. Creativity is not a property we can infer from an artifact in isolation.

For AI, the “person” node is already distributed. A model output depends on training data, model design, post-training, a prompt, sampling, tools, and usually human editing. The field then determines whether the result is a contribution, a curiosity, or noise. Debates over whether AI-generated art is “real art” therefore cannot be settled by model architecture alone. They concern provenance, authorship, domain competence, and institutional acceptance as much as generation.

## Putting the four frameworks together

The four views describe different gates:

1. **Generate variation** across an open space (Guilford).
2. **Connect representations** that were previously separate (Koestler).
3. **Explore or transform** the rules of a conceptual space (Boden).
4. **Survive evaluation** by a field and enter a domain (Csikszentmihalyi).

Seen this way, “Can AI be creative?” is underspecified. A model may dominate at candidate generation, make impressive cross-domain connections, and still fail because its outputs are ungrounded or because a field finds them unimportant. A human may generate few candidates but recognize a problem whose solution reorganizes a domain. A human–AI system may outperform either by combining search scale with judgment.

The bottleneck is not fixed. As models improve at one gate, it moves to the next.

## Practices I take from this literature

### 1. Separate generation from evaluation

Interactive brainstorming groups often produce fewer and lower-quality ideas than the same number of people generating independently—a result supported by a meta-analysis of nominal versus interacting groups ([Mullen, Johnson, & Salas, 1991](https://doi.org/10.1207/s15324834basp1201_1)). Production blocking, evaluation apprehension, and uneven participation are plausible mechanisms.

The practical conclusion is not “groups are bad.” Written or electronic idea exchange, alternating individual and group phases, and time for reflection can recover cognitive stimulation without forcing everyone through one conversational channel ([Paulus & Yang, 2000](https://doi.org/10.1006/obhd.2000.2888)). Generate in parallel; then expose, cluster, criticize, and combine.

### 2. Use movement as a task-specific intervention, not a ritual

Across four experiments, walking improved performance on several divergent-generation tasks during and shortly after walking, while not producing the same benefit on a convergent remote-associates task ([Oppezzo & Schwartz, 2014](https://doi.org/10.1037/a0036577)). The often-repeated “60% creativity boost” is an average from particular laboratory measures, not a universal multiplier for creative work. Walking may help when the current bottleneck is ideational fluency; it does not replace expertise or evaluation.

### 3. Keep searching after fluency drops

In a ten-minute unusual-uses study, later responses were rated as more creative on average even as the production rate declined; the trajectory also varied with fluid intelligence ([Beaty & Silvia, 2012](https://doi.org/10.1037/a0029171)). This serial-order effect is evidence for strategic retrieval, not a law that “idea number 20” is where quality begins. A time or quantity budget is useful because it pushes search beyond the easiest associations, not because there is a magic threshold.

Quantity improves the opportunity for a hit, but it does not guarantee one. Simonton’s equal-odds model describes a statistical relation between productivity and successful work across creative careers ([Simonton, 1997](https://doi.org/10.1037/0033-295X.104.1.66)). In practice: generate enough variance, then apply a demanding filter.

### 4. Retrieve distant analogies deliberately

Analogical transfer is not simply a function of having seen a relevant example. Retrieval depends on goals, representation, and whether relational structure is made salient. Naturalistic and laboratory studies of scientists show that the analogies people use change with the task and the prompt to generate them ([Dunbar & Blanchette, 2001](https://doi.org/10.1016/S1364-6613(00)01698-3)).

For research, “How would a biologist solve this?” is only a starting prompt. A stronger procedure asks: What are the entities, relations, invariants, and failure conditions in the source domain? Which of those map to the target? An LLM can help retrieve candidate domains; the researcher still has to test the mapping.

This also argues for maintaining inputs outside one’s primary field. Distant material is not guaranteed to become a useful analogy, but it gives deliberate retrieval a larger and less homogeneous index to search.

### 5. Build a field that can say no

Unfiltered novelty is noise. Find reviewers who understand the domain well enough to reject an idea for the right reasons. Criticism is not downstream of creativity; in the systems view, it is part of the creative process.

State the novelty target before asking for that judgment. Re-deriving a known idea can be valuable P-creativity; claiming H-creativity requires a search against the relevant history. Confusing the two creates either unnecessary self-doubt or inflated novelty claims.

### 6. Use AI to widen search without collapsing diversity

Asking one model for “the best answer” turns a generative system into an early convergence mechanism. I prefer to generate candidates under deliberately different assumptions, retrieval contexts, and critic roles; cluster them to expose redundancy; and defer ranking until the space is visible.

The Doshi–Hauser result is a useful warning: AI assistance can improve each artifact while homogenizing the set. The objective is not merely to raise the mean quality of one sample. It is to preserve enough variation for something genuinely different to survive.

### 7. Leave room for incubation, but do not mystify it

A meta-analysis of 117 studies found a small positive average incubation effect, *d* = 0.29, with substantial variation across problem and break conditions ([Sio & Ormerod, 2009](https://doi.org/10.1037/a0014212)). Longer preparation and lower-demand intervening tasks were associated with larger benefits in some conditions. The mechanism remains uncertain: forgetting misleading cues, restructuring, intermittent conscious thought, and other accounts may all contribute.

The defensible practice is simple. Work on the problem first. Step away when search becomes repetitive, perhaps for a walk or another low-demand activity. Return with a fresh pass. “The unconscious solved it” is not required.

## The remaining choice

Cheap execution is not only a threat to existing work. It is an invitation to choose more carefully.

Guilford asks how broadly we can search. Koestler asks which distant structures can be connected. Boden asks whether we are exploring a space or changing it. Csikszentmihalyi asks who can recognize the result and carry it into a domain.

Models will keep improving at each of these operations. That does not make human judgment permanently privileged, nor does it make it obsolete. It changes where judgment must operate: less on producing the first plausible artifact, more on selecting the problem, specifying the constraints, preserving diversity, and deciding what deserves to become part of the world.

When making becomes cheap, the most consequential question is no longer *Can this be made?*

It is *What is worth making—and why?*

## References

1. Boden, M. A. (2004). [*The Creative Mind: Myths and Mechanisms*](https://www.routledge.com/The-Creative-Mind-Myths-and-Mechanisms-2nd-Edition/Boden/p/book/9780203508527), 2nd ed.
2. Bellemare-Pepin, A., et al. (2024). [“Divergent Creativity in Humans and Large Language Models.”](https://arxiv.org/abs/2405.13012)
3. Beaty, R. E., & Silvia, P. J. (2012). [“Why Do Ideas Get More Creative Across Time?”](https://doi.org/10.1037/a0029171)
4. Csikszentmihalyi, M. (1988). [“Society, Culture, and Person: A Systems View of Creativity.”](https://books.google.com/books/about/Society_Culture_and_Person_a_Systems_Vie.html?id=9x3qSAAACAAJ)
5. Doshi, A. R., & Hauser, O. P. (2024). [“Generative AI Enhances Individual Creativity but Reduces the Collective Diversity of Novel Content.”](https://doi.org/10.1126/sciadv.adn5290)
6. Dunbar, K., & Blanchette, I. (2001). [“The In Vivo/In Vitro Approach to Cognition: The Case of Analogy.”](https://doi.org/10.1016/S1364-6613(00)01698-3)
7. Gentner, D. (1983). [“Structure-Mapping: A Theoretical Framework for Analogy.”](https://doi.org/10.1207/s15516709cog0702_3)
8. Guilford, J. P. (1950). [“Creativity.”](https://doi.org/10.1037/h0063487)
9. Koestler, A. (1964). [*The Act of Creation*](https://books.google.com/books/about/The_Act_of_Creation.html?id=tJC5pDXFY8oC).
10. Mullen, B., Johnson, C., & Salas, E. (1991). [“Productivity Loss in Brainstorming Groups: A Meta-Analytic Integration.”](https://doi.org/10.1207/s15324834basp1201_1)
11. Oppezzo, M., & Schwartz, D. L. (2014). [“Give Your Ideas Some Legs: The Positive Effect of Walking on Creative Thinking.”](https://doi.org/10.1037/a0036577)
12. Paulus, P. B., & Yang, H.-C. (2000). [“Idea Generation in Groups: A Basis for Creativity in Organizations.”](https://doi.org/10.1006/obhd.2000.2888)
13. Schapiro, S., Gladstone, A., Black, J., & Ji, H. (2026). [“Assessing the Creativity of Large Language Models: Testing, Limits, and New Frontiers.”](https://arxiv.org/abs/2605.13450)
14. Simonton, D. K. (1997). [“Creative Productivity: A Predictive and Explanatory Model of Career Trajectories and Landmarks.”](https://doi.org/10.1037/0033-295X.104.1.66)
15. Sio, U. N., & Ormerod, T. C. (2009). [“Does Incubation Enhance Problem Solving? A Meta-Analytic Review.”](https://doi.org/10.1037/a0014212)
