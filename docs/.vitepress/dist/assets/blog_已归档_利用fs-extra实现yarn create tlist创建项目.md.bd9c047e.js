import{_ as s,o as a,c as n,X as o}from"./chunks/framework.7a10e803.js";const i=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"blog/已归档/利用fs-extra实现yarn create tlist创建项目.md","filePath":"blog/已归档/利用fs-extra实现yarn create tlist创建项目.md","lastUpdated":null}'),l={name:"blog/已归档/利用fs-extra实现yarn create tlist创建项目.md"},p=o(`<h2 id="_1-前言" tabindex="-1">1. 前言 <a class="header-anchor" href="#_1-前言" aria-label="Permalink to &quot;1. 前言&quot;">​</a></h2><p>这一篇我们翻版一下 <code>create-vite</code>，将以后整理的项目模板集中管理，方便在需要的时候快速创建使用~</p><h2 id="_2-利用fs-extra实现-yarn-create-tlist-创建项目" tabindex="-1">2. 利用fs-extra实现&quot;yarn create tlist&quot;创建项目 <a class="header-anchor" href="#_2-利用fs-extra实现-yarn-create-tlist-创建项目" aria-label="Permalink to &quot;2. 利用fs-extra实现&quot;yarn create tlist&quot;创建项目&quot;">​</a></h2><p>资源拷贝我们采用<code>fs-extra</code>模块实现~</p><h3 id="_2-1-模板资源拷贝" tabindex="-1">2.1 模板资源拷贝： <a class="header-anchor" href="#_2-1-模板资源拷贝" aria-label="Permalink to &quot;2.1 模板资源拷贝：&quot;">​</a></h3><p>在模板资源拷贝时部分文件是需要我们特殊处理的，所以这部分文件在资源拷贝时就暂时过滤掉，<code>fs-extra</code>模块中的<code>copySync</code>就提供了过滤文件的功能~ 路径匹配的时候我们可以使用<code>path</code>模块中的<code>parse</code>函数转为对象后可以更好的操作~</p><div class="language-javascript"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#89DDFF;font-style:italic;">export</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> fileIgnore </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> [</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">package.json</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">_gitignore</span><span style="color:#89DDFF;">&#39;</span><span style="color:#A6ACCD;">]</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">fsExtra</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">copySync</span><span style="color:#A6ACCD;">(templateDir</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> targetDir</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#82AAFF;">filter</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">src</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;font-style:italic;">dest</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">!</span><span style="color:#A6ACCD;">fileIgnore</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">find</span><span style="color:#F07178;">(</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">f</span><span style="color:#89DDFF;">)</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">f</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">===</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">\`\${</span><span style="color:#A6ACCD;">path</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">parse</span><span style="color:#A6ACCD;">(src)</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">name</span><span style="color:#89DDFF;">}\${</span><span style="color:#A6ACCD;">path</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">parse</span><span style="color:#A6ACCD;">(src)</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">ext</span><span style="color:#89DDFF;">}\`</span></span>
<span class="line"><span style="color:#F07178;">    )</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span><span style="color:#89DDFF;">;</span></span></code></pre></div><h3 id="_2-2-文本文件拷贝" tabindex="-1">2.2 文本文件拷贝： <a class="header-anchor" href="#_2-2-文本文件拷贝" aria-label="Permalink to &quot;2.2 文本文件拷贝：&quot;">​</a></h3><p><code>_gitignore</code>文件需要再输出时进行重命名操作，但没有找到可以直接实现重命名的函数，所以就通过分别读写两步实现。普通文本文件使用<code>fs-extra</code>模块中的<code>readFileSync</code>读取，在输出到新文件名的文件中~</p><div class="language-javascript"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> gitignoreInfo </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> fsExtra</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">readFileSync</span><span style="color:#A6ACCD;">(</span></span>
<span class="line"><span style="color:#A6ACCD;">  path</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">resolve</span><span style="color:#A6ACCD;">(templateDir</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">_gitignore</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">fsExtra</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">outputFile</span><span style="color:#A6ACCD;">(path</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">join</span><span style="color:#A6ACCD;">(root</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">.gitignore</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;">)</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> gitignoreInfo)</span><span style="color:#89DDFF;">;</span></span></code></pre></div><h3 id="_2-3-json-文件拷贝" tabindex="-1">2.3 JSON 文件拷贝： <a class="header-anchor" href="#_2-3-json-文件拷贝" aria-label="Permalink to &quot;2.3 JSON 文件拷贝：&quot;">​</a></h3><p><code>package.json</code> 读取后我们需要重写内容后再输出，<code>fs-extra</code>模块中的<code>readJsonSync</code>函数可以直接读取为 JSON 对象，我们在修改对象后再次通过<code>outputJSONSync</code>输出 JSON 对象即可，在<code>outputJSONSync</code>提供的选项中指定<code>spaces=2</code>输出非在一行的 JSON 文件~</p><div class="language-javascript"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> pkg </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> fsExtra</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">readJsonSync</span><span style="color:#A6ACCD;">(path</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">resolve</span><span style="color:#A6ACCD;">(templateDir</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">package.json</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;">))</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">pkg</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">name </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> packageName </span><span style="color:#89DDFF;">||</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">getProjectName</span><span style="color:#A6ACCD;">()</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">fsExtra</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">outputJSONSync</span><span style="color:#A6ACCD;">(path</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">join</span><span style="color:#A6ACCD;">(root</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">package.json</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;">)</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> pkg</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">spaces</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">2</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span><span style="color:#89DDFF;">;</span></span></code></pre></div><h2 id="_3-总结" tabindex="-1">3. 总结 <a class="header-anchor" href="#_3-总结" aria-label="Permalink to &quot;3. 总结&quot;">​</a></h2><p>&quot;yarn create tlist&quot;的主要逻辑除去参数的收集以外就是模板的拷贝两块了，这里通过利用<code>fs-extra</code>实现了模板拷贝，<code>fs-extra</code>函数的支持还是挺不错的，拷贝文件还考虑到了支持过滤的功能，挺不错~</p><blockquote><p>本文项目已推送至GitHub，欢迎克隆演示：<code>git clone git@github.com:OSpoon/create-tlist.git</code></p></blockquote>`,16),e=[p];function t(c,r,D,y,F,A){return a(),n("div",null,e)}const d=s(l,[["render",t]]);export{i as __pageData,d as default};
