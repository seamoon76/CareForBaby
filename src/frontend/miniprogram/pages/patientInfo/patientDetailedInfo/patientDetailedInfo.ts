// pages/patientDetailedInfo/patientDetailedInfo.ts
Page({
  /**
   * 页面的初始数据
   */
  data: {
    token_:"123",
    patient_db_id:"12",
    patientInfo: {
      name: "张三",
      parents: "张大三",
      age: "1",
      relation: "父女",
      phone: "138299293877",
      bedID: "102",
      roomID: "922",
      patient_id: "3487457",
      gender: "男",
      foot: "/static/foot_example.jpg",
      complications: [],
      tips: "",
      infused_veins:'',
      disease:''
    },
    host_:'https://se.maqi.site:8001/'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(option) {
    let that = this
    this.setData({
      patient_db_id:option.quiryId
    }, function() {
      // this is setData callback
    });
    this.data.token_=wx.getStorageSync('token');
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
    let that=this
    wx.request({
      url: that.data.host_+"patients/api/patients/" + that.data.patient_db_id,
      method: "GET",
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization':'Token '+this.data.token_
      },
      success: function (res) {
        if (res.statusCode == 201 || res.statusCode == 200) {
          //login succeed
          console.log(res.data)
          let tmp_foot_image=that.data.patientInfo.foot
          if(res.data.foot!==''&&res.data.foot!==null&&res.data.foot!=='aa'){
            tmp_foot_image= res.data.foot
          };
          //let jsonObject = JSON.parse(res.data);
          that.setData({
            patientInfo: {
              name: res.data.name,
              age: res.data.age,
              parents: res.data.parents,
              relation: res.data.relation,
              phone: res.data.phone,
              bedID: res.data.bedID,
              roomID: res.data.roomID,
              patient_id: res.data.patient_id,//住院号
              gender: res.data.gender,
              foot:tmp_foot_image,
              complications: res.data.complications,
              tips: res.data.tips,
              disease:res.data.disease,
              infused_veins:res.data.infused_veins
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
  onTapGoToPatientInfo() {
    wx.navigateBack({
      delta: 1  // 返回上一级页面。
    })
  },
  onTapGoToInspection(){
    let id_to_quiry = Number(this.data.patient_db_id)
    wx.navigateTo({
      url: "../inspections/inspections?&quiry_id=" + id_to_quiry
    })
  }
})