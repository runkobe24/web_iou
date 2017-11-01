/**
 * Created by Administrator on 2017/8/3.
 */
define(function(require,exports,module) {
    require('vue-resource');//引入
    require('header');//引入
    require('leftMenu');//引入
    require('footer');//引入
    require('common');//引入
    require('alert');//引入

    var tranIds = Global.getUrlParam('tranIds')||'';//从跳转链接获取参数
    var tranNo = Global.getUrlParam('tranNo')||'';//从跳转链接获取参数
    var model = new Vue({
        el:"#app",
        data :{
            contentHeight:window.innerHeight-67,
            parentHeadTit:'交易记录',
            currHeadTit:'付款',
            isParent:true,
            transDetail:{},
            showDetail:false,
            buttonText:'展开更多 ∨',
            balance:'',
            payType:'iou',//支付方式
            payPassword:'',
            thirdPay:[
                {id:'r2',icon:'../../images/icons8-weixinpay.png',payType:'微信支付'},
                {id:'r3',icon:'../../images/icons8-alipay.png',payType:'支付宝支付'}
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
            gateId:'',
            errFlag:false,//错误提示标识
            errText:'',//错误提示
            pwdFlag:true,//密码框标识
            goto:'./trans_record.html',
            weChatPageUrl: '../payWithWechat.html',
            isEnough: false,
            isIouEnough: false,
            avaliableQuata: '',//运条可用额度
            tranAmount: '',//付款总金额
            tansNum: ''//合并支付的条数
        },
        created : function () {
            this.queryDetail();
            this.getBalance();
            this.getMyIou();
            this.getCombineTranAmount();
            if(this.balance<this.transDetail.tranAmount){
                this.isEnough = true;
            }
            if(this.avaliableQuata<this.transDetail.tranAmount){
                this.isIouEnough = true;
            }
            this.tansNum = tranIds.split(',').length;
        },
        mounted : function(){
            $(".subtitle").on("click",function () {
                model.gateId = $(this).find('input').attr('id');
                if(model.gateId == 'r0'){
                    model.payType = 'iou';
                    model.pwdFlag = true;
                }else if(model.gateId == 'r1'){
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
        },
        methods:{
            toggleBtn : function () {
                if(model.showDetail==false){
                    model.showDetail = true;
                    model.buttonText ='展开更多 ∨';
                }else{
                    model.showDetail = false;
                    model.buttonText ='收起 ∧';
                    }
                },
            toUpdatePayPw : function () {
                location.href = '../accountSetting/updatePayPw.html';
            },
            queryDetail : function () {//查询本单详情
                this.$http({
                    url : baseUrl+'/iou/transaction/findTransactionDetail',
                    method : 'GET',
                    params : {
                        userId:localStorage.userId,
                        tranId:tranIds,
                        tranType:'Pay',
                        tranNo:tranNo
                    },
                }).then(
                    function (res) {
                        //成功
                        if(res.data.code=="200"){
                            model.transDetail = res.data.data.tranSummary;
                        }else{

                        }
                    },function (res) {

                    }
                );
            },
            getMyIou : function () {
                this.$http({
                    url : baseUrl+'/iou/userIou/myIou',
                    method : 'GET',
                    params : {
                        userId:localStorage.userId
                    },
                }).then(
                    function (res) {
                        //成功
                        if(res.data.code=="200"){
                            model.avaliableQuata = res.data.data.avaliableQuata;
                        }else{

                        }
                    },function (res) {

                    }
                );
            },
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
            getCombineTranAmount : function () {
                this.$http({
                    url : baseUrl+'/iou/transaction/batchQueryTransactions',
                    method : 'POST',
                    params : {
                        tranIds:tranIds
                    },
                }).then(
                    function (res) {
                        model.tranAmount = res.data.data.tranAmount;
                    },function (res) {

                    }
                );
            },
            combinePay : function () {
                var self = this;
                if(model.payType=='bal'||model.payType=='iou'){
                    if(model.payPassword==''){
                        model.errText = '支付密码不可为空';
                    }
                }
                this.$http({
                    url : baseUrl+'/iou/bypay/combinePay',
                    method : 'POST',
                    params : {
                        gateId:model.gateId,
                        payAmount:model.transDetail.tranAmount,
                        payType:model.payType,
                        tranIds:tranIds,
                        tranPwd:model.payPassword,
                        userId:localStorage.userId
                    },
                }).then(
                    function (res) {
                        if(model.payType=='bal'||model.payType=='iou'){
                            var errObj = JSON.parse(res.data);
                            if(errObj.code=='200'){
                                model.errFlag = false;
                            }

                        }

                        //成功
                        if(res.status=="200"){
                            model.errFlag = false;
                            if(model.payType=='wxpay'){
                                localStorage.weChatSrc = res.url;
                                localStorage.moneyAmount = model.transDetail.tranAmount;
                                localStorage.payType = '付款';
                                location.href = self.weChatPageUrl;
                            }else if(model.payType=='alipay'){
                                $("#recharge").append(res.data);
                            }else if(model.payType=='unionpay'){
                                window.open(res.data.data);
                            }
                        }else{
                            model.errFlag = true;
                            model.errText = errObj.message;
                        }
                    },function (res) {

                    }
                );
            }
        }
    })


})