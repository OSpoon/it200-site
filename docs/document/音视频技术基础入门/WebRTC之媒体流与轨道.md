---
title: WebRTC之媒体流与轨道
date: '2022-06-09 21:46'
sidebar: 'auto'
categories:
 - 
tags:
 - 
---

:::tip
媒体流指的是访问设备后产生的数据流，轨道指的是 WebRTC 中的基本媒体单元。
:::

<!-- more -->

## 前言

大家好，我是[小鑫同学](https://it200.cn/ "https://it200.cn/")。一位从事过**Android开发**、**混合开发**，现在长期从事**前端开发**的编程爱好者，**我觉得在编程之路上最重要的是知识的分享，所谓三人行必有我师**。所以我开始在社区持续输出我所了解到、学习到、工作中遇到的各种编程知识，欢迎有想法、有同感的伙伴加我[fe-xiaoxin](https://it200.cn/ "https://it200.cn/")微信交流~

> 媒体流指的是访问设备后产生的数据流，轨道指的是 WebRTC 中的基本媒体单元。


> 当开始采集音频或视频设备后就会源源不断的产生媒体数据（媒体流），比如从摄像头，画布，桌面捕获到的视频流，从麦克风捕获到的音频流。只有当我们不停的接收到媒体流才能看到视频和听到音乐。
> 


> 在实际应用场景中这些媒体流将由更多种数据组成，WebRTC 将其划分成了多个轨道，我们可以得到不同轨道对应的设备信息，也可以对其进行控制，如麦克风静音或网络不优秀的时候关掉视频。


**媒体流与轨道相关 API：**

| 函数名                  | 参数     | 描述                                                                           |
| -------------------- | ------ | ---------------------------------------------------------------------------- |
| MediaStream          | 无      | 通过 getUserMedia 或 getDisplayMedia 接口获取媒体流                                    |
| MediaStreamTrack     | 无      | 通过 MediaStream.getVideoTracks 获取所有视频轨道通过 MediaStream.getAudioTracks 获取所有音频轨道 |
| Video.captureStream  | fps 帧率 | 捕获 Video 对象播放的媒体流，通过传入更大的帧率得到更清晰流畅的画面，也需要更高的宽带支持                             |
| Canvas.captureStream | fps 帧率 | 捕获 Canvas 中的媒体数据，可以动态的播放画布中的数据，同样传入更大的帧率得到的效果将更加流畅清晰                         |

## 媒体流介绍：

媒体流是通过 MediaStream 接口得到后进行操作的，在一个媒体流中可以包含多个轨道，如同时支持视频和音频后得到的视频轨道和音频轨道，在前面的学习中我们将其输出显示为视频或音频元素，其实我们还可以将其发送到 RTCPeerConnection 对象，然后将其发送到远程计算机。

媒体流有多少中获取的方式呢？如何得到媒体流？

1.  摄像头：捕获用户设备中所支持的摄像头硬件设备；
1.  麦克风：捕获用户设备中所支持的麦克风硬件设备；
1.  计算机屏幕，窗口：捕获用户计算机屏幕、窗口等；
1.  Canvas：捕获在 Canvas 中的内容；
1.  视频源 Video：捕获 Video 播放中视频的内容；
1.  远端流：使用对等连接来接收新的流。

## MediaStream API：

| **序号** | **属性** | **描述**                                   |
| ------ | ------ | ---------------------------------------- |
| 1      | active | 当 MediaStream 处于激活状态时返回 true，反之返回 false。 |
| 2      | ended  | 当媒体流读取完毕触发结束事件后返回 true，反之返回 false。       |
| 3      | id     | 对象的唯一标识符                                 |
| 4      | label  | 用户代理分配的唯一标识符                             |

通过事件来监听流处理及活动状态的变化：

| **序号** | **事件**        | **描述**                           |
| ------ | ------------- | -------------------------------- |
| 1      | onactive      | 当 MediaStream 对象变为活动状态时触发此事件。    |
| 2      | onaddtrack    | 当添加新的 MediaStreamTrack 对象时触发该事件。 |
| 3      | onended       | 当流终止是触发该事件。                      |
| 4      | oninactive    | 当 MediaStream 对象变为不活动状态时触发该事件。   |
| 5      | onremovetrack | 当有轨道从 MediaStreamTrack 移除时触发该事件。 |

通过方法来添加、删除、克隆及获取音视频轨道数据：

| **序号** | **方法**           | **描述**                                                    |
| ------ | ---------------- | --------------------------------------------------------- |
| 1      | addTrack()       | 从 MediaStream 添加作为参数的 MediaStreamTrack 对象，多次添加则只响应第一次的操作  |
| 2      | clone()          | 返回一份 MediaStream 的克隆后的对象（新 id）                            |
| 3      | getAudioTracks() | 从 MediaStream 得到音频 MediaStreamTrack 列表                    |
| 4      | getTrackById()   | 通过 id 得到对应的轨道数据，相同 id 的多个轨道会得到第一个                         |
| 5      | getTracks()      | 从 MediaStream 得到所有 MediaStreamTrack 列表                    |
| 6      | getVideoTracks() | 从 MediaStream 得到视频 MediaStreamTrack 列表                    |
| 7      | removeTracks()   | 从 MediaStream 删除作为参数的 MediaStreamTrack 对象，已删除后执行将不会发生任何操作 |

## 结语：

今天先了解一下对于媒体流和对象的各种操作，为后续的实验做准备，明天继续~

* * *

**如果看完觉得有收获，欢迎点赞、评论、分享支持一下。你的支持和肯定，是我坚持写作的动力~**

最后可以关注我@小鑫同学。欢迎[点此扫码加我微信](https://it200.cn/ "https://it200.cn/")[fe-xiaoxin](https://it200.cn/ "https://it200.cn/")交流，共同进步（还可以帮你**fix**🐛）~