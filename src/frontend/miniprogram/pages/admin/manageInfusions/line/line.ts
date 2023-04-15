var wxCharts = require('../../../../utils/wxcharts');
var app = getApp();
var lineChart = null;
Page({
    data: {
      infusion_cal:{
        total:320,
        patient_num:11
      },
      erate:0.002,
      staffID: "123445678",
      db_ID: "12345678",
      token_: "",
      host_:'',
      InfusionsArray:[],

    },
    touchHandler: function (e) {
        console.log(lineChart.getCurrentDataIndex(e));
        lineChart.showToolTip(e, {
            // background: '#7cb5ec',
            format: function (item, category) {
                return category + ' ' + item.name + ':' + item.data 
            }
        });
    },    
    createSimulationData: function () {
        var categories = [];
        var data = [];
        for (var i = 0; i < 10; i++) {
            categories.push('2016-' + (i + 1));
            data.push(Math.random()*(20-10)+10);
        }
        // data[4] = null;
        return {
            categories: categories,
            data: data
        }
    },
    updateData: function () {
        var simulationData = this.createSimulationData();
        var series = [{
            name: '成交量1',
            data: simulationData.data,
            format: function (val, name) {
                return val.toFixed(2) + '万';
            }
        }];
        lineChart.updateData({
            categories: simulationData.categories,
            series: series
        });
    },
    getWeekDataList() {
      //根据日期获取本周周一~周日的年-月-日
      // https://blog.csdn.net/h__z__q/article/details/122110770
      var weekList = [];
      var date = new Date();
      //判断本日期是否为周日，获取本周一日期
      if(date.getDay()=="0"){
        date.setDate(date.getDate() -6);
      }else {
        date.setDate(date.getDate() - date.getDay() + 1);
      }
      var myDate=date.getDate();
      var myMonth=date.getMonth() + 1;
      if(date.getDate()<10){
        myDate= '0'+ myDate;
      }
      if(date.getMonth() + 1<10){
        myMonth='0'+myMonth;
      }
      weekList.push(date.getFullYear() + "-" + myMonth+ "-" + myDate);
      // 获取周二以后日期
      for(var i=0;i<6;i++) {
        date.setDate(date.getDate() + 1);
        myDate=date.getDate();
        myMonth=date.getMonth() + 1;
        if(date.getDate()<10){
          myDate= '0'+ myDate;
        }
        if(date.getMonth() + 1<10){
          myMonth='0'+myMonth;
        }
        weekList.push(date.getFullYear() + "-" + myMonth+ "-" +myDate);
      }
      console.log(weekList);
      return weekList
    },

    onLoad: function (e) {
      wx.showLoading({
        title: '加载中',
      });
        var windowWidth = 320;
        try {
            var res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth;
        } catch (e) {
            console.error('getSystemInfoSync failed!');
        }

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
      // 获取数据(已经在后端筛选，是一周内的数据)
      wx.request({
        url: that.data.host_+'infusions/api/infusions?now_time=1',
        method: "GET",
        data:
        {},
        header: {
          'content-type': 'application/json', // 默认值
          'Authorization': 'Token ' + that.data.token_
        },
        success: function (res) {
          console.log(res);
          
          if (res.statusCode == 201 || res.statusCode == 200) {
            try {
              let infusion_arr=res.data.InfusionEntries
              
              console.log(infusion_arr);

              let total_num=infusion_arr.length;
              let patient_dist={};
              let p_num=0;
              let weekList=that.getWeekDataList();
              let inf_times_list=Array(7).fill(0);
              for(let i=0;i<total_num;i++)
              {
                if(!(infusion_arr[i].patient in Object.keys(patient_dist)))
                {
                  patient_dist[infusion_arr[i].patient]=infusion_arr[i].patient;
                  p_num=p_num+1;
                }
                let ind = weekList.indexOf(infusion_arr[i].start_time.split(' ')[0])
                if(ind!==-1)
                {
                  inf_times_list[ind]+=1;
                }
              }
              that.setData({
                InfusionsArray:infusion_arr,
                infusion_cal:{
                  total:total_num,
                  patient_num:p_num
                },
              })
              console.log(that.data.infusion_cal);
              console.log(inf_times_list)
              

              // 制作categories（横轴)
              lineChart = new wxCharts({
                canvasId: 'lineCanvas',
                type: 'line',
                categories: weekList,
                animation: true,
                // background: '#f5f5f5',
                series: [{
                    name: '输液次数',
                    data: inf_times_list,
                    format: function (val, name) {
                        return val.toFixed(0) + '次';
                    }
                },],
                xAxis: {
                    disableGrid: true
                },
                yAxis: {
                    title: '输液次数',
                    format: function (val) {
                        return val.toFixed(0);
                    },
                    min: 0
                },
                width: windowWidth,
                height: 200,
                dataLabel: false,
                dataPointShape: true,
                extra: {
                    lineStyle: 'curve'
                }
            });
            wx.hideLoading();

            } catch (e) {
              console.log(e);
              
              wx.showToast({
                title: '获取数据失败',
                icon: 'none',
                duration: 2000,
              })
          }       
          }
          else {
            wx.showToast({
              title: '获取数据失败',
              icon: 'none',
              duration: 2000,
            })
          }
        }
      })
      
        
    },
    goBack(){
      wx.navigateBack();
    }
});