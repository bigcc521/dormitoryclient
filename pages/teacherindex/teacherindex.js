// pages/teacherindex/teacherindex.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperList: [
      {id:1,src:"/images/photo_3.jpg"},
      {id:1,src:"/images/photo_1.jpg"},
      {id:1,src:"/images/photo_2.jpg"}
    ],
    // 导航 数组
    catesList1:[
      {id:1,src:"/images/one_1.png",text:"卫生评分",url:'/pages/apartmentselect/apartmentselect'},
      {id:2,src:"/images/one_2.png",text:"校园论坛",url:''},
      {id:3,src:"/images/one_3.png",text:"通讯管理",url:''},
      {id:4,src:"/images/one_4.png",text:"投诉建议",url:''},
      {id:5,src:"/images/one_5.png",text:"卫生分析",url:''}
    ],
    catesList2:[
      {id:1,src:"/images/two_1.png",text:"签到分析",url:''},
      {id:2,src:"/images/two_2.png",text:"温大官网",url:''},
      {id:3,src:"/images/two_3.png",text:"电费统计",url:''},
      {id:4,src:"/images/two_4.png",text:"公告发布",url:''},
      {id:5,src:"/images/two_5.png",text:"更多功能",url:''}
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // test:function(e){
  //   const jwt = wx.getStorageSync('jwt')
  //   wx.request({
  //     url: 'http://localhost:8080/teacher/tasks',
  //     method:"GET",
  //     header:{
  //       Authorization:jwt
  //     },
  //     success:(res)=>{
  //       console.log(res)
  //     }
  //   })
  // },

})