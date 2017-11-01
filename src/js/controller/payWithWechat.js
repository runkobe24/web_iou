/**
 * Created by Administrator on 2017/9/19.
 */
define(function(require,exports,module) {

    var model = new Vue({
        el:"#app",
        data :{
            moneyAmount: '',
            qrUrl: '',
            payType: ''
        },
        beforeMount : function () {
            this.moneyAmount = localStorage.moneyAmount;
            this.qrUrl = localStorage.weChatSrc;
            this.payType = localStorage.payType;
        }
    })


})