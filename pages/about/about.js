// pages/about/about.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName : "用户账号",
    userImagePath: "https://wx.qlogo.cn/mmopen/vi_32/echWia6oBqia24Cxt5Q1X3xQnrGHWs4GtVOaiahXFJAuVzoW09aPGFfjWP2YpKFVFlWTn8JE5l2bN7jsznYq1O4rg/132",
    userID:"",
    ifUserIsVIP:false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    list:[
      {
        index:0,
        title :"我的课程",
        imageScr:"../../scr/Mycourses.png",
      },
      {
        index: 1,
        title: "我的收藏",
        imageScr: "../../scr/mycollection.png",
      },
      {
        index: 2,
        title: "活动通知",
        imageScr: "../../scr/Eventnotice.png",
      },
      {
        index: 3,
        title: "联系我们",
        imageScr: "../../scr/contactus.png",
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData);
    let userId = app.globalData.userID;
    let userIdString = '用户id：' + userId.toString()
      this.setData({
        userID:userIdString
      })
    wx.getUserInfo({
      success: function (res) {
        console.log("app.globalData");
        console.log(res);
      }
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
    this.handleWithUserDataSource();
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  handleWithUserDataSource:function() {
    if (app.globalData.userInfo) {
      this.setData({
        userImagePath: app.globalData.userInfo.avatarUrl,
        userName: app.globalData.userInfo.nickName,
        userPhoneNumber: "150****8651"
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userImagePath: res.userInfo.avatarUrl,
          userName: res.userInfo.nickName,
          userPhoneNumber: "150****8651"
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userImagePath: res.userInfo.avatarUrl,
            userName: res.userInfo.nickName,
            userPhoneNumber: "150****8651"
          })
        }
      })
    }
  },


  navToViewController(event){
    var self = this;
    let item = event.currentTarget.dataset.item;
    console.log(item);
    var url = "../course/course";
    let index = item["index"]
    if (index == 1) {
      url = "../collection/collection"
    }else if(index == 2){
        url = "../eventNotice/eventNotice"
    }else if(index == 3){
        url = "../contactUs/contactUs";
    }
    wx.navigateTo({
      url: url,
      success: function (res) {
        console.log("chenggong")
      }, fail: function (err) {
        console.log("shibai")
      }
    })
  }




})