// pages/admin/selfInfo/selfInfo.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    staffID:"123445678",
    db_ID:"12345678",
    token_:"",
    nurse_info:{
      staff_id:"12345678",
      email:"test@mail.edu.cn",
      name:"test nurse",
      department:"妇幼科",
      role:"NURSE",
      gender:"F",
      openid:""
    },
    list: [
      {
        pagePath: "/pages/main/main",
        text: "工作主页",
        iconPath:"/static/bar-home.png",
        selectedIconPath: "/static/bar-home.png"
      },
      {
        pagePath: "/pages/manageInfusions/index/index",
        text: "输液记录",
        iconPath:"/static/bar-record.png",
        selectedIconPath: "/static/bar-record.png"
      },
      // {
      //   pagePath: "/pages/manageInfusions/index/index",
      //   text: "动态",
      //   iconPath:"/static/bar-news.png",
      //   selectedIconPath: "/static/bar-news.png",
      // },
      {
        pagePath: "/pages/selfInfo/selfInfo",
        text: "我的",
        iconPath:"/static/bar-profile.png",
        selectedIconPath: "/static/bar-profile.png"
      }
    ],
    host_:'https://se.maqi.site:8001/'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.data.db_ID=wx.getStorageSync('g_db_ID');
    this.data.staffID=wx.getStorageSync('g_staff_ID');
    this.data.token_=wx.getStorageSync('token');
    //console.log('Token '+this.data.token_);
    var app = getApp()
    if(app.globalData.localDebug)
    {
      this.setData({
        host_:'http://127.0.0.1:8000/'
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
    let that=this
    wx.request({
      // url: 'https://se.maqi.site:8001/users/api',
      url: that.data.host_+'users/api/users/'+that.data.db_ID,
      method:"GET",
      data: 
      {
      },
      
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization':'Token '+that.data.token_
      },
      success: function (res) {
        console.log(res.data);
        if (res.statusCode == 201 || res.statusCode == 200) {
          //login succeed
            console.log(res.data)
            //let jsonObject = JSON.parse(res.data);
            that.setData({
              db_ID: res.data.id,
              staffID:res.data.staff_id,
              nurse_info:{
                staff_id:res.data.staff_id,
                email:res.data.email,
                name:res.data.name,
                department:res.data.department,
                role:res.data.role,
                gender:res.data.gender,
                openid:res.data.openid,//todo
              }
            })
        }
        else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000,
          })
        }
 
      }
    })
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

  onTapGoToWechatBand(){
    let that=this

    
    wx.login({
      
      success:function (res) {
        
        if (res.code) {
          //发起网络请求
          console.log(res)
          console.log(res.code)
          let url_=that.data.host_+'users/api/getopenid'
          // wx.showToast({
          //   title: res.errMsg,
          //   icon: 'none',
          //   duration: 2000
          // });
          wx.request({
            url: url_,
            method:"POST",
            header: {
              'content-type': 'application/json', // 默认值
              'Authorization':'Token '+that.data.token_
            },
            data:{'code':res.code},
            success:function (res) {
              console.log(res)
              
              if(res.data.openid){
                // wx.showToast({
                //   title: res.openId,
                //   icon: 'none',
                //   duration: 20
                // });
                let nurse_info_new=that.data.nurse_info
                nurse_info_new['openid'] = res.data['openid']
                that.setData({
                  nurse_info:nurse_info_new
                })
                console.log(nurse_info_new)
                wx.request({
                  url: that.data.host_+'users/api/users/'+that.data.db_ID,
                  method:"PUT",
                  data:nurse_info_new,
                  header: {
                    'content-type': 'application/json', // 默认值
                    'Authorization':'Token '+that.data.token_
                  },
                  success: function (res) {
                    console.log(res);
                    if (res.statusCode == 200) {
                      //login succeed
                      if (res.data.error == true) {
                        wx.showToast({
                          title: res.data.msg,
                          icon: 'none',
                          duration: 2000,
                        })
                      } else {
                        wx.showToast({
                          title: "绑定成功",
                          icon: 'success',
                          duration: 2000
                        })
                      }
                    }
                    else{
                      wx.showToast({
                        title: '绑定失败',
                        icon: 'none',
                        duration: 2000
                      });
                    }
                  },
                  fail:function(res){
                    wx.showToast({
                      title: 'put错误',
                      icon: 'none',
                      duration: 2000,
                      
                    })
                  }
                })
              }
              else{
                wx.showToast({
                  title: '没有获得openid',
                  icon: 'none',
                  duration: 2000
                });
              }
            },
            fail:function(res){
              wx.showToast({
                title: '请求失败',
                icon: 'none',
                duration: 2000,
                
              })
            }
            })
          }
          else{
            console.log(res)
            wx.showToast({
              title:"绑定失败",
              icon: 'success',
              duration: 2000,
            })
          }
        },
      fail:function(res){
        wx.showToast({
          title: res.errMsg,
          icon: 'none',
          duration: 2000,
          
        })
      }
    })
  },

  onTapGoToWechatBandCancel(){
    let nurse_info_new=this.data.nurse_info
    nurse_info_new['openid'] = ""
    this.setData({
      nurse_info:nurse_info_new
    })
    let that=this
    wx.request({
      url: that.data.host_+'users/api/users/'+that.data.db_ID,
      method:"PUT",
      data:nurse_info_new,
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization':'Token '+that.data.token_
      },
      success: function (res) {
        console.log(res.data);
        if (res.statusCode == 200) {
        //login succeed
        if (res.data.error == true) {
           wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000,
        })
        } else {
          wx.showToast({
            title: "解绑成功",
            icon: 'success',
            duration: 2000
          })
        }
     }  
  },
  })
  },
  /**
   * 返回管理员工作主页
   */
  onTapGoToMain(){
    wx.navigateBack()
  },

  /**
   *  跳转到修改个人信息
   */
  onTapGoToModify(){
    wx.navigateTo({
      url: '../selfInfoModify/selfInfoModify',
    })
  },
  OnTapLogout(){
    let that=this
    wx.request({
      // url: 'https://se.maqi.site:8001/api/login',
      url: that.data.host_+'users/api/logout',
      method:"POST",
								// header: {'content-type': 'application/x-www-form-urlencoded'},
      data: 
      // JSON.stringify({
      //   "username": "string",
      //   "password": "string"
      // }),
      {
        
      },
      
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization':'Token '+this.data.token_
      },
      success: function (res) {
        console.log(res.data);
        if (res.statusCode == 201 || res.statusCode == 200 || res.statusCode == 204) {
          //login succeed
          if (res.data.error == true) {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000,
            })
          } else {
            console.log(res.data)
            //let jsonObject = JSON.parse(res.data);
            
            wx.showToast({
              title: "登出成功",
              icon: 'success',
              duration: 1000,
              success: function () {
                setTimeout(function () {
                  wx.reLaunch({
                    url: '../index/index'
                  })
                }, 500)
              }
            })
          }
        }
      }
    })
  }
})