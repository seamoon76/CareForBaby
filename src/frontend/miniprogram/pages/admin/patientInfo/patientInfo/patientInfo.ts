// pages/patientInfo/patientInfo.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token_:"123",
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
      //   pagePath: "/pages/admin/manageInfusions/index/index",
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
    // 读数据
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
    this.data.token_=wx.getStorageSync('token');
    // wx.request({
    //   url: "http://127.0.0.1:8000/patients/",
    //   method: "GET",
    //   header: {
    //     'content-type': 'application/json', // 默认值
    //     'Authorization':'Token '+this.data.token_
    //   },
    //   success: function (res) {
    //     if (res.statusCode == 201 || res.statusCode == 200) {
    //       //get succeed
    //       console.log(res.data)
    //       that.setData({
    //         patientArray: res.data
    //       })
    //     }
    //     else {
    //       wx.showToast({
    //         title: res.data.msg,
    //         icon: 'none',
    //         duration: 2000,
    //       })
    //     }
    //   }
    // })
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
      url: that.data.host_+"patients/api/patients",
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
  onTapGoToPatientDetailedInfo(event) {
    let id_to_quiry = Number(event.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../patientDetailedInfo/patientDetailedInfo?&quiryId=' + id_to_quiry,
    })
  },
  onTapGoToPatientDetailedInfoRevised(event) {
    let id_to_quiry = Number(event.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../patientDetailedInfoRevised/patientDetailedInfoRevised?&quiryId=' + id_to_quiry,
    })
  },
  onTapGoToAddPatient() {
    console.log("1")
    wx.navigateTo({
      url: '../addAPatient/addAPatient',
    })
  },
  onTapGoToDelete(event) {
    let id_to_delete = Number(event.currentTarget.dataset.id)
    let that = this
    wx.showModal({
      title: '提示',
      content: '确定删除该患者？',
      success(res) {
        // 用户点击确定
        if(res.confirm){
          wx.request({
            url: that.data.host_+"patients/api/patients/" + id_to_delete,
            method: "DELETE",
            header: {
              'content-type': 'application/json', // 默认值
              'Authorization':'Token '+that.data.token_
            },
            success: function(res){
              // console.log(res.statusCode)
              if (res.statusCode == 204) {
                //刷新页面
                that.onShow()
              }
              else {
                wx.showToast({
                  title: res.data.detail,
                  icon: 'none',
                  duration: 2000,
                })
              }
            }
          })
        }
      }
    })
  },
  onTapGoToMain(){
    // wx.navigateTo({
    //   url: "../../main/main"
    // })
    wx.navigateBack()
  }
})