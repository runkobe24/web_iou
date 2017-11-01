/**
 * Created by Administrator on 2017/7/17.
 */
Vue.component('fs-left', {
    template:   '<div class="leftMenu" :style="{height:menuHeight+\'px\'}">' +
                    '<div class="via">' +
                        '<img class="viaImg" src="../../images/leftLogo.png" @click="fsBy56()"/>'+
                    '</div>'+
                    '<ul class="menuList">' +
                        '<li @click="toAccount"><div @mouseenter="enter1" @mouseleave="leave1"><img :src="img1"/><span>账户总览</span></div></li>'+
                        '<li @click="toIou" v-if="msg"><div @mouseenter="enter2" @mouseleave="leave2"><img :src="img2"/><span>我的运条</span></div></li>'+
                        '<li @click="toOrderRecord"><div @mouseenter="enter3" @mouseleave="leave3"><img style="width: 15px" :src="img3"/><span>交易记录</span></div></li>'+
                    '</ul>'+
                '</div>',
    data : function () {
        return {
            menuHeight : window.innerHeight,
            img1 : '../../images/leftList-icon1.png',
            img2 : '../../images/leftList-icon2.png',
            img3 : '../../images/leftList-icon3.png',
            msg:'',
        }
    },
    beforeCreate:function(){
        //判断是否登录，没有登录不能进入账户页
        if(window.location.pathname=="/pages/help.html"||localStorage.userId!=undefined||localStorage.userType!=undefined){
                //未登录可以进入到指南页面
        }else{
            if(localStorage.userId==""||localStorage.userId==undefined){
                location.href='/index.html';
            }
        }
    },
    mounted:function(){
        window.onresize = function(){
            this.menuHeight =window.outerHeight-90;
        }
        this.isIou();
    },
    methods:{
        toAccountSetting : function () {
            location.href = 'accountSetting.html';
        },
        enter1 : function () {
            this.img1 = '../../images/leftList-icon1-select.png'
        },
        leave1 : function () {
            this.img1 = '../../images/leftList-icon1.png'
        },
        enter2 : function () {
            this.img2 = '../../images/leftList-icon2-select.png'
        },
        leave2 : function () {
            this.img2 = '../../images/leftList-icon2.png'
        },
        enter3 : function () {
            this.img3 = '../../images/leftList-icon3-select.png'
        },
        leave3 : function () {
            this.img3 = '../../images/leftList-icon3.png'
        },
        toAccount : function () {
            location.href='/pages/myAccount/account_overview.html'
        },
        toIou : function () {
            location.href='/pages/myIou/my_luck.html'
        },
        toOrderRecord : function () {
            location.href='/pages/orderRecord/trans_record.html'
        },
        fsBy56 : function () {
            location.href='../../index.html';
        },
        isIou :function(){
            this.$http({
                url:baseUrl+'/iou/user/userStatus',
                method:'GET',
                params:{
                    userId:localStorage.userId
                }
            }).then(function(res){
                var resData = res.data.data;               
                if(resData.iouStatus ==4){
                    this.msg=true;
                }
                
            })
        }
    }
})
