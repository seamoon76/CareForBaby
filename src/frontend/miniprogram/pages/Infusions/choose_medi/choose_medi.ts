// pages/Infusions/choose_medi/choose_medi.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token_: "123",
    patient_db_id: 1,
    patientInfo: {
      name: "张三",
      bedID: "102",
      roomID: "922",
      patient_id: "3487457",
      gender: "男",
      foot: "",
      age:2,
      complications: [],
      tips: "",
      disease:'',
      infused_veins:'',
    },
    age: "test",
    disease: "咳嗽流涕",
    tips: "test",
    med_list: ["青霉素", "药物2", "药物3", "手动输入"],
    med_index: 0,
    med_input: "",
    med_input_dose: 1,
    host_:''
  },
  inputEditMedName(e) {
    var inputModel = e.currentTarget.dataset.name;
    var value = e.detail.value;
    this.data[inputModel] = value;
    console.log(value)
    this.setData({
      med_input: value
    });
  },
  inputEditMedDose(e) {
    var inputModel2 = e.currentTarget.dataset.name;
    var value = e.detail.value;
    this.data[inputModel2] = value;
    console.log(value)
    this.setData({
      med_input_dose: value
    });
  },

  showActionSheet(e) {
    let that = this
    wx.showActionSheet({
      itemList: this.data.med_list,

      success(e) {
        that.setData({
          med_index: e.tapIndex
        })
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(option) {
    this.setData({
      patient_db_id: Number(option.id_to_operate)
    })
    this.data.token_ = wx.getStorageSync('token');
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
      url: that.data.host_+"patients/api/patients/" + this.data.patient_db_id,
      method: "GET",
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': 'Token ' + this.data.token_
      },
      success: function (res) {
        if (res.statusCode == 201 || res.statusCode == 200) {
          //login succeed
          console.log(res.data)
          //let jsonObject = JSON.parse(res.data);
          that.setData({
            patientInfo: {
              name: res.data.name,
              bedID: res.data.bedID,
              roomID: res.data.roomID,
              age:res.data.age,
              patient_id: res.data.patient_id,//住院号
              gender: res.data.gender,
              foot: res.data.foot,
              complications: res.data.complications,
              tips: res.data.tips,
              disease:res.data.disease,
              infused_veins:res.data.infused_veins,
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

  onTapGoToNext() {
    //将选中的内容填入到缓存当中

    wx.setStorage({
      key: "med_dose_storage",
      data: this.data.med_input_dose
    });
    console.log("dose med" + this.data.med_input_dose)

    if (this.data.med_index == this.data.med_list.length - 1)//最后一项，是手动输入
    {
      wx.setStorage({
        key: "med_storage",
        data: this.data.med_input
      });
      console.log("choose med" + this.data.med_input)
    }
    else if (this.data.med_list.length >= 2 && this.data.med_index < this.data.med_list.length - 1 && this.data.med_index >= 0) {
      wx.setStorage({
        key: "med_storage",
        data: this.data.med_list[this.data.med_index]
      });
      console.log("choose med" + this.data.med_list[this.data.med_index])
    }
    console.log(this.data.patientInfo.patient_id)
    wx.navigateTo({
      url: '../choose_tools/choose_tools?id_to_operate=' + this.data.patient_db_id + '&patient_id' + this.data.patientInfo.patient_id,
    })
  },

  onTapGoToMain() {
    wx.navigateBack({delta:3})
    // wx.redirectTo({
    //   url: '../../main/main'
    // })
  },

  onTapGoToLast() {
    wx.navigateBack()
  }
})