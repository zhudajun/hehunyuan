

// 用户
let user = {
    userName:"",//用户名称
    url:"",//用户头像
    phoneNumber:"",//手机号
    ifVip:true//是否是VIP用户
}

// 轮播图
let swiperModel = {
  url:"", // 图片地址
  id:0   // 专辑id
}

// 通知的数据
let noticeModel = {
  id: 0,             // id
  headerImg:"",//头像
  nickName:"", //名称
  createTime:"", //时间
  noticeTitle:"", //通知标题
  noticeDetail:"" //通知内容
  
}

// 课程或者专辑model
let courseModel = {
  id:0,        // 索引
  title:"",    //标题
  detail:"",   //副标题
  type:"",     //类型
  content:"",  // 介绍
  pay_count:0, // 购买人数
  img_url:"",  //封面图片
  time:0,       //总时间 单位秒
  alreadyPlay:0, //已经播放的时间  单位秒
  create_time:"",//创建时间
  update_time:"",//更新时间
  price:0,// 价格
  ifPay:false, // 是否购买
  collect:false,
  list:[] // 具体的课程
}
// 具体的课程mode
let detailCourseModel = {
  index:0,//序号
  scr:"",//资源地址
  title:"我是一个光荣的标题",
  totalTime:0,// 时间
  play_time:0// 已经播放的时间
}

function testUserMode(){
  let model = user;
      model.nickName = "我是一个测试账号";
  model.url = "https://wx.qlogo.cn/mmopen/vi_32/echWia6oBqia24Cxt5Q1X3xQnrGHWs4GtVOaiahXFJAuVzoW09aPGFfjWP2YpKFVFlWTn8JE5l2bN7jsznYq1O4rg/132";//用户头像
      model.phoneNumber = "15225962132";//手机号
      model.ifVip = true;//是否是VIP用户
  
  return model;
}

function testSwiperModelArray(){
  var switperArray = []
  for (var i = 0; i < 4; i ++){
    let model = JSON.parse(JSON.stringify(swiperModel));
    model.id = i + 1;
    model.url = "https://ossweb-img.qq.com/images/lol/web201310/skin/big84000.jpg";
    switperArray.push(model);
  }
 return switperArray;
}

var imageUrl = "http://img.xshuma.com/201209/180556120913124731.jpg";

var audioUrl ="http://sc1.111ttt.cn/2018/1/03/13/396131229550.mp3";
// 测试的课程
function testCourseDataSource(a = 0){
  var courseListArray = [];
  for(var i = a; i < 6; i ++){
    let model = JSON.parse(JSON.stringify(courseModel));
        model.id = i;// 索引
        model.title = "这是标题" + i;    //标题
        model.detail = "我是一个副标题" + i;//副标题
        model.type = i;     //类型
        model.content = "我是一段介绍的内容";  // 介绍
        model.pay_count = 1000 + i; // 购买人数
        model.img_url = imageUrl;  //封面图片地址
        model.time = 120 + 60 * i;       //总时间 单位秒
        model.alreadyPlay = 60 * i; //已经播放的时间  单位秒
        model.create_time = "2019-10-0" + (i + 1).toString();//创建时间
        model.update_time = "2019-10-0" + (i).toString();//更新时间
        model.price = 500 + i *100;// 价格
        model.ifPay = i % 2 == 0; // 是否购买
        model.collect = i % 2 == 0;
        var list = [];
        for(var j = 0; j < 6; j ++){
          let listModel = JSON.parse(JSON.stringify(detailCourseModel));
          listModel.index = j;
          listModel.totalTime = 120;
          listModel.play_time = j * 10;
          listModel.title = "我是一个标题哈哈" + j.toString();
          listModel.scr = audioUrl;
          list.push(listModel);
        }
        model.list = list;
        courseListArray.push(model);
  }
    return courseListArray;
}
  //测试的 通知消息
   function testNoticeDataSource(){
     var list = [];
     for(var i = 0; i < 6;i ++){
       var notice = JSON.parse(JSON.stringify(noticeModel));
       notice.id = i;
       notice.headerImg = "https://wx.qlogo.cn/mmopen/vi_32/echWia6oBqia24Cxt5Q1X3xQnrGHWs4GtVOaiahXFJAuVzoW09aPGFfjWP2YpKFVFlWTn8JE5l2bN7jsznYq1O4rg/132";
       notice.createTime = "2019.10.12 12:10:"+ (i*10).toString();
       notice.nickName = "我是一个通知" + i.toString();
       notice.noticeDetail = "我是通知的内容，我是通知的内容，我是通知的内容，我是通知的内容，我是通知的内容，我是通知的内容。";
       console.log("hahahh ---- " + notice.nickName);
       list.push(notice);
       console.log(list.length);
     }
     console.log(list.length);
     return list;
   }


  module.exports = {
    userMode:testUserMode,
    swiperModelArray:testSwiperModelArray,
    courseDataSource:testCourseDataSource,
    noticeDataSource:testNoticeDataSource
  }




