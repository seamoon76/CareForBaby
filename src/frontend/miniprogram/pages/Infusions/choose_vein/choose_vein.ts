// pages/Infusions/choose_vein/choose_vein.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token_:"123",
    patient_db_id:1,
    patientInfo: {
      name: "张三",
      bedID: "102",
      roomID: "922",
      patient_id: "3487457",
      gender: "男",
      foot: "",
      complications: [],
      age:2,
      tips:"",
      disease:'',
      infused_veins:'',
    },
    age:"test",
    disease:"咳嗽流涕",
    tips:"",
    vein_list:["头皮静脉","左足静脉","右足静脉","手动输入"],
    vein_index:0,
    vein_input:"",
    host_:''
  },

  showActionSheet(e) {
    let that = this
    wx.showActionSheet({
      itemList: this.data.vein_list,
      success(e) {
          that.setData({
            vein_index:e.tapIndex
          })
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(option) {
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
    this.setData({
      patient_db_id:Number(option.id_to_operate)
    })
    this.data.token_=wx.getStorageSync('token');
    wx.request({
      url: that.data.host_+"patients/api/patients/" + this.data.patient_db_id,
      method: "GET",
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization':'Token '+this.data.token_
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
              patient_id: res.data.patient_id,//住院号
              gender: res.data.gender,
              foot: res.data.foot,
              complications: res.data.complications,
              tips: res.data.tips,
              age:res.data.age,
              disease:res.data.disease,
              infused_veins:res.data.infused_veins,
              parents:res.data.parents,
              phone:res.data.phone,
              relation:res.data.relation,
            }
          });
          wx.setStorage({
            key: "infusing_patient_info",
            data: that.data.patientInfo
        });
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

  inputEditVeinName(e){
    console.log(135)
    var inputModel = e.currentTarget.dataset.name;
    var value = e.detail.value;
    this.data[inputModel] = value;   
    console.log(value)
    this.setData({
      vein_input:value
    }); 
  },

  inputEditTips(e){
    
    var inputModel2= e.currentTarget.dataset.name;
    var value = e.detail.value;
    this.data[inputModel2] = value;   
    console.log(value)
    this.setData({
      tips:value
    }); 
  },

  onTapGoToNext(){
    //将选中的内容填入到缓存当中
    wx.setStorage({
      key:"vein_tips",
      data:this.data.tips
    })
    console.log(this.data.tips)
    if(this.data.vein_index==this.data.vein_list.length-1)//最后一项，是手动输入
    {
      wx.setStorage({
        key: "vein_storage",
        data: this.data.vein_input
      });
      console.log("choose vein"+this.data.vein_input)
    }
    else if(this.data.vein_list.length>=2 && this.data.vein_index<this.data.vein_list.length-1 && this.data.vein_index>=0)
    {
      wx.setStorage({
        key: "vein_storage",
        data: this.data.vein_list[this.data.vein_index]
      });
      console.log("choose vein"+this.data.vein_list[this.data.vein_index])
    }
    
      wx.navigateTo({
        url: '../choose_medi/choose_medi?id_to_operate='+this.data.patient_db_id,
      })
  },
  onTapGoToMain(){
    wx.navigateBack({delta:2})
    // wx.redirectTo({
    //   url:'../../main/main'
    // })
  },

  onTapGoToLast(){
    wx.navigateBack()
  }
})