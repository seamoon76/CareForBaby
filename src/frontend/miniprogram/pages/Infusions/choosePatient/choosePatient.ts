// pages/Infusions/choosePatient/choosePatient.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token_:"123",
    current:9999999,
    patientArray: [
      {
        id: 1,
          name: "张三",
          parents: "张大三",
          relation: "父女",
          creditID: "110123",
          phone: "138299293877",
          bedID: "102",
          roomID: "922",
          patient_id: "3487457",
          gender: "男",
          foot: "",
          complications: [],
          tips: ""
        
      },
      
    ],
    host_:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    // 读数据
    let that = this
    this.data.token_=wx.getStorageSync('token');
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
    let that=this
    wx.request({
      url: that.data.host_+ "patients/api/patients",
      method: "GET",
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization':'Token '+this.data.token_
      },
      success: function (res) {
        if (res.statusCode == 201 || res.statusCode == 200) {
          //get succeed
          console.log(res.data)
          that.setData({
            patientArray: res.data.patients
          })
          if(that.data.patientArray.length!=0)
          {
            var index=0  //此处可以选择设置 需要选中的下标
            that.data.patientArray[index].checked="true";
            that.setData({
              patientArray: that.data.patientArray
            })
          }
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
  onTapGoToInfusion(event) {
    let id_to_operate = Number(event.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../addInfusions/addInfusions?&id_to_operate=' + id_to_operate,
    })
  },
  onTapGoToMain(){
    wx.navigateBack()
  },
  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    const items = this.data.patientArray
    this.data.current=e.detail.value
    for (let i = 0, len = items.length; i < len; ++i) {
      items[i].checked = items[i].id === e.detail.value;
    }

    this.setData({
      patientArray:items
    })
  },
  onTapGoToChooseVein(){
    let id_to_operate = this.data.current;
    
    if(this.data.current!==9999999){
      console.log(id_to_operate)
      wx.navigateTo({
        url: '../choose_vein/choose_vein?id_to_operate='+id_to_operate,
      })
    }
    else{
      // 没有选中任何一项，用默认值
      const items = this.data.patientArray
      for (let i = 0, len = items.length; i < len; ++i) {
        if(items[i].checked)
        {
          id_to_operate=items[i].id;
          this.data.current=id_to_operate
          console.log(id_to_operate)
          wx.navigateTo({
            url: '../choose_vein/choose_vein?id_to_operate='+id_to_operate,
          })
        }
      }
      
    }
    
  }
})