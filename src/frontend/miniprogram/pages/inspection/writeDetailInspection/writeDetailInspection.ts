// pages/inspection/writeDetailInspection/writeDetailInspection.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token_: "123",
    patient_db_id: 2,
    db_ID: "134",
    host_:'',
    is_show : false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(option) {
    this.setData({
      patient_db_id:option.quiryId
    })
    this.data.token_ = wx.getStorageSync('token');
    this.data.db_ID = wx.getStorageSync('g_db_ID');
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
  onClickShow(){
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  onTapSubmit() {
    wx.showToast({
      title: "提交成功",
      icon: 'success',
      duration: 2000,
      success: function () {
        setTimeout(function () {
          wx.navigateBack()
        }, 2000)
      }
    })
  },
  onTapReturn() {
    wx.navigateBack()
  },
  onTapEmergency(){
    wx.showModal({
      title: '提示',
      content: '确定发起紧急呼叫？',
      success(res) {
        // 用户点击确定
        if (res.confirm) {
          wx.showToast({
            title: "呼叫成功",
            icon: 'success',
            duration: 2000,
            success: function () { 
            }
          })
        }
      }
    })
  },
  formSubmit: function (e) {
    let that = this
    wx.request({
      url: that.data.host_+"patients/api/inspections",
      method: "POST",
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': 'Token ' + this.data.token_
      },
      data: {
        "patient": that.data.patient_db_id,
        "nurse": that.data.db_ID,
        "complications": e.detail.value.complications,
        "tips": e.detail.value.tips
      },
      success: function (res) {
        if (res.statusCode == 201) {
          console.log(res)
          wx.showToast({
            title: "提交成功",
            icon: 'success',
            duration: 2000,
            success: function () {
              setTimeout(function () {
                wx.navigateBack()
                // var pages = getCurrentPages()
                // pages[pages.length-2].onLoad()
                // wx.navigateBack({
                //   delta: 1  // 返回上一级页面。
                // })
              }, 2000)
            }
          })

        }
        else{
          wx.showToast({
            title: "提交失败",
            icon: 'none',
            duration: 1000,
            
          })
        }
      }
    })
  }
})