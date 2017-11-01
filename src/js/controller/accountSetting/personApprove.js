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
    var idReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    var phoneReg = /^1(3|4|5|7|8)\d{9}$/;
    var bankReg = /^\d{16}|\d{19}$/;

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
            errorMsg:'',//错误信息
            formWidth : '400',
            userId : '',
            loginPhone : localStorage.phone,//登录页缓存的登录手机号
            bankList : [],
            bankName : '',
            cardType : '',
            iconUrl : '',
            goto:'./accountSetting.html',
            bankCardNo: '',
            newUser: {
                realName: '',
                idNo: '',
                bankCardNo: '',
                bankMobile: '',
                securityCode: ''
            },
            // 控制提示语要不要显示
            showSuggestion: {
                name: true,
                id: true,
                bankCardNo: true,
                bankMobile: true,
                securityCode: true,
            }
        },
        beforeMount: function() {
            // todo: 如果用户已经认证则跳转回去
            if(localStorage.authStatus == 'S'){
                location.href = this.goto;
            };
        },
        mounted:function(){
            $.getJSON('../../json/bankcard.json',function (data) {
                model.bankList = data;
            });
        },
        computed: {
            validation: function() {
                return {
                    name: this.newUser.realName.trim().length && this.newUser.realName.trim().length < 6,
                    id: idReg.test(this.newUser.idNo.trim()),
                    bankCardNo: bankReg.test(this.bankCardNo.trim()),
                    bankMobile: phoneReg.test(this.newUser.bankMobile.trim()),
                    securityCode: true,
                }
            },
            isValid: function () {
                var validation = this.validation
                return Object.keys(validation).every(function (key) {
                    return validation[key]
                })
            }
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
                        code:model.newUser.securityCode,//短信验证码
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
                if(!this.isValid) {
                    model.errorMsg = '您输入的信息有误';
                    model.showAlert();
                }
                else if(!Global.IdentityCodeValid(model.newUser.idNo)){
                    model.errorMsg = '请再次检查您的身份证号码';
                    model.showAlert();

                }else if(!Global.luhnCheck(model.bankCardNo)) {
                    model.errorMsg = '请再次检查您的银行卡号';
                    model.showAlert();
                    return false;
                }else if(!Global.moblieVerify(model.newUser.bankMobile)) {
                    model.errorMsg = '请再次检查您的手机号';
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
                        idNo:model.newUser.idNo,
                        mobile:model.newUser.bankMobile,
                        realName:model.newUser.realName,
                        userId:localStorage.userId,
                        bankIcon:model.iconUrl,
                        bankName:model.bankName,
                        cardType:model.newUser.cardType
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
                                    location.href = './accountSetting.html';
                                },
                                confirmCallback:function (e) {//确定回调
                                    //判断个人认证还是企业认证
                                    location.href = './accountSetting.html';
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
            },
            realNameValid: function() {
                this.showSuggestion.name = this.validation.name;
            },
            idNoValid: function() {
                this.showSuggestion.id = this.validation.id;
            },
            bankCardNoValid: function() {
                this.showSuggestion.bankCardNo = this.validation.bankCardNo;
            },
            bankMobileValid: function() {
                this.showSuggestion.bankMobile = this.validation.bankMobile;
            },
        }
    })

})