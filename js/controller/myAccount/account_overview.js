/**
 * Created by Administrator on 2017/8/3.
 */

define(function(require,exports,module) {
    require('vue-resource');//引入
    require('header');//引入
    require('leftMenu');//引入
    require('footer');//引入
    require('common');//引入

    window.onresize = function(){
        model.contentWidth = document.body.clientWidth-210;
    }
    var model = new Vue({
        el:"#app",
        data :{
            contentHeight:window.innerHeight-67,
            parentHeadTit:'', // 父路径名称
            isParent : false, //是否有父路径
            currHeadTit:'账户总览',
            CNYBalance:'', //人民币账户余额
            USDBalance:'', //人民币账户余额
            payables:'', //待还款
            creditScore:'', //信用积分
            creditQuota:'', //信用总额度
            balance:'', //可用额度
            updateTime:'', //更新时间
            tranRecords:[], //交易记录数组
            payBackText:'', //还款入口文字
            iouStatus:'', //运条状态
            payBackFlag:false //还款金额弹窗
        },
        mounted : function () {
            this.queryBasicInfo();
            this.getUserStatus();
            this.iouStatus = localStorage.iouStatus;
        },
        methods:{
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
            toRecharge : function () {
                if(ifOpenIou.tranPwdFlag==true&&ifOpenIou.securityFlag==true){
                    location.href = 'account_recharge.html';
                }else{
                    model.errorMsg='请完成密保问题和支付密码设置';
                    model.showAlert();
                }

            },
            toWithdrawDeposit : function () {
                if(ifOpenIou.tranPwdFlag==true&&ifOpenIou.securityFlag==true&&ifOpenIou.authStatus=='S'){
                    location.href = 'account_wd.html';
                }else{
                    model.errorMsg='请完成密保问题，支付密码设置和实名认证';
                    model.showAlert();
                }

            },
            payBack : function () {
                if(model.iouStatus == 4){
                    //已经开通运条跳转到开通运条页面
                    location.href = '../myIou/my_luck.html';
                }else{
                    //弹窗输入还款金额
                    //model.payBackFlag = true;
                    location.href = '../myIou/openIou.html';
                }

            },
            toDetail : function (el) {
                var tranId = el.id;
                var tranType = el.tranType;
                var tranNo = el.tranNo;
                location.href = '../orderRecord/trans_info_tip.html?tranId='+tranId+'&tranType='+tranType+'&tranNo='+tranNo;
        },
            toTransRecord : function () {
                location.href = '../orderRecord/trans_record.html';
            },
            toPay : function (el) {
                var tranIds = el.id;
                var amount = el.amount;
                var tranNo = el.tranNo;
                location.href = '../orderRecord/trans_payment.html?tranIds='+tranIds+'&payAmount='+amount+'&tranNo='+tranNo;
            },
            queryBasicInfo : function () {
                this.$http({
                    url : baseUrl+'/iou/account/overview',
                    method : 'GET',
                    params : {
                        userId:localStorage.userId
                    },
                }).then(
                    function (res) {
                        //成功
                        if(res.data.code=="200"){
                            var resData = res.data.data;
                            model.CNYBalance = resData.accountBalance.CNYBalance ==''||resData.accountBalance.CNYBalance==null?resData.accountBalance.CNYBalance=0:resData.accountBalance.CNYBalance;
                            model.USDBalance = resData.accountBalance.USDBalance==''||resData.accountBalance.USDBalance==null?resData.accountBalance.USDBalance=0:resData.accountBalance.USDBalance;
                            model.payables = resData.iou.payables==''||resData.iou.payables==null?resData.iou.payables=0:resData.iou.payables;
                            model.creditScore = resData.iou.creditScore==''||resData.iou.creditScore==null?resData.iou.creditScore=0:resData.iou.creditScore;
                            model.updateTime = resData.iou.createTime==''||resData.iou.createTime==null?resData.iou.createTime='无':resData.iou.updateTime;
                            model.tranRecords = resData.tranRecords;
                            model.creditQuota = resData.iou.creditQuota;
                            model.balance = resData.iou.balance==null||resData.iou.balance==''?0:resData.iou.balance;

                            if(model.iouStatus==4){
                                model.payBackText = '详情';
                            }else{
                                model.payBackText = '开通运条';
                            }
                        }else{

                        }
                    },function (res) {

                    }
                );
            },
            getUserStatus : function () {
                this.$http({
                    url : baseUrl+'/iou/user/userStatus',
                    method : 'GET',
                    params : {
                        userId:localStorage.userId
                    },
                }).then(
                    function (res) {
                        //成功
                        if(res.data.code=="200"){
                            var resData = res.data.data;
                            localStorage.avatarImg = resData.avatarImg;
                            model.bankCardNum = resData.bankCardNum;
                            model.emailFlag = resData.emailFlag;
                            model.mobile = resData.mobile;
                            model.securityFlag = resData.securityFlag;
                            model.tranPwdFlag = resData.tranPwdFlag;

                            model.userFrom = resData.userFrom;
                            localStorage.userFrom = resData.userFrom;

                            model.iouStatus = resData.iouStatus;
                            localStorage.iouStatus = resData.iouStatus;

                            model.userType = resData.userType;
                            localStorage.userType = resData.userType;

                            model.username = resData.username;
                            model.email = resData.email==null?'':resData.email;
                        }else{

                        }
                    },function (res) {

                    }
                );
            },

            myTerms : function () {
               location.href='../myIou/my_luck.html';
            },
            myCNY:function () {
                location.href = '../orderRecord/trans_record.html?currency=CNY';
            },
            myUSD:function () {
                location.href = '../orderRecord/trans_record.html?currency=USD';
            }
        }
    })
})