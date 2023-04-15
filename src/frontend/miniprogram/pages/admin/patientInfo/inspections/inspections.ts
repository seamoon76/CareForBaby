// pages/admin/patientInfo/inspections/inspections.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token_: "123",
    patient_db_id: "12",
    inspectionsList: [
      // { "name": "张护士", "time": "2022-01-02-19-30", "complications": "正常", "tips": "无" },
      // { "name": "李护士", "time": "2022-01-03-19-30", "complications": "正常", "tips": "无" },
      // { "name": "李护士", "time": "2022-01-04-19-30", "complications": "静脉炎", "tips": "无" },
    ],
    host_:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(option) {
    this.data.token_ = wx.getStorageSync('token');
    this.setData({
      patient_db_id: option.quiry_id
    })
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
    let that = this
    wx.request({
      url: that.data.host_+"patients/api/inspections",
      method: "GET",
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': 'Token ' + this.data.token_
      },
      data: {
        "patient": that.data.patient_db_id
      },
      success: function (res) {
        if (res.statusCode == 201 || res.statusCode == 200) {
          //login succeed
          console.log(res.data)
          for (let record of res.data.inspections) {
            var nurse_name = ""
            wx.request({
              url: that.data.host_+"users/api/users/" + record.nurse,
              method: "GET",
              header: {
                'content-type': 'application/json', // 默认值
                'Authorization': 'Token ' + that.data.token_
              },
              success: function (res) {
                console.log(res.data);
                if (res.statusCode == 201 || res.statusCode == 200) {
                  nurse_name = res.data.name
                  var new_rec = {
                    "name": nurse_name,
                    "time": record.created_at,
                    "complications": record.complications,
                    "tips": record.tips
                  }
                  that.setData({
                    inspectionsList: that.data.inspectionsList.concat(new_rec)
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
          }
          console.log(that.data.inspectionsList)

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
  onTapReturn() {
    wx.navigateBack()
  }
})