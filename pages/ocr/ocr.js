// 获取全局应用程序实例对象
const app = getApp();

var md5Date = require('../../utils/zhmd5.js');//用来MD5加密

// 创建页面实例对象
Page({
  /**
   * 页面名称
   */
  name: "ocr拍照翻译页",
  /**
   * 页面的初始数据
   */

  data: {

    hideTwoView:true,//隐藏拍照后显示的view
    hideUpperView:true,//遮罩层默认隐藏

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

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

  //选照/拍照
  click_selectPhoto:function(){
    var that= this;

    wx.showLoading({
      title: '加载照片中',
    })

    wx.chooseImage({//从相册选择照片或拍照
      count:1,//返回几张照片
      success: function(res) {
        wx.hideLoading()

        var tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths[0])

        //获取到照片后添加至界面image中并显示
        that.setData({
          imgPhoto: tempFilePaths[0],
          hideTwoView:false,
        })
        

        //加载照片识别
        that.getPhotoTranslation(tempFilePaths[0])

      },
      fail:function(){
        wx.hideLoading()

        wx.showToast({
          title: '未选择照片',
          icon: 'none',
          duration: 3000
        });

      }
    })

  },

  //加载照片识别
  getPhotoTranslation:function(imagePhotoOCR){
    var that = this;

    wx.getNetworkType({//检查网络状态
      success: function(res) {

        if (res.networkType == 'none') {//无网络

          wx.showToast({
            title: '无网络',
            icon: 'none',
            duration: 1000
          });

        } else {

          wx.showLoading({
            title: '加载OCR翻译中',
          })

          wx.request({
            url: 'https://www.dounine.com',
          })

          // //请求参数准备
          // var imagePhoto = imagePhotoOCR;//要识别的图片，需要Base64编码
          // var toLanguage = 'zh-en';//要识别的语言类型 英文：en，中英混合：zh-en
          // var detectType = '10012';//按字识别：10011；按行识别：10012
          // var imageType = '1';//图片类型，目前只支持Base64
          // var appKey = '166b9fcfe89034ee';
          // var key = 'pEx2a8sGIRbqXaiy2OTZWVg1RFKjSlTS';
          // var salt = (new Date).getTime;//随机数
          // var sign = appkey + imagePhoto + salt + key;//签名
          // var docType = 'JSON';//服务器响应类型，目前只支持json

          // wx.request({
          //   url: 'https://openapi.youdao.com/ocrapi',
          //   data: {
          //     img:imagePhoto,
          //     langType:toLanguage,
          //     detectType: detectType,
          //     imageType, imageType,
          //     appKey: appKey,
          //     salt: salt,
          //     sign: md5Date.md5(sign),
          //     docType: docType
          //   },
          //   method: 'GET',
          //   header: { 'Content-type': 'application/json' },
          //   success:function(res){
          //     wx.hideLoading()
          //     console.log(res.data)

          //   },
          //   fail:function(){
          //     wx.hideLoading()

          //     wx.showModal({//弹框
          //       content: 'OCR翻译出错，请重试',
          //       showCancel: true,
          //       confirmColor: '#000000',
          //       confirmText:'重试',
          //       success:function(res){
                  
          //         if (res.confirm){//用户点击确认

          //           //再次调用自己
          //           that.getPhotoTranslation(imagePhotoOCR)

          //         } else if (res.cancel){//用户点击取消
          //           console.log('用户点击取消')
          //         }

          //       }
          //     });

          //   }
          // })

        }

      },
    })


  },





})