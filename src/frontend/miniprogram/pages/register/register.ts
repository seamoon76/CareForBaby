// pages/register/register.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    host_:'https://se.maqi.site:8001/'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    let that = this
    var app = getApp()
    if(app.globalData.localDebug)
    {
      that.setData({
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
  formSubmit: function (e) {
    // console.log(e.detail.value);
    let that=this
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
        "username": e.detail.value.usr,
        "password": e.detail.value.pwd
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        if (res.statusCode == 200) {
          //login succeed
          
            //缓存
            wx.setStorage({
              key: "username",
              data: res.data.username
            });
            wx.showToast({
              title: "注册成功",
              icon: 'success',
              duration: 20000,
              success: function () {
                setTimeout(function () {
                  wx.navigateTo({
                    url: '../index/index',
                  })
                }, 2000)
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
  }
})