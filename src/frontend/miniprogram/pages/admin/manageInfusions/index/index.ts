// pages/admin/manageNurse/manageNurse.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    staffID: "123445678",
    db_ID: "12345678",
    token_: "",
    _options: {},
    InfusionsArray: [{
      id: 3,
      start_time: "2022-11-10 17:11:45",
      end_time: "2022-11-10 17:19:45",
      performer_query_id: "2",
      patient_query_id: "10",
      drug: "青霉素",
      dose: "2",
      equipments: {},
      vein: "头皮静脉",
      tips: "无",
    },],
    list: [
      {
        pagePath: "/pages/admin/main/main",
        text: "工作主页",
        iconPath: "/static/bar-home.png",
        selectedIconPath: "/static/bar-home.png"
      },
      {
        pagePath: "/pages/admin/manageInfusions/index/index",
        text: "输液记录",
        iconPath: "/static/bar-record.png",
        selectedIconPath: "/static/bar-record.png"
      },
      // {
      //   pagePath: "/pages/admin/manageInfusions/index/index",
      //   text: "动态",
      //   iconPath: "/static/bar-news.png",
      //   selectedIconPath: "/static/bar-news.png",
      // },
      {
        pagePath: "/pages/admin/selfInfo/selfInfo",
        text: "我的",
        iconPath: "/static/bar-profile.png",
        selectedIconPath: "/static/bar-profile.png"
      }
    ],
    order_index: 0,

    OrderArray:[{
      id:0,
      key:"updated_at",
      text:"更新时间（升序）"
    },
    {
      id:1,
      key:"end_time",
      text:"结束时间（升序）",},
    {
      id:2,
      text:"开始时间（升序）",
      key:"start_time"
      ,},
      {
        id:3,
        key:"-updated_at",
        text:"更新时间（降序）"
      },
      {
        id:4,
        key:"-end_time",
        text:"结束时间（降序）",},
      {
        id:5,
        text:"开始时间（降序）",
        key:"-start_time"
        ,}],
        search_index: 0,

    SearchArray:[{
      id:0,
      key:"all",
      text:"全部"
    },{
      id:1,
      key:"end_time==''",
      text:"未结束"
    },
    {
      id:2,
      key:"end_time!=''",
      text:"已结束",},
    ],
        host_:'',
        patient_map:{}
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    let that = this
    this.data.db_ID = wx.getStorageSync('g_db_ID');
    this.data.staffID = wx.getStorageSync('g_staff_ID');
    this.data.token_ = wx.getStorageSync('token');
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
          let map_={}
          const plist=res.data.patients
          for(let i=0;i<plist.length;i++)
          {
            map_[plist[i].patient_id]=plist[i].name
          }
          that.setData({
            patient_map: map_
          })
          console.log(map_)
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

  onTapGoToCalculate: function(e) {
    var page = e.currentTarget.dataset.page;
    console.log(e)
    wx.navigateTo({
        url: '../line/line',
        success:
      function(res) {console.log("jump to share")},
      fail:
      function(res) {
      wx.showToast({
        title: "参数错误",
        icon: 'erro',
        duration: 2000,
      })
      console.log(res)
    }
    });
},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let that = this
    let order_key=that.data.OrderArray[that.data.order_index].key
    
    wx.request({
      url: that.data.host_+'infusions/api/infusions?ordering='+order_key,
      //url: 'http://127.0.0.1:8000/infusions/api/infusions',
      method: "GET",
      data:
      {
      },

      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': 'Token ' + this.data.token_
      },
      success: function (res) {
        console.log(res.data);
        if (res.statusCode == 201 || res.statusCode == 200) {
          //get succeed
          console.log(res.data)
          let InfusionsArray_=res.data.InfusionEntries
          if(that.data.search_index==1)
          {
            //未完成
            InfusionsArray_=InfusionsArray_.filter(item=> (item.end_time === ''||item.end_time === null))
              
            }
            else if(that.data.search_index==2)
            {
              // 已完成
              InfusionsArray_=InfusionsArray_.filter(item=> (item.end_time !== ''&&item.end_time !== null))
            }
            that.setData({
              InfusionsArray:InfusionsArray_
            })
            //console.log(InfusionsArray_)
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

  onTapGoToInfusionDetailedInfo(event) {
    let id_to_quiry = Number(event.currentTarget.dataset.id)
    console.log("infusion id to query" + id_to_quiry)
    wx.navigateTo({
      url: '../infusionDetaildInfo/infusionDetaildInfo?quiryId=' + id_to_quiry,
    })
  },
  onTapGoToInfusionDetailedInfoRevised(event) {
    let id_to_quiry = Number(event.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../infusionDetaildInfoRevised/infusionDetaildInfoRevised?quiryId=' + id_to_quiry,
    })
  },
  onTapGoToAddInfusion(event) {

    wx.navigateTo({
      url: '../addInfusions/addInfusions',
    })
  },
  onTapGoToMain() {
    wx.navigateBack()
    // wx.navigateTo({
    //   url: '../main/main?db_ID='+this.data.db_ID+"&staffID="+this.data.staffID,
    // })
  },
  onTapGoToInfusionShare(event){
    let id_to_share = Number(event.currentTarget.dataset.id)
    let that = this
    wx.navigateTo({
      url:'../share/share?infusion_db_id='+id_to_share,
      success:
      function(res) {console.log("jump to share")},
      fail:
      function(res) {
      wx.showToast({
        title: "参数错误",
        icon: 'erro',
        duration: 2000,
      })
      console.log(res)
    }
    })
  },
  getDate(e){
    console.log(e.detail.id)
    console.log(e.detail.text)
    this.setData({
      order_index:e.detail.id,
    })
    this.onShow()
  },
  getSearchData(e){
    console.log(e.detail.id)
    console.log(e.detail.text)
    this.setData({
      search_index:e.detail.id,
    })
    this.onShow()
  },
  onTapGoToSort(){
    this.onShow()
  },
  onTapGoToFilter(){

    this.onShow()
  },
  onTapGoToDeleteInfusion(event) {
    let id_to_delete = Number(event.currentTarget.dataset.id)
    let that = this
    wx.showModal({
      title: '提示',
      content: '确定删除该输液记录？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')

          wx.request({
            // url: 'https://se.maqi.site:8001/users/api',
            url: that.data.host_+'infusions/api/infusions/' + id_to_delete,
            method: "DELETE",
            data:
            {
              "id": id_to_delete
            },
            header: {
              'content-type': 'application/json', // 默认值
              'Authorization': 'Token ' + that.data.token_
            },
            success: function (res) {
              console.log(res.data);
              if (res.statusCode == 204) {
                //get succeed
                console.log("delete succeed")
                that.onShow()
                //that.data.NurseArray.filter(item => item.id !== id_to_delete);
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
        } else if (res.cancel) {
          return
        }
      }
    })
  }
})