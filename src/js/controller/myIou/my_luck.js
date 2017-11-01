/**
 * Created by Administrator on 2017/8/3.
 */
define(function(require,exports,module) {
    require('vue-resource');//引入
    require('header');//引入
    require('leftMenu');//引入
    require('footer');//引入
    var model = new Vue({
        el:"#app",
        data :{
            contentHeight:window.innerHeight-67,
            parentHeadTit:'我的运条',
            isParent:false,
            avaliableQuata:'',
            creditQuota:'',
            billDate:'',
            currency:'',
            isBlack:'',
            isOverdue:'',
            nextRepaymet:'',
            overdueAmount:'',
            payDueDate:'',
            waiteRepayAmount:'',
            accNo:'',
            goto:'./my_luck.html',
            iouStatus:'',
        },
        mounted : function () {
            this.getStatus();
            this.queryIouInfo();
            
        },
        methods:{
            getStatus:function(){
                
                this.$http({
                    url:baseUrl+'/iou/user/userStatus',
                    method:'GET',
                    params:{
                        userId:localStorage.userId,
                    }
                }).then(function(res){
                    
                    model.iouStatus = res.data.data.iouStatus;
                    localStorage.iouStatus = res.data.data.iouStatus;
                    
                    if(localStorage.iouStatus!=4){
                        window.location = '/pages/myIou/openIou.html';
                    }
                },function(){
                
                })
            },
            showCover:function () {
                cover.coverFlag = true;
            },
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
                        
                        model.avaliableQuata = resData.avaliableQuata; //可用额度;
                        model.creditQuota  = resData.creditQuota;      //运条总额度;
                        model.billDate = resData.billDate;
                        model.currency = resData.currency;
                        model.isBlack = resData.isBlack;
                        model.isOverdue = resData.isOverdue;
                        model.nextRepaymet = resData.nextRepaymet; //	下期应还款;
                        model.overdueAmount = resData.overdueAmount;
                        model.waiteRepayAmount = resData.waiteRepayAmount;//当前待还款;
                        cover.waiteRepayAmount = resData.waiteRepayAmount;//当前待还款;
                        model.payDueDate = resData.payDueDate;
                        localStorage.accNoSub = resData.accNoSub;
                    }

                },function(){

                })
            },

        },

    })
    var cover = new Vue({
        el:"#popUp",
        data:{
            payment:'',
            coverFlag:false,
            money:'',
            waiteRepayAmount:''
        },
        methods : {
            hideCover:function () {
                cover.coverFlag = false;
            },

            srueToDo:function () {
                //跳转
                location.href = 'pay_back.html?money='+cover.money;
            },

        }
    })

})