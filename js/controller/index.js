/**
 * Created by cy on 2017/7/6.
 */
define(function(require,exports,module) {
    require('vue-resource');//引入
    require('common');//引入
    require('alert');//引入
    var model = new Vue({
            el:"#app",
        data:{
                contentHeight:window.innerHeight-30,
                userName:"请登录",
                loginFlag:loginFlag,
                banner1:'../images/banner1.png',
                color : "red",
                banner2:'../images/banner2.png',
                banner3:'../images/banner3.png',
                tabFlag:true,//显示首页或者运条内容
                tabClass:true,//头部tab标签颜色标识
                pageNum:1,//当前banner图1,2,3
                footMarginTop:window.innerHeight-30-204-83
        },
        mounted: function () {
            document.onkeydown=function(event){
                var e = event || window.event || arguments.callee.caller.arguments[0];

                if(e && e.keyCode==13){ // 按 up
                    //enter键登录
                    loginAlert.login();
                }
                if(!(model.pageNum==1)){
                    if(e && e.keyCode==38){ // 按 up
                        //要做的事情
                        if(!(model.pageNum==1)){
                            model.moveDown();
                        }

                    }
                }
                if(!(model.pageNum==3)){
                    if(e && e.keyCode==40){ // 按 down
                        //要做的事情
                        if(!(model.pageNum==3)){
                            model.moveUp();
                        }
                    }
                }
            };
            function throttle (fn, limit) {
              var wait = false;
              
              return function () {
                if (!wait) {
                  fn.call();
                  wait = true;
                  setTimeout(function () {
                    wait = false;
                  }, limit);
                }
              }
            }
            document.body.onmousewheel = throttle(function(event) {
                event = event || window.event;
                if(event.wheelDelta>0){
                    if(!(model.pageNum==1)){
                        model.moveDown();
                    }
                }else{
                    if(!(model.pageNum==3)) {
                        model.moveUp();
                    }
                }
            }, 800);
            //兼容火狐
            document.body.addEventListener("DOMMouseScroll", throttle(function(event) {
                event = event || window.event;
                if(event.detail<0){
                    if(!(model.pageNum==1)){
                        model.moveDown();
                    }
                }else{
                    if(!(model.pageNum==3)) {
                        model.moveUp();
                    }
                }
            }, 800));
        },
        methods:{
            moveUp : function () {
                var top = model.contentHeight;
                model.pageNum++;
                $(".slides").animate({top: "-="+top+"px"
                },500,function(){
                    //回调函数

                });
            },
            moveDown : function () {
                var top = model.contentHeight;
                model.pageNum--;
                $(".slides").animate({top: "+="+top+"px"
                },500,function(){
                    //回调函数
                });
            },
            toOne : function () {//第一页
                if(model.pageNum==2){
                    model.moveDown();
                }
                if(model.pageNum==3){
                    //重写model.moveDown();加快移动时间
                    var top = model.contentHeight*2;
                    $(".slides").animate({top: "+="+top+"px"
                    },500,function(){
                        //回调函数
                        model.pageNum--;
                        model.pageNum--;
                    });
                }
            },
            toTwo : function () {//第二页
                if(model.pageNum==1){
                    model.moveUp();
                }
                if(model.pageNum==3){
                    model.moveDown();
                }
            },
            toThree : function () {//第三页
                if(model.pageNum==1){
                    //重写model.moveUp();加快移动时间两倍距离
                    var top = model.contentHeight*2;
                    $(".slides").animate({top: "-="+top+"px"
                    },500,function(){
                        //回调函数
                        model.pageNum++;
                        model.pageNum++;
                    });
                }
                if(model.pageNum==2){
                    model.moveUp();
                }
            },
            toBy56 : function () {
                location.href='http://sub.by56.com/CSTCenter/Member.aspx';
            },
            toHowToUse : function () {
                location.href='pages/help.html';
            },
            toRegister : function () {
                location.href = '../pages/register.html';
            },
            toMyAccount : function () {
                location.href = '../../pages/myAccount/account_overview.html';
            },
            atFirstPage : function () {
                model.tabFlag = true;
                model.tabClass = true;

            },
            atYtPage : function () {
                model.tabFlag = false;
                model.tabClass = false;
            },
            showLogin : function () {
                loginAlert.visible=true;
                loginAlert.userName = '';
                loginAlert.password = '';
                //$(document.body).css("overflow","hidden");
            },
            pushUp :function () {
                alert(1);
            },
            //退出
            loginOut:function () {
                this.$http({
                    url : baseUrl+'/iou/login/logout',
                    method : 'POST',
                    params : {
                        'userId':localStorage.userId
                    }
                    //emulateJSON:true
                }).then(
                    function (res) {
                        //成功
                        if(res.data.code=="200"){
                            //退出清除登录信息缓存
                            localStorage.removeItem("userId");
                            localStorage.removeItem("userName");
                            loginFlag = false;
                            location.href='../../index.html'
                        }else{
                            //系统异常
                        }
                    },function (res) {
                        //失败

                    }

                );
            },
            openIou : function () {
                Vue.$alert({
                    visible:true,
                    msgType:warning,
                    text1:'请先进行支付密码设置，实名认证，密保问题设置！',
                    cancelCallback:function (e) {//取消回调
                        e.visible=false;
                    },
                    confirmCallback:function (e) {//确定回调
                        //判断个人认证还是企业认证
                        if(model.selected==true){
                            //个人
                            location.href='personApprove.html';
                        }else{
                            if(ifOpenIou.authStatus == false){
                                location.href = 'pages/accountSetting/updatePayPw.html';
                            }else if(ifOpenIou.securityFlag){
                                location.href = 'pages/accountSetting/updatePayQues.html';
                            }else if(ifOpenIou.securityFlag == "N"||ifOpenIou.securityFlag == "F"){
                                location.href = 'pages/accountSetting/updatePayQues.html';
                            }
                            //企业
                            location.href='companyApprove.html';
                        }
                    }
                });
            }
        }
    });

    //登录弹窗实例
    var loginAlert = new Vue({
        el:'#loginAlert',
        data:{
            userName:'',
            password:'',
            errMsg:'',//错误信息
            errFlag:false,//控制错误信息的消失时间
            visible:false
        },
        methods:{
            hideLogin:function () {
                loginAlert.visible=false;
                //$(document.body).css("overflow","auto");
            },
            toRegister : function () {
                location.href = '../pages/register.html';
            },
            //点击登录进行参数校验，通过方可调用登录接口
            paramVerify:function () {
                if(Global.moblieVerify(loginAlert.userName)){
                    loginAlert.login();
                }else{
                    loginAlert.errMsg='请输入有效的手机号码';
                    loginAlert.errFlag = true;
                    setTimeout(function () {
                        loginAlert.errFlag = false;
                    },3000)
                }
            },
            forgetPwd : function() {
                location.href='pages/forgetPwd.html';
            },
            //登录
            login : function () {
                this.$http({
                    url : baseUrl+'/iou/login/login',
                    method : 'POST',
                    params : {
                        'loginPwd':loginAlert.password,
                        'mobile':loginAlert.userName
                    },
                    //emulateJSON:true
                }).then(
                    function (res) {
                        //成功
                        if(res.data.code=="200"){
                            loginAlert.visible = false;
                            //$(document.body).css("overflow","hidden");
                            //手机号缓存
                            //localStorage.loginPhoneNo = loginAlert.userName;
                            localStorage.userId = res.data.data.userId;
                            localStorage.userName = res.data.data.username;
                            model.loginFlag= true;
                            loginFlag = true;
                            loginAlert.hideLogin();
                            location.href='pages/myAccount/account_overview.html';
                        }else{
                            loginAlert.errMsg = res.data.message;
                            loginAlert.errFlag = true;
                            setTimeout(function () {
                                loginAlert.errFlag = false;
                            },3000);
                        }
                    },function (res) {
                        //失败
                        loginAlert.errMsg = '登录失败';
                        loginAlert.errFlag = true;
                        setTimeout(function () {
                            loginAlert.errFlag = false;
                        },3000);
                    }
                );

            }
        }
    });

    //自动登录
    function init() {
        model.userName = localStorage.userName||'请登录';
    }
    init();
});