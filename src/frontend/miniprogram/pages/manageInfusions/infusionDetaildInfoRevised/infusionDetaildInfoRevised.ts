// pages/manageInfusions/infusionDetaildInfoRevised/infusionDetaildInfoRevised.ts
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
      equipments: '',
      vein: "头皮静脉",
      tips: "无",
      performer_db_id:1,
      nurse_id:"2"
    },
    patient_info: {
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
    host_:''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(option) {
    this.data.db_ID=wx.getStorageSync('g_db_ID');
    this.data.token_=wx.getStorageSync('token');
    this.setData({
      infusion_ID: option.quiryId,
    }, function() {
      // this is setData callback
    });
    
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
    console.log('Token '+this.data.token_);
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
              db_ID: res.data.id,
              infusion_info:{
                id:res.data.id,
                start_time: res.data.start_time,
                end_time: res.data.end_time,
                patient_db_id:res.data.patient,
                patient_id:res.data.patient_query_id,
                drug: res.data.drug,
                dose: res.data.dose,
                equipments: res.data.equipments,
                vein: res.data.vein,
                tips: res.data.tips,
                performer_db_id:res.data.performer,
                nurse_id:res.data.performer_query_id
              }
            });
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
                      creditID: res.data.creditID,
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
                    title: res.data.msg,
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
  onTapFinish(){
    if(this.data.infusion_info.end_time==''||this.data.infusion_info.end_time==null)
    {
      let inf=this.data.infusion_info
      inf['end_time']=this.getNowDate()
      this.setData({
        infusion_info:inf
      })
      this.onShow()
    }
  },
  onTapCancel(){
    wx.navigateBack()
  },
  formSubmit: function (e) {
    let that=this
    console.log(e.detail.value);
    let dic=e.detail.value.equipments
    console.log(this.data.infusion_info)
    wx.request({
      url: that.data.host_+'infusions/api/infusions/'+this.data.infusion_ID,
      method:"PUT",
			// header: {'content-type': 'application/x-www-form-urlencoded'},
      //url: app.globalData.url.login,
      data:
      {
        start_time: e.detail.value.start_time,
        end_time: e.detail.value.end_time,
        drug: e.detail.value.drug,
        dose: e.detail.value.dose,
        equipments:dic,
        vein: e.detail.value.vein,
        tips: e.detail.value.tips,
        performer_query_id:e.detail.value.performer_query_id,
        patient_query_id:that.data.infusion_info.patient_id,
      },
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
            //缓存
            // wx.setStorage({
            //   key: "username",
            //   data: res.data.username
            // });
            wx.showToast({
              title: "修改成功",
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
        }
        else if(res.statusCode==400){
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
        else{
          wx.showToast({
            title: '请求失败',
            icon: 'none',
            duration: 5000,
          })
        }

 
      }
    })
  }
})