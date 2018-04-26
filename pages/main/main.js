// 获取全局应用程序实例对象
var app = getApp();

var untilDate = require('../../utils/util.js');//用来获取时间
var md5Date = require('../../utils/zhmd5.js');//用来MD5加密

var inputValue = '';//存储输入框的值
var tagLanguage = 'auto';//存储用户所选的目标语言

var translationDataList = new Array();//存储翻译数据data
var contentTranslationDataList = new Array();//存储生词本数据data
var tagLanguageArray = ['目标语言', '英文', '中文', '日文', '韩文', '法文', '俄文', '葡萄牙文', '西班牙文'];//目标语言选择集合

// 创建页面实例对象
Page({
  /**
   * 页面名称
   */
  name: "main",
  /**
   * 页面的初始数据
   */

  data: {

    tagLanguageArray: tagLanguageArray,
    index: 0,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    var that = this

    //------------------------------------------------获取每日一句的缓存
    wx.getStorage({
      key: 'dayOneCache',
      success: function (res) {

        console.log(res.data.dateline)
        //跟当前系统日期进行比较(将系统时间转换为和缓存中格式相同的数据)
        var dateNow = String(untilDate.formatTime(new Date())).substring(0, 10).replace('/', '-')
        dateNow = dateNow.replace('/', '-')
        console.log(dateNow)

        //如果缓存中的年月日与系统年月日相等则直接加载缓存中的每日一句，否则加载云端数据
        if (res.data.dateline == dateNow) {

          //对界面控件赋值
          that.setData({
            oneDayZH: res.data.content,
            oneDayEN: res.data.note,
          })

        } else {

          that.getDayOne()

        }

      },
      fail: function () {//没有缓存则直接加载每日一句
        that.getDayOne()
      },
    })

    //------------------------------------------加载已缓存的查询数据
    wx.getStorage({
      key: 'translationCache',
      success: function (res) {

        translationDataList = res.data//将缓存中的集合赋值给变量

        //对界面控件赋值
        that.setData({
          translationList: res.data,
        })

      },
      fail: function () {
        console.log("已翻译缓存获取失败")
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



  //目标语言选择
  change_TagLanguage:function(e){

    console.log(tagLanguageArray[indexValue])

    var indexValue = e.detail.value;
    if (tagLanguageArray[indexValue] == '目标语言'){
      tagLanguage = 'auto';
    } else if (tagLanguageArray[indexValue] == '英文'){
      tagLanguage = 'EN';
    } else if (tagLanguageArray[indexValue] == '中文') {
      tagLanguage = 'zh-CHS';
    } else if (tagLanguageArray[indexValue] == '日文') {
      tagLanguage = 'ja';
    } else if (tagLanguageArray[indexValue] == '韩文') {
      tagLanguage = 'ko';
    } else if (tagLanguageArray[indexValue] == '法文') {
      tagLanguage = 'fr';
    } else if (tagLanguageArray[indexValue] == '俄文') {
      tagLanguage = 'ru';
    } else if (tagLanguageArray[indexValue] == '葡萄牙文') {
      tagLanguage = 'pt';
    } else if (tagLanguageArray[indexValue] == '西班牙文') {
      tagLanguage = 'es';
    }

    this.setData({//设置picker目标语言选项
        index: indexValue
    })

  },

  //获取输入框的值
  input_queryTranslation: function (e) {

    var that = this
    console.log(e.detail.value);
    inputValue = e.detail.value//赋值~

  },

  //翻译
  click_queryTranslation: function (e) {
    var that = this

    wx.getNetworkType({
      success: function (res) {

        if (res.networkType == 'none') {//无网络

          wx.showToast({
            title: '无网络',
            icon: 'none',
            duration: 1000
          });

        } else {

          //输入框没有值
          if (inputValue == null || inputValue == '') {

            wx.hideToast();

            wx.showToast({
              title: '输入框不可为空',
              icon: 'none',
              duration: 1000
            });

            return;

          }

          //数据加载完成之前，显示加载中提示框
          wx.showToast({
            title: '翻译中',
            icon: 'loading',
            duration: 90000
          });

          //准备翻译参数数据
          var query = inputValue;
          var appkey = '166b9fcfe89034ee';
          var key = 'pEx2a8sGIRbqXaiy2OTZWVg1RFKjSlTS';
          var salt = (new Date).getTime;
          var sign = appkey + query + salt + key

          //获取输入翻译
          wx.request({
            url: 'https://openapi.youdao.com/api',
            data: {
              q: inputValue,
              from: 'auto',
              to: tagLanguage,
              appKey: appkey,
              salt: salt,
              sign: md5Date.md5(sign),
            },
            method: 'GET',
            header: { 'Content-type': 'application/json' },
            success: function (res) {
              wx.hideToast();//隐藏
              console.log(res.data)

              var translationData = new Object();//新建一个对象
              translationData.translationFrom = res.data.query;//查询内容
              translationData.translationTo = res.data.translation[0];//翻译内容
              //只在查词时才返回音标数据
              if (res.data.basic != null) {

                //在查词时才返回音标数据
                if (res.data.basic.phonetic != null) {

                  translationData.phonetic = res.data.basic.phonetic;//音标

                } else {
                  translationData.phonetic = "无"
                }

                //只在查中文词时才返回释义数据
                if (res.data.basic.explains[0] != null) {

                  translationData.explains = res.data.basic.explains[0];//释义

                } else {
                  translationData.explains = "无"
                }

              } else {//都设置为无
                translationData.phonetic = "无"
                translationData.explains = "无"
              }

              translationData.speakURL = res.data.tSpeakUrl;//发音地址连接

              translationDataList.unshift(translationData)//存储至集合

              //存储至缓存
              wx.setStorage({
                key: 'translationCache',
                data: translationDataList,
              })

              //再次加载缓存
              wx.getStorage({
                key: 'translationCache',
                success: function (res) {
                  console.log(res.data)

                  //对界面控件赋值
                  that.setData({
                    translationList: res.data,
                  })

                },
                fail: function () {
                  console.log('已翻译缓存获取出错')
                }
              })


            },
            fail: function () {
              wx.hideToast();//隐藏

              wx.showModal({

                content: '获取翻译失败',
                showCancel: false,
                confirmColor: '#000000',

              });

            }
          })

        }

      },
    })


  },

  //阅读
  click_readTranslation: function (e) {

    var index = parseInt(e.currentTarget.dataset.index);//获取所点击的index

    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = true
    innerAudioContext.src = translationDataList[index].speakURL//音频播放地址
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
      data: translationDataList[index].translationTo,
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

  //生词本
  click_contentTranslation: function (e) {
    var that = this;

    var index = parseInt(e.currentTarget.dataset.index);//获取所点击的index

    //获取生词本缓存
    wx.getStorage({
      key: 'contentTranslationCache',
      success: function (res) {

        contentTranslationDataList = res.data//将缓存中的集合赋值给变量
        //将点击的翻译数据加入集合
        contentTranslationDataList.unshift(translationDataList[index])

        that.insertContentData()

      },
      fail: function () {
        console.log("生词本缓存获取失败")
        //如果没有生词本缓存则直接加入集合
        contentTranslationDataList.unshift(translationDataList[index])

        that.insertContentData()

      }
    })

  },

  //再次设置生词本缓存
  insertContentData: function () {

    wx.setStorage({
      key: 'contentTranslationCache',
      data: contentTranslationDataList,
    })

    wx.showModal({

      content: '成功加入生词本，点击上方每日一句即可打开生词本',
      showCancel: false,
      confirmColor: '#000000',

    });

  },

  //删除
  click_deleteTranslation: function (e) {
    var that = this

    var index = parseInt(e.currentTarget.dataset.index);//获取所点击的index

    translationDataList.splice(index, 1)//移除数组元素

    //更新列表状态
    that.setData({
      translationList: translationDataList,
    })

    //重新设置缓存
    wx.setStorage({
      key: 'translationCache',
      data: translationDataList,
    })

  },

  //跳转至生词本
  click_openContent: function (e) {

    wx.navigateTo({
      url: '/pages/content/content',
    })

  },

  //获取每日一句
  getDayOne: function () {
    var that = this

    //获取网络状态
    wx.getNetworkType({
      success: function (res) {

        if (res.networkType == 'none') {//无网络

          //加载本地数据
          wx.getStorage({
            key: 'dayOneCache',
            success: function (res) {

              //对界面控件赋值
              that.setData({
                oneDayZH: res.data.content,
                oneDayEN: res.data.note,
              })

            },
          })


        } else {

          //数据加载完成之前，显示加载中提示框
          wx.showToast({
            title: '加载每日一句',
            icon: 'loading',
            duration: 10000
          });

          wx.request({
            url: 'https://open.iciba.com/dsapi',
            data: {},
            method: 'GET',
            header: { 'Content-type': 'application/json' },
            success: function (res) {
              wx.hideToast()
              console.log(res.data)
              //对界面控件赋值
              that.setData({
                oneDayZH: res.data.content,
                oneDayEN: res.data.note,
              })
              //将数据存储至本地
              wx.setStorage({
                key: 'dayOneCache',
                data: res.data,
              })
            },
            fail: function () {
              wx.hideToast()
              console.log('加载每日一句出错')
            }
          })


        }

      }
    })

  },



})
