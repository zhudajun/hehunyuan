//app.js
const backgroundAudioManager = wx.getBackgroundAudioManager()

const netHelper = require("/utils/netHelper.js");

App({
  onLaunch: function () {
    
  },
  onHide(){
    console.log(this.globalData);
    console.log("我进入后台了，哈哈哈");
  },
  onShow(){
    
  },
  globalData: {
    userInfo: null,
    userID:'',
    playListDataSource: {},
    playingDataSource: {
      albumId:0,
      playIndex:0,
      playCourse:{}//音频列表
    },
  }
})