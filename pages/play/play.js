// pages/play/play.js
const app = getApp();
const netHelper = require("../../utils/netHelper.js");


const SEQUENCE_MODE = 1
const SINGLE_CYCLE_MOD = 2


Page({
  data: {
    playingState:0,
    playurl: '',
    currentTime:'0:00',
    currentSong: null,
    playMod: SINGLE_CYCLE_MOD,
    ifShowVipNumber: false,// 是否输入VIP
    inputValue: '',// 输入的VIP值
    progressValue: 0,//进度条值
    ifSeekAction: false,//是否在拖动进度条
  },

  onShow: function () {
    this._init()
  },

  //初始化
  _init: function () {
    let course = app.globalData.playListDataSource
    let playingSource = app.globalData.playingDataSource
    let songslist = playingSource.playCourse
    console.log(playingSource)
    if(songslist.length && (playingSource.albumId == course.albumId)){
      // 播放的是同一专辑的音乐
      console.log('相同的音乐',course.albumId)
      let playIndex = playingSource.playIndex
      let currentSong = songslist[playIndex]
       if(currentSong.id != course.id){
        for (var i = 0; i < songslist.length; i++) {
          if(songslist[i].id == course.id){
            playIndex = i
            break
          }
        }
       }
       currentSong = songslist[playIndex]
      let duration = currentSong && currentSong.trackLength
      this.setData({
        currentSong: currentSong,
        duration: this._formatTime(duration),
        songslist: songslist,
        currentIndex: playingSource.playIndex
      })
      this._createAudio(currentSong.url)
    } else {
      // 播放的是不同的音乐
    this._getCourseListWithId(course.albumId)
    } 
  },

  // 获取播放地址
  _getCourseListWithId(couseId) {
    let self = this
    netHelper.getCourseListWithId(couseId, function (success) {
      let list = success
      app.globalData.playingDataSource.albumId = couseId
      app.globalData.playingDataSource.playCourse = list
      let playIndex = 0
      for (var i = 0; i < list.length; i++) {
        if(list[i].id == app.globalData.playListDataSource.id){
          playIndex = i
          break
        }
      }
      app.globalData.playingDataSource.playIndex = playIndex
      console.log('不同的音乐',couseId)
      self._init();
    }, function (failure) {
      console.log(failure)
    })
  },

  // 创建播放器
  _createAudio: function (playUrl) {
    console.log(playUrl,'   hahah')
    wx.getBackgroundAudioPlayerState({
      success(res){
        console.log('hahadddddddhh',res.status,res.dataUrl,res.duration,res.currentPosition)
        if (res.dataUrl == playUrl) {
          const currentTime = res.currentPosition
          let progress =  parseInt(currentTime / res.duration * 100)
          wx.getBackgroundAudioManager().seek(currentTime)
          this.setData({
              progressValue: progress,// 播放的时间
              currentTime: this._formatTime(currentTime),
          })
        }
      }
    })
    wx.playBackgroundAudio({
      dataUrl: playUrl,
      title: this.data.currentSong.title,
      coverImgUrl: this.data.currentSong.coverUrl
    })
    // 监听音乐播放。
    wx.onBackgroundAudioPlay(() => {
      this.setData({
        playingState: 1
      })
    })
    // 监听音乐暂停。
    wx.onBackgroundAudioPause(() => {
      this.setData({
         playingState: 0
      })
    })
    // 监听音乐停止。
    wx.onBackgroundAudioStop(() => {
      if (this.data.playMod === SEQUENCE_MODE) {
        this._init()
        return
      }
      this.next()
    })
    // 监听播放拿取播放进度
    const manage = wx.getBackgroundAudioManager()
    manage.onTimeUpdate(() => {
      const currentTime = manage.currentTime
      let progress =  parseInt(currentTime / this.data.currentSong.trackLength * 100)
      if (!this.data.ifSeekAction) {
        console.log('播放中',currentTime,'progress',progress)
        this.setData({
          currentTime: this._formatTime(currentTime),
          progressValue:  progress
        })
      }
    })
  },

  _formatTime: function (interval) {
    interval = interval | 0
    const minute = interval / 60 | 0
    const second = this._pad(interval % 60)
    return `${minute}:${second}`
  },
  /*秒前边加0*/
  _pad(num, n = 2) {
    let len = num.toString().length
    while (len < n) {
      num = '0' + num
      len++
    }
    return num
  },
  changeMod: function () {
    let playMod = this.data.playMod + 1
    if (playMod > SINGLE_CYCLE_MOD) {
      playMod = SEQUENCE_MODE
    }
    this.setData({
      playMod: playMod
    })
  },
  prev: function () {
    app.globalData.playingDataSource.playIndex = this.getNextIndex(false)
    this.setData({
      progressValue: 0,// 播放的时间
      currentTime: this._formatTime(0),
    })
    this._init()
  },
  next: function () {
    app.globalData.playingDataSource.playIndex = this.getNextIndex(true)
    this.setData({
      progressValue: 0,// 播放的时间
      currentTime: this._formatTime(0),
    })
    this._init()
  },
  /**
   * 获取不同播放模式下的下一曲索引
   * @param nextFlag: next or prev
   * @returns currentIndex
   */
  getNextIndex: function (nextFlag) {
    let ret,
        currentIndex = app.globalData.playingDataSource.playIndex,
        mod = this.data.playMod,
        len = this.data.songslist.length
      if (nextFlag) {
        ret = currentIndex + 1 == len ? 0 : currentIndex + 1
      } else {
        ret = currentIndex - 1 < 0 ? len - 1 : currentIndex - 1
      }
    return ret
  },
  togglePlaying: function () {
    wx.getBackgroundAudioPlayerState({
      success: function (res) {
        var status = res.status
        if (status == 1) {
          wx.pauseBackgroundAudio()
        } else {
          wx.playBackgroundAudio()
        }
      }
    })
  },
  openList: function () {
    if (this.data.songslist.length < 2) {
      return
    }
    this.setData({
      bottomModal: true
    })
  },
  hideListView() {
    this.setData({
      bottomModal: false
    })
  },
  playthis: function (e) {
    const index = e.currentTarget.dataset.index
    app.globalData.playingDataSource.playIndex = index
    this._init()
    this.hideListView()
  },

  // 分享按钮点击
  onShareAppMessage: function () {
        console.log('分享')
  },

  // 收藏按钮点击
  collectBtnClicked() {
    let dic = this.data.currentSong
    dic.collection = !dic.collection
    let self = this
    netHelper.collectionCourseAction(dic.collection, dic.id, function (success) {
      self.setData({
        currentSong: dic
      })
    }, function (failure) {
      console.log(failure);
    })
  },
  // 滑动
  progressViewActioning(event) {

    let value = event.detail.value;
    let currentTime = parseInt(value / 100 * this.data.currentSong.trackLength);
    console.log('滑动中',value)
    this.setData({
      ifSeekAction: true,
      progressValue: value,// 播放的时间
      currentTime: this._formatTime(currentTime),
    })
  },
  // 拖动进度条
  progressViewAction(event) {
    let value = event.detail.value;
    let currentTime = parseInt(value / 100 * this.data.currentSong.trackLength)
    console.log('滑动结束',value,currentTime)
    wx.getBackgroundAudioManager().seek(currentTime)
    this.setData({
      ifSeekAction: false,
      progressValue: value,// 播放的时间
      currentTime: this._formatTime(currentTime),
    })
  }
})