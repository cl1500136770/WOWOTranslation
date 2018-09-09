// 获取全局应用程序实例对象
var app = getApp();

var md5Date = require('../../utils/zhmd5.js');//用来MD5加密

const recorder = wx.getRecorderManager()//录音实例化

//录音配置参数
const options = {
  duration: 90000,//指定录音的时长
  sampleRate: 44100,//采样率
  numberOfChannels: 1,//录音通道数
  encodeBitRate: 192000,//编码码率
  format: 'aac',//音频格式
  frameSize: 50//指定帧大小
}

// 创建页面实例对象
Page({
  /**
   * 页面名称
   */
  name: "talk语音翻译页",
  /**
   * 页面的初始数据
   */

  data: {

    plainEN: false,//按钮无背景图
    plainZH: false,//按钮无背景图
    toView: 'viewhelp',//scrollView定位至最底部
    hideTalkZH: false,//说话动效隐藏
    hideTalkEN: false,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

    this.setData({//隐藏说话动效图
      hideTalkZH: true,
      hideTalkEN: true
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },


  //以下为自定义点击事件

  //中文语音输入开始
  startTalkZH: function () {

    this.setData({//按下按钮css变化并出现说话动效图
      plainZH: true,
      hideTalkZH: false
    })

    this.setData({//scrollView定位至最底部（必须放在说话动效之后否则说话动效会被遮盖）
      toView: 'viewhelp'
    })

    //开始录音
    recorder.onStart(() => {
      console.log('开始录音')
    })
    recorder.start(options)

  },

  //中文语音输入结束
  stopTalkZH: function () {

    //wx.stopRecord()
    this.setData({//松开按钮css变化并隐藏说话动效图
      plainZH: false,
      hideTalkZH: true
    })

    //停止录音
    recorder.onStop((res) => {
      console.log('结束录音', res)
      const { tempFilePath } = res

      //将录音转换为文字
      this.getTalkInText(tempFilePath,'ZH')

    })
    recorder.stop()

  },

  //英文语音输入开始
  startTalkEN: function () {
    this.setData({//按下按钮css变化并显示说话动效图
      plainEN: true,
      hideTalkEN: false
    })
    this.setData({//scrollView定位至最底部（必须放在说话动效之后否则说话动效会被遮盖）
      toView: 'viewhelp'
    })

    //开始录音
    recorder.onStart(() => {
      console.log('开始录音')
    })
    recorder.start(options)
    
  },

  //英文语音输入结束
  stopTalkEN: function () {
    this.setData({//松开按钮css变化并隐藏说话动效图
      plainEN: false,
      hideTalkEN: true
    })
    
    //停止录音
    recorder.onStop((res) => {
      console.log('结束录音', res)
      const { tempFilePath } = res

      //将录音转换为文字
      this.getTalkInText(tempFilePath, 'EN')

    })
    recorder.stop()

  },

  //将声音转换为文字
  getTalkInText(talkPath,talkType){

    //准备语音识别数据
    var appkey = '596360f66b2846778d24bd43ed0598d3';
    var api = 'asr';//值必须是 ‘asr’
    var timestamp = (new Date).getTime;//当前时间戳，精确到毫秒
    var sign = '92020abc9a5c4b6c8506af8fc089fb10' + api + appkey + timestamp + '92020abc9a5c4b6c8506af8fc089fb10';//MD5 签名
    var sound = '';//欲识别的音频文件(选填)
    var seq = 'seg';//请求的识别结果类型，可以是 seg 或 nli，例如：seq=seg。支持合并使用，以逗号区隔，例如：seq=seg,nli
    var stop = 0;//0：默认值，音频尚未提交完毕，1：音频提交结束(选填)
    var compress = 0;//0：一般音频文件，1：音频为 Speex 压缩文件
    var cusid = '';//终端用户识别码(选填)
    var rq = '';//带有特殊设定参数的 JSON 字符串(选填)

    // wx.uploadFile({
    //   url: 'https://cn.olami.ai/cloudservice/api',
    //   filePath: '',
    //   name: '',
    // })

    wx.request({
      //https://cn.olami.ai/cloudservice/api?api=asr&appkey=your_app_key&timestamp=current_timestamp&sign=your_sign&seq=seg,nli&compress=0&stop=1
      url: 'https://cn.olami.ai/cloudservice/api',
      data: {
        appkey: appkey,
        api: api,
        timestamp: timestamp,
        sign: md5Date.md5(sign),
        sound: talkPath,
        seq: seq,
        stop:1,
        compress:0
      },
      method: 'POST',
      header: { 'Content-type': 'multipart/form-data' },
      success:function(res){
        console.log(res.data)
      },
      fail:function(){
        console.log('获取语音识别出错')
      }
    })

  }



})
