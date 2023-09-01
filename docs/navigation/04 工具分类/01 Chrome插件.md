---
layout: page
---

<script lang="ts" setup>
import navigation from '../../.vitepress/views/navigation.vue';
</script>

<navigation 
    uid="48a68f91-784c-4f66-a572-e9c6e1df5d56"
    :superlink="[
        {
        uuid:'fa4b7c5b-c88b-4d3e-bc46-cf6544e89a2d',
        title: 'Ajax Interceptor',
        description: '你可以用该插件修改页面上Ajax请求的返回结果。',
        icon: 'https://picgo-2022.oss-cn-beijing.aliyuncs.com/202309011607758.png',
        href: 'https://chrome.google.com/webstore/detail/ajax-interceptor/nhpjggchkhnlbgdfcbgpdpkifemomkpg',
      },
      {
        uuid:'b3117c1a-22a8-464e-9cdc-74b9be3c488f',
        title: 'Awesome Screenshot',
        description: '超级截图录屏大师是一款录屏神器，也是一款截屏神器．屏幕截图& 图片编辑，屏幕录像＆视频编辑，所有这些截图，录屏功能，都被一气呵成的集成到插件和对应的网站服务中．',
        icon: 'https://picgo-2022.oss-cn-beijing.aliyuncs.com/202309011607493.png',
        href: 'https://chrome.google.com/webstore/detail/awesome-screenshot-and-sc/nlipoenfbbikpbjkfpfillcgkoblgpmj',
      },
      {
        uuid:'fcd2d424-4922-4077-ab21-1b844880e385',
        title: 'Enhanced GitHub',
        description: 'Display repo size, size of each file, download link and option to copy file contents ',
        icon: 'https://picgo-2022.oss-cn-beijing.aliyuncs.com/202309011607271.png',
        href: 'https://chrome.google.com/webstore/detail/enhanced-github/anlikcnbgdeidpacdbdljnabclhahhmd',
      },
      {
        uuid:'a5749be0-1cf3-4875-a439-b5fbd15b5686',
        title: 'FeHelper(前端助手)',
        icon: 'https://picgo-2022.oss-cn-beijing.aliyuncs.com/202309011608606.png',
        href: 'https://chrome.google.com/webstore/detail/fehelper%E5%89%8D%E7%AB%AF%E5%8A%A9%E6%89%8B/pkgccpejnmalmdinmhkkfafefagiiiad',
        description: 'JSON自动格式化、手动格式化，支持排序、解码、下载等，更多功能可在配置页按需安装！',
      },
      {
        uuid:'dc6d3f31-3251-4771-a13f-6ca80859d373',
        title: 'EditThisCookie',
        icon: 'https://picgo-2022.oss-cn-beijing.aliyuncs.com/202309011608843.png',
        href: 'https://chrome.google.com/webstore/detail/editthiscookie/fngmhnnpilhplaeedifhccceomclgfbg',
        description: 'EditThisCookie是一个cookie管理器。您可以添加，删除，编辑，搜索，锁定和屏蔽cookies！',
      },
      {
        uuid:'5221db4a-fb34-4293-9d53-88596155d131',
        title: 'Github 百宝箱',
        icon: 'https://picgo-2022.oss-cn-beijing.aliyuncs.com/202309011608434.png',
        href: 'https://chrome.google.com/webstore/detail/github-%E7%99%BE%E5%AE%9D%E7%AE%B1/pbggmlghklngacbdkdjcebaaglkcokhp',
        description: 'Github 加速,Github 加速,Github 代码在线看,Github 1s,Octotree, VS Code 打开',
      },
      {
        uuid:'6daecbd6-3948-434e-ba63-05fcf77c463d',
        title: 'Octotree',
        icon: 'https://picgo-2022.oss-cn-beijing.aliyuncs.com/202309011608470.png',
        href: 'https://chrome.google.com/webstore/detail/octotree-github-code-tree/bkhaagjahfmjljalopjnoealnfndnagc',
        description: 'GitHub code tree Browser extension that enhances GitHub code review and exploration.',
      },
      {
        uuid:'95660a74-7d97-4b66-b513-395b13da8564',
        title: 'Tampermonkey',
        icon: 'https://picgo-2022.oss-cn-beijing.aliyuncs.com/202309011609045.png',
        href: 'https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo',
        description: 'Tampermonkey（油猴）是最受欢迎的浏览器扩展之一，拥有超过1000万用户。',
      },
      {
        uuid:'960b0c21-04e4-4d37-810c-7b77d683e91b',
        title: 'XPath Helper',
        icon: 'https://picgo-2022.oss-cn-beijing.aliyuncs.com/202309011609716.png',
        href: 'https://chrome.google.com/webstore/detail/xpath-helper/hgimnogjllphhhkhlmebbmlgjoejdpjl',
        description: 'XPath Helper makes it easy to extract, edit, and evaluate XPath queries on any webpage.',
      },
      {
        uuid:'cff4d9c2-ed67-4c24-be93-afaa010c88f2',
        title: '划词翻译',
        icon: 'https://picgo-2022.oss-cn-beijing.aliyuncs.com/202309011609969.png',
        href: 'https://chrome.google.com/webstore/detail/%E5%88%92%E8%AF%8D%E7%BF%BB%E8%AF%91/ikhdkkncnoglghljlkmcimlnlhkeamad',
        description: '一站式划词 / 截图 / 网页全文 / 音视频翻译扩展，支持谷歌、DeepL、百度、腾讯等 8 个国内外主流翻译服务，且均可用于网页翻译。能在 PDF 里使用。',
      },
      {
        uuid:'e5ca1154-9e35-40b8-b81b-734e9cef2179',
        title: '谷歌上网助手',
        icon: 'https://picgo-2022.oss-cn-beijing.aliyuncs.com/202309011610394.png',
        href: 'https://chrome.google.com/webstore/detail/%E8%B0%B7%E6%AD%8C%E4%B8%8A%E7%BD%91%E5%8A%A9%E6%89%8B-%E5%BC%80%E5%8F%91%E7%89%88/cieikaeocafmceoapfogpffaalkncpkc',
        description: '专门为科研、外贸、跨境电商、海淘人员、开发人员服务的上网加速工具，chrome内核浏览器专用!可以解决chrome扩展无法自动更新的问题，同时可>以访问谷歌google搜索，gmail邮箱，google+等谷歌产品',
      },
    ]"
/>

<style>
.VPPage {
  padding: 0 20px;
}
</style>
