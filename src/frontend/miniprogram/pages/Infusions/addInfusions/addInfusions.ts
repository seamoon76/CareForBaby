// pages/manageInfusions/infusionDetaildInfoRevised/infusionDetaildInfoRevised.ts
Page({
  /**
   * 页面的初始数据
   */
  data: {
    db_ID:"134",//nurse id in db
    staff_ID:"11",// nurse staff id
    token_:"",
    patient_db_id:1,
    patient_id:"",
    infusion_info:{
      id:3,
      start_time:"",
      end_time:"",
      drug:"",
      dose:" ml",
      vein:"",
      equipments:["",""],
      operate_nurse_id:"",
      tips:"注意事项"
    },
    host_:''
  },

  getNowDate(): string {
    // modify from
    //https://blog.csdn.net/e295166319/article/details/87974243
    const date = new Date();
    let month: string | number = date.getMonth() + 1;
    let strDate: string | number = date.getDate();
   
    if (month <= 9) {
      month = "0" + month;
    }
   
    if (strDate <= 9) {
      strDate = "0" + strDate;
    }
   
    return date.getFullYear() + "-" + month + "-" + strDate + " "
    + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(option) {
    let tool=wx.getStorageSync('tool_storage')
    let vein_tips=wx.getStorageSync('vein_tips')
    let tool_tips=wx.getStorageSync('tool_tips')
    let tem_tip='';
    if(vein_tips!=='')
    {
      tem_tip=tem_tip+"静脉注意事项: "+vein_tips+";";
    }
    if(tool_tips!=='')
    {
      tem_tip=tem_tip+"器材注意事项: "+tool_tips+";";
    }
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
      patient_db_id:Number(option.id_to_operate),
      token_:wx.getStorageSync('token'),
      patient_id:option.patient_id,
      db_ID:wx.getStorageSync('g_db_ID'),
      staff_ID:wx.getStorageSync('g_staff_ID'),
      infusion_info:{
        id:Number(option.id_to_operate),
        start_time:this.getNowDate(),
        end_time:"",
        drug:wx.getStorageSync('med_storage'),
        dose:wx.getStorageSync('med_dose_storage'),
        vein:wx.getStorageSync('vein_storage'),
        equipments:String(tool),
        operate_nurse_id:wx.getStorageSync('g_staff_ID'),
        tips:tem_tip
    },
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

  onTapCancel(){
    wx.navigateBack({delta:5})
  },
  formSubmit: function (e) {
    let that=this
    console.log(that.data.db_ID)
    
    let dic=that.data.infusion_info.equipments
    console.log(this.data)
    let p_info=wx.getStorageSync('infusing_patient_info')
    let s=p_info['infused_veins']
    console.log(s)
    if(s.indexOf("无") != -1){
      s=that.data.infusion_info.vein
    }
    else{
      s=s+','+that.data.infusion_info.vein
    }
    console.log(s)
    p_info['infused_veins']=s
    wx.request({
      url: that.data.host_+"patients/api/patients/" + that.data.patient_db_id,
      method: "PUT",
      data: p_info, 
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization':'Token '+that.data.token_
      },
      success: function(res){
        console.log(res)
          
        },
        fail:function(res){
          console.log(res)
        }
      });

    // console.log(e.detail.value);
    wx.request({
      url: that.data.host_+'infusions/api/infusions',
      method:"POST",
      data:{
        "start_time": that.data.infusion_info.start_time,
        //"end_time": that.data.infusion_info.end_time,
        "drug": that.data.infusion_info.drug,
        "dose": that.data.infusion_info.dose,
        "equipments": dic,
        "patient_query_id":that.data.patient_id,
        "performer_query_id":that.data.staff_ID,
        "vein": that.data.infusion_info.vein,
        "tips": that.data.infusion_info.tips,
      }
      
      ,
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization':'Token '+this.data.token_
      },
      success: function (res) {
        console.log(res.data);
        if (res.statusCode == 201) {
            wx.showToast({
              title: "添加成功",
              icon: 'success',
              duration: 2000,
              success: function () {
                setTimeout(function () {
                  // wx.navigateTo({
                  //   url:"../../admin/manageNurse/manageNurse?db_ID="+that.data.admin_db_ID+"&staffID="+that.data.admin_staff_ID
                  // })
                  wx.navigateBack({delta:5})
                }, 2000)
              }
            })
          
        }
        else{
          
            wx.showToast({
              title: "添加失败",
              icon: 'none',
              duration: 2000,
            })
          
        }
 
      }
    })
  }
})