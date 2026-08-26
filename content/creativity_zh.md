# AI 让执行变得廉价，那创造力到底是什么？

> **Research Note｜研究笔记**
> 最初写于 2026 年 4 月 17 日 · 2026 年 8 月修订
> 这篇文章记录的是我当时探索的一条思路，并不代表我现在或未来研究议程的全部。
> [Read the English version →](https://app.notion.com/p/3c57bc231a828120847cc67ea6cc1bc0)

在 AI 时代，执行（execution）正在变得越来越廉价。

写代码、做设计、剪视频、整理数据、翻译文档、生成图像——过去要花数小时甚至数天，才能拿到一个可供评估的初稿；现在，一个能力足够强的模型几秒钟就能生成一个像样的 first pass。这并不意味着执行成本真的归零了：验证、集成、维护和责任归属依然昂贵。但瓶颈确实在转移。

当“把东西做出来”变得更容易，决定“什么东西值得被做出来”就变得更重要。问题选择、判断力和 taste，开始占据更大的权重。

这个判断很容易被压缩成一句让人安心的话：AI 负责执行，人类负责创造。但证据已经没有这么整齐。在一些定义较窄的 divergent-thinking 和 creative-writing 任务上，LLM 已经能达到、甚至超过人类平均分数（[Bellemare-Pepin et al., 2024](https://arxiv.org/abs/2405.13012)）。可是，在人类创造力测试上得高分，不等于拥有更广义的创造力。最近的研究也表明，没有一种测试能同时很好地预测模型在 creative writing、divergent thinking 和 scientific ideation 上的能力（[Schapiro et al., 2026](https://arxiv.org/abs/2605.13450)）。

所以，更有意义的问题不是“模型到底有没有创造力”，而是：我们把哪些不同的操作都放进了“创造力”这个词里？当前模型已经能完成哪些？判断又在系统的哪一层发生？

下面四个框架一直对我很有启发。它们不是一套完整理论，但叠在一起，刚好能把生成与连接、搜索与规则改变、个人的新颖性与社会认可区分开。

## 一、Guilford：创造力是发散性思维（1950）

J. P. Guilford 在 1950 年给美国心理学会所作的主席演讲，通常被视为现代创造力心理测量研究的起点之一（[Guilford, 1950](https://doi.org/10.1037/h0063487)）。他做了一个简单但影响深远的区分：

- **收敛性思维（convergent thinking）**：从多个信息点出发，收敛到一个答案。比如解一道方程、修一个 bug、判断最可能的原因。
- **发散性思维（divergent thinking）**：面对开放问题，生成多个可能答案。比如：“一个回形针能有多少种用途？”

Guilford 的研究传统又把 divergent production 拆成四个可以观察的维度：

- **流畅性（fluency）**：能产生多少想法。
- **灵活性（flexibility）**：这些想法跨越多少不同类别。
- **独创性（originality）**：相对于一个比较样本，想法在统计上有多罕见。
- **精细性（elaboration）**：能把一个想法发展得多具体、多完整。

这个框架让创造力不再完全神秘，也让它变得可测量。但它同时带来一个长期的诱惑：把容易测量的东西，当成创造力本身。Alternative Uses Task 测的是开放式生成任务上的表现。它并不能单独回答一个人是否选中了重要问题、做出了有用的东西、改变了一个领域，或长期维持了一套创造性研究计划。**Divergent thinking 是创造力的一个组成部分和 proxy，不是创造力的同义词。**

这个区别对理解 LLM 很重要。模型非常擅长生成和展开候选方案：给定一个 prompt，它可以快速 sample 大量 continuation，改变风格，并补齐实现细节。在某些评测设置下，模型在 semantic distance 和 creative-writing judgment 上也已经很强。但这些结果仍然留下几个问题：

- 输出是否真的跨越了不同的 conceptual region，还是只在一个高密度、熟悉的 basin 里做变体？
- originality 是相对于其他 sample、训练语料，还是整个领域历史来测量？
- evaluator 奖励的是单纯的意外，还是有用且自洽的意外？
- 当大量用户使用同一模型和相似 prompt 时，群体层面的多样性会发生什么？

最后一个问题已经有了一些实验信号。Doshi 和 Hauser 让参与者写八句话的短故事；部分作者可以调用 GPT-4 生成一个或最多五个开头想法。AI 辅助提高了单篇故事的平均 novelty 和 usefulness 评价，尤其帮助了基线创造力较低的作者；但所有 AI-assisted stories 放在一起时，彼此更相似了（[Doshi & Hauser, 2024](https://doi.org/10.1126/sciadv.adn5290)）。个体作品的质量和群体输出的多样性，可以朝相反方向变化。

Guilford 给了我们描述“生成”的语言，但还没有解释有意义的新颖性从哪里来。

## 二、Koestler：创造力是 bisociation（1964）

Arthur Koestler 在《创造行为》（*The Act of Creation*）里提出了一个更结构化的解释：幽默、科学发现和艺术创造，底层都包含同一种操作——两个原本分离的参照框架同时被激活。他把这种连接称为 **bisociation（双联想）**（[Koestler, 1964](https://books.google.com/books/about/The_Act_of_Creation.html?id=tJC5pDXFY8oC)）。

他用三种“啊”来描述三种形式：*Ha-ha*、*Aha!* 和 *Ah…*

### Ha-ha：碰撞与爆破

笑话先把听众带进一个解释框架，再在 punch line 处强制切换。Koestler 引过一个据称来自 John von Neumann 的笑话：一位母亲说儿子去看心理医生，被诊断为 Oedipus complex；另一位母亲却把“爱母亲”当作好儿子的普通表现。精神分析与家庭伦理两个框架无法兼容，碰撞本身构成了笑点。

### Aha!：融合与综合

科学发现里，两个框架相遇后，往往会被整合进一个更大的解释系统。经典叙述是：Newton 把地面物体与天体的运动放进同一套引力框架；Darwin 把人工育种与自然界的遗传变异联系起来。真实发现过程当然比这些故事复杂得多，但 insight 的形式很重要：原本分开的两组现象，突然可以被同一个结构表达。

### Ah…：并置与共振

艺术往往不消解两个框架，而是让它们同时存在。一个好的 metaphor 有力量，正是因为两层意义都没有消失。按照 Koestler 的说法，科学倾向于整合，艺术则保留 productive ambiguity。新理论可能替代旧解释，但新作品不会让《蒙娜丽莎》过时。

Koestler 还为幽默、科学和艺术配置了不同的情感与生理模式：幽默偏自我肯定和爆发，科学偏平衡，艺术偏参与和自我超越。今天看，这部分更适合作为一套雄心很大的 mid-century hypothesis，而不是已经成立的现代机制。更经得起时间的洞见是：创造力也许不只取决于“生成了多少”，还取决于能否在 representation 之间找到一个非显然的 mapping。

这对 LLM 来说既乐观，也令人不安。Foundation model 的统计结构横跨代码、生物学、文学、游戏等大量领域，潜在连接空间非常大。但同时知道两个领域，并不等于做出了有价值的类比。Gentner 的 structure-mapping theory 强调，好的类比保留的是关系结构，而不是表面属性（[Gentner, 1983](https://doi.org/10.1207/s15516709cog0702_3)）。“Transformer 像大脑”只是一个宽泛联想；明确哪些 information-routing constraints 对应、这个 mapping 预测了什么、又会在哪里失效，才更接近科学意义上的 bisociation。

我还怀疑，常规 post-training 会把模型推向更容易解释、更安全、更立即显得合理的连接。这会提高 usefulness，却可能压缩分布尾部。但这只是一个判断，不是已经被证明的结论；sampling strategy、prompt、retrieval 和显式 search 都可能改变模型探索的空间。更根本的问题是：罕见连接不自动等于好连接。Bisociation 仍然需要 selection。

## 三、Boden：三种创造力，以及 P 和 H 的区别（1990/2004）

Margaret Boden 的框架尤其适合拿来讨论机器，因为她用 **conceptual space（概念空间）** 描述创造力：一个空间包含 representation、constraint 和 operation，它们共同决定哪些移动是允许的、哪些是不成立的（[Boden, 2004](https://www.routledge.com/The-Creative-Mind-Myths-and-Mechanisms-2nd-Edition/Boden/p/book/9780203508527)）。她区分了三种形式：

1. **组合式创造力（combinational creativity）**：用陌生方式组合熟悉元素。很多隐喻、笑话和设计概念属于这一类。
2. **探索式创造力（exploratory creativity）**：在一个有结构的概念空间里，搜索还没有被访问的区域。比如在形式系统里找到新证明，或在既有音乐语法中写出新作品。
3. **变革式创造力（transformational creativity）**：改变定义这个空间的某条约束，让原本不允许的移动成为可能。非欧几何和无调性音乐是常见例子。

第三种最难评估，因为 transformation 只有相对于原来的 rule system 才可见。生成一万种风格变体，可能是极强的探索，却没有改变语法本身。

Boden 还提出了另一组区分：

- **P-creativity（psychological creativity）**：这个想法对提出它的人而言是新的。
- **H-creativity（historical creativity）**：这个想法在人类历史上是新的。

这个区分能避免一个常见的 category error。一个结果即使早已被别人发现，也可能对正在独立理解它的学生或研究者非常有创造性。反过来，一个从未出现过的字符串，也不必然具有任何有意义的历史创造性。

把 P-creativity 原封不动地套到 LLM 上会有困难，因为它默认我们知道什么东西对模型而言是“心理上新”的。更可操作的问题是：输出是否出现在已知训练数据中？它是否用专家没有预期的方式解决了问题？它是否改变了后续工作可以搜索的空间？这些是不同的测试，sample-level novelty 无法一次回答。

当前模型显然能够做强大的组合；当它们与 tool、verifier 和 search 结合时，探索能力也在迅速增强。它们是否能稳定地产生 transformational 或 H-creative 工作，仍然是开放问题。这不仅因为模型能力尚不确定，也因为历史新颖性很难证明，而一个领域是否真的被改变，通常只能事后判断。

## 四、Csikszentmihalyi：创造力是一个系统（1988/1996）

Mihaly Csikszentmihalyi 把分析单位从个体头脑移到了系统。在他的 systems view 里，创造力来自三个部分的互动（[Csikszentmihalyi, 1988](https://books.google.com/books/about/Society_Culture_and_Person_a_Systems_Vie.html?id=9x3qSAAACAAJ)）：

- **个体（person）**：产生一个 variation。
- **领域（domain）**：提供理解这个 variation 所需的符号、规则和累积知识，比如数学、爵士乐、分子生物学、中国书法。
- **场域（field）**：决定什么能进入并留在领域里，包括 reviewers、editors、curators、同行、机构或市场。

假设 AI 生成了一幅看起来像书法的抽象水墨画。西方当代艺术策展人可能认为，它把数字方法和东亚美学做了有趣组合；受过严格训练的书法家则可能认为，它连基本的笔法结构都没有掌握。像素完全相同，domain knowledge 和 field 的评价标准却不同。

这不只是说“一切都很主观”。Field 可能保守、带有偏见，甚至判断错误；但如果没有某种 selection process，新颖性就无法进入共享领域。创造力不是只看一个 artifact 就能推断出来的孤立属性。

对于 AI，“person”这一节点本身已经是分布式的：模型输出依赖 training data、architecture、post-training、prompt、sampling、tools，通常还包括 human editing。随后，field 再决定它是贡献、趣味实验，还是噪声。因此，“AI 生成艺术是不是真艺术”不可能只靠模型架构回答。它同时涉及 provenance、authorship、domain competence 和 institutional acceptance。

## 把四个框架叠起来

四种观点分别描述了四道门：

1. 在开放空间里**生成 variation**（Guilford）。
2. 在原本分离的 representation 之间**建立连接**（Koestler）。
3. **探索或改变**概念空间的规则（Boden）。
4. 经受 field 的评价，并进入一个 domain（Csikszentmihalyi）。

这样看，“AI 能不能创造”其实是一个 underspecified question。模型可以在候选生成上非常强，也可以给出漂亮的跨域连接，却因为 grounding 不足或问题本身不重要而失败。人类可能只提出少量候选，却识别出了一个足以重组领域的问题。Human–AI system 也可能通过结合搜索规模与判断力，超过任何一方单独工作。

瓶颈不是固定的。模型每攻下一道门，它就会向下一道门移动。

## 那么，具体该怎么产生想法？

### 1. 把生成与评价分开

很多实验里，面对面互动的 brainstorming group 产生的想法，在数量和质量上都低于同样人数各自生成后再合并的 nominal group；Mullen、Johnson 和 Salas 的 meta-analysis 支持这一总体结果（[Mullen et al., 1991](https://doi.org/10.1207/s15324834basp1201_1)）。Production blocking、evaluation apprehension 和参与不均，都是可能的机制。

但结论不是“群体无效”。书面或电子方式交换想法、交替安排个人与群体阶段、给成员留下反思时间，可以保留 cognitive stimulation，同时避免所有人挤在同一个对话通道里（[Paulus & Yang, 2000](https://doi.org/10.1006/obhd.2000.2888)）。先并行生成，再集中展示、聚类、批评和组合。

### 2. 走路可以是 intervention，但不是仪式

Oppezzo 和 Schwartz 的四个实验发现，走路时以及刚走完之后，参与者在若干 divergent-generation task 上表现更好；同样的收益并没有出现在 convergent remote-associates task 上（[Oppezzo & Schwartz, 2014](https://doi.org/10.1037/a0036577)）。常被引用的“创造力提高 60%”只是特定实验测量的平均结果，不是对所有创造性工作的通用 multiplier。走路可能帮助 ideational fluency，但不能替代知识与判断。

### 3. Fluency 降下来以后，再搜索一会儿

在一个十分钟的 unusual-uses study 里，参与者越到后面，idea production rate 越低，但后期想法平均被评为更有创造性；这个 trajectory 还受到 fluid intelligence 的调节（[Beaty & Silvia, 2012](https://doi.org/10.1037/a0029171)）。Serial-order effect 支持的是 strategic retrieval，而不是“第 20 个想法必然最好”之类的定律。设置时间或数量预算的意义，是强迫搜索越过最容易出现的联想，而不是等一个神秘拐点。

数量会增加出现 hit 的机会，但不能保证质量。Simonton 的 equal-odds model 描述的是创作者职业生涯中，产量与成功作品之间的统计关系（[Simonton, 1997](https://doi.org/10.1037/0033-295X.104.1.66)）。更实用的理解是：先产生足够的 variance，再使用严格的 filter。

### 4. 主动调用远距离类比

Analogical transfer 不只是“看过相关例子”就会自动发生。能否 retrieve 到合适类比，取决于目标、representation，以及关系结构是否被突出。对科学家的自然观察与实验研究都显示，人们使用什么类比，会随着任务和生成要求而变化（[Dunbar & Blanchette, 2001](https://doi.org/10.1016/S1364-6613(00)01698-3)）。

“一个生物学家会怎么解决这个问题？”只能作为起始 prompt。更强的步骤是继续追问：source domain 里的 entity、relation、invariant 和 failure condition 分别是什么？哪些能映射到 target？LLM 可以帮助 retrieve 候选领域，研究者仍然要检验 mapping。

这也意味着，需要持续接触主领域以外的材料。远距离信息不保证自动变成好类比，但它能给有意识的 retrieval 提供一个更大、也更不均质的 index。

### 5. 找到一个能说“不”的 field

未经筛选的新颖性只是噪声。需要找到真正理解 domain、因正确理由拒绝想法的人。Criticism 不是创造力发生之后的附加步骤；在 systems view 里，它本来就是创造过程的一部分。

在请人判断之前，也要先明确你追求的是哪一种 novelty。重新独立得到一个已知结论，可能是很有价值的 P-creativity；声称 H-creativity，则需要对相关历史进行检索。混淆两者，要么制造不必要的自我怀疑，要么夸大新颖性。

### 6. 用 AI 扩大搜索，而不是过早收敛

让一个模型直接给出“最佳答案”，等于把 generative system 变成 early-convergence mechanism。我更倾向于在不同假设、retrieval context 和 critic role 下生成候选，再聚类暴露冗余，等整个空间可见以后再排序。

Doshi–Hauser 的结果是一个很好的提醒：AI assistance 可能提高每一件作品，同时让整个集合变得更同质。目标不只是提高一个 sample 的平均质量，还要保留足够多的 variation，让真正不同的东西有机会存活。

### 7. 给 incubation 留空间，但不要把它神秘化

Sio 和 Ormerod 汇总了 117 项研究，得到一个较小的平均 incubation effect，*d* = 0.29；不同问题类型和 break condition 之间差异很大（[Sio & Ormerod, 2009](https://doi.org/10.1037/a0014212)）。更长的前期准备、较低认知负荷的中间任务，在部分条件下与更大收益有关。但机制仍不确定：可能涉及忘记误导线索、重新表征、间歇性的 conscious thought，或多种机制共同作用。

比较可靠的实践很简单：先认真处理问题；当搜索开始重复时离开一下，可以去走路或做其他低认知负荷的事情；回来后重新看一遍。并不需要诉诸“潜意识替我解决了一切”。

## 最后

执行变得便宜，不只是在威胁现有工作，也是在邀请我们更认真地选择。

Guilford 问：搜索能有多宽？Koestler 问：哪些遥远结构可以相连？Boden 问：我们是在探索一个空间，还是改变它？Csikszentmihalyi 问：谁能识别这个结果，并把它带进一个领域？

模型会在这些操作上继续进步。这既不保证 human judgment 永远更优，也不意味着判断已经不再重要。它只是改变了判断发生的位置：不再主要花在产出第一个像样的 artifact，而更多花在选择问题、明确约束、保留多样性，以及决定什么值得成为世界的一部分。

当“做出来”变得廉价，最重要的问题不再是：**这能不能被做出来？**

而是：**什么值得被做出来？为什么？**

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
