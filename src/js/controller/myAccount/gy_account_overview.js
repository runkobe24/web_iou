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
            parentHeadTit:'账户设置',
            currHeadTit:'实名认证'
        },
        beforeCreate : function () {

        },
        mounted : function () {
            var width = window.screen.width;
            document.body.onmousewheel = function(event) {
                event = event || window.event;
                if(window.devicePixelRatio!=1){
                    model.contentWidth = model.contentWidth*window.devicePixelRatio;
                }
            };
        },
        methods:{

        }
    })


})