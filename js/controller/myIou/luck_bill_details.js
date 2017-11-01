/**
 * Created by Administrator on 2017/8/3.
 */
define(function(require,exports,module) {
    require('vue-resource');//引入
    require('header');//引入
    require('leftMenu');//引入
    require('footer');//引入

    window.onresize = function(){
        model.contentWidth = document.body.clientWidth-210;
    }
    var model = new Vue({
        el:"#app",
        data :{
            contentWidth:document.body.clientWidth-210,
            contentHeight:window.innerHeight-67,
            parentHeadTit:'我的运条',
            currHeadTit:'账单详情',
            isParent:true,
            bills:{

                billDate:'',
                billMonth:'',
                createTime:null,
                createUser:null,
                currency:'',
                currentPayAmount:null,
                currentRepayAmount:null,
                endDate:'',
                id:'',
                overdueInterest:null,
                payDueDate:'',
                repayBillAmount:null,
                repayOverdueInterest:null,
                startDate:'',
                status:'',
                totalBillAmount:null,
                updateTime:null,
                updateUser:null,
                userId:'',
                waiteRepayAmount:null,
            },
            list_pay:[],
            list_refund:[],

        },
        beforeCreate : function () {
            this.$http({
                url:baseUrl+'/iou/userIou/billDetails',
                method:'GET',
                params:{
                    settledId:localStorage.id,
                }
            }).then(function(res){
                var resData = res.data.data;
                
                
                //状态: 'N':未还清, 'C':已还清, 'O':已逾期;
                this.bills.billDate =resData.billDate;
                this.bills.billMonth =resData.billMonth;
                this.bills.createTime =resData.createTime;
                this.bills.createUser =resData.currency;
                this.bills.currentPayAmount =resData.currentPayAmount;
                this.bills.currentRepayAmount =resData.currentRepayAmount;
                this.bills.endDate =resData.endDate;
                this.bills.id =resData.id;
                this.bills.status= resData.status;
                this.bills.overdueInterest = resData.overdueInterest;
                this.bills.payDueDate =resData.payDueDate;
                this.bills.repayBillAmount =resData.repayBillAmount;
                this.bills.repayOverdueInterest =resData.repayOverdueInterest;
                this.bills.startDate =resData.startDate;
                this.bills.totalBillAmount =resData.totalBillAmount;
                this.bills.updateTime =resData.updateTime;
                this.bills.updateUser =resData.updateUser;
                this.bills.userId =resData.userId;
                this.bills.waiteRepayAmount= resData.waiteRepayAmount;
                
            },function(){

            });
            
        },
        mounted : function () {

            this.pay();
            this.refund();
            

            this.pay();
            this.refund();
            

        },
        methods:{

            pay:function(){
                this.$http({
                    url:baseUrl+'/iou/userIou/billRecords',
                    method:'GET',
                    params:{
                        pageNum:localStorage.pageNum,
                        pageSize:localStorage.pageSize,
                        settledId:localStorage.id,
                        tranType:'P',
                    }
                }).then(function(res){
                    var resData = res.data.data;
                    //console.log(resData);
                    this.list_pay = resData.list;
                },function(){
    
                })
            },
            refund:function(){
                this.$http({
                    url:baseUrl+'/iou/userIou/billRecords',
                    method:'GET',
                    params:{
                        pageNum:localStorage.pageNum,
                        pageSize:localStorage.pageSize,
                        settledId:localStorage.id,
                        tranType:'R',
                    }
                }).then(function(res){
                    var resData = res.data.data;
                    console.log(resData);
                    this.list_refund = resData.list;
                },function(){
    
                })
            }
            
        }
    })
});
//选项卡
function setTab(name, cursel, n) {
    for(i = 1; i <= n; i++) {
        var menu = document.getElementById(name + i);
        if(menu != null && menu != undefined){
            menu.className = i == cursel ? "hover" : "";
        }

        var con = document.getElementById("con-" + name + "-" + i);
        if(con!= null && con != undefined){
            con.style.display = i == cursel ? "block" : "none";
        }
    }
}