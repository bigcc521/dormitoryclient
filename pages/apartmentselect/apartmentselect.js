// pages/apartmentselect/apartmentselect.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    districts:[],
    districtvalue:0,
    apartments:[],
    apartmentvalue:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const jwt = wx.getStorageSync('jwt')
    wx.request({
      url: 'http://localhost:8080/teacher/dormitoryserver/district',
      method:"GET",
      header:{
        Authorization:jwt
      },
      success:(res)=>{
        if(res.data.success){
          this.setData({
            districts:res.data.content,
            apartments:res.data.content[0].apartments
          })
        }else{
          if(res.data.statusCode==-10001){
            wx.showModal({
              title: '提示',  
              content: '未登录或登录已过期',     
              success: function (res) {
                wx.redirectTo({
                  url: '/pages/teacherlogin/teacherlogin',
                })
              }
            })
          }else if(res.data.statusCode==-10004){
            wx.showModal({
              title: '提示',  
              content: '该账号或许在别的地方登录',     
              success: function (res) {
                wx.redirectTo({
                  url: '/pages/teacherlogin/teacherlogin',
                })
              }
            })
          }else if(res.data.statusCode==-10003)
          wx.showModal({
            title: '提示',  
            content: '你没有权限',     
            success: function (res) {
              wx.switchTab({
                url: '/pages/teacherindex/teacherindex',
              })
            }
          })
        }
        
      }
    })
  },
  bindDistrictPickerChange:function(e){
    const apartments=this.data.districts[e.detail.value].apartments
    //console.log(apartmentnames)
    this.setData({
      apartments:apartments,
      districtvalue:e.detail.value,
      apartmentvalue:0
    })
    
  },
  bindApartmentPickerChange:function(e){
    //console.log(apartmentnames)
    this.setData({
      apartmentvalue:e.detail.value
    })
    
  },
  bindapartmentselect:function(e){
    wx.navigateTo({
      url: '/pages/healthscore/healthscore?apartmentid='
      +e.detail.value.apartmentid+'&apartment='+e.detail.value.apartment,
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})