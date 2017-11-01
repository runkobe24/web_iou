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
            contentWidth:document.body.clientWidth-210,
            contentHeight:window.innerHeight-67
        },
        beforeCreate : function () {

        },
        mounted : function () {

        },
        methods:{
            showLogin : function () {
                loginAlert.visible=true;
                loginAlert.userName = '';
                loginAlert.password = '';
            },
            toRegister : function () {
                location.href = 'register.html';
            },
            fsby56 : function () {
                location.href='../../index.html';
            },
        }
    })
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
            //登录
            login : function () {
                this.$http({
                    url : baseUrl+'/iou/login/login',
                    method : 'POST',
                    /*crossDomain : true,
                     credentials : true,*/
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
                            localStorage.userId = res.data.data.userId;
                            localStorage.userName = res.data.data.username;
                            model.loginFlag= true;
                            loginFlag = true;
                            loginAlert.hideLogin();
                            location.href='myAccount/gy_account_overview.html';
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



})