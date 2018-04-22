// 获取全局应用程序实例对象
var app = getApp();

var contentTranslationDataList = new Array();//存储生词本数据data


// 创建页面实例对象
Page({
  /**
   * 页面名称
   */
  name: "content",
  /**
   * 页面的初始数据
   */

  data: {



  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    var that = this

    //------------------------------------------加载已缓存的生词本数据
    wx.getStorage({
      key: 'contentTranslationCache',
      success: function (res) {

        contentTranslationDataList = res.data//将缓存中的集合赋值给变量

        //对界面控件赋值
        that.setData({
          contentTranslationDataList: res.data,
        })

      },
      fail: function () {
        console.log("生词本缓存获取失败")
      }
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

  //阅读
  click_readTranslation: function (e) {

    var index = parseInt(e.currentTarget.dataset.index);//获取所点击的index

    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = true
    innerAudioContext.src = contentTranslationDataList[index].speakURL//音频播放地址
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })

  },

  //复制
  click_copyTranslation: function (e) {

    var index = parseInt(e.currentTarget.dataset.index);//获取所点击的index

    //设置值系统剪切板
    wx.setClipboardData({
      data: contentTranslationDataList[index].translationTo,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            console.log(res.data)

            wx.showToast({
              title: '复制成功',
              icon: 'success',
              duration: 1000
            })

          },
          fail: function () {

            wx.showToast({
              title: '复制失败',
              icon: 'success',
              duration: 1000
            })
          }

        })
      }
    })

  },

  //删除
  click_deleteTranslation: function (e) {
    var that = this

    var index = parseInt(e.currentTarget.dataset.index);//获取所点击的index

    contentTranslationDataList.splice(index, 1)//移除数组元素

    //更新列表状态
    that.setData({
      contentTranslationDataList: contentTranslationDataList,
    })

    //重新设置缓存
    wx.setStorage({
      key: 'contentTranslationCache',
      data: contentTranslationDataList,
    })

  },
  

})
