// pages/addAPatient/addAPatient.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
      token_:"123",
      foot_image: "",
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
      host_:'',
      gender: [{
        id: 1,
        value: '男',
        content:'M'
      }, {
        id: 2,
        value: '女',
        content:'F'
      }],
      gender_index:1,
      file_urls:[],
      server_save_filename:'',
      has_error:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.data.token_=wx.getStorageSync('token');
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
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  onChangeImagePickerTap(e){
    //let img_urls=e.detail.current;
    let that=this
    // this.setData({
    //   file_urls:e.detail.current
    // })
    // console.log(that.data.file_urls)
    if (e.detail.current[0]) {
        console.log(e.detail.current[0]);
        
      /*若有图*/
      wx.uploadFile({
        url: 'https://se.maqi.site:8003/upload',
        filePath: e.detail.current[0],
        name: 'foot',
        success: function(res){
          if(res.statusCode == 200){
            
              wx.showToast({
                title: "添加成功",
                icon: 'success',
                duration: 2000,
                success: function (res) {
                  console.log(res)
                  let new_filename_arr=String(e.detail.current[0]).split('/')
                  let new_filename=new_filename_arr[new_filename_arr.length-1]
                  new_filename='http://se.maqi.site/save/'+new_filename
                  that.setData({
                    server_save_filename:new_filename
                  })
                  console.log(new_filename)
                }
              })
            
          }
        }
      })
    }
    // if(e.detail.current[0]){
    // let size = e.detail.current[0].size
    //     if (size <= 1000000) {
    //       that.setData({
    //         file_urls:e.detail.current
    //       })
    //       console.log(that.data.file_urls)
    //     }else{
    //       wx.showToast({
    //         title:'上传图片不能大于1M!',
    //         icon:'none'    
    //       })
    //     }
    //   }
  },
  onImgOverSize(e)
  {
    console.log(11);
    
    if(e.detail.oversize.length!==0){
      wx.showToast({
        title:'上传图片不能大于1M!',
        icon:'none'    
      })
    }
  },
  chooseImage(e){
    // 废弃
    let that=this
    

    let up_url=that.data.host_+'upload'
    wx.chooseImage({
    count: 1,
    sizeType: ['original', 'compressed'], 
    sourceType: ['album', 'camera'], 
    success: function (res) {
        let file = res.tempFilePaths[0]
        // var app = getApp()
        // let a=app.globalData.access_token
        // wx.request({
        //   method:'POST',
        //   url:'https://api.weixin.qq.com/wxa/img_sec_check?access_token='+a,
        //   data:{
        //     media:file
        //   }
        // })
        wx.uploadFile({  
	      url: up_url,  
	      name: 'foot_image'+generateString(8),//随机字符串，要保证不和别人冲突
        filePath: file,
        header: {
          'Authorization':'Token '+this.data.token_
        },
        formData: { // HTTP 请求中其他额外的 form data
          
        },
	      success: function(result){  
	        console.log(result);
	      },  
	      fail: function(){  
          console.log("error");
	        return 
	      }  
	    })  
    },
    fail: function (res) {}
})
  },

  onTapGoToPatientInfo(){
    wx.navigateBack({
      delta: 1
    })
  },
  handleError(e){
    console.log(e)
    if(e.detail.isError)
    {
      this.setData({
        has_error:true
      })

    }
    else{
      this.setData({
        has_error:false
      })
    }

  },
  formSubmit: function(e){
    let that=this
    if(that.data.has_error)
    {
      wx.showToast({
        title: '存在格式错误，请检查输入',
        icon: 'none',
        duration: 2000,
      })
      return
    }
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
    "gender": that.data.gender[that.data.gender_index-1].content,
    "foot": that.data.server_save_filename,
    "complications": "",
    "tips": e.detail.value.tips,}

      if (false) {
        
        /*若有图*/
        wx.uploadFile({
          url: that.data.host_+"patients/api/patients",
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
          url: that.data.host_+"patients/api/patients",
          data: formData, 
          method: 'POST',
          header: {
            'content-type': 'application/json', // 默认值
            'Authorization':'Token '+this.data.token_
          },
          success: function(res){
            if(res.statusCode == 201||res.statusCode == 200){
              
                wx.showToast({
                  title: "添加成功",
                  icon: 'success',
                  duration: 2000,
                  success: function () {
                    setTimeout(function () {
                      wx.navigateBack()
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
              wx.showToast({
                title: '添加失败',
                icon: 'none',
                duration: 2000,
              })
            }
          }
        })
      }

    // wx.request({
    //   url: that.data.host_+"patients/api/patients",
    //   method: "POST",
    //   header: {
    //     'content-type': 'application/json', // 默认值
    //     'Authorization':'Token '+this.data.token_
    //   },
    //   data: {
    //     "name": e.detail.value.name,
    //     "age": e.detail.value.age,
    //     "parents": e.detail.value.parents,
    //     "relation": e.detail.value.relation,
    //     "phone": e.detail.value.phone,
    //     "bedID": e.detail.value.bedID,
    //     "roomID": e.detail.value.roomID,
    //     "patient_id": e.detail.value.patient_id,
    //     "disease":e.detail.value.disease,
    //     "infused_veins":e.detail.value.infused_veins,
    //     "gender": that.data.gender[that.data.gender_index-1].content,
    //     "foot": "aa",
    //     "complications": "",
    //     "tips": e.detail.value.tips,
    //   },
    //   success: function(res){
    //     if(res.statusCode == 201){
          
    //         wx.showToast({
    //           title: "添加成功",
    //           icon: 'success',
    //           duration: 2000,
    //           success: function () {
    //             setTimeout(function () {
    //               wx.navigateBack()
    //               // var pages = getCurrentPages()
    //               // pages[pages.length-2].onLoad()
    //               // wx.navigateBack({
    //               //   delta: 1  // 返回上一级页面。
    //               // })
    //             }, 2000)
    //           }
    //         })
          
    //     }
    //     else {
    //       console.log(res.data)
    //       wx.showToast({
    //         title: res.data.msg,
    //         icon: 'none',
    //         duration: 2000,
    //       })
    //     }
    //   }
    // })
  }
})