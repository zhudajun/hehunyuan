// pages/course/course.js
const netHelper = require("../../utils/netHelper.js");
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 总共的pageNumber
    totalPages: 1,
    // pageIndex 
    pageIndex: 0, 
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPageDataSource();
  },


  
// 加载数据
  getPageDataSource() {
    var pageIndex = this.data.pageIndex;
    var list = this.data.list;
    if (pageIndex == 0) {
      list = [];
    }
    if (pageIndex >= this.data.totalPages) {
      return;
    }
    let self = this
    netHelper.getUserCourse(pageIndex, 20, function (success) {
      console.log(success)
      self.setData({
        totalPages: success.totalPage,
        pageIndex: pageIndex + 1,
        list: list.concat(success.list)
      })
    }, function (failure) {
      console.log(failure);
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("加载更多数据");
    this.getPageDataSource()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 去详情页面
  goPlayViewController(event){
    let course = event.currentTarget.dataset.course;
    course.albumId = course.id;
    app.globalData.playListDataSource = course;
    wx.navigateTo({
      url: '../play/play',
      success: function (res) {
        console.log("chenggong")
      }, fail: function (err) {
        console.log("shibai")
      }
    })
  }



})