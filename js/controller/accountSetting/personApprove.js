/**
 * Created by Administrator on 2017/7/27.
 */
define(function(require,exports,module) {
    require('vue-resource');//引入
    require('header');//引入
    require('leftMenu');//引入
    require('footer');//引入
    require('alert');//引入
    require('common');//引入
    window.onresize = function(){
        model.contentWidth = document.body.clientWidth-210;
    }
    var model = new Vue({
        el:"#app",
        data :{
            contentWidth:document.body.clientWidth-210,
            contentHeight:window.innerHeight-82,
            parentHeadTit:'账户设置',
            currHeadTit:'实名认证',
            autoCode : '获取验证码',//获取验证码
            sid : '',//短信验证码id
            sendFlag : true,//限制重复发送验证码参数
            isParent:true,
            selected : true,
            securityCode : '',
            errorMsg:'',//错误信息
            formWidth : '400',
            bankCardNo : '',
            idNo : '',
            bankMobile : '',
            realName : '',
            userId : '',
            loginPhone : localStorage.phone,//登录页缓存的登录手机号
            bankList : [],
            bankName : '',
            cardType : '',
            iconUrl : ''
        },
        mounted:function(){
            $.getJSON('/json/bankcard.json',function (data) {
                model.bankList = data;
            })
        },
        watch : {
            bankCardNo : function (newValue, oldValue) {
                if(newValue.length>15&&newValue.length<20){
                    var authNo = newValue.substring(0,6);
                    for(var i=0;i<model.bankList.length;i++){
                        for (var key in model.bankList[i]) {
                            if(authNo == key){
                                model.bankName = model.bankList[i][key].bankName;
                                model.cardType = model.bankList[i][key].cardType;
                                model.iconUrl = model.bankList[i][key].iconUrl||'https://acc.by56.com:8443/bankcard/CGB.png';
                            }
                        }
                    }
                }
            }
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
            sendAuthCode : function () {//发送验证码
                if(model.sendFlag){//限制重复发送
                    this.$http({
                        url : baseUrl+'/iou/sms/verificationCode',
                        method : 'POST',
                        params : {mobile:model.loginPhone},//13018061579
                        //emulateJSON:true
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
                                model.errorMsg = res.data.message;
                                model.showAlert();
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
                            model.personApprove();//验证成功进行认证
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
            paramVerify :function () {
                if(model.realName==''){
                    model.errorMsg='姓名不能为空';
                    model.showAlert();
                    return false;
                }else if(!Global.IdentityCodeValid(model.idNo)){
                    model.errorMsg = '请输入正确的身份证号';
                    model.showAlert();

                }else if(model.bankCardNo == '') {
                    model.errorMsg = '请输入银行卡号';
                    model.showAlert();
                    return false;
                }else if(!Global.luhnCheck(model.bankCardNo)) {
                    model.errorMsg = '请输入正确的银行卡号';
                    model.showAlert();
                    return false;
                }else if(!Global.moblieVerify(model.bankMobile)) {
                    model.errorMsg = '请输入正确的手机号';
                    model.showAlert();
                    return false;
                }else{
                    model.checkAuthCode();
                }
            },
            personApprove : function () {
                this.$http({
                    url : baseUrl+'/iou/unionPay/certification',
                    method : 'POST',
                    params : {
                        bankCardNo:model.bankCardNo,//6228480402564890018
                        idNo:model.idNo,
                        mobile:model.bankMobile,
                        realName:model.realName,
                        userId:localStorage.userId,
                        bankIcon:model.iconUrl,
                        bankName:model.bankName,
                        cardType:model.cardType
                    },
                    //emulateJSON:true
                }).then(
                    function (res) {
                        //成功
                        if(res.data.code=="200"){
                            var alert = Vue.$alert({//弹窗提示
                                visible:true,
                                msgType:success,
                                text1:'认证成功',
                                cancelCallback:function (e) {//取消回调
                                    location.href = 'accountSetting.html';
                                },
                                confirmCallback:function (e) {//确定回调
                                    //判断个人认证还是企业认证
                                    location.href = 'accountSetting.html';
                                }
                            });
                        }else{
                            model.errorMsg = res.data.message;
                            model.showAlert();
                        }
                    },function (res) {
                        model.errorMsg = '网络错误，注册失败';
                        model.showAlert();
                    }
                );
            }
        }
    })

})