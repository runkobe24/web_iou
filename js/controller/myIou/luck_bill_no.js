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
            currHeadTit:'运条账单',
            isParent:true,
            page:{
                pageNum:1,
                pageSize:5,
                pages:null,
                total:null,
            },
            list:[],
            list_money : [],
            list_total :'',
            list_refund:[],
            list_totalRefund:'',
            

        },
        beforeCreate : function () {

        },
        mounted : function () {
            this.$http({
                url:baseUrl+'/iou/userIou/unsettledBills',
                method:'GET',
                params:{
                    accNoSub:localStorage.accNoSub,
                    pageNum:this.page.pageNum,
                    pageSize:this.page.pageSize,
                },
            }).then(function(res){
                var resData = res.data.data;
                console.log(resData);
                this.page.pageNum = resData.pageNum;
                this.page.pageSize =resData.pageSize;
                this.page.total = resData.total;
                this.page.pages = resData.pages;
                this.page.total = resData.total;
                this.list = resData.list;

                //----------金额相加 start---------;
                for(var i = 0;i<this.list.length;i++){
                    this.list_money.push(this.list[i].amount);
                }                                
                Array.prototype.sumadd = function (){
                    return this.reduce(function (partial, value){
                     return partial + value;
                    })
                };                                
                this.list_total = this.list_money.sumadd();
                
                //-------退换金额 start-------;
                for(var i = 0;i<this.list.length;i++){
                    
                    if(this.list[i].tranType == 'Pay'){
                        this.list_refund.push(this.list[i].amount);
                        
                    } 
                }
                
                this.list_totalRefund = this.list_refund.sumadd();
                

                //-------退换金额 end-------;
            },function(){

            })
        },
        methods:{
            handleSizeChange(val){
                this.page.pageNum=1;
                this.page.pageSize=val;
            },
            handleCurrentChange(val){
                this.page.pageNum=val;
            }
        }
    })


})