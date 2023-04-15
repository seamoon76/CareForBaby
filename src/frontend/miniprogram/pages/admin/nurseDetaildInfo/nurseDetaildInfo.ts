// pages/admin/nurseDetaildInfo/nurseDetaildInfo.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    admin_staff_ID:"123445678",
    admin_db_ID:"134",
    db_ID:"12345678",
    token_:"",
    nurse_info:{
      staff_id:"12345678",
      email:"test@mail.edu.cn",
      name:"test user",
      department:"妇幼科",
      role:"ADMIN",
      gender:"F"
    },
    host_:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(option) {
    let that=this
    this.setData({
      db_ID:option.quiryId
    }, function() {
      // this is setData callback
    });
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
    this.data.admin_db_ID=wx.getStorageSync('g_admin_db_ID');
    this.data.admin_staff_ID=wx.getStorageSync('g_admin_staff_ID');
    this.data.token_=wx.getStorageSync('token');
    console.log(this.data.admin_db_ID)
    console.log(this.data.admin_staff_ID)
    console.log('Token '+that.data.token_)
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
      url: that.data.host_+'users/api/users/'+this.data.db_ID,
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
              db_ID: res.data.id,
              nurse_info:{
                staff_id:res.data.staff_id,
                email:res.data.email,
                name:res.data.name,
                department:res.data.department,
                role:res.data.role,
                gender:res.data.gender
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

  /**
   * 返回管理员工作主页
   */
  onTapGoToMain(){
    wx.navigateBack()
  //   wx.navigateTo({
  //   url: '../manageNurse/manageNurse?staffID='+this.data.admin_staff_ID+"&db_ID="+this.data.admin_db_ID,
  // })
  },

  /**
   *  跳转到修改护士个人信息
   */
  onTapGoToModify(){
    wx.navigateTo({
      url: '../nurseDetaildInfoRevised/nurseDetaildInfoRevised?id_to_check='+this.data.db_ID,
    })
  }
})