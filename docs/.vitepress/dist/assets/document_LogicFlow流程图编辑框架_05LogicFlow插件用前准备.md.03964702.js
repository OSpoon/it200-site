import{_ as s,o,c as a,X as n}from"./chunks/framework.7a10e803.js";const A=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"document/LogicFlow流程图编辑框架/05LogicFlow插件用前准备.md","filePath":"document/LogicFlow流程图编辑框架/05LogicFlow插件用前准备.md","lastUpdated":1692946053000}'),l={name:"document/LogicFlow流程图编辑框架/05LogicFlow插件用前准备.md"},p=n(`<blockquote><p>LogicFlow 是一款流程图编辑框架，提供了一系列流程图交互、编辑所必需的功能和灵活的节点自定义、插件等拓展机制。LogicFlow支持前端研发自定义开发各种逻辑编排场景，如流程图、ER图、BPMN流程等。在工作审批配置、机器人逻辑编排、无代码平台流程配置都有较好的应用。</p></blockquote><p>这一节将讲解快速上手 LogicFlow 流程图编辑框架的插件用前准备工作，项目整体基于<a href="https://1024code.com/codecubes/0z9xIZl" target="_blank" rel="noreferrer">Vue3+Vite3+Ts4</a>开发，为帮助还为熟练使用 Vue3 和 Typescript 语法的小伙伴提供便利，如果你已经很熟练在Vue3中的开发习惯，建议直接访问 <a href="http://logic-flow.org/" target="_blank" rel="noreferrer">LogicFlow</a> 将获取完整的入门指南。</p><h2 id="_1-安装插件扩展模块" tabindex="-1">1. 安装插件扩展模块： <a class="header-anchor" href="#_1-安装插件扩展模块" aria-label="Permalink to &quot;1. 安装插件扩展模块：&quot;">​</a></h2><p>当你真的需要用到插件的功能时可以安装下面这个模块，每个模块各司其职：</p><div class="language-shell"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#FFCB6B;">npm</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">i</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">@logicflow/extension</span></span></code></pre></div><h2 id="_2-注册插件到全局或实例" tabindex="-1">2. 注册插件到全局或实例 <a class="header-anchor" href="#_2-注册插件到全局或实例" aria-label="Permalink to &quot;2. 注册插件到全局或实例&quot;">​</a></h2><p>插件的注册分为两种，分别是<strong>注册到全局</strong>和<strong>注册到实例</strong>，这个就需要按你业务的实际需要来设置了：</p><p>注册到全局：将如下的代码安装到 <code>Vue</code> 的 <code>main.ts</code> 入口文件中即可</p><div class="language-typescript"><button title="Copy Code" class="copy"></button><span class="lang">typescript</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">BpmnElement</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">@logicflow/extension</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">LogicFlow</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">use</span><span style="color:#A6ACCD;">(BpmnElement)</span><span style="color:#89DDFF;">;</span></span></code></pre></div><p>注册到实例：将扩展包在LF对象实例化后，将需要用到的插件通过 <code>plugins</code> 注册</p><div class="language-typescript"><button title="Copy Code" class="copy"></button><span class="lang">typescript</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> LogicFlow </span><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">@logicflow/core</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">DndPanel</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">SelectionSelect</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">Group</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">@logicflow/extension</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">@logicflow/core/dist/style/index.css</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">@logicflow/extension/lib/style/index.css</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> lf </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">new</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">LogicFlow</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">container</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> document</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">querySelector</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">#app</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;">)</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">grid</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FF9CAC;">true</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">plugins</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> [DndPanel</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> SelectionSelect</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> Group]</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span><span style="color:#89DDFF;">;</span></span></code></pre></div><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>这一节的内容就到此结束了，本小节内容简单，主要是为了提供一份可以为后续内置插件和自定义插件的使用提供一份可以<strong>fork</strong>的代码仓库，本节源码将使用注册到实例的方式操作，搞定后就马上要开始插件部分的学习了~</p>`,13),e=[p];function t(c,r,D,F,y,i){return o(),a("div",null,e)}const d=s(l,[["render",t]]);export{A as __pageData,d as default};
