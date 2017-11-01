/**
 * Created by Administrator on 2017/8/7.
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
            currHeadTit:'密保问题',
            isParent:true,
            stepNum1 : true,
            stepNum2 :  false,
            stepNum3 :  false, //每一步的显示标志

            sendFlag : true,//限制验证码重复发送
            autoCode : '获取验证码',//获取验证码
            securityCode : '',//获取到的验证码


            step1 : step1ing,
            step2 : step2,
            step3 : step3,
            phone : localStorage.phone,
            options : [],
            value1 : '',
            value2 : '',
            value3 : '',
            ans1 : '',
            ans2 : '',
            ans3 : '',
            goto:'./accountSetting.html',
        },
        mounted : function () {
            this.getQues();
        },
        methods:{
            getQues:function () {
                this.$http({
                    url : baseUrl+'/iou/security/findAllSecurity',
                    method : 'GET',
                    params : {}
                }).then(
                    function (res) {
                        //成功
                        if(res.data.code=="200"){
                            var resData = res.data.data;
                            for(var i=0;i<resData.length;i++){
                                var innerObj = {value:resData[i].id,label:resData[i].securityQuestion};
                                model.options.push(innerObj);
                            }
                        }else{

                        }
                    },function (res) {

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
                        //判断个人认证还是企业认证
                        e.visible=false;
                    }
                });
                return alert;
            },
            checkParam : function () {
                if(model.value1==''||model.value2==''||model.value3==''||model.ans1==''||model.ans2==''||model.ans3==''){
                    model.errorMsg='请完成所有问题和答案';
                    model.showAlert();
                }else{
                    model.saveResponse();
                }
            },
            saveResponse : function () {
                this.$http({
                    url : baseUrl+'/iou/security/security',
                    method : 'POST',
                    params : {data:JSON.stringify([{
                        userId : localStorage.userId,
                        securityId : model.value1,
                        securityAnswer : model.ans1
                    },
                        {
                            userId : localStorage.userId,
                            securityId : model.value2,
                            securityAnswer : model.ans2
                        },
                        {
                            userId : localStorage.userId,
                            securityId : model.value3,
                            securityAnswer : model.ans3
                        }
                    ])},
                }).then(
                    function (res) {
                        //成功
                        if(res.data.code=="200"){
                            //存储成功跳转第三步
                            this.stepNum1 = false;
                            this.stepNum2 = false;
                            this.stepNum3 = true;
                            this.step1 = step1ed;
                            this.step2 = step2ed;
                            this.step3 = step2ing;
                        }else{

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
                            //验证成功到第二步
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
            back : function () {
                location.href = '../myAccount/account_overview.html';
            }
        }
    })

})