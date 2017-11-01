/**
 * Created by Administrator on 2017/8/4.
 */
define(function(require,exports,module) {
    require('vue-resource');//引入
    require('header');//引入
    require('leftMenu');//引入
    require('footer');//引入
    require('alert');//引入\
    require('common');//引入\
    var step1ing = '../../images/step1ing.png',
        step1ed = '../../images/step1ed.png',
        step2 = '../../images/step2.png',
        step2ing = '../../images/step2ing.png',
        step2ed = '../../images/step2ed.png',
        step3 = '../../images/lastStep.png',
        step3ing = '../../images/lastSteping.png';
    var condition = Global.getUrlParam('condition')||'';//从跳转链接获取参数
    //console.log(condition);
    var model = new Vue({
        el:"#app",
        data :{
            contentHeight:window.innerHeight-67,
            parentHeadTit:'账户设置',
            currHeadTit:'设置支付密码',
            isParent:true,
            autoCode : '获取验证码',//获取验证码
            sendFlag : true,//限制重复发送验证码参数
            securityCode : '',//短信验证码

            stepNum1 : true,
            stepNum2 :  false,
            stepNum3 :  false, //每一步的显示标志

            step1 : step1ing,
            step2 : step2,
            step3 : step3,
            phone : localStorage.phone,

            payPwd : '',//支付密码
            confirmPayPwd : ''//确认支付密码
        },
        created:function () {
            if(condition=='security'){
                this.flag = true;
            }else{
                this.flag = false;
            }
        },
        methods:{
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
                            //验证码校验成功到第二步
                            this.stepNum1 = false;
                            this.stepNum2 = true;
                            this.stepNum3 = false;
                            this.step1 = step1ed;
                            this.step2 = step2ing;
                            this.step3 = step3;
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
            setPayPwd : function () {//设置支付密码
                if(model.payPwd==model.confirmPayPwd){
                    this.$http({
                        url : baseUrl+'/iou/user/saveTranPwd',
                        method : 'POST',
                        params : {
                            tranPwd:model.payPwd,
                            userId : localStorage.userId
                        },
                    }).then(
                        function (res) {
                            //成功
                            if(res.data.code=="200"){
                                //验证码校验成功到第三步
                                this.stepNum1 = false;
                                this.stepNum2 = false;
                                this.stepNum3 = true;
                                this.step1 = step1ed;
                                this.step2 = step2ed;
                                this.step3 = step3ing;

                            }else{
                                model.errorMsg=res.data.message;
                                model.showAlert();
                            }
                        },function (res) {
                            model.errorMsg='验证码校验失败';
                            model.showAlert();
                        }
                    );
                }else{
                    model.errorMsg='请确认两次的验证码相同';
                    model.showAlert();
                }

            },
            toSecurityVerify : function () {
                location.href = 'securityVerify.html';
            },
            back : function () {
                location.href = '../myAccount/account_overview.html';
            }
        }
    })

})