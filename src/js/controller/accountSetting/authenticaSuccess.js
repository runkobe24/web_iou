/**
 * Created by Administrator on 2017/7/27.
 */
define(function(require,exports,module) {
    require('vue-resource');//引入
    require('header');//引入
    require('leftMenu');//引入
    require('footer');//引入
    require('alert');//引入
    window.onresize = function(){
        model.contentWidth = document.body.clientWidth-210;
    }
    var model = new Vue({
        el:"#app",
        data :{
            contentWidth:document.body.clientWidth-210,
            contentHeight:window.innerHeight-67,
            selected : true,
            parentHeadTit:'账户设置',
            currHeadTit:'实名认证成功',
            isParent:true
        },
        methods:{
            toSetPayPwd : function () {
                location.href='./setPayPwd.html';
            },
            toUpdatePayQues : function () {
                location.href='./updatePayQues.html';
            },
            toAccount_overview: function () {
                location.href='../myAccount/account_overview.html';
            }
        }
    })


})