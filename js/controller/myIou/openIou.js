/**
 * Created by Administrator on 2017/7/10.
 */
define(function(require,exports,module) {
    require('vue-resource');//引入
    require('common');//引入
    require('alert');//引入
    var model = new Vue({
        el:'#app',
        data: {

            userId:localStorage.userId,
            errorMsg:'',
            userName:localStorage.userName,
            userId:'',
            oldPayPwd : '',//支付密码
            creditQuota : '',//额度
            currency : '',//币种
            ifChecked:true,
            tranPwd:''

        },
        watch : {
            ifChecked : function (newValue,oldValue) {
                console.log(newValue+'%%%%%'+oldValue);
            }
        },
        methods:{

            toIndex : function () {
                location.href = "../myAccount/account_overview.html";
            },
            fsby56 : function () {
                location.href='../../index.html';
            },

            //退出
            loginOut : function () {
                this.$http({
                    url : baseUrl+'/iou/login/logout',
                    method : 'POST',
                    credentials : true,//允许跨域传入cookie
                    params : {
                        'userId':localStorage.userId,
                         tranPwd:model.payPwd,
                    }

                }).then(
                    function (res) {
                        //成功
                        if(res.data.code=="200"){
                            //退出清除登录信息缓存
                            localStorage.removeItem("userId");
                            localStorage.removeItem("userName");
                            location.href='../../index.html'
                        }else{
                            //系统异常
                        }
                    },function (res) {
                        //失败
                    }

                );
            },
            checkPayPwd:function () {
                if(model.tranPwd==''){
                    model.errorMsg='支付密码不能为空';
                    model.showAlert();
                }else if(model.ifChecked==false){
                    model.errorMsg='请阅读《运条服务协议》';
                    model.showAlert();
                }else{
                    this.$http({
                        url : baseUrl+'/iou/user/checkTranPassword',
                        method : 'POST',
                        params : {
                            userId:localStorage.userId,
                            tranPwd:model.tranPwd,
                        }
                    }).then(
                        function (res) {
                            //成功
                            if(res.data.code=="200"){
                                model.QueryParameters();//支付密码教研成功方可开通运条


                            }else{
                                model.errorMsg=res.data.message;
                                model.showAlert();
                            }
                        },function (res) {
                            model.errorMsg='支付密码不匹配';
                            model.showAlert();
                        }
                    );
                }
            },

            QueryParameters : function () {
                this.$http({
                    url : baseUrl+'/iou/userIou/verifyOpenIou',
                    method : 'post',
                    params : {
                        userId:localStorage.userId,
                    }
                }).then(
                    function (res) {
                        //成功
                        if(res.data.code=="200"){
                            model.creditQuota = res.data.data.creditQuota;
                            model.currency = res.data.data.currency;
                            model.confirmOpen();
                        }else{
                            model.errorMsg=res.data.message;
                            model.showAlert();
                        }
                    },function (res) {
                        model.errorMsg='系统异常';
                        model.showAlert();
                    }
                );
            },
            confirmOpen : function () {
                this.$http({
                    url : baseUrl+'/iou/userIou/confirmOpenIou',
                    method : 'POST',
                    params : {
                        creditQuota:model.creditQuota,
                        currency:model.currency,
                        userId:localStorage.userId,
                    }
                }).then(
                    function (res) {
                        //成功
                        if(res.data.code=="200"){
                            //开通成功
                            model.errorMsg='开通成功！';
                            var alert = Vue.$alert({
                                visible:true,
                                msgType:success,
                                text1:model.errorMsg,
                                isCancel:false,
                                cancelCallback:function (e) {//取消回调
                                    e.visible=false;
                                },
                                confirmCallback:function (e) {//确定回调
                                    e.visible=false;
                                    location.href='../myIou/my_luck.html'
                                }
                            });

                        }else{
                            model.errorMsg=res.data.message;
                            model.showAlert();
                        }
                    },function (res) {
                        model.errorMsg='系统异常';
                        model.showAlert();
                    }
                );
            },
            showAlert : function () {
                var alert = Vue.$alert({
                    visible:true,
                    msgType:error,
                    text1:model.errorMsg,
                    cancelCallback:function (e) {//取消回调
                        e.visible=false;
                    },
                    confirmCallback:function (e) {//确定回调
                        e.visible=false;

                    }
                });
                return alert;
            }


        }
    });


});