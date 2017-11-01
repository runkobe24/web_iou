/**
 * Created by Administrator on 2017/7/12.
 */
var success = '../../../images/pass.png';
var info = '../../../images/info.png';
var warning = '../../../images/warning.png';
var error = '../../../images/error.png';
var Alert = Vue.extend({
    // 有效，因为是在正确的作用域内
    template:   '<div class="cover" :style="{height:alertHeight+\'px\'}" v-show="visible">' +
                    '<div class="cover-bg" @click="hideCover"></div>' +
                    '<div class="cover-box">' +
                        '<div class="cover-tit">' +
                                '<h3 style="height: 30px"></h3>' +
                                '<a class="cover-close" @click="hideCover"><img src="../../../images/closeAlert.png"/></a>' +
                        '</div>' +
                        '<div class="cover-content">' +
                            '<div class="cover-text"">' +
                                '<img class="cover-img" :src="msgType"/><span class="cover-text1" v-text="text1"></span>'+
                                '<a v-show="quickGo" :href="goWay" style="color:rgb(0, 160, 233);font-size:14px;margin-left:10px;">立即前往</a><br>'+
                                '<span class="cover-text2" v-html="text2"></span>'+
                            '</div>'+
                            '<button class="cancel-cover" v-if="isCancel" @click="hideCover">取消</button>'+
                            '<button class="sure-cover" v-if="isCancel" @click="srueToDo">确认</button>'+
                            '<button class="sure-cover1" v-if="!isCancel" @click="srueToDo">确认</button>'+
                        '</div>'+
                    '</div>' +
                '</div>',
    data: function () {
        return {
            msgType:success,
            text1:'',
            text2:'',
            visible:true,
            quickGo:false,
            alertHeight:'',
            goWay:'',
            isCancel:true//取消按钮
        }
    },
    mounted:function(){
        if(document.body.scrollHeight>window.innerHeight){
            this.alertHeight=document.body.scrollHeight;
        }else{
            this.alertHeight=window.innerHeight;
        }

    },
    methods:{
        cancelCallback:function(){},
        hideCover:function(){
            this.cancelCallback(this);
        },
        confirmCallback:function(){},
        srueToDo:function(){
            this.confirmCallback(this);
        }
    }
});

var instancePool = [];

var getInstance = function(){
    if(instancePool.length > 0){
        return instancePool[0];
    }
    return new Alert({
        el: document.createElement("div")
    });
};

var alert = function(obj){
    var msgbox = getInstance();
    instancePool.push(msgbox);
    msgbox.msgType = obj.msgType;
    msgbox.text1 = obj.text1;
    msgbox.text2 = obj.text2;
    msgbox.visible = obj.visible;
    msgbox.quickGo = obj.quickGo;
    msgbox.isCancel = obj.isCancel;
    msgbox.goWay = obj.goWay;
    msgbox.cancelCallback = obj.cancelCallback || function(){};
    msgbox.confirmCallback = obj.confirmCallback || function(){};
    document.body.appendChild(msgbox.$el);
};

Vue.$alert = Vue.prototype.$alert = alert;
