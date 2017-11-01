/**
 * Created by Administrator on 2017/8/4.
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
            parentHeadTit:'账户设置',
            currHeadTit:'添加银行卡',
            isParent : true,
            personal:false,
            errorMsg:'',//错误信息

            phone : localStorage.phone,
            sendFlag : true,//限制验证码重复发送
            autoCode : '获取验证码',//获取验证码
            securityCode : '',//获取到的验证码
            isPerson : false,//是否是个人用户
            isDisabled : false,//是否禁用身份证号输入

            bankList:[],

            ownerName:'',
            companyName:'',
            registerBankName:'',//开户银行
            bankAccType:'E',//账户类型
            bankCardNo:'',//银行卡号
            idNo:'',//身份证号
            mobile:'',//预留手机号
            bankName:'',//银行卡号
            cardType:'',//银行卡类型
            iconUrl:''//银行图标路径
        },
        created : function () {
            $.getJSON('/json/bankcard.json',function (data) {
                model.bankList = data;
            })
            this.getCertification();
            //如果是个人用户就只能添加个人账户
            if(localStorage.userType=='P'){
                this.isPerson = true;
                this.personal = true;
                this.bankAccType = 'P';
            }
            //如果用户来源是供应商只能添加对公账户
            if(localStorage.userFrom=='S'){
                this.isPerson = false;
                this.personal = false;
            }
            //this.addCard();
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
                                model.iconUrl = model.bankList[i][key].iconUrl;
                            }
                        }
                    }
                }
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
                if(model.bankCardNo==''){
                    model.errorMsg='银行卡号不能为空';
                    model.showAlert();
                }else{
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
                                //校验成功执行添加银行卡
                                model.addCard();
                            }else{
                                model.errorMsg='验证码输入有误';
                                model.showAlert();
                            }
                        },function (res) {
                            model.errorMsg='验证码校验失败';
                            model.showAlert();
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
            getCertification : function () {
                this.$http({
                    url : baseUrl+'/iou/bankCard/getCertification',
                    method : 'GET',
                    params : {
                        userId:localStorage.userId
                    }
                }).then(
                    function (res) {
                        //成功
                        if(res.data.code=="200"){
                            model.ownerName = res.data.data.realName;
                            model.companyName = res.data.data.companyName;
                            model.idNo = res.data.data.idNo;
                        }else{
                            model.errorMsg=res.data.message;
                            model.showAlert();
                        }
                    },function (res) {
                        model.errorMsg=res.data.message;
                        model.showAlert();
                    }
                );
            },
            addCard : function () {
                var ownerName = '';
                if(model.bankAccType=='P'){
                    ownerName = model.ownerName;
                }else{
                    ownerName = model.companyName;
                }
                this.$http({
                    url : baseUrl+'/iou/bankCard/addCard',
                    method : 'POST',
                    params : {
                        userId:localStorage.userId,
                        bankAccType:model.bankAccType,//bankAccType,
                        bankCardNo:model.bankCardNo,//bankCardNo,6228480402564890110
                        bankIcon:'https://acc.by56.com:8443/bankcard/ICBC.png',//bankIcon,//银行卡号判断图标
                        bankName:model.bankName,//bankName,//银行卡号判断银行名称
                        cardType:model.cardType,//cardType,//银行卡号判断卡类型
                        idNo:model.idNo,//idNo,
                        mobile:model.mobile,//mobile,
                        ownerName:ownerName,//ownerName,
                        registerBankName:model.registerBankName//registerBankName
                    }
                }).then(
                    function (res) {
                        //成功
                        if(res.data.code=="200"){
                            model.errorMsg='银行卡添加成功';
                            model.showAlert();
                            location.href = 'cardManage.html';
                        }else{
                            model.errorMsg=res.data.message;
                            model.showAlert();
                        }
                    },function (res) {
                        model.errorMsg='添加银行卡失败';
                        model.showAlert();
                    }
                );
            },
            showAlert : function () {
                var alert = Vue.$alert({
                    visible:true,
                    msgType:error,
                    text1:model.errorMsg,
                    isCancel:false,
                    cancelCallback:function (e) {//取消回调
                        e.visible=false;
                    },
                    confirmCallback:function (e) {//确定回调
                        e.visible=false;
                    }
                });
                return alert;
            },
            choosePersonal:function () {
                model.personal = true;
                model.bankAccType = 'P';

            },
            chooseUnPersonal:function () {
                model.personal = false;
                model.bankAccType = 'E';
            }

        }
    })

})