import{_ as a,K as n,o as p,c as o,O as l,X as e}from"./chunks/framework.7a10e803.js";const u=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"document/构建工具tsup入门/02构建工具tsup入门第二部分.md","filePath":"document/构建工具tsup入门/02构建工具tsup入门第二部分.md","lastUpdated":1692946053000}'),t={name:"document/构建工具tsup入门/02构建工具tsup入门第二部分.md"},c=e(`<blockquote><p>tsup 是一个基于 ESBuild 实现在零配置的情况下快速捆绑 Typescript 模块的项目，在构建 CLI类 项目时可以优先考虑采用。</p></blockquote><p><img src="https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308101429193.png" alt="完整大纲"></p><p>在这一节中你将了解到 tsup 如何压缩代码、如何代码拆分、如何做 tree shaking、捆绑的格式有哪些以及配置目标环境，内容较多，请各位小伙伴准备好，马上要开始了~</p><h2 id="_1-开启压缩代码-代码拆分" tabindex="-1">1. 开启压缩代码 &amp; 代码拆分： <a class="header-anchor" href="#_1-开启压缩代码-代码拆分" aria-label="Permalink to &quot;1. 开启压缩代码 &amp; 代码拆分：&quot;">​</a></h2><p>代码压缩可以有效的移除对于程序运行时并不关心空白符号来减少编译结果的体积，其中开启的方式也很简单，查看下面1.1部分的两种方式即可；</p><p>代码拆分主要考虑将共享模块单独打包，这样仅在第一次访问有引用共享模块的页面时下载；在异步 <code>import()</code> 时才对模块进行下载，减少初次启动带来的大量请求阻塞造成的性能问题。</p><h3 id="_1-1-开启压缩代码" tabindex="-1">1.1 开启压缩代码 <a class="header-anchor" href="#_1-1-开启压缩代码" aria-label="Permalink to &quot;1.1 开启压缩代码&quot;">​</a></h3><p>终端执行时开启：</p><div class="language-typescript"><button title="Copy Code" class="copy"></button><span class="lang">typescript</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">cd code02 </span><span style="color:#89DDFF;">&amp;&amp;</span><span style="color:#A6ACCD;"> npx tsup index</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">tsx </span><span style="color:#89DDFF;">--</span><span style="color:#A6ACCD;">minify</span></span></code></pre></div><p>配置文件中开启：</p><div class="language-typescript"><button title="Copy Code" class="copy"></button><span class="lang">typescript</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">defineConfig</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">tsup</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">export</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">default</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">defineConfig</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">entry</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> [</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">index.tsx</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;">]</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">minify</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FF9CAC;">true</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span></span></code></pre></div><p>PS：代码参照<a href="https://1024code.com/codecubes/Ha1LfyC" target="_blank" rel="noreferrer">1024Code</a>中的code01部分；</p><h3 id="_1-2-代码拆分与不拆分" tabindex="-1">1.2 代码拆分与不拆分 <a class="header-anchor" href="#_1-2-代码拆分与不拆分" aria-label="Permalink to &quot;1.2 代码拆分与不拆分&quot;">​</a></h3><p>代码拆分需要注意 <code>esm</code> 模块默认开启，<code>cjs</code> 模块需要手动开启，如果需要关闭代码拆分需要手动指定 <code>--no-splitting</code> 参数；</p><p>准备两个模块，将一个模块通过异步导入到入口模块：</p><div class="language-typescript"><button title="Copy Code" class="copy"></button><span class="lang">typescript</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#676E95;font-style:italic;">// index.js</span></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> content </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">import</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">./content.js</span><span style="color:#89DDFF;">&#39;</span><span style="color:#A6ACCD;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">console</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">log</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">content: </span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> content)</span><span style="color:#89DDFF;">;</span></span></code></pre></div><div class="language-typescript"><button title="Copy Code" class="copy"></button><span class="lang">typescript</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#89DDFF;font-style:italic;">export</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> say </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">PS：请查看README.md后学习各小节内容</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">;</span></span></code></pre></div><p>添加合适的配置文件：</p><div class="language-typescript"><button title="Copy Code" class="copy"></button><span class="lang">typescript</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">defineConfig</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">tsup</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">export</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">default</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">defineConfig</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">entry</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> [</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">index.js</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;">]</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">format</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">esm</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span></span></code></pre></div><p>运行编译后，dist 目录将分别输出两个模块编译后的结果：</p><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#82AAFF;">cd</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">code02</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&amp;&amp;</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">npx</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">tsup</span></span></code></pre></div><p>通过配置文件禁止代码分割，再次运行编译将两个模块的结果合并：</p><div class="language-typescript"><button title="Copy Code" class="copy"></button><span class="lang">typescript</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">defineConfig</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">tsup</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">export</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">default</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">defineConfig</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">entry</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> [</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">index.js</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;">]</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">format</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">esm</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">splitting</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FF9CAC;">false</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span></span></code></pre></div><p>PS：代码参照<a href="https://1024code.com/codecubes/Ha1LfyC" target="_blank" rel="noreferrer">1024Code</a>中的code02部分；</p><h2 id="_2-利用-rollup-做-tree-shaking" tabindex="-1">2. 利用 Rollup 做 tree shaking： <a class="header-anchor" href="#_2-利用-rollup-做-tree-shaking" aria-label="Permalink to &quot;2. 利用 Rollup 做 tree shaking：&quot;">​</a></h2><p>由于 ESBuild 的 <code>tree shaking</code> 功能不那么完美，会在结果中留存部分并没有副作用的内容，就比如说下面这个例子：</p><div class="language-typescript"><button title="Copy Code" class="copy"></button><span class="lang">typescript</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> cwd </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> process</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">cwd</span><span style="color:#A6ACCD;">()</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">export</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{}</span></span></code></pre></div><p>对于这段代码来说变量 <code>cwd</code> 并没有任何地方的使用，仅仅是声明了这样一个变量，但是 esbuild 在处理后并没能将变量 <code>cwd</code> 移除，所以 <code>tsup</code> 就没有使用 ESBuild 的 <code>tree shaking</code> 而是选用了 Rollup；</p><p>那么想要在 tsup 正确开启 <code>tree shaking</code> 就是下面的两种方式：</p><p>终端执行时开启：</p><div class="language-typescript"><button title="Copy Code" class="copy"></button><span class="lang">typescript</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">cd code03 </span><span style="color:#89DDFF;">&amp;&amp;</span><span style="color:#A6ACCD;"> npx tsup index</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">js </span><span style="color:#89DDFF;">--</span><span style="color:#A6ACCD;">treeshake</span></span></code></pre></div><p>配置文件中开启：</p><div class="language-typescript"><button title="Copy Code" class="copy"></button><span class="lang">typescript</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">defineConfig</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">tsup</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">export</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">default</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">defineConfig</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">treeshake</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FF9CAC;">true</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span></span></code></pre></div><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#82AAFF;">cd</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">code03</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&amp;&amp;</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">npx</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">tsup</span></span></code></pre></div><p>运行后的结果将不再包含声明的 <code>cwd</code> 变量了。</p><p>PS：代码参照<a href="https://1024code.com/codecubes/Ha1LfyC" target="_blank" rel="noreferrer">1024Code</a>中的code03部分；</p><h2 id="_3-捆绑模块的格式" tabindex="-1">3. 捆绑模块的格式： <a class="header-anchor" href="#_3-捆绑模块的格式" aria-label="Permalink to &quot;3. 捆绑模块的格式：&quot;">​</a></h2><p>前端模块化主流的 <code>esm</code>、<code>cjs</code>、<code>iife</code> 都是 <code>tsup</code> 支持的将模块进行捆绑的格式，在 tsup 中默认使用 <code>iife</code> 格式。</p><p>在一次编译时输出多种模块格式的结果：</p><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#82AAFF;">cd</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">code04</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&amp;&amp;</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">npx</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">tsup</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">index.js</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">--format</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">esm,cjs,iife</span></span></code></pre></div><p>输出结果的文件名和格式存在如下对应关系：</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">dist</span></span>
<span class="line"><span style="color:#A6ACCD;">├── index.mjs         # esm</span></span>
<span class="line"><span style="color:#A6ACCD;">├── index.global.js   # iife</span></span>
<span class="line"><span style="color:#A6ACCD;">└── index.js          # cjs</span></span></code></pre></div><p>当项目根目录下的 <code>package.json</code> 文件中 <code>type</code> 被标记为 <code>module</code> 时将发生下面的变化：</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">dist</span></span>
<span class="line"><span style="color:#A6ACCD;">├── index.js          # esm</span></span>
<span class="line"><span style="color:#A6ACCD;">├── index.global.js   # iife</span></span>
<span class="line"><span style="color:#A6ACCD;">└── index.cjs         # cjs</span></span></code></pre></div><p>如果你不想使用不同的后缀来区分模块的格式可以开启 <code>--legacy-output</code> 参数来禁止这个行为，不同模块格式将输出到不同的目录中；</p><p>PS：代码参照<a href="https://1024code.com/codecubes/Ha1LfyC" target="_blank" rel="noreferrer">1024Code</a>中的code04部分；</p><h2 id="_4-目标环境配置-支持es5" tabindex="-1">4. 目标环境配置 &amp; 支持es5： <a class="header-anchor" href="#_4-目标环境配置-支持es5" aria-label="Permalink to &quot;4. 目标环境配置 &amp; 支持es5：&quot;">​</a></h2><p>在 tsup 运行前可以使用 <code>tsup.config.ts</code> 中的 <code>target</code> 选项或 <code>--target</code> 标志来为生成的 JavaScript 和/或 CSS 代码设置目标环境。每个目标环境是一个环境名称，后面跟着一个版本号组成；同样支持指定JavaScript语言版本。</p><p><code>target</code> 的值默认为项目中 <code>tsconfig.json</code> 内的 <code>compilerOptions.target</code> 选项，如果没有指定，则为 <code>node14</code>。</p><p>由于 ESBuild 天生不支持到 es5 的语法降级，所以在此 tsup 在此又选用了另一款编译框架来支持，那就是 <code>SWC</code>，一款由 <code>Rust</code> 编写的编译框架。在由 <code>esbuild</code> 将代码编译为 <code>es2020</code> 后由 <code>SWC</code> 接管语法降级部分再次编译降级为 <code>es5</code> 语法；</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>这一节的内容就到此结束了，代码压缩、模块拆分、树摇、捆绑格式及目标环境要在实际的情况下考虑是否要开启和关闭，在这一节还提到了 tsup 在遇到 esbuild 无能为力时的处理方式，那么你在开发中遇到这类问题是怎么解决的呢？</p>`,52);function r(y,i,D,C,d,F){const s=n("Comment");return p(),o("div",null,[c,l(s)])}const h=a(t,[["render",r]]);export{u as __pageData,h as default};
