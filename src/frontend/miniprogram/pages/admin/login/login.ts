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
    min: 1,
    max: 128,
    message: "密码长度应在1-128位之间"
    }],
    host_:'',
    has_error:false
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
  findpwd(){
    wx.navigateTo({
      url: '../findpw/findpw',
    })
  },
  OnTapGotoRegister(){
    wx.navigateTo({
      url: '../register/register',
    })
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
  onTapWechatLogin()
  {
    let that=this;
    wx.login({
      success (res) {
        if (res.code) {
          console.log(res.code)
          wx.request({
            url: that.data.host_+'users/api/wxlogin',
            method:"POST",
            data: 
            {
              "code": res.code,
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              console.log(res.data);
              if (res.statusCode == 201 || res.statusCode == 200) {
                //login succeed        
                console.log(res.data)
                that.setData({
                    db_ID: res.data["user"].id,
                    staffID:res.data["user"].staff_id,
                });
                if(res.data["user"].role=="NURSE")
            {
              wx.showToast({
                title: "您不是管理员",
                icon: 'error',
                duration: 2000,
                success: function () {
                  setTimeout(function () {
                    wx.redirectTo({
                      url: '../../index/index'
                    })
                  }, 2000)
                }
              })
              return;
            };
                //缓存
                wx.setStorage({
                    key: "token",
                    data: res.data.token
                });
                wx.setStorage({
                    key: "g_db_ID",
                    data: res.data["user"].id
                });
                wx.setStorage({
                    key: "g_staff_ID",
                    data: res.data["user"].staff_id
                });
                wx.setStorage({
                  key: "g_admin_db_ID",
                  data: res.data["user"].id
                });
                wx.setStorage({
                  key: "g_admin_staff_ID",
                  data: res.data["user"].staff_id
                });
                  
                wx.showToast({
                    title: "登录成功",
                    icon: 'success',
                    duration: 2000,
                    success: function () {
                      setTimeout(function () {
                        wx.redirectTo({
                          url: '../main/main',
                        })
                      }, 2000)
                    }
                })              
              }
              else{
                wx.showToast({
                  title: "未查询到绑定此微信的管理员账号，首次请通过账号密码登录",
                  icon: 'none',
                  duration: 2000,
              }) 
              }
            }
          })
        } else {
          wx.showToast({
            title: '用户名或密码错误',
            icon: 'none',
            duration: 2000,
          })
        }
      }
    })
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
  formSubmit: function (event) {
    var that = this
    // console.log(e.detail.value);
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
      url: that.data.host_+'users/api/login',
      // url: 'http://127.0.0.1:8000/users/api/login',
      //url: app.globalData.url.login,
      method:"POST",
								// header: {'content-type': 'application/x-www-form-urlencoded'},
      data: 
      // JSON.stringify({
      //   "username": "string",
      //   "password": "string"
      // }),
      {
        "staff_id": event.detail.value.usr,
        "password": event.detail.value.pwd
      },
      
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        if (res.statusCode == 201 || res.statusCode == 200) {
          //login succeed
          if (res.data.error == true) {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000,
            })
          } else {
            console.log(res.data)
            if(res.data["user"].role=="NURSE")
            {
              wx.showToast({
                title: "您不是管理员",
                icon: 'error',
                duration: 2000,
                success: function () {
                  setTimeout(function () {
                    wx.redirectTo({
                      url: '../../index/index'
                    })
                  }, 2000)
                }
              })
              return;
            }
            //let jsonObject = JSON.parse(res.data);
            that.setData({
              db_ID: res.data["user"].id,
              staffID:res.data["user"].staff_id,
            }),
            //缓存
            wx.setStorage({
              key: "token",
              data: res.data.token
            });
            wx.setStorage({
              key: "g_admin_db_ID",
              data: res.data["user"].id
            });
            wx.setStorage({
              key: "g_admin_staff_ID",
              data: res.data["user"].staff_id
            });
            wx.setStorage({
              key: "g_db_ID",
              data: res.data["user"].id
            });
            wx.setStorage({
              key: "g_staff_ID",
              data: res.data["user"].staff_id
            });
            
            wx.showToast({
              title: "登录成功",
              icon: 'success',
              duration: 2000,
              success: function () {
                setTimeout(function () {
                  wx.redirectTo({
                    url: '../main/main?staffID='+that.data.staffID+"&db_ID="+that.data.db_ID,
                  })
                }, 2000)
              }
            })
          }
        }
        else{
          wx.showToast({
            title: '用户名或密码错误',
            icon: 'none',
            duration: 2000,
          })
        }
      }
    })
  }
})