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
            currHeadTit:'银行卡管理',
            isParent:true,
            personalCard:[],//个人账户的银行卡信用卡
            companyCard:[],//对公账户的银行卡信用卡
            bankCardNo:[],//银行卡号
            personalCardLength:'',//个人银行卡数量
            companyCardLength:'',//对公银行卡数量
            creditCardLength:'',//对私信用卡卡数量
            goto:'./accountSetting.html',
        },
        created : function () {
            this.queryBank();
        },
        methods:{
            queryBank : function () {
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
                                cardInfo.bankLogo = resData[i].bankIcon;
                                cardInfo.cardType = resData[i].cardType=='D'?'储蓄卡':'信用卡';
                                cardInfo.lastNum = resData[i].bankCardNo.substring(resData[i].bankCardNo.length-4,resData[i].bankCardNo.length);
                                cardInfo.userName = resData[i].ownerName;
                                cardInfo.isDefault = resData[i].isDefault=='Y'?true:false;
                                cardInfo.bankCardNo = resData[i].bankCardNo;
                                if(resData[i].bankAccType == 'P'){
                                    model.personalCard.push(cardInfo);
                                }else{
                                    model.companyCard.push(cardInfo);
                                }
                                cardInfo = {};
                            }
                            var index = 0;
                            for(var i=0;i<model.personalCard.length;i++){
                                if(model.personalCard[i].bankType=='C'){
                                    index++;
                                }
                            }
                            model.creditCardLength = index;
                            model.personalCardLength = model.personalCard.length;
                            model.companyCardLength = model.companyCard.length;

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
            deleteCard : function (bankCardNo) {
                this.$http({
                    url : baseUrl+'/iou/bankCard/deleteCard',
                    method : 'POST',
                    params : {
                        _method:'put',
                        bankCardNo:bankCardNo
                    }
                }).then(
                    function (res) {
                        //成功
                        if(res.data.code=="200"){
                            model.personalCard = [];
                            model.queryBank();
                        }else{
                            model.errorMsg=res.data.message||'删除失败';
                            model.showAlert();
                        }
                    },function (res) {
                        model.errorMsg=res.data.message||'删除失败';
                        model.showAlert();
                    }
                );
            },
            setDefault : function (bankCardNo) {
                this.$http({
                    url : baseUrl+'/iou/bankCard/setDefaultCard',
                    method : 'POST',
                    params : {
                        _method:'put',
                        bankCardNo:bankCardNo,
                        userId:localStorage.userId
                    }
                }).then(
                    function (res) {
                        //成功
                        if(res.data.code=="200"){
                            model.personalCard = [];
                            model.queryBank();
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
            toAddBankCard : function () {
                if(localStorage.authStatus == 'S'){
                    location.href = 'addCard.html';
                }else{
                    model.errorMsg='未完成实名认证';
                    model.showAlert();
                }
            }

        }
    })

})