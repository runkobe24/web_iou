/**
 * Created by Administrator on 2017/8/4.
 */
define(function(require,exports,module) {
    require('vue-resource');//引入
    require('header');//引入
    require('leftMenu');//引入
    require('footer');//引入
    require('alert');//引入\

    var step1ing = '../../images/step1ing.png',
        step1ed = '../../images/step1ed.png',
        step2 = '../../images/step2.png',
        step2ing = '../../images/step2ing.png',
        step2ed = '../../images/step2ed.png',
        step3 = '../../images/lastStep.png',
        step3ing = '../../images/lastSteping.png';
    window.onresize = function(){
        model.contentWidth = document.body.clientWidth-210;
    }
    var model = new Vue({
        el:"#app",
        data :{
            contentWidth:document.body.clientWidth-210,
            contentHeight:window.innerHeight-67,
            parentHeadTit:'账户设置',
            currHeadTit:'绑定邮箱',
            isParent : true,
            stepNum1 : true,
            stepNum2 :  false,
            stepNum3 :  false, //每一步的显示标志

            step1 : step1ing,
            step2 : step2,
            step3 : step3,
            autoCode : '获取验证码',//获取验证码
            sendFlag : true,//限制重复发送验证码参数
            securityCode : '',//短信验证码
            sid : '',//短信id
            emailCode : '',//邮箱验证码
            isSendEmail : false,//是否发送邮件成功

            phone:localStorage.phone,//手机号码
            emailAddress : '',//绑定邮箱地址
            goto:'./accountSetting.html',
        },
        methods:{
            backMyAccount:function () {
                location.href="../accountSetting/accountSetting.html";
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
                            //验证成功到第二步
                            model.stepNum1=false;
                            model.stepNum2=true;
                            model.stepNum3=false;

                            model.step1 = step1ed;
                            model.step2 = step2ing;
                            model.step3 = step3;

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
            sendEmail : function () {//发送邮件
                this.$http({
                    url : baseUrl+'/iou/userDetail/verifyEmail',
                    method : 'POST',
                    params : {
                        email:model.emailAddress,//邮箱地址
                        userId:localStorage.userId//用户id
                    },
                }).then(
                    function (res) {
                        model.errorMsg = res.data.message;
                        //成功
                        if(res.data.code=="200"){
                            model.stepNum1=false;
                            model.stepNum2=false;
                            model.isSendEmail = true;//验证码发送成功展示输入验证码框(第二步的中间态)
                            model.stepNum3=false;

                            model.step1 = step1ed;
                            model.step2 = step2ing;
                            model.step3 = step3ed;

                        }else{
                            model.showAlert();
                        }
                    },function (res) {
                        model.errorMsg = "系统错误，认证失败";
                        model.showAlert();
                    }
                );
            },
            checkEmailCode : function () {//验证邮箱验证码
                this.$http({
                    url : baseUrl+'/iou/userDetail/confirmEmail',
                    method : 'POST',
                    params : {
                        captcha:model.emailCode,
                        email:model.emailAddress,//邮箱地址
                        userId:localStorage.userId//用户id
                    },
                    //emulateJSON:true
                }).then(
                    function (res) {
                        model.errorMsg = res.data.message;
                        //成功
                        if(res.data.code=="200"){
                            model.isSendEmail = true;//验证码发送成功展示输入验证码框
                            //切换到第三步
                            model.stepNum1=false;
                            model.stepNum2=false;
                            model.isSendEmail = false;
                            model.stepNum3=true;

                            model.step1 = step1ed;
                            model.step2 = step2ed;
                            model.step3 = step3ing;
                        }else{
                            model.showAlert();
                        }
                    },function (res) {
                        model.errorMsg = "系统错误，认证失败";
                        model.showAlert();
                    }
                );
            }
        }
    })

})