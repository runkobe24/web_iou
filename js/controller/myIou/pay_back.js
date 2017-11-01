/**
 * Created by Administrator on 2017/8/3.
 */
define(function(require,exports,module) {
    require('vue-resource');//引入
    require('header');//引入
    require('leftMenu');//引入
    require('footer');//引入
    require('common');//引入
    var subAccNo = Global.getUrlParam('subAccNo');
    var money = Global.getUrlParam('money');
    var model = new Vue({
        el:"#app",
        data :{
            contentHeight:window.innerHeight-67,
            parentHeadTit:'我的运条',
            currHeadTit:'还款',
            isParent:true,
            errMsg:true,
            errFlag:false,
            thirdPay:[
                {id:'r2',icon:'../../images/icons8-weixinpay.png'},
                {id:'r3',icon:'../../images/icons8-alipay.png'}
            ],
            bankList:[
                {id:'0005',icon:'../../images/bank1.png'},
                {id:'1010',icon:'../../images/bank2.png'},
                {id:'0007',icon:'../../images/bank3.png'},
                {id:'4008',icon:'../../images/bank4.png'},
                {id:'1023',icon:'../../images/bank5.png'},
                {id:'1025',icon:'../../images/bank6.png'},
                {id:'0027',icon:'../../images/bank7.png'},
                {id:'0028',icon:'../../images/bank8.png'}
            ],
            balance:'',
            passKey:'',
            gateId:'',
            payType:'bal',
            pwdFlag:true,
            money:money
        },
        mounted : function () {
            $(".subtitle").on("click",function () {
                model.gateId = $(this).find('input').attr('id');
                if(model.gateId == 'r1'){
                    model.payType = 'bal';
                    model.pwdFlag = true;
                }else if(model.gateId == 'r2'){
                    model.payType = 'wxpay';
                    model.pwdFlag = false;
                }else if(model.gateId == 'r3'){
                    model.payType = 'alipay';
                    model.pwdFlag = false;
                }else{
                    model.payType = 'unionpay';
                    model.pwdFlag = false;
                }
            });
            this.getBalance();
        },
        methods:{
            getBalance : function () {
                this.$http({
                    url : baseUrl+'/iou/account/balance',
                    method : 'GET',
                    params : {
                        accType:'BAL',
                        currency:'CNY',
                        userId:localStorage.userId
                    },
                }).then(
                    function (res) {
                        //成功
                        if(res.data.code=="200"){
                            model.balance = res.data.data.balance;
                        }else{

                        }
                    },function (res) {

                    }
                );
            },
            payBack : function () {
                this.$http({
                    url : baseUrl+'/iou/bypay/iouRepay',
                    method : 'POST',
                    params : {
                        gateId:model.gateId,
                        payType:model.payType,
                        repayAmount:money,
                        subAccNo:localStorage.accNoSub,
                        tranPwd:model.passKey,
                        userId:localStorage.userId
                    },
                }).then(
                    function (res) {
                        var errObj = JSON.parse(res.data);
                        //成功
                        if(errObj.code=="200"){
                            model.pwdFlag = true;
                        }else{
                            model.pwdFlag = false;
                            model.errMsg = errObj.errMsg;
                        }
                    },function (res) {
                        model.pwdFlag = false;
                        model.errMsg = '系统异常';
                    }
                );
            }
        }
    })


})