/**
 * Created by Administrator on 2017/7/25.
 */
define(function(require,exports,module) {
    require('vue-resource');//引入
    require('header');//引入
    require('leftMenu');//引入
    require('footer');//引入
    var scrollWidth =0;
    function getScrollWidth() {
        //思路就是设置一个div没有滚动条的,获取其宽度,然后再让其拥有滚动条,在获取宽度,取差值
        var noScroll, scroll, oDiv = document.createElement("DIV");
        oDiv.style.cssText = "position:absolute; top:-1000px; width:100px; height:100px; overflow:hidden;";
        noScroll = document.body.appendChild(oDiv).clientWidth;
        oDiv.style.overflowY = "scroll";
        scroll = oDiv.clientWidth;
        document.body.removeChild(oDiv);
        scrollWidth =  noScroll-scroll;
    }
    if (document.body.style.overflow!="hidden"&&document.body.scroll!="no"&&document.body.scrollHeight>document.body.offsetHeight) {
        getScrollWidth();
    } else {
        scrollWidth=0;
        document.scrollHeight;
        document.body.scrollHeight;
        $("#app").height();
    }
    window.onresize = function(){
        model.contentWidth = document.body.clientWidth-210;
    }
    var model = new Vue({
        el:"#app",
        data :{
            contentWidth:document.body.clientWidth-210,
            contentHeight:window.innerHeight-85,
            parentHeadTit:'',
            currHeadTit:'账户设置',
            isParent : true,
            authStatus : '',
            payPasswordText:'',//支付密码设置状态
            securityFlagText:'',//密保问题设置状态
            avatarImg:'',//用户头像
            bankCardNum:'',//银行数量
            emailFlag:'',//是否绑定邮箱
            isFromBy56:'',//是否来自百运网
            mobile:'',//用户绑定手机号
            securityFlag:'',//是否填写密保信息
            tranPwdFlag:'',//是否设置交易密码
            userFrom:'',//用户来源
            userType:'',//用户类型
            iouStatus:'',//运条开通状态
            username:'',//用户名
            email:''//邮箱地址


        },
        created : function () {
            this.authStatus = localStorage.authStatus;
            if(localStorage.tranPwdFlag){
                this.payPasswordText = "修改";
            }else{
                this.payPasswordText = "设置";
            }
            if(localStorage.securityFlag){
                this.securityFlagText = "修改";
            }else{
                this.securityFlagText = "设置";
            }
        },
        mounted:function(){
            this.getUserStatus();
        },
        methods:{
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
                            model.mobile = resData.mobile.substring(0,3)+'****'+resData.mobile.substring(7,11);
                            model.securityFlag = resData.securityFlag;
                            model.tranPwdFlag = resData.tranPwdFlag;

                            model.userFrom = resData.userFrom;
                            localStorage.userFrom = resData.userFrom;

                            model.iouStatus = resData.iouStatus;
                            localStorage.iouStatus = resData.iouStatus;

                            model.userType = resData.userType;
                            localStorage.userType = resData.userType;

                            model.username = resData.username;
                            model.email = resData.email ? resData.email : '';
                        }else{

                        }
                    },function (res) {

                    }
                );
            },
            toAuthentication : function () {
                location.href='./authentication.html';
            },
            toCardManage : function () {
                location.href='./cardManage.html';
            },
            toAddCard : function () {
                location.href='./addCard.html';
            },
            toUpdateEmail : function () {
                location.href='./updateEmail.html';
            },
            toUpdateLoginPw : function () {
                location.href='./updateLoginPw.html';
            },
            toUpdatePayPw : function () {
                //先判断是否设置过支付密码，没有的话就进行设置，设置过了可以点击修改
                if(!localStorage.tranPwdFlag){
                    location.href='./setPayPwd.html';
                }else{
                    location.href='./updatePayPw.html';
                }

            },
            toUpdatePayQues : function () {
                location.href='./updatePayQues.html';
            }
        }
    })


})