// pages/home/home.js
const netHelper = require("../../utils/netHelper.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 是否要输入VIP会员
    ifShowVipNumber:false,
    inputValue: '',// 输入的邀请码
    selectedCourse:{},// 点击了那个专辑
    // pageIndex 
    pageIndex:0, 
    // 总共的pageNumber
    totalPages:1,
    // 选择了哪一张轮播图
    cardCur: 0,
    swiperList: [],
    //  分区栏
    TabCur: 0,
    scrollLeft: 0,
    tabList:[
      "精品专栏",
      "婚姻经营",
      "婚外情处理",
      "情感疗愈"
    ],
    bottomList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 登录
    let self = this;
    wx.login({
      success: res => {
        if (res.code) {
          console.log(res.code)
          let getUrl = "https://www.hehunfan.cn/app/oauth/login/wechat?code=" + res.code
          wx.request({
            url: getUrl,
            success: function (res) {
              console.log('token---' + res.data.token);
              netHelper.tokenAction(res.data.token);
              self.getUserId();
            },
            fail: function (error) {
            }
          })
        } else {
          console.log('登陆失败')
        }
      }
    })
  },
  // 请求用户的id
  getUserId() {
    let self = this;
    netHelper.getUserIdAction(function (success) {
      console.log(success);
      app.globalData.userID = success.userId;
      self.getHomeData();
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
  // 加载数据
  getHomeData(){
    let self = this
    netHelper.getHomeSwiperDataSource(function (success) {
      let swiper = success
      self.setData({
        swiperList: swiper
      })
      self.getPageDataSource();
    }, function (failure) {
      console.log(failure);
    })
  },


  // 加载数据
  getPageDataSource(){
    var type  = 1;
    var pageIndex = this.data.pageIndex;
    var list = this.data.bottomList;
    if(pageIndex == 0){
      list = [];
    }
    if(pageIndex >= this.data.totalPages){
      return;
    }
    switch (this.data.TabCur){
      case 1:
        type = 2;
        break;
      case 2:
        type = 3;
        break;
      case 3:
        type = 4;
        break;
    }
    let self = this
    netHelper.getHomeQueryList(type, pageIndex,20,function(success){
      console.log(success)
      self.setData({
        totalPages: success.totalPage,
        pageIndex: pageIndex + 1,
        bottomList: list.concat(success.list)
      })
      if (pageIndex == 0){
        wx.stopPullDownRefresh();
      }
    },function(failure){
      console.log(failure);
      if (pageIndex == 0) {
        wx.stopPullDownRefresh();
      }
    })
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onPullDownRefresh(){
    console.log("刷新数据");
    this.setData({
      totalPages: 1,
      pageIndex: 0
    })
    this.getPageDataSource()
  },
  onReachBottom(){
    console.log("加载更多数据");
    this.getPageDataSource()
  },
  // 点击头视图的轮播图
  cardSwiperTap(e) {
    console.log(e.currentTarget.dataset.item);
  },
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
  // 滑动栏选择
  tabSelect(e){
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      totalPages: 1,
      pageIndex: 0,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
    this.getPageDataSource()
  },

// cell点击
  goPlayViewController(event) {
    let course = event.currentTarget.dataset.course;
    if (!course.purchase && course.type != 'free'){
      this.setData({
        selectedCourse:course,
        ifShowVipNumber: true
      });
      return;
    }
    app.globalData.playListDataSource = course;
    console.log("--------------")
    console.log(app.globalData);
    wx.navigateTo({
      url: '../play/play',
      success: function (res) {
        console.log("chenggong")
      }, fail: function (err) {
        console.log("shibai")
      }
    })
  },
  // 隐藏VIP输入
  hideVipNumberInputView(){
    console.log("隐藏VIP输入")
    this.setData({
      ifShowVipNumber: false
    })
    let userid = app.globalData.userID;
    wx.setClipboardData({
      data: '用户ID：' + userid + '\n' + '合辑ID：' + this.data.selectedCourse.albumId.toString(),
      success(res) {
        wx.getClipboardData({
          success (res) {
            console.log('复制成功')
            console.log(res.data) // data
          }
        })
      }
    })
  },
  bindKeyInput: function (e) {
    console.log(e.detail.value);
    this.setData({
      inputValue: e.detail.value
    })
  },
  // 处理VIP输入
  handleVipNumber() {
    this.setData({
      ifShowVipNumber: false
    })
    let self = this;
    netHelper.userPayCourseWithId(this.data.inputValue, this.data.selectedCourse.albumId, function (success) {
      var course = self.data.selectedCourse;
      course.purchase = true;
      var list = self.data.bottomList;
      for(var i = 0; i < list.length; i ++){
        let c = self.data.bottomList[i];
        if(c.id == course.id){
          list[i] = course;
          break;
        }
      }
      self.setData({
        bottomList: list
      })
      app.globalData.playListDataSource = course;
      console.log(app.globalData);
      wx.navigateTo({
        url: '../play/play',
        success: function (res) {
          console.log("chenggong")
        }, fail: function (err) {
          console.log("shibai")
        }
      })
    }, function (failure) {
      console.log(failure);
    })
    console.log("处理VIP输入");
  }
})