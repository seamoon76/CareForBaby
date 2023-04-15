// pages/admin/manageNurse/manageNurse.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    staffID:"123445678",
    db_ID:"12345678",
    token_:"",
    _options:{},
    NurseArray:[{
      id:3,
      staff_id:"12345678",
      email:"test@mail.edu.cn",
      name:"test user",
      department:"妇幼科",
      role:"NURSE",
      gender:"F"
    },
    {
      id:4,
      staff_id:"12345678",
    email:"test@mail.edu.cn",
    name:"test user",
    department:"妇幼科",
    role:"NURSE",
    gender:"F"},
    {
      id:5,
      staff_id:"12345678",
    email:"test@mail.edu.cn",
    name:"test user",
    department:"妇幼科",
    role:"NURSE",
    gender:"F"}],
    list: [
      {
        pagePath: "/pages/admin/main/main",
        text: "工作主页",
        iconPath:"/static/bar-home.png",
        selectedIconPath: "/static/bar-home.png"
      },
      {
        pagePath: "/pages/admin/manageInfusions/index/index",
        text: "输液记录",
        iconPath:"/static/bar-record.png",
        selectedIconPath: "/static/bar-record.png"
      },
      // {
      //   pagePath: "/pages/manageInfusions/index/index",
      //   text: "动态",
      //   iconPath:"/static/bar-news.png",
      //   selectedIconPath: "/static/bar-news.png",
      // },
      {
        pagePath: "/pages/admin/selfInfo/selfInfo",
        text: "我的",
        iconPath:"/static/bar-profile.png",
        selectedIconPath: "/static/bar-profile.png"
      }
    ],
    host_:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    let that=this
    this.data.db_ID=wx.getStorageSync('g_admin_db_ID');
    this.data.staffID=wx.getStorageSync('g_admin_staff_ID');
    this.data.token_=wx.getStorageSync('token');
    console.log(this.data.db_ID)
    console.log(this.data.staffID)
    console.log('Token '+that.data.token_)
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
      // url: 'https://se.maqi.site:8001/users/api',
      url: that.data.host_+'users/api/users',
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
          //get succeed
            console.log(res.data)
            that.setData({
              NurseArray:res.data
            })
        }
        else{
          wx.showToast({
            title: "参数错误",
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

  onTapGoToNurseDetailedInfo(event){
    let id_to_quiry=Number(event.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../nurseDetaildInfo/nurseDetaildInfo?quiryId='+id_to_quiry,
    })
  },
  onTapGoToNurseDetailedInfoRevised(event){
    let id_to_quiry=Number(event.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../nurseDetaildInfoRevised/nurseDetaildInfoRevised'+"?id_to_check="+id_to_quiry,
    })
  },
  onTapGoToAddNurse(event){

    wx.navigateTo({
      url: '../addANurse/addANurse',
    })
  },
  onTapGoToMain(){
    wx.navigateBack()
    // wx.navigateTo({
    //   url: '../main/main?db_ID='+this.data.db_ID+"&staffID="+this.data.staffID,
    // })
  },
  onTapGoToDeleteNurse(event){
    let id_to_delete=Number(event.currentTarget.dataset.id)
    let that=this
    wx.showModal({
      title: '提示',
      content: '确定删除该护士？',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        
    wx.request({
      // url: 'https://se.maqi.site:8001/users/api',
      url: that.data.host_+'users/api/users/'+id_to_delete,
      method:"DELETE",
      data: 
      {
        "id":id_to_delete
      },
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization':'Token '+that.data.token_
      },
      success: function (res) {
        console.log(res.data);
        if (res.statusCode == 204) {
          //get succeed
            console.log("delete succeed")
            that.onShow()
            // that.onLoad()
            //that.data.NurseArray.filter(item => item.id !== id_to_delete);
        }
        else{
          wx.showToast({
            title: res.data.detail,
            icon: 'none',
            duration: 2000,
          })
        }
      }
      })
      } else if (res.cancel) {
      return
      }
    }
    })
  }
})