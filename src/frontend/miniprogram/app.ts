// app.ts
App<IAppOption>({
  globalData: {
    localDebug:false, // 设置为TRUE时，访问的URL将变为http://127.0.0.1:8000
    localUrl:'http://127.0.0.1:8000/',
    serverUrl:'https://se.maqi.site:8001/',
    // appid:"wxdbfa43410e90e3e1",
    // appsecret:"58e0acd54570bc752371239dc10019bf",
    // access_token:""


  },

  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // wx.request({
    //   url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+this.globalData.appid+'&secret='+this.globalData.appsecret,
    //   method:"GET",
    //   success:function(res){
    //     this.setData({
    //       access_token:res.data.access_token
    //     })
    //   }
    // })
    // 登录
    // wx.login({
    //   success: res => {
    //     console.log(res.code)
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   },
    // })
    //client_credential
  },
})