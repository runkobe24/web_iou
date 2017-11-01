(function(win){
	win.Config = {}
	win.Config.ajaxUrl ="";

	 // device check
    var ua = win.navigator.userAgent.toLowerCase();
    win.Device = {
        isMobile: (/mobile/i).test(ua),
        isIphone: (/iphone/i).test(ua),
        isAndroid: (/android/i).test(ua)
    };


    win.Global = {

        /* URL参数处理 */
        getUrlParam: function (key) {
            var search = location.search.substring(1);
            if(search == ""){ return search; }
            var object = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
            return object[key] || "";
        },

        /* 请求参数拼接 */
        paramToStr: function (param) {
            var p = JSON.stringify(param);
            p = p.replace(/[\{\}]/g, "");
            var arr = p.split(',');
            var l = arr.length;
            var str = "";

            for(var i = 0; i < l; i++){
                var cur = arr[i].split(":");
                if(i !== 0){
                    str += "&";
                }
                str = str + (cur[0] ? cur[0].replace(/[\"]/g, "") : "");
                str = str + (cur[0] ? "=" : "");
                str = str + (cur[1] ? cur[1].replace(/[\"]/g, "") : "");
            }
            return str;
        },

        /* 数字处理 小于10加0*/
        numAddZero: function (num) {
            var numStr = num >= 10 ? ("" + num) : ("0" + num);
            return numStr;
        },

        /* 金额处理 默认为分转元 */
        formatMoney: function (money, type) {
            var multiple = 100;
            switch (type){
                case "cent":
                    multiple = 100;
                    break;
                case "dime":
                    multiple = 10;
                    break;
                default: break;
            }
            var mString = (money / multiple).toFixed(2);
            return mString;
        },

        /* 格式化时间 */
        dateToStr: function (type, time) {

            if(!time || time <= 0){return "未知时间"};

            var date = new Date(time);
            var year = ""+date.getFullYear();
            var month = this.numAddZero(date.getMonth()+1);
            var day = this.numAddZero(date.getDate());
            var hour = this.numAddZero(date.getHours());
            var minute = this.numAddZero(date.getMinutes());
            var second = this.numAddZero(date.getSeconds());

            var str_p1 = [year, month, day].join(".");
            var str_p2 = [hour, minute, second].join(":");

            switch (type){
                case "full":
                    return str_p1+" "+str_p2;
                case "minute":
                    return [minute, second].join(":");
                default:
                    return str_p1+" "+str_p2;
            }
        },

        pxTorem:function(px,modelWidth){            //传递的像素、基准模板的宽度
        	var docEl = win.document.documentElement;
        	var width = docEl.getBoundingClientRect().width;
        	if (width / dpr > 540) {
	            width = 540 * dpr;
	        }
	        var ratio = width/modelWidth;
	        var rem = width / 10;
	        var remValue = (px*ratio)/rem;
	        return remValue;
        },

        switchPx:function(px,modelWidth){			//计算实际高度
        	var docEl = win.document.documentElement;
        	var width = docEl.getBoundingClientRect().width; 
        	var ratio = width/modelWidth;
        	var pxValue = px*ratio;
        	return pxValue;
        },

        /* 控制跳转 */
        navigatorTo: function (url, param) {
            var paramUrl = url;
            var paramStr = param ? "?" + this.paramToStr(param) : "";
            // console.log("navigatorTo----------", paramUrl, paramStr);
            win.location.href = paramUrl + paramStr;
        },
        // 验证130-139,150-159,180-189号码段的手机号码
        moblieVerify:function (mobile) {
            if(mobile.length==0) {
                //alert('请输入手机号码！');
                return false;
            }
            if(mobile.length!=11) {
                //alert('请输入有效的手机号码！');
                return false;
            }
            var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
            if(!myreg.test(mobile)) {
                //alert('请输入有效的手机号码！');
                return false;
            }
            return true;
        },
        //银行卡号码检测
        luhnCheck : function (bankno) {
        var lastNum = bankno.substr(bankno.length - 1, 1); //取出最后一位（与luhn进行比较）
        var first15Num = bankno.substr(0, bankno.length - 1); //前15或18位
        var newArr = new Array();
        for (var i = first15Num.length - 1; i > -1; i--) { //前15或18位倒序存进数组
            newArr.push(first15Num.substr(i, 1));
        }
        var arrJiShu = new Array(); //奇数位*2的积 <9
        var arrJiShu2 = new Array(); //奇数位*2的积 >9
        var arrOuShu = new Array(); //偶数位数组
        for (var j = 0; j < newArr.length; j++) {
            if ((j + 1) % 2 == 1) { //奇数位
                if (parseInt(newArr[j]) * 2 < 9) arrJiShu.push(parseInt(newArr[j]) * 2);
                else arrJiShu2.push(parseInt(newArr[j]) * 2);
            } else //偶数位
                arrOuShu.push(newArr[j]);
        }

        var jishu_child1 = new Array(); //奇数位*2 >9 的分割之后的数组个位数
        var jishu_child2 = new Array(); //奇数位*2 >9 的分割之后的数组十位数
        for (var h = 0; h < arrJiShu2.length; h++) {
            jishu_child1.push(parseInt(arrJiShu2[h]) % 10);
            jishu_child2.push(parseInt(arrJiShu2[h]) / 10);
        }

        var sumJiShu = 0; //奇数位*2 < 9 的数组之和
        var sumOuShu = 0; //偶数位数组之和
        var sumJiShuChild1 = 0; //奇数位*2 >9 的分割之后的数组个位数之和
        var sumJiShuChild2 = 0; //奇数位*2 >9 的分割之后的数组十位数之和
        var sumTotal = 0;
        for (var m = 0; m < arrJiShu.length; m++) {
            sumJiShu = sumJiShu + parseInt(arrJiShu[m]);
        }

        for (var n = 0; n < arrOuShu.length; n++) {
            sumOuShu = sumOuShu + parseInt(arrOuShu[n]);
        }

        for (var p = 0; p < jishu_child1.length; p++) {
            sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p]);
            sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p]);
        }
        //计算总和
        sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu) + parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2);

        //计算luhn值
        var k = parseInt(sumTotal) % 10 == 0 ? 10 : parseInt(sumTotal) % 10;
        var luhn = 10 - k;

        if (lastNum == luhn) {
            //验证通过
            return true;
        } else {

            return false;
        }
    },
        //身份证号合法性验证
        //支持15位和18位身份证号
        //支持地址编码、出生日期、校验位验证
        IdentityCodeValid : function (code) {
        var city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
        var tip = "";
        var pass= true;

        if(!(code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code))){
            tip = "身份证号格式错误";
            pass = false;
        }

        else if(!city[code.substr(0,2)]){
            tip = "地址编码错误";
            pass = false;
        }
        else{
            //18位身份证需要验证最后一位校验位
            if(code.length == 18){
                code = code.split('');
                //∑(ai×Wi)(mod 11)
                //加权因子
                var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
                //校验位
                var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
                var sum = 0;
                var ai = 0;
                var wi = 0;
                for (var i = 0; i < 17; i++)
                {
                    ai = code[i];
                    wi = factor[i];
                    sum += ai * wi;
                }
                var last = parity[sum % 11];
                if(parity[sum % 11] != code[17]){
                    tip = "校验位错误";
                    pass =false;
                }
            }
        }
        if(!pass) alert(tip);
        return pass;
        },
        transMobileNo : function (num) {//隐藏手机号中间4位
            var head = num.substring(0,3);
            var foot = num.substring(7,11);
            var moblie = head+'****'+foot;
            return moblie;
        }
    };


    win.Global.alertDialog= new function(){
        	var obj = document.createElement("div");
            var con = document.createElement("p");
            var first = true;
            var timeoutAnimate,timeoutFun;
            var hideFun = function(){
                clearTimeout(timeoutAnimate);
                obj.style.opacity = 0;
                timeoutAnimate = setTimeout(function(){ obj.style.display = "none"; },450);
            };
            
            obj.className = "alert fixed translate transition corner none";
            con.className = "tc";
            obj.appendChild(con);
            
            this.show = function(text,fun){
                if(first){
                    first = false;document.body.appendChild(obj);
                }
                var callback = fun || hideFun;
                var time = fun ? 0 : 2000;
                clearTimeout(timeoutAnimate);
                clearTimeout(timeoutFun);
                con.innerHTML = text || "";
                obj.style.display = "block";
                timeoutAnimate = setTimeout(function(){ obj.style.opacity = 1; },50);
                timeoutFun = setTimeout(callback,time);
            }
            
            this.hide = hideFun;
        }

})(window);