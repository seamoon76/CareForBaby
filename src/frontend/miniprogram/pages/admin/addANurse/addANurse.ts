// pages/admin/addANurse/addANurse.ts
// pages/register/register.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    db_ID:"123",
    staffID:"245",
    pwd:'',
    mail:'',

    IDRule:[{
      required: true
    },{
    type: 'string',
    min: 1,
    max: 150,
    message: "工作证号长度应在1-150位之间"
    }],
    PasswordRule:[{
      required: true
    },{
    type: 'string',
    min: 1,
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
    host_:'',
    token_:'',
    has_error:false
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(option) {
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
    this.data.db_ID = wx.getStorageSync('g_admin_db_ID');
    this.data.staffID = wx.getStorageSync('g_admin_staff_ID');
    this.data.token_ = wx.getStorageSync('token');
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
  handleError(e){
    console.log(e)
    if(e.detail.isError)
    {
      this.setData({
        has_error:true
      })

    }
    else{
      this.setData({
        has_error:false
      })
    }

  },
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
    wx.navigateBack()
  },
  formSubmit: function (e) {
    // console.log(e.detail.value);
    let that=this
    if(that.data.has_error)
    {
      wx.showToast({
        title: '存在格式错误，请检查输入',
        icon: 'none',
        duration: 2000,
      })
      return
    }

    wx.request({
      url: that.data.host_+'users/api/register',
      // url: 'http://127.0.0.1:8000/users/api/register',
      method:"POST",
			// header: {'content-type': 'application/x-www-form-urlencoded'},
      //url: app.globalData.url.login,
      data:
      // JSON.stringify({
      //   "username": "string",
      //   "password": "string"
      // }),
       {
        "staff_id": e.detail.value.uid,
        "password": e.detail.value.pwd,
        "email":e.detail.value.mail,
        "name":e.detail.value.username,
        "department":e.detail.value.department,
        "role":"NURSE",
        "gender":"F"
      },
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': 'Token ' + that.data.token_
      },
      success: function (res) {
        console.log(res.data);
        if (res.statusCode == 201) {
          //login succeed
          if (res.data.error == true) {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000,
            })
          } else {
            //缓存
            // wx.setStorage({
            //   key: "username",
            //   data: res.data.username
            // });
            wx.showToast({
              title: "添加护士成功",
              icon: 'success',
              duration: 1000,
              success: function () {
                setTimeout(function () {
                  wx.navigateBack()
                }, 1000)
              }
            })
          }
        }
        else if(res.statusCode==400){
          // 格式错误
          let return_info=res.data
          var keyMap = {
            "staff_id":"工作证号",
        "password": "密码",
        "email":"邮箱",
        "name":"姓名",
        "department":"科室",
        "role":"身份",
        "gender":"性别"
          };
          var hint=''
        
        
                var obj = return_info;
                for(var key in obj){
                  var newKey = keyMap[key];
                  if(newKey){
                    obj[newKey] = obj[key];
                    hint=hint+newKey+':'+obj[newKey]+';'
                    delete obj[key];
                    }
                  }
        
        console.log(hint)
        console.log(obj)
          wx.showToast({
            title: hint,
            icon: 'none',
            duration: 5000,
          })
        }

        else{
          wx.showToast({
            title: "添加失败",
            icon: 'none',
            duration: 1000,
            success: function () {
              setTimeout(function () {
                wx.navigateBack()
              }, 1000)
            }
          })
        }
 
      }
    })
  }
})