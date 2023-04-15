// pages/patientDetailedInfoRevised/patientDetailedInfoRevised.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token_: "123",
    patient_db_id:"12",
    patientInfo: {
      name: "张三",
      age: "1",
      parents: "张大三",
      relation: "父女",
      phone: "138299293877",
      bedID: "102",
      roomID: "922",
      patient_id: "3487457",
      gender: "男",
      foot: "/static/foot_example.jpg",
      complications: "",
      tips: "",
      disease:'',
      infused_veins:''
    },
    IDRule: [{
      required: true
    }, {
      type: 'number',
      min: 1,
      max: 150,
      message: "住院号长度应在1-150位之间"
    }],
    creditRule: [{
      required: true
    }, {
      type: 'number',
      len: 18,
      message: "身份证号无效"
    }],
    phoneRule: [{
      required: true
    },
    {
      type: 'number',
      len: 11,
      message: "手机号无效"
    }
    ],
    host_:'https://se.maqi.site:8001/',
    gender: [{
      id: 0,
      value: '男',
      content:'M'
    }, {
      id: 1,
      value: '女',
      content:'F'
    }],
    gender_index:0,
    file_urls:[]
  },
  radioChange: function (e) {
    const sex = this.data.gender
    for (let i = 0, len = sex.length; i < len; ++i) {
      sex[i].checked = sex[i].id == e.detail.value
    }
    this.setData({
      gender:sex
    })
    let chosen_gender = 1;
    this.data.gender.map((item, index) => {
      if (item.checked) {
        chosen_gender = item.id;
      }
    })
    this.setData({
      gender_index:chosen_gender
    })
    console.log('choose gender:');
    console.log(chosen_gender);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(option) {
    let that = this
    this.data.token_ = wx.getStorageSync('token');
    this.setData({
      patient_db_id:option.quiryId
    }, function() {
      // this is setData callback
    });
    var app = getApp()
    if(app.globalData.localDebug)
    {
      that.setData({
        host_:'http://127.0.0.1:8000/'
      })
    }
    wx.request({
      url: that.data.host_+"patients/api/patients/" + option.quiryId,
      method: "GET",
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': 'Token ' + this.data.token_
      },
      success: function (res) {
        if (res.statusCode == 201 || res.statusCode == 200) {
          //login succeed
          console.log(res.data)
          let tmp_foot_image=that.data.patientInfo.foot
          if(res.data.foot!==''&&res.data.foot!==null&&res.data.foot!=='aa'){
            tmp_foot_image= res.data.foot
          };
          let gender_index_here='0'
          const sex = that.data.gender
    
          if(res.data.gender=='F')
          {
            gender_index_here='1',
            sex[1].checked=true
          }
          else{
            sex[0].checked=true
          }
          //let jsonObject = JSON.parse(res.data);
          that.setData({
            patientInfo: {
              name: res.data.name,
              age: res.data.age,
              parents: res.data.parents,
              relation: res.data.relation,
              phone: res.data.phone,
              bedID: res.data.bedID,
              roomID: res.data.roomID,
              patient_id: res.data.patient_id,
              gender: res.data.gender,
              foot: tmp_foot_image,
              complications: res.data.complications,
              tips: res.data.tips,
              disease:res.data.disease,
              infused_veins:res.data.infused_veins
            },
            gender_index:gender_index_here,
            gender:sex
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
  formSubmit: function(e){
    let that=this
    // 生成随机字符串
    // https://juejin.cn/post/6953833031421394980
    const generateString = length => Array(length).fill('').map((v) => Math.random().toString(36).charAt(2)).join('');

    var formData={"name": e.detail.value.name,
    "age": e.detail.value.age,
    "parents": e.detail.value.parents,
    "relation": e.detail.value.relation,
    "phone": e.detail.value.phone,
    "bedID": e.detail.value.bedID,
    "roomID": e.detail.value.roomID,
    "patient_id": e.detail.value.patient_id,
    "disease":e.detail.value.disease,
    "infused_veins":e.detail.value.infused_veins,
    "gender": that.data.gender[that.data.gender_index].content,
    "foot": that.data.patientInfo.foot,
    "complications": "",
    "tips": e.detail.value.tips,}

      if (false) {
        /*若有图*/
        wx.uploadFile({
          url: that.data.host_+"patients/api/patients/" + this.data.patient_db_id,
          // method: "PUT",
          filePath: this.data.file_urls[0],
          name: 'foot',
          formData: formData,
          header: {
            'Authorization':'Token '+that.data.token_
          },
          success: function(res){
            if(res.statusCode == 201){
              
                wx.showToast({
                  title: "添加成功",
                  icon: 'success',
                  duration: 2000,
                  success: function () {
                    setTimeout(function () {
                      wx.navigateBack()
                    }, 2000)
                  }
                })
              
            }
            else {
              console.log(res.data)
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000,
              })
            }
          }
        })
      }
      else {
        /*若无图*/
        wx.request({
          url: that.data.host_+"patients/api/patients/" + this.data.patient_db_id,
          method: "PUT",
          data: formData, 
          header: {
            'content-type': 'application/json', // 默认值
            'Authorization':'Token '+this.data.token_
          },
          success: function(res){
            if(res.statusCode == 201||res.statusCode == 200){
              
                wx.showToast({
                  title: "修改成功",
                  icon: 'success',
                  duration: 2000,
                  success: function () {
                    setTimeout(function () {
                      wx.navigateBack({
                        delta: 1  // 返回上一级页面。
                      })
                      // var pages = getCurrentPages()
                      // pages[pages.length-2].onLoad()
                      // wx.navigateBack({
                      //   delta: 1  // 返回上一级页面。
                      // })
                    }, 2000)
                  }
                })
              
            }
            else if(res.statusCode==400){
              // 格式错误
              let return_info=res.data
              var keyMap = {
                "name": "姓名",
    "age": "年龄",
    "parents": "监护人",
    "relation": "关系",
    "phone": "手机号",
    "bedID": "床号",
    "roomID":"房间号",
    "patient_id": "住院号",
    "disease":"病症",
    "infused_veins":"已注射静脉",
    "gender": "性别",
    "foot": "脚纹",
    "complications": "历史记录",
    "tips": "注意事项"
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
            else {
              console.log(res.data)
              console.log(res.statusCode)
              wx.showToast({
                title: '修改失败，请检查输入',
                icon: 'none',
                duration: 2000,
              })
            }
          }
        })
      }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },
  onChangeImagePickerTap(e){
    //let img_urls=e.detail.current;
    this.setData({
      file_urls:e.detail.current
    })
    console.log(this.data.file_urls)
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
  onTapGoToPatientInfo() {
    wx.navigateBack({
      delta: 1  // 返回上一级页面。
    })
  },
  onTapGoToInspection() {
    let id_to_quiry = Number(this.data.patient_db_id)
    wx.navigateTo({
      url: "../inspections/inspections?&quiry_id=" + id_to_quiry
    })
  }
})