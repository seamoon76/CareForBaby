// pages/Infusions/choose_tools/choose_tools.ts
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
      age:2,
      roomID: "922",
      patient_id: "3487457",
      gender: "男",
      foot: "",
      complications: [],
      tips:"",
      disease:'',
      infused_veins:'',
    },
    age:"test",
    disease:"test",
    tips:"",
    tool_list:["钢针","外周静脉导管","留置针","手动输入"],
    tool_index:0,
    tool_input:"",
    host_:''
  },

  showActionSheet(e) {
    let that = this
    wx.showActionSheet({
      itemList: this.data.tool_list,

      success(e) {
          that.setData({
            tool_index:e.tapIndex
          })
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(option) {
    let that=this
    this.setData({
      patient_db_id:Number(option.id_to_operate)
    })
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
              age:res.data.age,
              tips:res.data.tips,
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
  inputEditToolName(e){
    var inputModel = e.currentTarget.dataset.name;
    var value = e.detail.value;
    this.data[inputModel] = value;   
    console.log(value)
    this.setData({
      tool_input:value
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

  onTapGoToMain(){
    wx.navigateBack({delta:4})
    // wx.redirectTo({
    //   url:'../../main/main'
    // })
  },

  onTapGoToLast(){
    wx.navigateBack()
  },

  onTapGoToNext(){
    //将选中的内容填入到缓存当中
    wx.setStorage({
      key:"tool_tips",
      data:this.data.tips
    })
    console.log(this.data.tips)
    if(this.data.tool_index==this.data.tool_list.length-1)//最后一项，是手动输入
    {
      wx.setStorage({
        key: "tool_storage",
        data: this.data.tool_input
      });
      console.log("choose tool"+this.data.tool_input)
    }
    else if(this.data.tool_list.length>=2 && this.data.tool_index<this.data.tool_list.length-1 && this.data.tool_index>=0)
    {
      wx.setStorage({
        key: "tool_storage",
        data: this.data.tool_list[this.data.tool_index]
      });
      console.log("choose tool"+this.data.tool_list[this.data.tool_index])
    }
      console.log(this.data.patient_db_id)
      wx.navigateTo({
        url: '../addInfusions/addInfusions?id_to_operate='+this.data.patient_db_id+'&patient_id='+this.data.patientInfo.patient_id,
      })
  }
})