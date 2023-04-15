// pages/manageInfusions/infusionDetaildInfoRevised/infusionDetaildInfoRevised.ts
Page({
  /**
   * 页面的初始数据
   */
  data: {
    db_ID:"134",//nurse id
    token_:"",
    infusion_info:{
      id:3,
      start_time:"",
      end_time:"",
      patient_id:"",
      drug:"",
      dose:" ml",
      vein:"",
      equipments:'',
      operate_nurse_id:"",
      tips:"注意事项"
    },
    host_:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.data.db_ID=wx.getStorageSync('g_db_ID');
    this.data.token_=wx.getStorageSync('token');
    console.log('Token '+this.data.token_);
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
    wx.navigateBack()
  },
  formSubmit: function (e) {
    let that=this
    let tmp_end_time=e.detail.value.end_time
    if(tmp_end_time=='')
    {
      tmp_end_time=null
    }
    this.setData({
      infusion_info:{
        id:3,
        start_time:e.detail.value.start_time,
        end_time:tmp_end_time,
        patient_id:e.detail.value.patient_id,
        drug:e.detail.value.drug,
        dose:e.detail.value.dose,
        vein:e.detail.value.vein,
        equipments:e.detail.value.equipments,
        operate_nurse_id:e.detail.value.nurse_id,
        tips:e.detail.value.tips
      }
    })
    let dic=e.detail.value.equipments
    // console.log(e.detail.value);
    wx.request({
      url: that.data.host_+'infusions/api/infusions',
      method:"POST",
			// header: {'content-type': 'application/x-www-form-urlencoded'},
      //url: app.globalData.url.login,
      // data:
      // {
      //   "start_time":e.detail.value.start_time,
      //   "end_time":e.detail.value.end_time,
      //   "patient_name":e.detail.value.patient_name,
      //   "patient_id":e.detail.value.patient_id,
      //   "bed_id":e.detail.value.bed_id,
      //   "drug":e.detail.value.drug,
      //   "dose":e.detail.value.dose,
      //   "vein":e.detail.value.vein,
      //   "equipments":e.detail.value.equipments,
      //   "operate_nurse_name":e.detail.value.nurse_name,
      //   "tips":e.detail.value.tips
      // }
      data:{
        "start_time": e.detail.value.start_time,
        "end_time": tmp_end_time,
        "drug": e.detail.value.drug,
        "dose": e.detail.value.dose,
        "equipments": dic,
        "patient_query_id":e.detail.value.patient_id,
        "performer_query_id":e.detail.value.nurse_id,
        "vein": e.detail.value.vein,
        "tips": e.detail.value.tips,
      }
      // JSON.stringify({
      //   "username": "string",
      //   "password": "string"
      // }),
      //  {
      //   "start_time": e.detail.value.start_time,
      //   // "password": e.detail.value.pwd,
      //   "end_time":e.detail.value.end_time,
      //   "name":e.detail.value.username,
      //   "department":e.detail.value.department,
      //   "role":"ADMIN",
      //   "gender":"F"
      // },
      ,
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization':'Token '+this.data.token_
      },
      success: function (res) {
        console.log(res.data);
        if (res.statusCode == 201) {
          //login succeed
          
            //缓存
            // wx.setStorage({
            //   key: "username",
            //   data: res.data.username
            // });
            wx.showToast({
              title: "添加成功",
              icon: 'success',
              duration: 2000,
              success: function () {
                setTimeout(function () {
                  // wx.navigateTo({
                  //   url:"../../admin/manageNurse/manageNurse?db_ID="+that.data.admin_db_ID+"&staffID="+that.data.admin_staff_ID
                  // })
                  wx.navigateBack()
                }, 2000)
              }
            })
          
        }
        else{
          if(res.statusCode==400){
            // 格式错误
            let return_info=res.data
            var keyMap = {
              "start_time": "开始时间",
              "end_time": "结束时间",
              "drug": "药物名称",
              "dose": "药物剂量",
              "equipments": "器材",
              "patient_query_id":"患者住院号",
              "performer_query_id":"执行护士工作证号",
              "vein": "静脉",
              "tips": "注意事项",
            };
            var hint=''
          
          
                  var obj = return_info;
                  for(var key in obj){
                    var newKey = keyMap[key];
                    if(newKey){
                      obj[newKey] = obj[key];
                      hint=hint+newKey+':'+obj[newKey]+';'
                      delete obj[key];
                      }
                    }
          
          console.log(hint)
          console.log(obj)
            wx.showToast({
              title: hint,
              icon: 'none',
              duration: 5000,
            })
          }
          
        }
 
      }
    })
  }
})