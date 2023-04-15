// pages/admin/login/login.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    staffID:"",
    db_ID:"",
    IDRule:[{
      required: true
    },{
    type: 'number',
    min: 1,
    max: 150,
    message: "工作证号长度应在1-150位之间"
    }],
    PasswordRule:[{
      required: true
    },{
    type: 'string',
    min: 6,
    max: 128,
    message: "密码长度应在1-128位之间"
    }],
    MailRule:[{
      required: true
    },{
    type: 'email',
    min: 1,
    max: 254,
    }],
    host_:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    let that=this
    var app = getApp()
    if(app.globalData.localDebug)
    {
      that.setData({
        host_:app.globalData.localUrl
      })
    }
    else{
      that.setData({
        host_:app.globalData.serverUrl
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },
  // findpwd(){
  //   wx.navigateTo({
  //     url: '../findpw/findpw',
  //   })
  // },
  // OnTapGotoRegister(){
  //   wx.navigateTo({
  //     url: '../register/register',
  //   })
  // },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  onTapCancel(){
    wx.redirectTo({
      url: '../login/login',
    })
  },
  formSubmit: function (event) {
    var that = this
    //console.log(e.detail.value);
    wx.request({
      // url: 'https://se.maqi.site:8001/api/login',
      url: that.data.host_+'users/api/password-reset-complete',
      //url: app.globalData.url.login,
      method:"POST",
								// header: {'content-type': 'application/x-www-form-urlencoded'},
      data: 
      // JSON.stringify({
      //   "username": "string",
      //   "password": "string"
      // }),
      {
        "token": event.detail.value.token,
        "uidb64":event.detail.value.uid,
        "password":event.detail.value.password
      },
      
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        if (res.statusCode == 201 || res.statusCode == 200) {
          //login succeed
          
            wx.showToast({
              title: "修改密码成功",
              icon: 'success',
              duration: 2000,
              success: function () {
                setTimeout(function () {
                  wx.redirectTo({
                    url: '../login/login',
                  })
                }, 2000)
              }
            })
          
          
          }
          else{
            wx.showToast({
              title: "请检查输入",
              icon: 'error',
              duration: 2000,
              
            })
          }
        }
        
 
      }
    )
  }
})