// 获取全局应用程序实例对象
const app = getApp();

var newsDataList = new Array();//存储新闻数据data

// 创建页面实例对象
Page({
  /**
   * 页面名称
   */
  name: "read每日读刊页",
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

    //加载缓存中的时间
    wx.getStorage({
      key: 'newsTimeCache',
      success: function(res) {

        //跟当前系统日期进行比较(将系统时间转换为和缓存中格式相同的数据)
        var dateNow = String(untilDate.formatTime(new Date())).substring(0, 10).replace('/', '-')
        dateNow = dateNow.replace('/', '-')
        console.log(dateNow)

        //如果缓存中的时间相同则加载本地新闻缓存否则加载云端新闻
        if (res.data == dateNow){

          that.loadingLocalNews()

        }else{

          that.getNewsData()

        }

      },
      fail:function(){//获取缓存时间出错则直接加载本地新闻数据

        that.loadingLocalNews()

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

  //打开新闻详情页
  click_openNews:function(e){

    var index = parseInt(e.currentTarget.dataset.index);//获取所点击的index

    if (newsDataList[index] != null){//空值检验

      wx.navigateTo({//跳转页面带参
        url: '/pages/details/details?newsDetails = ' + newsDataList[index],
      })

    }else{

      wx.showToast({
        title: '加载新闻详情出错',
        icon: 'none',
        duration: 3000
      });

    }

  },

  //加载云端新闻
  getNewsData:function(){
    var that = this

    //数据加载完成之前，显示加载中提示框
    wx.showToast({
      title: '加载今日读刊',
      icon: 'loading',
      duration: 10000
    });

    wx.request({
      url: 'https://api02.bitspaceman.com/news/bbc',
      data:{
        apikey:'XwbEFbtDxJxCqifVW1APCYnZabGJMwJOCITqM0S771fGG8Dmvm41DspM99bPXiQN',
        kw: 'a'//搜索条件参数
      },
      method: 'GET',
      header: { 'Content-type': 'application/json' },
      success: function (res) {
        wx.hideToast()
        console.log(res.data)

        //对集合赋值(只显示三条BBC新闻即可)
        newsDataList.push(res.data.data[0])
        newsDataList.push(res.data.data[1])
        newsDataList.push(res.data.data[2])

        //对界面控件赋值
        that.setData({
          newsList: newsDataList,
        })
        //将数据存储至本地
        wx.setStorage({
          key: 'newsDataCache',
          data: res.data,
        })

      },
      fail:function(){

        wx.hideToast()
        console.log('加载BBC新闻出错')

      }

    })

  },
  //加载本地新闻
  loadingLocalNews:function(){
    var that = this

    wx.getStorage({
      key: 'newsDataCache',
      success: function(res) {

        newsDataList = res.data//对集合赋值

        //对界面控件赋值
        that.setData({
          newsList: newsDataList,
        })

      },
      fail:function(){

        console.log('本地新闻缓存加载出错')
        //本地新闻加载出错则加载云端新闻数据
        that.getNewsData()

      }
    })

  },

})