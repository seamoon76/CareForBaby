// pages/manageInfusions/infusionDetaildInfo/infusionDetaildInfo.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    db_ID:"134",//nurse id
    infusion_ID:"12345678",
    token_:"",
    infusion_info:{
      id:3,
      start_time: "2022-11-10 17:11:45",
      end_time: "2022-11-10 17:19:45",
      patient_db_id:1,
      patient_id:"10",//住院号
      drug: "青霉素",
      dose: "2",
      equipments: {},
      vein: "头皮静脉",
      tips: "无",
      performer_db_id:1,
      nurse_id:"2"
    },
    patient_info: {
      name: "张三",
      parents: "张大三",
      relation: "父女",
      phone: "138299293877",
      bedID: "102",
      roomID: "922",
      patient_id: "3487457",
      gender: "男",
      foot: "",
      complications: [],
      tips: ""
    },
    host_:''
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(option) {
    this.data.db_ID=wx.getStorageSync('g_db_ID');
    this.data.token_=wx.getStorageSync('token');
    this.setData({
      infusion_ID:option.quiryId
    }, function() {
      // this is setData callback
    });
    var that = this
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
    console.log('infusion id '+this.data.infusion_ID);
    console.log('Token '+this.data.token_);
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
    let know_patient_id=false
    wx.request({
      // url: 'https://se.maqi.site:8001/users/api',
      url: that.data.host_+'infusions/api/infusions/'+that.data.infusion_ID,
      method:"GET",
      data: 
      {
      },
      
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization':'Token '+this.data.token_
      },
      success: function (res) {
        console.log(res.data);
        if (res.statusCode == 201 || res.statusCode == 200) {
          //login succeed
            console.log(res.data)
            //let jsonObject = JSON.parse(res.data);
            that.setData({
              infusion_info:{
                id:res.data.id,
                start_time: res.data.start_time,
                end_time: res.data.end_time,
                patient_db_id:res.data.patient,
                patient_id:res.data.patient_query_id,
                drug: res.data.drug,
                dose: res.data.dose,
                equipments: String(res.data.equipments),
                vein: res.data.vein,
                tips: res.data.tips,
                performer_db_id:res.data.performer,
                nurse_id:res.data.performer_query_id
              }
            })
            wx.request({
              url: that.data.host_+"patients/api/patients/" + that.data.infusion_info.patient_db_id,
              method: "GET",
              header: {
                'content-type': 'application/json', // 默认值
                'Authorization':'Token '+that.data.token_
              },
              success: function (res) {
                if (res.statusCode == 201 || res.statusCode == 200) {
                  //login succeed
                  console.log(res.data)
                  //let jsonObject = JSON.parse(res.data);
                  that.setData({
                    patient_info: {
                      name: res.data.name,
                      parents: res.data.parents,
                      relation: res.data.relation,
                      phone: res.data.phone,
                      bedID: res.data.bedID,
                      roomID: res.data.roomID,
                      patient_id: res.data.patient_id,//住院号
                      gender: res.data.gender,
                      foot: res.data.foot,
                      complications: res.data.complications,
                      tips: res.data.tips,
                    }
                  })
                }
                else {
                  wx.showToast({
                    title: '请求失败',
                    icon: 'none',
                    duration: 2000,
                  })
                }
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
    });
    

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
  onTapGoToMain(){
    wx.navigateBack()
  },
  onTapGoToModify(){
    
    wx.navigateTo({
      url: '../infusionDetaildInfoRevised/infusionDetaildInfoRevised?&quiryId=' + this.data.infusion_ID,
    })
  }
})