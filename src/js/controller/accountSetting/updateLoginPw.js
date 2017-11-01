/**
 * Created by Administrator on 2017/8/4.
 */
define(function(require,exports,module) {
    require('vue-resource');//引入
    require('header');//引入
    require('leftMenu');//引入
    require('footer');//引入
    require('alert');//引入
    require('common');//引入

    var step1ing = '../../images/step1ing.png',
        step1ed = '../../images/step1ed.png',
        step2 = '../../images/step2.png',
        step2ing = '../../images/step2ing.png',
        step2ed = '../../images/step2ed.png',
        step3 = '../../images/lastStep.png',
        step3ing = '../../images/lastSteping.png';
    window.onresize = function(){
        model.contentWidth = document.body.clientWidth-210;
    }
    var model = new Vue({
        el:"#app",
        data :{

            contentWidth:document.body.clientWidth-210,
            contentHeight:window.innerHeight-67,
            parentHeadTit:'账户设置',
            currHeadTit:'修改登录密码',
            isParent:true,
            stepNum1 :true,
            stepNum2 :false,
            stepNum3 :false, //每一步的显示标志

            step1 : step1ing,
            step2 : step2,
            step3 : step3,
            sendFlag : false,
            isMobile : true,//判断从忘记密码页面跳转过来时的参数类型
            phone:'',
            goto:'./accountSetting.html',

        },
        created : function () {
            this.isMobile = Global.getUrlParam('isMobile')||true;//从跳转链接获取参数
            this.phone = Global.transMobileNo(localStorage.phone);//从缓存中获取参数
        },
        methods:{
            toSecurityVerify : function () {
                location.href = 'loginPwdconditionVerify.html?condition=security';
            },
            toPhoneVerify : function () {
                location.href = 'loginPwdconditionVerify.html?condition=phone';
            }
        }
    })

})