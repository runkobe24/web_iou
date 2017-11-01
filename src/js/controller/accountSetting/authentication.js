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
            currHeadTit:'实名认证',
            isParent : true,
            flag : true,//判断是否能进行个人实名认证
            goto:"./accountSetting.html",
        },
        created : function () {
            // todo: 如果用户已经认证则跳转回去
            if(localStorage.authStatus == 'S'){
                location.href = this.goto;
            }
            //如果用户来源是供应商不能进行个人实名认证
            if(localStorage.userFrom=='S'){
                model.flag = false;
            }
        },
        computed: {
            authType: function() {
                return this.selected ? '个人认证' : '企业认证';
            }
        },
        methods:{
            clickPerson:function () {
                model.selected = true;
            },
            clickCompany:function () {
                model.selected = false;
            },
            next:function () {
                // cover.dialogVisible = true;
                // console.log(document.body.scrollHeight);
                var self = this;
                Vue.$alert({
                    visible:true,
                    msgType:warning,
                    text1:'您即将选择“' + self.authType + '”，认证成功后，类型不可更改！',
                    cancelCallback:function (e) {//取消回调
                        e.visible=false;
                    },
                    confirmCallback:function (e) {//确定回调
                        //判断个人认证还是企业认证
                        if(model.selected==true){
                            //个人
                            location.href='./personApprove.html';
                        }else{
                            //企业
                            location.href='./companyApprove.html';
                        }
                    }
                });
            }

        }
    })

})