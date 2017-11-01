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
            parentHeadTit:'账户总览',
            currHeadTit:'信用详情',
            isParent:true,
            autorized: {
                type: String,
                default: 'N',
                validator: function(v) {
                    return v === 'N' || v === 'I' || v === 'S' || v === 'F';
                }
            }, // 实名认证
            emailBound: {
                type: Boolean
            }, // 邮箱认证
            iouPaid: false, // 归还运条
            iouActivated: {
                type: Number
            }, // 运条开通
            creditScore: 0, // 信用积分
            creditScoreLastMonth: 0 // 上月信用积分
        },
        computed: {
            //评估时间
            evalDate: function() {
                return this.parseDate(new Date());
            },
            evalPic: function() {
                if(this.creditScore > this.creditScoreLastMonth) {
                    return '../../images/icons-arrows_up.png';
                }
                if(this.creditScore < this.creditScoreLastMonth) {
                    return '../../images/icons-arrows_down.png';
                }
                else {
                    return '';
                }
            }
        },
        beforeCreate : function () {
            var self = this;
            this.$http({
                url : baseUrl + '/iou/account/overview',
                method : 'GET',
                params : {
                    userId:localStorage.userId
                },
            }).then(
                function (res) {
                    this.creditScore = res.data.data.iou.creditScore || 0;
                    this.creditScoreLastMonth = res.data.data.iou.lastCreditScore || 0;
                },function (res) {
                    
                }
            );
            this.$http({
                url : baseUrl + '/iou/userIou/myIou',
                method : 'GET',
                params : {
                    userId:localStorage.userId,
                },
            }).then(function(res){
                var waiteRepayAmount = res.data && res.data.waiteRepayAmount;
                self.iouPaid = !Number(waiteRepayAmount);
            },function(){
                
            })
        },
        methods:{
            processUserInfo: function(userInfo) {
                this.$nextTick(function() {
                    this.autorized = userInfo.authStatus.trim();
                    this.emailBound = !!userInfo.emailFlag;
                    this.iouActivated = Number(userInfo.iouStatus);
                    // this.iouActivated = 4;
                    // console.log(userInfo);
                })
            },
            parseDate: function(d) {
                var year = d.getFullYear();
                var month = this.parseDoubleDigits(d.getMonth() + 1);
                var day = this.parseDoubleDigits(d.getDate());
                return year + '-' + month + '-' + day;
            },
            parseDoubleDigits: function(n) {
                return n > 9 ? n.toString() : '0' + n;
            }
        }
    })


})