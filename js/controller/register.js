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
                phone:'',//手机号码
                pwd:'',             //密码
                confirmPwd:'',      //重复密码
                securityCode:'',    //验证码
                sendFlag : true,//限制重复发送验证码参数
                autoCode : '获取验证码',//获取验证码
                sid : '',           //短信id
                userFrom : 'C',
                mobileFlag : false,
                errorMsg : '', // 参数错误
                showAgreementModal: false
        },
        /*watch:{
            phone: function (val, oldVal) {
                model.paramVerify();
                //console.log('new: %s, old: %s', val, oldVal)
                model.mobileFlag = true;
            }
        },*/
        methods:{
            showLogin : function () {
                loginAlert.visible=true;
                loginAlert.userName = '';
                loginAlert.password = '';
                $(document.body).css("overflow","hidden");
            },
            toLogin : function () {
                location.href = "../../pages/login.html";
            },
            toIndex : function () {
                location.href = "../../index.html";
            },
            fsby56 : function () {
                location.href='../../index.html';
            },
            handleClick:function(tab, event) {
                //console.log(tab, event);
                if(tab.index=="0"){
                    model.userFrom = 'C';
                };
                if(tab.index=="1"){
                    model.userFrom = 'S';
                }
            },
            //参数校验（点击注册时候校验）
            paramVerify:function () {
                if(!Global.moblieVerify(this.phone)){
                    model.errorMsg='请输入有效的手机号码';
                    model.showAlert();
                    return false;
                }else if(!model.CheckPassWord(model.pwd)){
                    model.errorMsg='登录密码必须为字母加数字且长度不小于8位';
                    model.showAlert();
                    return false;
                }else if(!model.pwd==model.confirmPwd){
                    model.errorMsg='登录密码和确认密码不同';
                    model.showAlert();
                    return false;
                }else{
                    model.checkPwdStrength();
                }

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
                        //判断个人认证还是企业认证
                        e.visible=false;
                    }
                });
                return alert;
            },
            CheckPassWord:function (password) {//必须为字母加数字且长度不小于8位
                var str = password;
                if (str == null || str.length <8) {
                    return false;
                }
                var reg1 = new RegExp(/^[0-9A-Za-z]+$/);
                if (!reg1.test(str)) {
                    return false;
                }
                var reg = new RegExp(/[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/);
                if (reg.test(str)) {
                    return true;
                } else {
                    return false;
                }
            },
            checkPwdStrength : function () {//检验密码强度，太弱则不可注册
                this.$http({
                    url : baseUrl+'/iou/user/pwdStrength',
                    method : 'POST',
                    params : {
                        password : model.pwd
                    },
                }).then(
                    function (res) {
                        //成功
                        if(res.data.code=="92001"){//密码强度强
                            //流程正常开始校验验证码
                            model.checkAuthCode();
                        }
                        if(res.data.code=="92000"){//密码强度弱
                            //密码强度太弱
                            model.errorMsg='密码强度太弱，请重新设置';
                            model.showAlert();
                        }


                    },function (res) {
                        model.errorMsg='网络错误，稍后重试';
                        model.showAlert();
                    }
                );
            },
            //注册
            register: function (){
                    this.$http({
                        url : baseUrl+'/iou/user/user',
                        method : 'POST',
                        params : {
                            loginPwd : model.pwd,
                            mobile : model.phone,
                            userFrom : model.userFrom
                        },
                    }).then(
                        function (res) {
                            //成功
                            if(res.data.code=="200"){
                                msgbox.msgType = "success";
                                msgbox.msgText = "注册成功";
                                msgbox.msgboxFlag = true;
                                setTimeout(function () {
                                    msgbox.msgboxFlag = false;
                                },2000);

                            }else{
                                //不做处理
                                msgbox.msgType = "error";
                                msgbox.msgText = "注册失败";
                                msgbox.msgboxFlag = true;
                                setTimeout(function () {
                                    msgbox.msgboxFlag = false;
                                },2000);
                            }
                        },function (res) {

                        }
                    );
            },
            sendAuthCode : function () {//发送验证码
                if(model.sendFlag){//限制重复发送
                    this.$http({
                        url : baseUrl+'/iou/sms/verificationCode',
                        method : 'POST',
                        params : {mobile:model.phone}//15872364622
                    }).then(
                        function (res) {
                            //成功
                            if(res.data.code=="200"){
                                model.sendFlag = false;//限制重复发送
                                //短信id
                                model.sid = res.data.data.sid;
                                var count = 60;
                                model.autoCode = '60s';
                                model.countDown(count);
                            }else{

                            }
                        },function (res) {

                        }
                    );
                }
            },
            checkAuthCode : function () {//检验验证码
                this.$http({
                    url : baseUrl+'/iou/sms/validateCode',
                    method : 'POST',
                    params : {
                        code:model.securityCode,//短信验证码
                        sid : model.sid
                    },
                }).then(
                    function (res) {
                        //成功
                        if(res.data.code=="200"){
                            model.register();
                        }else{
                            model.errorMsg='验证码输入有误';
                            model.showAlert();
                        }
                    },function (res) {
                        model.errorMsg='验证码校验失败';
                        model.showAlert();
                    }
                );
            },
            countDown : function (count) {
                if(count>0){
                    setTimeout(function () {
                        count--;
                        model.autoCode = count+'s';
                        model.countDown(count);
                    },1000)
                }else{
                    model.autoCode = '获取验证码';
                    model.sendFlag = true;
                    return false;
                }
            },
            toggleAgreementModal: function() {
                this.showAgreementModal = !this.showAgreementModal;
            }
        }
    });
    //弹窗提示
    var msgbox = new Vue({
        el:"#cover",
        data:{
            msgText:'注册成功',
            msgType:'success',
            msgboxFlag:false
        },
        methods:{

        }
    });
    //登录弹窗实例
    // var loginAlert = new Vue({
    //     el:'#loginAlert',
    //     data:{
    //         userName:'',
    //         password:'',
    //         errMsg:'',//错误信息
    //         errFlag:false,//控制错误信息的消失时间
    //         visible:false
    //     },
    //     methods:{
    //         hideLogin:function () {
    //             loginAlert.visible=false;
    //             $(document.body).css("overflow","auto");
    //         },
    //         toRegister : function () {
    //             location.href = '../pages/register.html';
    //         },
    //         //点击登录进行参数校验，通过方可调用登录接口
    //         paramVerify:function () {
    //             if(Global.moblieVerify(loginAlert.userName)){
    //                 loginAlert.login();
    //             }else{
    //                 loginAlert.errMsg='请输入有效的手机号码';
    //                 loginAlert.errFlag = true;
    //                 setTimeout(function () {
    //                     loginAlert.errFlag = false;
    //                 },3000)
    //             }
    //         },
    //         //登录
    //         login : function () {
    //             this.$http({
    //                 url : baseUrl+'/iou/login/login',
    //                 method : 'POST',
    //                 /*crossDomain : true,
    //                  credentials : true,*/
    //                 params : {
    //                     'loginPwd':loginAlert.password,
    //                     'mobile':loginAlert.userName
    //                 },
    //                 //emulateJSON:true
    //             }).then(
    //                 function (res) {
    //                     //成功
    //                     if(res.data.code=="200"){
    //                         loginAlert.visible = false;
    //                         $(document.body).css("overflow","hidden");
    //                         localStorage.userId = res.data.data.userId;
    //                         localStorage.userName = res.data.data.username;
    //                         model.loginFlag= true;
    //                         loginFlag = true;
    //                         loginAlert.hideLogin();
    //                         location.href='pages/myAccount/gy_account_overview.html';
    //                     }else{
    //                         loginAlert.errMsg = res.data.message;
    //                         loginAlert.errFlag = true;
    //                         setTimeout(function () {
    //                             loginAlert.errFlag = false;
    //                         },3000);
    //                     }
    //                 },function (res) {
    //                     //失败
    //                     loginAlert.errMsg = '登录失败';
    //                     loginAlert.errFlag = true;
    //                     setTimeout(function () {
    //                         loginAlert.errFlag = false;
    //                     },3000);
    //                 }
    //             );
    //         }
    //     }
    // });

});