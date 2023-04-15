// pages/inspection/selectPatients/selectPatients.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token_: "123",
    db_ID: "134",
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
        pagePath: "/pages/main/main",
        text: "工作主页",
        iconPath: "/static/bar-home.png",
        selectedIconPath: "/static/bar-home.png"
      },
      {
        pagePath: "/pages/manageInfusions/index/index",
        text: "输液记录",
        iconPath: "/static/bar-record.png",
        selectedIconPath: "/static/bar-record.png"
      },
      // {
      //   pagePath: "/pages/manageInfusions/index/index",
      //   text: "动态",
      //   iconPath: "/static/bar-news.png",
      //   selectedIconPath: "/static/bar-news.png",
      // },
      {
        pagePath: "/pages/selfInfo/selfInfo",
        text: "我的",
        iconPath: "/static/bar-profile.png",
        selectedIconPath: "/static/bar-profile.png"
      }
    ],
    chosenPatientID: [],
    chosenPatientName: [],
    host_:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.data.token_ = wx.getStorageSync('token');
    this.data.db_ID = wx.getStorageSync('g_db_ID');
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
      url: that.data.host_+"patients/api/patients",
      method: "GET",
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': 'Token ' + this.data.token_
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
  onTapSubmitTogether() {
    let that = this
    var flag = 1
    var patientName = ""
    for(let i of that.data.chosenPatientName){
      patientName += i
      patientName += '\r\n'
    }
    wx.showModal({
      title: '提示',
      content: '确定以下患者一切正常?\r\n' + patientName,
      success(res) {
        // 用户点击确定
        if (res.confirm) {
          // console.log(that.data.chosenPatient)
          // console.log(that.data.db_ID)
          for (let i of that.data.chosenPatientID) {
            wx.request({
              url: "https://se.maqi.site:8001/patients/api/inspections",
              method: "POST",
              header: {
                'content-type': 'application/json', // 默认值
                'Authorization': 'Token ' + that.data.token_
              },
              data: {
                "patient": i,
                "nurse": that.data.db_ID,
                "complications": "正常",
                "tips": "无"
              },
              success: function (res) {
                if (res.statusCode == 201) { }
                else {
                  flag = 0
                  wx.showToast({
                    title: res.data.detail,
                    icon: 'none',
                    duration: 2000,
                  })
                }
              }
            })
          }
          if (flag == 1) {
            wx.showToast({
              title: "一键提交成功",
              icon: 'success',
              duration: 2000,
              success: function () {
                setTimeout(function () {
                }, 2000)
              }
            })
          }
        }
      }
    })
  },
  onTapReturn() {
    wx.navigateBack()
  },
  onTapToWriteDetail(event) {
    let id_to_quiry = Number(event.currentTarget.dataset.id)
    wx.navigateTo({
      url: "../writeDetailInspection/writeDetailInspection?&quiryId=" + id_to_quiry
    })
  },
  handleItemChange(e) {
    var item = e.detail.value
    var selectid = []; //选中的id
    var selectname = []; //选中的name
    for (var i = 0; i < item.length; i++) {
      var selectrow = item[i].split(",") //数组以逗号分割
      selectid = selectid.concat(selectrow[0]) //第一个为id
      selectname = selectname.concat(selectrow[1]) //第二个为name
    }
    this.setData({
      chosenPatientID: selectid,
      chosenPatientName: selectname
    })
  }
})