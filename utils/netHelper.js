
const baseURL = "https://www.hehunfan.cn"
const homeSwiperDataUrl = baseURL + "/app/sys/site/setting"

// 精品专栏
const homeExcellentCourseListUrl = baseURL + "/app/course/queryByType?type=nofree"
// 免费专区
const homeFreeCourseListUrl = baseURL + "/app/course/queryByType?type=hyjy"
// 热门专区
const homeHotCourseListUrl = baseURL + "/app/course/queryByType?type=hwqcl"
// 进阶大课
const homeAdvancedCourseListUrl = baseURL + "/app/course/queryByType?type=qgly"
// 首页
const homeQueryListUrl = 'https://www.hehunfan.cn/app/course/queryList'


// 课程列表
const courseDetailList = baseURL + "/app/course/list/"

// 我的课程
const userCourseList = baseURL + "/app/user/course/list"
// 购买我的课程
const userAddCourse = baseURL + "/app/user/course/save"

// 我的收藏
const userCollectionCourseList = baseURL + "/app/user/collection/list"
// 新增收藏 Post 删除收藏 DELETE
const userCollectionAction = baseURL + "/app/user/collection/save"
const userDeleteCollectionAction = baseURL + "/app/user/collection/delete"
// 活动通知
const noticeMessage = baseURL + "/app/sys/notice"

// 联系我们
const aboutUs = baseURL + "/app/sys/about/us"


var  token  = ""

// 错误码情况
function errCodeMessage(err) {
  switch (err) {
    case 0:
      return '成功'
      break;
    case 500:
      return '服务器错误'
      break;
    default:
      break;
  }
}

// HUD 
// 操作成功
function showSuccess(title = "成功", duration = 1500) {
  wx.showToast({
    title: title,
    icon: 'success',
    duration: (duration <= 0) ? 1500 : duration
  });
}
// 操作失败
function showError(title = "失败", duration = 1500) {
  wx.showToast({
    title: title,
    icon:'none',
    duration: (duration <= 0) ? 1500 : duration
  });
}
// 加载  loading 提示
function showLoding(title = "正在加载", duration = 50000) {
  wx.showLoading({
    title: title,
    icon: 'loading',
    duration: (duration <= 0) ? 5000 : duration
  });
}
// 隐藏提示框
function hideHUD() {
  wx.hideToast();
  wx.hideLoading();
}


// 获取首页轮播图
function getHomeSwiperDataSource(success,failure){
  wx.request({
    url: homeSwiperDataUrl,
    header: { 'token': token },
    success:function(res){
      console.log(res);
      let data = res.data
      if(data.code == 0){
        var switperArray = [];
        let array = data.setSettings;
            array.sort(function(a,b){
              return a.id - b.id;
            })
        for (var i = 0; i < array.length; i++) {
          let model = JSON.parse(JSON.stringify(array[i]));
          switperArray.push(model);
        }
        success(switperArray)
      }else{
        hideHUD()
        showError(data.msg)
        failure(data.code)
      }
    },
    fail:function(error){
      hideHUD()
      showError("失败")
      console.log(error.duration);
      failure(error.errMsg);
    }
  })
}

// 新加的首页
function getHomeQueryList(type, offset, pageSize, success, failure) {
  let page = "&page=" + (offset + 1).toString()
  // type = 1 精品  2 免费 3 热门  4 进阶
  var url = homeExcellentCourseListUrl + page
  if (type == 2) {
    url = homeFreeCourseListUrl + page
  } else if (type == 3) {
    url = homeHotCourseListUrl + page
  } else if (type == 4) {
    url = homeAdvancedCourseListUrl + page
  }
  console.log(url)
  wx.request({
    url: url,
    header: { 'token': token },
    success: function (res) {
      console.log(res);
      let data = res.data
      if (data.code == 0) {
        var switperArray = [];
        let array = data.page.list;
        array.sort(function (a, b) {
          return a.id - b.id;
        })
        for (var i = 0; i < array.length; i++) {
          let model = JSON.parse(JSON.stringify(array[i]));
          switperArray.push(model);
        }
        success({ "totalPage": data.page.totalPage, "list": switperArray })
      } else {
        hideHUD()
        showError(data.msg)
        failure(data.code)
      }
    },
    fail: function (error) {
      hideHUD()
      showError("失败")
      console.log(error.duration);
      failure(error.errMsg);
    }
  })
}

// 首页数据  精品
function getHomeDataSource(type,offset,pageSize,success, failure) {
  let page = "?page=" + (offset+1).toString()
 
  // type = 1 精品  2 免费 3 热门  4 进阶
  var url = homeExcellentCourseListUrl + page
  if(type == 2) {
    url = homeFreeCourseListUrl + page
  }else if(type == 3){
    url = homeHotCourseListUrl + page
  }else if(type == 4){
    url = homeAdvancedCourseListUrl + page
  }
  console.log(url)
  wx.request({
    url: url,
    header: {'token':token},
    success: function (res) {
      console.log(res);
      let data = res.data
      if (data.code == 0) {
        var switperArray = [];
        let array = data.page.list;
        array.sort(function (a, b) {
          return a.orderNum - b.orderNum;
        })
        for (var i = 0; i < array.length; i++) {
          let model = JSON.parse(JSON.stringify(array[i]));
          switperArray.push(model);
        }
        success({"totalPage":data.page.totalPage,"list":switperArray})
      } else {
        hideHUD()
        showError(data.msg)
        failure(data.code)
      }
    },
    fail: function (error) {
      hideHUD()
      showError("失败")
      console.log(error.duration);
      failure(error.errMsg);
    }
  })
}

// 获取专辑数据
function getCourseListWithId(courseId,success, failure){
  let pageSize = "?limit=200"
  var url = courseDetailList + courseId.toString() + pageSize;
  console.log(url)
  wx.request({
    url: url,
    header: { 'token': token },
    success: function (res) {
      console.log(res);
      let data = res.data
      if (data.code == 0) {
        var switperArray = [];
        let array = data.page.list;
        array.sort(function (a, b) {
          return a.orderNum - b.orderNum;
        })
        for (var i = 0; i < array.length; i++) {
          let model = JSON.parse(JSON.stringify(array[i]));
          switperArray.push(model);
        }
        success(switperArray)
      } else {
        hideHUD()
        showError(data.msg)
        failure(data.code)
      }
    },
    fail: function (error) {
      hideHUD()
      showError("失败")
      console.log(error.duration);
      failure(error.errMsg);
    }
  })
}



// 收藏专辑行为
function collectionCourseAction(collecte,courseId, success, failure){
  if(collecte){
    // 收藏
    wx.request({
      url: userCollectionAction,
      header: { 'token': token },
      method:"POST",
      data:{
        "courseId":courseId
      },
      success: function (res) {
        console.log(res);
        let data = res.data
        if (data.code == 0) {
          success("成功")
        } else {
          hideHUD()
          showError(data.msg)
          failure(data.code)
        }
      },
      fail: function (error) {
        hideHUD()
        showError("失败")
        console.log(error.duration);
        failure(error.errMsg);
      }
    })
  }else{
    // 删除收藏
    wx.request({
      url: userDeleteCollectionAction + '/' + courseId.toString(),
      header: { 'token': token },
      // method: "POST",
      // data: {
      //   "ids": [courseId]
      // },
      success: function (res) {
        console.log(res);
        let data = res.data
        if (data.code == 0) {
          success("成功")
        } else {
          hideHUD()
          showError(data.msg)
          failure(data.code)
        }
      },
      fail: function (error) {
        hideHUD()
        showError("失败")
        console.log(error.duration);
        failure(error.errMsg);
      }
    })
  }
}

// 获取收藏数据
function getUserCollectionCourse(offset, pageSize, success, failure) {

  let page = "?page=" + (offset + 1).toString()

  var url = userCollectionCourseList + page

  wx.request({
    url: url,
    header: { 'token': token },
    success: function (res) {
      console.log(res);
      let data = res.data
      if (data.code == 0) {
        var switperArray = [];
        let array = data.page.list;
        array.sort(function (a, b) {
          return a.id - b.id;
        })
        for (var i = 0; i < array.length; i++) {
          let model = JSON.parse(JSON.stringify(array[i]));
          model.minute = parseInt(model.trackLength / 60)

          switperArray.push(model);
        }
        success({ "totalPage": data.page.totalPage, "list": switperArray })
      } else {
        hideHUD()
        showError(data.msg)
        failure(data.code)
      }
    },
    fail: function (error) {
      hideHUD()
      showError("失败")
      console.log(error.duration);
      failure(error.errMsg);
    }
  })
}

// 购买课程
function userPayCourseWithId(payId, albumId,success,failure){
  let url = userAddCourse + "?key=" + payId.toString() + "&aid=" + albumId.toString();

  console.log(url)
  wx.request({
    url: url,
    header: {
      'token': token,
    },
    success: function (res) {
      console.log(res);
      let data = res.data
      if (data.code == 0) {
        success()
      } else {
        hideHUD()
        showError(data.msg)
        failure(data.code)
      }
    },
    fail: function (error) {
      hideHUD()
      showError("失败")
      console.log(error.duration);
      failure(error.errMsg);
    }
  })

}


// 我的课程
function getUserCourse(offset, pageSize, success, failure) {
   
  let page = "?page=" + (offset + 1).toString()

  var url = userCourseList + page
  console.log('url + token')
  console.log( token)
  wx.request({
    url: url,
    header: {
      'token': token,
       },
    success: function (res) {
      console.log(res);
      let data = res.data
      if (data.code == 0) {
        var switperArray = [];
        let array = data.page.list;
        array.sort(function (a, b) {
          return a.id - b.id;
        })
        for (var i = 0; i < array.length; i++) {
          let model = JSON.parse(JSON.stringify(array[i]));
          switperArray.push(model);
        }
        success({ "totalPage": data.page.totalPage, "list": switperArray })
      } else {
        hideHUD()
        showError(data.msg)
        failure(data.code)
      }
    },
    fail: function (error) {
      hideHUD()
      showError("失败")
      console.log(error.duration);
      failure(error.errMsg);
    }
  })
}

// 活动通知
function getNoticeMessage(offset, pageSize, success, failure) {

  let page = "?page=" + (offset + 1).toString()

  var url = noticeMessage + page

  wx.request({
    url: url,
    header: {
      'token': token,
    },
    success: function (res) {
      console.log(res);
      let data = res.data
      if (data.code == 0) {
        var switperArray = [];
        let array = data.page.list;
        array.sort(function (a, b) {
          return a.id - b.id;
        })
        for (var i = 0; i < array.length; i++) {
          let model = JSON.parse(JSON.stringify(array[i]));
          switperArray.push(model);
        }
        success({ "totalPage": data.page.totalPage, "list": switperArray })
      } else {
        hideHUD()
        showError(data.msg)
        failure(data.code)
      }
    },
    fail: function (error) {
      hideHUD()
      showError("失败")
      console.log(error.duration);
      failure(error.errMsg);
    }
  })
}

// 关于我们
function aboutUsAction(success, failure) {
  var url = aboutUs
  wx.request({
    url: url,
    header: { 'token': token },
    success: function (res) {
      console.log(res);
      let data = res.data
      if (data.code == 0) {
        success(data)
      } else {
        hideHUD()
        showError(data.msg)
        failure(data.code)
      }
    },
    fail: function (error) {
      hideHUD()
      showError("失败")
      console.log(error.duration);
      failure(error.errMsg);
    }
  })
}
// 获取用户的id
function getUserIdAction(success, failure) {
  var url = 'https://www.hehunfan.cn/app/getUserId'
  wx.request({
    url: url,
    header: {
      'token': token,
    },
    success: function (res) {
      console.log(res.data);
      let data = res.data
        success(data)
    },
    fail: function (error) {
      hideHUD()
      showError("失败")
      console.log(error.duration);
      failure(error.errMsg);
    }
  })
}

function tokenAction(tokenStr){
    token = tokenStr;
    console.log(token);
}



// 把 接口暴露出来
module.exports = {
  tokenAction: tokenAction,
  errCodeMessage: errCodeMessage,
  showSuccess: showSuccess,
  showError: showError,
  showLoding: showLoding,
  hideHUD: hideHUD,
  getHomeSwiperDataSource: getHomeSwiperDataSource,
  getHomeDataSource: getHomeDataSource,
  getCourseListWithId: getCourseListWithId,
  collectionCourseAction: collectionCourseAction,
  getUserCollectionCourse: getUserCollectionCourse,
  getUserCourse: getUserCourse,
  getNoticeMessage: getNoticeMessage,
  aboutUs: aboutUsAction,
  userPayCourseWithId: userPayCourseWithId,
  getUserIdAction: getUserIdAction,
  getHomeQueryList: getHomeQueryList
}


