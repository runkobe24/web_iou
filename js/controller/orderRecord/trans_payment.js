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
    var payAmount = Global.getUrlParam('payAmount')||'';//从跳转链接获取参数
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
            payType:'bal',//支付方式
            payPassword:'',
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
            gateId:''
        },
        created : function () {
            this.queryDetail();
            this.getBalance();

        },
        mounted : function(){
            $(".subtitle").on("click",function () {
                model.gateId = $(this).find('input').attr('id');
                if(model.gateId == 'r2'){
                    model.payType = 'wxpay';
                }else if(model.gateId == 'r3'){
                    model.payType = 'alipay';
                }else{
                    model.payType = 'unionpay';
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
                            model.transDetail.createTime = res.data.data.timeSummary[0].createTime;
                        }else{
S
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
            combinePay : function () {
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
                        //成功
                        if(res.status=="200"){
                            if(model.payType=='wxpay'){
                                var src = res.url;
                                var html =  '</div><div style="position: absolute;top: 0px;width: 100%;height: 100%;">' +
                                    '<div style="width: 400px;background-color:#ffffff;position: absolute;top: 50%;left: 50%;-webkit-transform: translate(-50%, -50%);-moz-transform: translate(-50%, -50%);-ms-transform: translate(-50%, -50%);-o-transform: translate(-50%, -50%);transform: translate(-50%, -50%);z-index:100;">' +
                                    '<p style="text-align: center;font-size: 14px">请扫描二维码完成微信充值</p>' +
                                    '<img style="margin-left: 100px" src='+src+' />' +
                                    '</div>' +
                                    '</div><';
                                $("#recharge").append(html);
                            }else if(model.payType=='alipay'){
                                $("#recharge").append(res.data);
                            }else if(model.payType=='unionpay'){
                                window.open(res.data.data);
                            }
                        }else{
                            var errObj = JSON.parse(res.data);
                            var alert = Vue.$alert({
                                visible:true,
                                msgType:error,
                                text1:errObj.message,
                                cancelCallback:function (e) {//取消回调
                                    e.visible=false;
                                },
                                confirmCallback:function (e) {//确定回调
                                    //判断个人认证还是企业认证
                                    e.visible=false;
                                }
                            });
                        }
                    },function (res) {

                    }
                );
            }
        }
    })


})