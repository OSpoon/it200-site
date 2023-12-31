# CSS3动画相关属性整理

### CSS3 transition 属性
#### 使用语法: `transition:``property``duration``timing-function``delay``;`
#### 属性介绍:
| 属性 | 解释 | 默认值 | 可选值 |
| --- | --- | --- | --- |
| transition-property | 指定要进行过渡的css属性 | all | none 无属性做过渡
all 所有属性做过渡
_property (如: _width,height_) 指定属性/属性列表过渡_ |
| transition-duration | 指定完成过渡的时间(秒/毫秒) | 0 | time (如: 5s,500ms) |
| transition-timing-function | 指定完成过渡的转速曲线 | ease | linear: 匀速 cubic-bezier(0,0,1,1)
ease: 慢-快-慢 cubic-bezier(0.25,0.1,0.25,1)
ease-in: 慢-匀速 cubic-bezier(0.42,0,1,1)
ease-out: 匀速-慢 cubic-bezier(0,0,0.58,1)
ease-in-out: 慢-匀速-慢 cubic-bezier(0.42,0,0.58,1)
cubic-bezier(n,n,n,n): 指定速度曲线立方贝塞尔曲线函数 |
| transition-delay | 指定等待多久开始切换 | 0 | time (如: 5s,500ms) |

### CSS3 animation属性
#### 使用语法: `animation:``name``duration``timing-function``delay``iteration-count``direction``fill-mode``play-state``;`
#### 属性介绍:
| 属性 | 解释 | 默认值 | 可选值 |
| --- | --- | --- | --- |
| [animation-name](https://www.runoob.com/cssref/css3-pr-animation-name.html) | 指定关键帧名称 | none | keyframename_: _绑定到选择器的关键帧的名称
none |
| [animation-duration](https://www.runoob.com/cssref/css3-pr-animation-duration.html) | 指定执行时长(秒/毫秒) | 0 | time (如: 5s,500ms) |
| [animation-timing-function](https://www.runoob.com/cssref/css3-pr-animation-timing-function.html) | 指定动画执行周期(方式) |  | linear: 匀速 cubic-bezier(0,0,1,1)
ease: 慢-快-慢 cubic-bezier(0.25,0.1,0.25,1)
ease-in: 慢-匀速 cubic-bezier(0.42,0,1,1)
ease-out: 匀速-慢 cubic-bezier(0,0,0.58,1)
ease-in-out: 慢-匀速-慢 cubic-bezier(0.42,0,0.58,1)
cubic-bezier(n,n,n,n): 指定速度曲线立方贝塞尔曲线函数 |
| [animation-delay](https://www.runoob.com/cssref/css3-pr-animation-delay.html) | 指定等待多久开始执行 | 0 | time (如: 5s,500ms) |
| [animation-iteration-count](https://www.runoob.com/cssref/css3-pr-animation-iteration-count.html) | 指定播放次数 | 1 | n: 次数
infinite: 无限次 |
| [animation-direction](https://www.runoob.com/cssref/css3-pr-animation-direction.html) | 指定是否交替翻转执行 | normal | normal: 正常播放
reverse: 反向播放
alternate: 奇数次(正),偶数次(反)
alternate-reverse: 奇数次(反),偶数次(正)
initial: property: initial;
inherit: property: inherit; |
| [animation-fill-mode](https://www.runoob.com/cssref/css3-pr-animation-fill-mode.html) | 指定动画完成/延迟未执行时样式 | none | none: 不会应用任何样式到目标元素
forwards: 由animation-iteration-count决定,保留结束位置
backwards: 由animation-delay决定,保留初始位置
both: 由forwards和backwards共同决定
initial: property: initial;
inherit: property: inherit; |
| [animation-play-state](https://www.runoob.com/cssref/css3-pr-animation-play-state.html) | 指定动画运行/暂停 | running | running: 运行动画
paused: 暂停动画 |
| initial | 设置数据为默认值 |  | 语法: property: initial; |
| inherit | 继承父元素属性 |  | 后续整理 |

### CSS3 @keyframes 规则
#### 使用语法: `@keyframes``animationname``{``keyframes-selector``{``css-styles``;}}`
#### 属性介绍:
| 属性 | 解释 | 必选项 |
| --- | --- | --- |
| _animationname_ | 指定animation的名称 | 自定义 |
| keyframes-selector | 指定持续时间的百分比 | 合法值： 
0-100% 
from (和0%相同) 
to (和100%相同) 
注意： 您可以用一个动画keyframes-selectors。 |
| _css-styles_ | 合法的CSS样式属性 | 自定义CSS样式属性 |



