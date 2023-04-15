// pages/admin/main/main.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_show:false,
    staffID: "123445678",
    db_ID: "12345678",
    token_: "",
    nurse_info: {
      staff_id: "12345678",
      email: "test@mail.edu.cn",
      name: "test nurse",
      department: "妇幼科",
      role: "NURSE",
      gender: "F"
    },
    list: [
      {
        pagePath: "/pages/admin/main/main",
        text: "工作主页",
        iconPath: "/static/bar-home.png",
        selectedIconPath: "/static/bar-home.png"
      },
      {
        pagePath: "/pages/admin/manageInfusions/index/index",
        text: "输液记录",
        iconPath: "/static/bar-record.png",
        selectedIconPath: "/static/bar-record.png"
      },
      // {
      //   pagePath: "/pages/admin/manageInfusions/index/index",
      //   text: "动态",
      //   iconPath: "/static/bar-news.png",
      //   selectedIconPath: "/static/bar-news.png",
      // },
      {
        pagePath: "/pages/admin/selfInfo/selfInfo",
        text: "我的",
        iconPath: "/static/bar-profile.png",
        selectedIconPath: "/static/bar-profile.png"
      }
    ],
    host_:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    let that = this
    this.data.db_ID = wx.getStorageSync('g_admin_db_ID');
    this.data.staffID = wx.getStorageSync('g_admin_staff_ID');
    this.data.token_ = wx.getStorageSync('token');
    console.log(this.data.db_ID)
    console.log(this.data.staffID)
    console.log('Token ' + that.data.token_)
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
  Showinfo(){
    this.setData({
      is_show:true
    })
  },

  closeThis(){
    this.setData({
      is_show:false
    })
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
    let that = this
    wx.request({
      // url: 'https://se.maqi.site:8001/users/api',
      url: that.data.host_+'users/api/users/' + that.data.db_ID,
      method: "GET",
      data:
      {
      },

      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': 'Token ' + that.data.token_
      },
      success: function (res) {
        console.log(res.data);
        if (res.statusCode == 201 || res.statusCode == 200) {
          //login succeed
          console.log(res.data)
          //let jsonObject = JSON.parse(res.data);
          that.setData({
            db_ID: res.data.id,
            staffID: res.data.staff_id,
            nurse_info: {
              staff_id: res.data.staff_id,
              email: res.data.email,
              name: res.data.name,
              department: res.data.department,
              role: res.data.role,
              gender: res.data.gender
            }
          })
        }
        else {
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
  OnTapLogout() {
    let that = this
    wx.request({
      url: that.data.host_+'users/api/logout',
      //url: 'http://127.0.0.1:8000/users/api/logout',
      method: "POST",
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
        'Authorization': 'Token ' + this.data.token_
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
                  wx.redirectTo({
                    url: '../../index/index'
                  })
                }, 500)
              }
            })
          }
        }
      }
    })
  },

  //跳转管理护士信息页
  OnTapGoToManageNurse() {
    wx.navigateTo({
      url: '../manageNurse/manageNurse',
    })
  },

  OnTapGoToManagePatient() {
    wx.navigateTo({
      url: '../patientInfo/patientInfo/patientInfo',
    })
  },

})