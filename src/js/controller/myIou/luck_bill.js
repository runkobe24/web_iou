/**
 * Created by Administrator on 2017/8/3.
 */
define(function(require,exports,module) {
    require('vue-resource');//引入
    require('header');//引入
    require('leftMenu');//引入
    require('footer');//引入
    require('math');//引入
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
            goto:'./my_luck.html',         
            pickerOptions0:{
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
            },
            page:{
                startTime:'',
                endTime:'',
                pageNum:null,//当前页
                pageSize:null,//每页数据条数
                total:null,                
            },
            list:[],
        },
        beforeCreate : function () {
            this.$http({
                url:baseUrl+'/iou/userIou/settledBills',
                method:'GET',
                params:{
                    accNoSub:localStorage.accNoSub,
                }
            }).then(function(res){
                var resData = res.data.data;
                console.log(resData);
                this.list = resData.list;
                this.page.total = resData.total;
                this.page.pageNum = resData.pageNum;                    
                this.page.pageSize = resData.pageSize;
                this.page.pages = resData.pages;
            },function(){

            })
        },
        mounted : function () {

        },
        methods:{

            setStarttime(val){
                this.page.startTime = val;
            },
            setEndtime(val){
                this.page.endTime = val;
            },
            queryZd:function(){

                this.list = [];

                this.$http({
                    url:baseUrl+'/iou/userIou/settledBills',
                    method:'GET',
                    params:{
                        accNoSub:localStorage.accNoSub,
                        startTime:this.page.startTime,
                        endTime:this.page.endTime,
                        pageNum:this.page.pageNum,
                        pageSize:this.pageSize
                    }
                

                

                }).then(function(res){
                                                            
                    //console.log(localStorage.accNoSub);
                    var resData = res.data.data;
                    //console.log(resData);

                    this.page.total = resData.total;
                    this.page.pageNum = resData.pageNum;                    
                    this.page.pageSize = resData.pageSize;
                    this.page.pages = resData.pages;
                    this.list = resData.list;
                },function(){
                    console.log('请求失败');
                })
            },
            handleSizeChange(val) {
                this.page.pageNum=1;
                this.page.pageSize=val;
            },

            handleCurrentChange(val) {
                this.page.pageNum=val;
            },
            goxiangqing:function(el){
                var id = el.id;
                console.log(id);
                localStorage.id = id;                
                localStorage.pageNum = this.page.pageNum;
                localStorage.pageSize =	this.page.pageSize;
                //localStorage.tranType = this.page.
                window.location = 'luck_bill_details.html';
            }
        }
        
    })

})