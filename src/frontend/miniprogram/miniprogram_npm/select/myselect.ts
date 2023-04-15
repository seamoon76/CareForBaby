// miniprogram_npm/select/myselect.ts
//https://blog.csdn.net/weixin_45085423/article/details/106685531
Component({
  /**
   * 组件的属性列表
   */
   // select.js 文件下
 //  第一步 在组件的属性列表  
 properties: {
  propArray:{  //声明传递的类型
      type:Array,
  },
  initContent:"请选择",
},
// 第二步 组件的初始数据
 data: {
  selectShow:false,//初始option不显示
  nowText:"请选择",//初始内容
  animationData:{}//右边箭头的动画
},
// 第三步
  /**
 * 组件的方法列表
 */
methods: {
  //option的显示与否
  selectToggle:function(){
    var nowShow=this.data.selectShow;//获取当前option显示的状态
    //创建动画
    var animation = wx.createAnimation({
        timingFunction:"ease"
    })
    this.animation=animation;
    if(nowShow){
        animation.rotate(0).step();
        this.setData({
            animationData: animation.export()
        })
    }else{
        animation.rotate(180).step();                
        this.setData({
            animationData: animation.export()
        })
    }
    this.setData({
        selectShow: !nowShow
    })
},
// 第四步
//设置内容
  setText:function(e){
    var nowData = this.properties.propArray;//当前option的数据是引入组件的页面传过来的，所以这里获取数据只有通过this.properties
    var nowIdx = e.target.dataset.index;//当前点击的索引
    var nowText = nowData[nowIdx].text;//当前点击的内容
    //执行动画
    this.animation.rotate(0).step();
    this.setData({
        selectShow: false,
        nowText:nowText,
        animationData: this.animation.export()
    })
    var nowDate={
      id:nowIdx,
      text:nowText
  }
  this.triggerEvent('myget', nowDate)
}
}}
)
