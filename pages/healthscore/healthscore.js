// pages/healthscore/healthscore.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //默认评论选择
    helpinfo:['寝室地面脏乱','卫生间地面脏乱','寝室床铺未铺整洁','寝室垃圾桶满却未倒','卫生间马桶有明显脏乱现象','卫生间垃圾桶满却未倒','卫生间洗手台脏乱'],
    apartment:'',
    dormitorys:[],
    dormitoryvalue:0,
    domitoryscore:'',
    //富文本编辑器
    formats: {},
    placeholder: '评分较低原因（附上原因图片）',
    images:[],
    editorcontext:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      apartment:options.apartment
    })
    const jwt = wx.getStorageSync('jwt')
    wx.request({
      url: 'http://localhost:8080/teacher/dormitoryserver/dormitory/'+options.apartmentid,
      header:{
        Authorization:jwt
      },
      method:"GET",
      success:(res)=>{
        if(res.data.success){
          this.setData({
            dormitorys:res.data.content
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
  bindDormitoryPickerChange:function(e){
    this.setData({
      dormitoryvalue:e.detail.value
    })
  },
  //富文本编辑器开始
   // 编辑器初始化完成时触发
   onEditorReady:function(e){
    const that = this;
    wx.createSelectorQuery().select('#editor').context(function(res) {
      that.editorCtx = res.context;
    }).exec();
  },
  undo() {
    this.editorCtx.undo();
  },
  redo() {
    this.editorCtx.redo();
  },
  format(e) {
    let {
      name,
      value
    } = e.target.dataset;
    if (!name) return;
    // console.log('format', name, value)
    this.editorCtx.format(name, value);
  },
  // 通过 Context 方法改变编辑器内样式时触发，返回选区已设置的样式
  onStatusChange(e) {
    const formats = e.detail;
    this.setData({
      formats
    });
  },
  // 插入分割线
  insertDivider() {
    this.editorCtx.insertDivider({
      success: function() {

      }
    });
  },
  // 清除
  clear() {
    this.editorCtx.clear({
      success: function(res) {

      }
    });
  },
  // 移除样式
  removeFormat() {
    this.editorCtx.removeFormat();
  },
  // 插入当前日期
  insertDate() {
    const date = new Date()
    const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    this.editorCtx.insertText({
      text: formatDate
    });
  },
  // 插入图片
  insertImage() {
    wx.chooseImage({
      count: 1,
      success: (res) => {
        var tempFilePaths = res.tempFilePaths
        this.editorCtx.insertImage({
          src: tempFilePaths[0],
          width:'100%',
          success: () => {
            console.log('insert image success')
          }
        })
      }
    });
  },
  //查看详细页面
  toDeatil() {
    this.editorCtx.getContents({
      success: (res) => {
        console.log(res.html)
        app.globalData.html = res.html
        wx.navigateTo({
          url: '../details/details'
        })
     
      },
      fail: (res) => {
        console.log("fail：" , res);
      }
    });
  },
  //添加评语
  bindGradeInfoPickerChange(e){
    this.editorCtx.insertText({
      text:this.data.helpinfo[e.detail.value]
    })
  },
  async gradesubmit(e){
    if(e.detail.value.grade==''){
      wx.showToast({
        title: '请填入分数',
        icon:'none',
        duration: 2000
      })
      return
    }
    var that = this
    var app=getApp()
    that.editorCtx.getContents({
      success:async (res)=>{
        that.setData({
          editorcontext:res.delta
        })
        var flag=1
        var items=res.delta.ops
        for(let item of items){
          if(item.insert.image!=null&&item.insert.image!=''){
            flag=await that.uploadfile(item)
            console.log(flag)
            if(flag!=1){
              break
            }
          }
        }
        console.log(that.data.editorcontext)      
        if(flag!=1){
          if(flag==3){
            wx.showToast({
              title: '照片仅限jgp或者png格式',
              icon: 'none',
              duration: 2000
            })
            return 
          }else{
            that.errorcode(flag)
            return
          }
        }
        const jwt = wx.getStorageSync('jwt')
        wx.request({
              url: 'http://localhost:8080/teacher/dormitoryserver/tgrade',
              method:"POST",
              header:{
                Authorization:jwt
              },
              data:{
                dormitory:e.detail.value.dormitoryid,
                grade:e.detail.value.grade,
                info:JSON.stringify(that.data.editorcontext),
                teacher:app.globalData.teacherinfo.id
              },
              success:(res)=>{
                if(res.data.success){
                  wx.showToast({
                    title: '操作成功',
                    icon: 'success',
                    duration: 2000
                  })
                  this.setData({
                    dormitoryvalue:this.data.dormitoryvalue+1,
                    domitoryscore:''
                  })
                  this.editorCtx.clear()                                   
                }else{
                  that.errorcode(res.data.statusCode)
                }
              }
            })
      }
    })       
  },
  errorcode(statusCode){
    if(statusCode==-10001){
      wx.showModal({
        title: '提示',  
        content: '未登录或登录已过期',     
        success: function (res) {
          wx.redirectTo({
            url: '/pages/teacherlogin/teacherlogin',
          })
        }
      })
    }else if(statusCode==-10004){
      wx.showModal({
        title: '提示',  
        content: '该账号或许在别的地方登录',     
        success: function (res) {
          wx.redirectTo({
            url: '/pages/teacherlogin/teacherlogin',
          })
        }
      })
    }else if(statusCode==-10003)
    wx.showModal({
      title: '提示',  
      content: '你没有权限',     
      success: function (res) {
        wx.switchTab({
          url: '/pages/teacherindex/teacherindex',
        })
      }
    })
  },
  uploadfile(item){  
    return new Promise((resolve, reject) => {
      var flag=1
      const jwt = wx.getStorageSync('jwt')
      wx.uploadFile({
        filePath:item.insert.image ,
        name: 'file',
        header:{
          Authorization:jwt
        },
        url: 'http://47.114.176.122:8989/photoupload/healthphoto',
        success:(res)=>{
          console.log(res)
          var data=JSON.parse(res.data)
          if(!data.success){
            if(data.statusCode==-10005){
              flag=3
            }else{
              flag=data.statusCode
            }
            item.insert.image=''
          }else{
            flag=1
            item.insert.image="http://47.114.176.122:8989"+data.content
          }     
          resolve(flag)
        }
      })
    })
  },
  //富文本编辑器结束

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (e) {
    
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