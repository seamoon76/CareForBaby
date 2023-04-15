// pages/register/register.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    staffID:"",
    db_ID:"",
    gender:"M",
    role:"Admin",
    items: [
      {value: 'M', name: '男'},
      {value: 'F', name: '女', checked: 'true'},
    ],
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
  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)

    const items = this.data.items
    for (let i = 0, len = items.length; i < len; ++i) {
      items[i].checked = items[i].value === e.detail.value
      if(items[i].value === e.detail.value)
      {
        this.data.gender=items[i].value
      }
    }

    this.setData({
      items
    })
  },
  formSubmit: function (e) {
    let that=this
    // console.log(e.detail.value);
    wx.request({
      url: that.data.host_+'users/api/register',
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
        "role":"ADMIN",
        "gender":"F"
      },
      header: {
        'content-type': 'application/json' // 默认值
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
              title: "注册成功",
              icon: 'success',
              duration: 20000,
              success: function () {
                setTimeout(function () {
                  wx.redirectTo({
                    url: '../login/login',
                  })
                }, 2000)
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
            title: "注册失败",
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