/**
 * Created by Administrator on 2017/8/3.
 */
define(function(require,exports,module) {
    require('vue-resource');//引入
    require('header');//引入
    require('leftMenu');//引入
    require('footer');//引入
    require('common');//引入
    var tranId = Global.getUrlParam('tranId')||'';//从跳转链接获取参数
    var tranType = Global.getUrlParam('tranType')||'';//从跳转链接获取参数
    var tranNo = Global.getUrlParam('tranNo')||'';//从跳转链接获取参数
    var amount = Global.getUrlParam('amount')||'';//从跳转链接获取参数
    var model = new Vue({
        el:"#app",
        data :{
            contentHeight:window.innerHeight-67,
            parentHeadTit:'交易记录',
            currHeadTit:'交易详情',
            isParent:true,
            feeSummary:[],//费用信息
            refundSummary:[],//退款收款信息
            timeSummary:{},//创建时间
            tranSummary:{},//交易信息
            RefundFlag:false,//退款标识
            closeTimeFlag:false,//关闭时间标识
            refundSummaryObj:{},//退款对象
            tranType:'',
            goto:'./trans_record.html',
        },
        created : function () {
            this.queryDetail();
        },
        methods:{
            gotoPayment : function () {
                location.href = 'trans_payment.html?tranIds='+tranId+'&tranNo='+tranNo;
            },
            queryDetail : function () {
                this.$http({
                    url : baseUrl+'/iou/transaction/findTransactionDetail',
                    method : 'GET',
                    params : {
                        userId:localStorage.userId,
                        tranId:tranId,
                        tranType:tranType,
                        tranNo:tranNo,
                    },
                }).then(
                    function (res) {
                        //成功
                        if(res.data.code=="200"){
                            console.log(res);
                            model.tranType = tranType;
                            model.refundSummary = res.data.data.timeSummary;
                            model.timeSummary = res.data.data.timeSummary[0];
                            model.tranSummary = res.data.data.tranSummary;
                            console.log(model.timeSummary)
                            //付款有单独的参数否则用交易信息的参数
                            if(model.tranSummary.tranType=='Pay'){
                                model.feeSummary = res.data.data.feeSummary;
                            }else{
                                var obj = {
                                    billNo:model.tranSummary.tranNo,
                                    costName:model.tranSummary.tranTypeStr,
                                    billAmount:model.tranSummary.tranAmount
                                };
                                model.feeSummary.push(obj);
                            }
                            //只有退款才会显示退款表格否则只有时间
                            if(model.refundSummary.length>0){
                                RefundFlag = true;
                                mdoel.refundSummaryObj.closeTime = refundSummary[0].closeTime;
                            }

                        }else{

                        }
                    },function (res) {

                    }
                );
            }
        }
    })


})