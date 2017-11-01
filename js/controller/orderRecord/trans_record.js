/**
 * Created by Administrator on 2017/8/3.
 */
define(function(require,exports,module) {
    require('vue-resource');//引入
    require('header');//引入
    require('leftMenu');//引入
    require('footer');//引入
    require('math');//引入
    require('common');//引入
    var currency = Global.getUrlParam('currency');

    var model = new Vue({
        el:"#app",
        data :{
            contentHeight:window.innerHeight-67,
            parentHeadTit:'我的运条',
            currHeadTit:'全部交易记录',
            isParent:true,
            tabFlag:true,//默认显示第一个tab
            pickerOptions0: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
            },
            pickerOptions1: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            },
            multipleSelection: [],
            //交易记录
            page : {
                startTime: '',
                endTime: '',
                tranNo: null,
                status: '',
                tranType: '',
                currency: 'CNY',
                pageData : null,
                pageNum:null,
                pageSize:null,
                total:null,
                pages:null
            },
            tranType:'',
            status:'',
            //收支明细
            page2 : {
                startTime: '',
                endTime: '',
                tranType: '',
                currency: 'CNY',
                pageData: null,
                incomming: null,
                expending: null,

                pageNum:null,
                pageSize:null,
                total:null,
                pages:null
            }

        },
        created : function () {
            if(currency==''){
            }else{
                this.page2.currency = currency;
                this.tabFlag=false;
            }
            this.queryPage();
            this.queryPage2();
        },
        watch : {
            'page.pageNum':"queryPage",
            'page.pageSize':"queryPage",
            'page2.pageNum':"queryPage2",
            'page2.pageSize':"queryPage2"
        },
        methods:{

            toggleSelection(rows) {
                if (rows) {
                    rows.forEach(row => {
                        this.$refs.multipleTable.toggleRowSelection(row);
                    });
                } else {
                    this.$refs.multipleTable.clearSelection();
                }
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },

            //交易记录
            tranTypeTrans1(val){
                this.page.tranType=val;
            },
            statusTrans(val){
                this.page.status=val;
            },
            currencyTrans1(val){
                this.page.currency=val;
            },
            setStartDate1(val){
                this.page.startTime = val;
            },
            setEndDate1(val){
                this.page.endTime = val;
            },

            queryPage() {
                this.$http({
                    url : baseUrl+'/iou/transaction/findTranRecord',
                    method : 'GET',
                    credentials : true,//允许跨域传入cookie
                    params : {
                        'userId':localStorage.userId,
                        // 'userId':'userid:c40aff1dc633489d897f77ba14a77ad1',
                        'pageNum':this.page.pageNum,
                        'pageSize':this.page.pageSize,
                        'startTime':this.page.startTime,
                        'endTime':this.page.endTime,
                        'tranNo':this.page.tranNo,
                        'tranType':this.page.tranType,
                        'status':this.page.status,
                        'currency':this.page.currency
                    }
                    //emulateJSON:true
                }).then(
                    function (res) {
                        //成功
                        if(res.data.code=="200"){
                            this.page.pageData = res.data.data;
                            //分页参数
                            this.page.pageNum = res.data.data.pageNum;
                            this.page.pageSize = res.data.data.pageSize;
                            this.page.total = res.data.data.total;
                            this.page.pages = res.data.data.pages;
                        }else{
                            //系统异常
                        }
                    },function (res) {
                        //失败
                    }

                );
            },

            //账户余额收支明细
            setStartDate2(val){
                this.page2.startTime = val;
            },
            setEndDate2(val){
                this.page2.endTime = val;
            },
            tranTypeTrans2(val){
                this.page2.tranType=val;
            },
            currencyTrans2(val){
                this.page2.currency=val;
            },

            queryPage2(){
                this.$http({
                    url : baseUrl+'/iou/transaction/findAccBalDetail',
                    method : 'GET',
                    credentials : true,//允许跨域传入cookie
                    params : {
                        'userId':localStorage.userId,
                        //'userId':'userid:c40aff1dc633489d897f77ba14a77ad1',
                        'pageNum':this.page2.pageNum,
                        'pageSize':this.page2.pageSize,
                        'startTime':this.page2.startTime,
                        'endTime':this.page2.endTime,
                        'tranType':this.page2.tranType,
                        'currency':this.page2.currency
                    }
                    //emulateJSON:true
                }).then(
                    function (res) {
                        //成功
                        if(res.data.code=="200"){
                            this.page2.pageData = res.data.data;
                            //分页参数
                            this.page2.pageNum = res.data.data.pageNum;
                            this.page2.pageSize = res.data.data.pageSize;
                            this.page2.total = res.data.data.total;
                            this.page2.pages = res.data.data.pages;

                            //计算收入和支出
                            var incomming = 0;
                            var expending = 0;
                            var dataList = res.data.data.list;
                            for(item in dataList){
                                if(dataList[item].tranType == 'Topup' || dataList[item].tranType == 'Refund'){
                                    //收入
                                    incomming = incomming.add(dataList[item].amount);
                                }else{
                                    //支出
                                    expending = expending.add(dataList[item].amount);
                                }
                            }
                            this.page2.incomming = incomming;
                            this.page2.expending = expending;

                        }else{
                            //系统异常
                        }
                    },function (res) {
                        //失败
                    }

                );
            },
            tebExchange1 : function () {
              model.tabFlag = true;
            },
            tebExchange2 : function () {
              model.tabFlag = false;
            },
            handleSizeChange(val) {
                this.page.pageNum=1;
                this.page.pageSize=val;
            },

            handleCurrentChange(val) {
                this.page.pageNum=val;
            },

            handleSizeChange2(val) {
                this.page.pageNum=1;
                this.page2.pageSize=val;
            },

            handleCurrentChange2(val) {
                this.page2.pageNum=val;
            }
        }
    })
});
