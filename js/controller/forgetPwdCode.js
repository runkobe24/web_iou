/**
 * Created by Administrator on 2017/8/4.
 */
define(function(require,exports,module) {
    require('vue-resource');//引入
    require('common');//引入
    require('alert');//引入
    require('elementUi');//引入

    var model = new Vue({
        el:'#app',
        data: {
            data:'',
            securityCode:'',
            verifyCode:{},
            isMobile : true,//判断从忘记密码页面跳转过来时的参数类型
            phone : '',
            userMeans : '',
            acPhone:'',
            encrypted:true,
            userId:'',
            phone:''
        },
        created : function () {
            this.isMobile = Global.getUrlParam('mobile')||true;//从跳转链接获取参数
            this.userMeans = Global.getUrlParam('userMeans')||'';//从跳转链接获取参数
            this.data = Global.getUrlParam('data')||'';//从跳转链接获取参数
            this.getUserId();
        },
        methods:{
            fsby56 : function () {
                location.href='../../index.html';
            },
            toSecurityVerify : function () {
                location.href = 'forgetPwdAnswer.html?condition=security'+'&data='+model.data+'&forgetPhone='+model.phone+'&userMeans='+model.userMeans;
            },
            toPhoneVerify : function () {
                location.href = 'forgetPwdAnswer.html?condition=phone'+'&data='+model.data+'&forgetPhone='+model.phone+'&userMeans='+model.userMeans;
            },
            getUserId : function () {
                this.$http({
                    url : baseUrl+'/iou/user/forgetPassword',
                    method : 'POST',
                    params : {
                        data:this.data,
                        type:this.userMeans,
                    },
                }).then(
                    function (res) {
                        //成功
                        if(res.data.code=="200"){
                            model.userId = res.data.data.userId;
                            model.getMobile();
                            if(model.isMobile=='false'){
                                model.flag = true;
                            }else{
                                model.flag = false;
                            }
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
            getMobile : function () {
                this.$http({
                    url : baseUrl+'/iou/user/userStatus',
                    method : 'GET',
                    params : {
                        userId:model.userId
                    },
                }).then(
                    function (res) {
                        //成功
                        if(res.data.code=="200"){
                            model.phone = res.data.data.mobile;
                            model.acPhone = Global.transMobileNo(res.data.data.mobile);
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
        },

    });


});