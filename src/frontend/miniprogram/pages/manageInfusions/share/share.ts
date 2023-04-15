// pages/manageInfusions/share/share.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    db_ID:"12",//当前执行操作的护士
    token_: "123",
    infusion_db_id: 1,//要转发的输液id
   
    // nurse_list: ["青霉素", "药物2", "药物3", "手动输入"],
    nurse_index: 0,

    NurseArray:[{
      id:3,
      staff_id:"12345678",
      text:"test user",

    },
    {
      id:4,
      staff_id:"12345678",
      text:"test user",},
    {
      id:5,
      staff_id:"12345678",
      text:"test user",}],
      host_:''
  },

  getDate(e){
    console.log(e.detail.id)
    console.log(e.detail.text)
    this.setData({
      nurse_index:e.detail.id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(option) {
    console.log(11)
    this.setData({
      db_ID:wx.getStorageSync('g_db_ID'),
      token_:wx.getStorageSync('token'),
      infusion_db_id:option.infusion_db_id
    })
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
    wx.request({
      // url: 'https://se.maqi.site:8001/users/api',
      url: that.data.host_+'users/api/users',
      method:"GET",
      data: 
      {
      },
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization':'Token '+that.data.token_
      },
      success: function (res) {
        console.log(res.data);
        if (res.statusCode == 201 || res.statusCode == 200) {
          //get succeed
          let nurse_list=res.data
          for(let i=0;i<nurse_list.length;i++)
          {
            nurse_list[i]["text"]=nurse_list[i]["name"]
          }
          nurse_list=nurse_list.filter(item=> (item.role === 'NURSE'))
            that.setData({
              NurseArray:nurse_list
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

  onTapCancel(){
    wx.navigateBack()
  },
  onConfirmShare(){
    let that=this
    wx.request({
      url: that.data.host_+'infusions/api/share',
      method:"POST",
      data: 
      {
        infusion_db_id:that.data.infusion_db_id,
        nurse_target_id:that.data.NurseArray[that.data.nurse_index].id,
      },
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization':'Token '+that.data.token_
      },
      success: function (res) {
        console.log(res.data);
        if (res.statusCode == 201 || res.statusCode == 200) {
          //share succeed
          wx.showToast({
            title: "转发成功",
            icon: 'success',
            duration: 500,
            success: function () {
              setTimeout(function () {
                wx.navigateBack()
              }, 2000)
            }
          })
        }
        else{
          wx.showToast({
            title: "转发失败",
            icon: 'erro',
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

  onTapGoToWechatBand(){
    let that=this
    let appid="wxdbfa43410e90e3e1"
    let appsecret="58e0acd54570bc752371239dc10019bf"
    let url_raw="https://api.weixin.qq.com/sns/jscode2session"
    wx.login({
      success (res) {
        if (res.code) {
          //发起网络请求
          let url = url_raw + "?appid=" + appid + "&secret=" + appsecret + "&js_code=" + res.code + "&grant_type=authorization_code"
          wx.request({
            url: url,
            method:"GET",
            success:function (res) {
                let nurse_info_new=that.data.nurse_info
                nurse_info_new['openid'] = res.data['openid']
                that.setData({
                  nurse_info:nurse_info_new
                })
                console.log(nurse_info_new)
                wx.request({
                  url: that.data.host_+'users/api/users/'+that.data.db_ID,
                  method:"PUT",
                  data:nurse_info_new,
                  header: {
                    'content-type': 'application/json', // 默认值
                    'Authorization':'Token '+that.data.token_
                  },
                  success: function (res) {
                    console.log(res.data);
                    if (res.statusCode == 200) {
                      //login succeed
                      if (res.data.error == true) {
                        wx.showToast({
                          title: res.data.msg,
                          icon: 'none',
                          duration: 2000,
                        })
                      } else {
                        wx.showToast({
                          title: "绑定成功",
                          icon: 'success',
                          duration: 2000
                        })
                      }
                    }
                  }
                })
              }
            })
          }
          else{
            wx.showToast({
              title:"绑定失败",
              icon: 'success',
              duration: 2000,
            })
          }
        }
    })
  },

  onTapGoToWechatBandCancel(){
    let nurse_info_new=this.data.nurse_info
    nurse_info_new['openid'] = ""
    this.setData({
      nurse_info:nurse_info_new
    })
    let that=this
    wx.request({
      url: that.data.host_+'users/api/users/'+this.data.db_ID,
      method:"PUT",
      data:nurse_info_new,
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization':'Token '+this.data.token_
      },
      success: function (res) {
        console.log(res.data);
        if (res.statusCode == 200) {
        //login succeed
        if (res.data.error == true) {
           wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000,
        })
        } else {
          wx.showToast({
            title: "解绑成功",
            icon: 'success',
            duration: 2000
          })
        }
     }  
  },
  })
  },
})