/**
 * Created by Administrator on 2017/8/3.
 */
define(function(require,exports,module) {
    require('vue-resource');//引入
    require('header');//引入
    require('leftMenu');//引入
    require('footer');//引入
    require('common');//引入

    var model = new Vue({
        el:"#app",
        data :{
            contentWidth:document.body.clientWidth-210,
            contentHeight:window.innerHeight-67,
            parentHeadTit:'账户总览',
            currHeadTit:'提现',
            isParent:true,
            balance:'',//可提现余额
            bankListD:[],//银行列表
            bankListC:[],//信用卡列表
            subOpenBank:'',//开户支行名称
            bankProv:'',
            bankCity:'',
            cardNo:'',
            money:'',
            openBank:'',
            purpose:'提现',
            tranPwd:'',
            userName:'',


            options1: [],//省List
            value1: '',//选中的
            options2: [],//市List
            value2: '',
            errFlag: false,
            pwdFlag: false,
            errText: '',
            goto:'./account_overview.html',
        },
        created : function () {
            this.getBalance();
            this.getBankCard();
            this.getPosition();
        },
        watch : {
            value1:function (newValue, oldValue) {//选择了省份则查对应的城市
                model.bankProv = $("#province input").val();
                model.getPosition(newValue,2);
                model.value2='';
                model.bankCity='';
            },
            value2:function (newValue, oldValue) {//选择了城市则查对应的地区
                model.bankCity = $("#city input").val();
            },
            money:function (newValue, oldValue) {//监听提现金额
                if(newValue>50000){
                    model.errFlag=true;
                }else{
                    model.errFlag=false;
                }
            }
        },
        methods:{
            getCardInfo : function (el) {
                model.cardNo = el.bankCardNo;
                model.openBank = el.bankName;
                model.cardNo = el.bankCardNo;
                model.userName = el.ownerName;
            },
            getPosition : function (areaId,level) {
                this.$http({
                    url : baseUrl+'/iou/base/linkageAreaList',
                    method : 'GET',
                    params : {
                        areaId:areaId,
                        level:level
                    },
                    //emulateJSON:true
                }).then(
                    function (res) {
                        //成功
                        if(res.data.code=="200"){
                            var resData = res.data.data;
                            var innerObj = {};
                            if(level==1||level==''||level==undefined){
                                for(var i=0;i<resData.length;i++){
                                    var innerObj = {value:resData[i].areaId,label:resData[i].areaName};
                                    model.options1.push(innerObj);
                                }
                            }
                            if(level==2){
                                model.options2=[];
                                for(var i=0;i<resData.length;i++){
                                    var innerObj = {value:resData[i].areaId,label:resData[i].areaName};
                                    model.options2.push(innerObj);
                                }
                            }

                        }else{

                        }
                    },function (res) {

                    }
                );
            },
            toAddBankCard : function () {
                location.href='../accountSetting/addCard.html';
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
            withdrawApply : function () {
                this.$http({
                    url : baseUrl+'/iou/chinapay/withdrawApply',
                    method : 'POST',
                    params : {
                        bankCity:$("#city input").val(),
                        bankProv:$("#province input").val(),
                        cardNo:model.cardNo,
                        money:model.money,
                        openBank:model.openBank,
                        purpose:model.purpose,
                        subOpenBank:model.subOpenBank,
                        tranPwd:model.tranPwd,
                        userId:localStorage.userId,
                        userName:model.userName
                    }
                }).then(
                    function (res) {
                        //成功
                        if(res.data.code=="200"){
                            location.href = 'account_overview.html';
                        }else{
                            model.errText=res.data.message;
                            model.pwdFlag=true;
                        }
                    },function (res) {

                    }
                );
            },
            getBankCard : function () {//查询银行卡
                this.$http({
                    url : baseUrl+'/iou/bankCard/findUserCard',
                    method : 'GET',
                    params : {userId:localStorage.userId}
                }).then(
                    function (res) {
                        //成功
                        if(res.data.code=="200"){
                            var resData = res.data.data;
                            var cardInfo = {};

                            for(var i=0;i<resData.length;i++){
                                    if(resData[i].cardType=='D'){//借记卡
                                    cardInfo.bankIcon = resData[i].bankIcon;
                                    cardInfo.id = i;
                                    cardInfo.bankCardNo = resData[i].bankCardNo;
                                    cardInfo.bankName = resData[i].bankName;
                                    cardInfo.ownerName = resData[i].ownerName;
                                    model.bankListD.push(cardInfo);
                                    cardInfo = {};
                                }
                                if(resData[i].cardType=='C'){//信用卡
                                    for(var i=0;i<resData.length;i++){
                                        cardInfo.bankIcon = resData[i].bankIcon;
                                        cardInfo.id = i;
                                        cardInfo.bankCardNo = resData[i].bankCardNo;
                                        cardInfo.bankName = resData[i].bankName;
                                        cardInfo.ownerName = resData[i].ownerName;
                                        model.bankListC.push(cardInfo);
                                        cardInfo = {};
                                    }
                                }
                            };
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
            toPayPwdconditionVerify : function () {
                location.href = '../accountSetting/payPwdconditionVerify.html?condition=security';
            },

        }
    })


})