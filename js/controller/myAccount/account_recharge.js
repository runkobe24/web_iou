/**
 * Created by Administrator on 2017/8/3.
 */
define(function(require,exports,module) {
    require('vue-resource');//引入
    require('header');//引入
    require('leftMenu');//引入
    require('footer');//引入
    require('alert');//引入

    window.onresize = function(){
        model.contentWidth = document.body.clientWidth-210;
    }
    var model = new Vue({
        el:"#app",
        data :{
            contentWidth:document.body.clientWidth-210,
            contentHeight:window.innerHeight-67,
            parentHeadTit:'账户总览',
            currHeadTit:'充值',
            isParent:true,
            bankList : [
                {id:'0005',value:'option3',img:'../../images/bank1.png'},
                {id:'1010',value:'option4',img:'../../images/bank2.png'},
                {id:'0007',value:'option5',img:'../../images/bank3.png'},
                {id:'4008',value:'option6',img:'../../images/bank4.png'},
                {id:'1023',value:'option7',img:'../../images/bank5.png'},
                {id:'1025',value:'option8',img:'../../images/bank6.png'},
                {id:'0027',value:'option9',img:'../../images/bank7.png'},
                {id:'0028',value:'option10',img:'../../images/bank8.png'},
                {id:'0026 ',value:'option11',img:'../../images/bank9.png'},
                {id:'0004',value:'option12',img:'../../images/bank10.png'},
                {id:'1022',value:'option13',img:'../../images/bank11.png'},
                {id:'3824',value:'option14',img:'../../images/bank12.png'}
            ],
            money : '',//充值金额
            checkFlag : true,//选中的充值方式
            payUrl : '/iou/alipay/alipay',//选中的充值方式
            id : 'r1',//判断付款方式
            balance : ''//当前余额

        },
        mounted : function () {
            $(".magic-radio").on("click",function () {
                model.id = $(this).attr('id');
            });
            this.getBalance();
        },
        methods:{
            showAlert : function () {//弹窗提示
                var alert = Vue.$alert({
                    visible:true,
                    msgType:error,
                    text1:model.errorMsg,
                    cancelCallback:function (e) {//取消回调
                        e.visible=false;
                    },
                    confirmCallback:function (e) {//确定回调
                        //判断个人认证还是企业认证
                        e.visible=false;
                    }
                });
                return alert;
            },
            sureToPay : function () {
                if(model.id == 'r1'){//支付宝支付（默认）
                    model.aliPay();
                }else if(model.id == 'r2'){//微信支付
                    model.weiXinPay();
                }else{
                    model.unionPay(model.id);
                }
            },
            getBalance : function () {//获取可提现余额
                this.$http({
                    url : baseUrl+'/iou/account/balance',
                    method : 'GET',
                    params : {
                        accType:'BAL',
                        currency:'CNY',
                        userId:localStorage.userId,
                    }
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
            //微信支付
            weiXinPay : function () {
                this.$http({
                    url : baseUrl+'/iou/wxPay/createWXQRCode',
                    method : 'POST',
                    params : {
                        money:model.money,
                        user_id:localStorage.userId
                    },
                    //emulateJSON:true
                }).then(
                    function (res) {
                        //成功
                        if(res.status=="200"){
                            var src = res.url;
                            var html =  '<div style="position: absolute;top: 0px;width: 100%;height: 100%;">' +
                                            '<div style="width: 400px;background-color:#ffffff;position: absolute;top: 50%;left: 50%;-webkit-transform: translate(-50%, -50%);-moz-transform: translate(-50%, -50%);-ms-transform: translate(-50%, -50%);-o-transform: translate(-50%, -50%);transform: translate(-50%, -50%);z-index:100;">' +
                                                '<p style="text-align: center;font-size: 14px">请扫描二维码完成微信充值</p>' +
                                                '<img style="margin-left: 100px" src='+src+' />' +
                                            '</div>' +
                                        '</div>';
                            $("#recharge").append(html);
                        }else{
                            model.errorMsg = res.data.message;
                            model.showAlert();
                        }
                    },function (res) {
                        model.errorMsg = '网络错误，充值失败';
                        model.showAlert();
                    }
                );
            },
            //支付宝支付
            aliPay : function () {
                this.$http({
                    url : baseUrl+'/iou/alipay/alipay',
                    method : 'POST',
                    params : {
                        money:model.money,
                        user_id:localStorage.userId
                    },
                    //emulateJSON:true
                }).then(
                    function (res) {
                        //成功
                        if(res.status=="200"){
                            $("#recharge").append(res.data);
                        }else{
                            model.errorMsg = res.data.message;
                            model.showAlert();
                        }
                    },function (res) {
                        model.errorMsg = '网络错误，充值失败';
                        model.showAlert();
                    }
                );
            },
            //银联支付
            unionPay : function (id) {
                this.$http({
                    url : baseUrl+'/iou/chinapay/pay',
                    method : 'POST',
                    params : {
                        gateId:id,
                        money:model.money,
                        user_id:localStorage.userId
                    },
                    //emulateJSON:true
                }).then(
                    function (res) {
                        //成功
                        if(res.data.code=="200"){
                            window.open(res.data.data);
                        }else{
                            model.errorMsg = res.data.message;
                            model.showAlert();
                        }
                    },function (res) {
                        model.errorMsg = '网络错误，充值失败';
                        model.showAlert();
                    }
                );
            }
        }
    })


})