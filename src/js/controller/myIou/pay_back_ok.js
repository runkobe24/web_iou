/**
 * Created by Administrator on 2017/8/3.
 */
define(function(require,exports,module) {
    require('vue-resource');//引入
    require('header');//引入
    require('leftMenu');//引入
    require('footer');//引入

    window.onresize = function(){
        model.contentWidth = document.body.clientWidth-210;
    }
    var model = new Vue({
        el:"#app",
        data :{
            contentWidth:document.body.clientWidth-210,
            contentHeight:window.innerHeight-67,
            parentHeadTit:'我的运条',
            currHeadTit:'运条成功还款',
            isParent:true,
            waiteRepayAmount:''
        },
        mounted : function () {
            this.queryIouInfo();
        },
        methods:{
            queryIouInfo : function () {
                this.$http({
                    url : baseUrl+'/iou/userIou/myIou',
                    method : 'GET',
                    params : {
                        userId:localStorage.userId,
                    },
                }).then(function(res){
                    console.log(res.data.data);
                    if(res.data.code == 200){
                        var resData = res.data.data;
                        model.waiteRepayAmount = resData.waiteRepayAmount;//当前待还款;
                    }

                },function(){

                })
            },
        }
    })


})