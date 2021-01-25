// pages/teacherlogin/teacherlogin.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginerr:''
  },
  onLoad: function (options){
    
   
  },
  formSubmit(e) {
    if(e.detail.value.usernumber==''){
      wx.showToast({
        title: '请输入工号',
        icon:'none',
        duration: 2000
      })
      return
    }
    if(e.detail.value.password==''){
      wx.showToast({
        title: '请输入密码',
        icon:'none',
        duration: 2000
      })
      return
    }  
    wx.request({
      url: 'http://localhost:8080/teacher/login', 
      data: {
      password:e.detail.value.password,
      username:e.detail.value.usernumber
      },
      header: {
      'content-type': 'application/x-www-form-urlencoded  ' // 默认值
      },
      method:'POST',
      success: (res) => {
        var app=getApp()
        app.globalData.teacherinfo=res.data.content
        wx.setStorageSync('jwt',res.header.Authorization)
        if(res.data.success){
          wx.switchTab({
            url: '/pages/teacherindex/teacherindex',
          })
        }else{
          this.setData({
            loginerr:'密码或用户名错误'
          })
        }
      }
      })
  }
})