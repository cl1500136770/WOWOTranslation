// 获取全局应用程序实例对象
const app = getApp();


// 创建页面实例对象
Page({
  /**
   * 页面名称
   */
  name: "details新闻详情页",
  /**
   * 页面的初始数据
   */

  data: {



  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(newsData) {//接收页面传参（新闻详情数据）
    var that = this
    console.log(newsData)

    //将新闻详情添加至页面

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



})