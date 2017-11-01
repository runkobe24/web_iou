var resourceUrl = "http://fengchao.8686c.com/html/weixin/";
var ajaxUrl = "http://edms.fcbox.com/";	
switch(location.hostname){
	case "fengchaobox.sit.sf-express.com" : 
		ajaxUrl = "http://fengchaobox.sit.sf-express.com/dropbox/";
		break;
	case "hibox2.sit.sf-express.com" : 
		ajaxUrl = "http://hibox2.sit.sf-express.com/dropbox/";
		break;
	case "internetweb-sit1.fcbox.com" : 
		ajaxUrl = "http://internetweb-sit1.fcbox.com/dropbox/";
		break;
}

var ua = navigator.userAgent.toLowerCase();
document.body.addEventListener('touchstart', function(){},false);

//禁用uc浏览器左右滑动翻页
var ucControl = navigator.control || {};
if(ucControl.gesture){ucControl.gesture(false);}

//get url value
function getUrlValue(text){
	var urlArr = location.search.slice(1).split("&");
	var value = "";
	for(var i=0;i<urlArr.length;i++){
		var tempArr = urlArr[i].split("=");
		if(tempArr.length == 2 && tempArr[0] == text){
			value = tempArr[1];
		}
	}
	return value;
}

//get index
function getIndex(obj){
	var list = obj.parentNode.children;
	for(var i=0;i<list.length;i++){
		if(obj === list[i]){
			return i;
		}
	}
}

// 当天时间对比
function getRightTime(startTime, endTime) {

	if(!startTime && !endTime){return false}

    var now = new Date();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var startH = startTime ? parseInt(startTime.split(":")[0]) : 0;
    var startM = startTime ? parseInt(startTime.split(":")[1]) : 0;
    var endH = parseInt(endTime.split(":")[0]);
    var endM = parseInt(endTime.split(":")[1]);

    // console.log("getRightTime----------", startTime, startH, startM);
    // console.log("getRightTime----------", endTime, endH, endM);
    // console.log("getRightTime----------", now.getTime(), hour, minute);

    if(hour > startH && hour < endH || hour == startH && minute >= startM || hour == endH && minute <= endM){
        // console.log("OK");
        return true;
    }else{
        return false;
    }
}

//link to
function href(url,e){
	window.location.href = url;
	e && e.preventDefault();
}
 
//prefix
var prefix = (function(){
	var div = document.createElement("div");
	div.style.cssText = "-webkit-transition:1s;transition:1s;";
	var text = div.style.cssText.match("-webkit-") ? "-webkit-" : "";
	return text;
})();
var transitionEnd = prefix == "" ? "transitionend" : "webkitTransitionEnd";


//Alert
var Alert = new function(){
	var bg = document.createElement("div");
	var obj = document.createElement("div");
	var con = document.createElement("p");
	var first = true;
	var timeoutAnimate,timeoutFun;
	var hideFun = function(){
		clearTimeout(timeoutAnimate);
		obj.style.opacity = 0;
		var classArr = obj.className.split(" ");
		if(classArr.length > 1 && classArr[0].indexOf("alert") != -1 && classArr[1].indexOf("alert") != -1){
			classArr.splice(1, 1);
		}
		timeoutAnimate = setTimeout(function(){
			bg.style.display = "none";
			obj.className = classArr.join(" ");
		}, 450);
	};
	bg.className = 'alert-bg none';
	obj.className = "alert relative translate transition corner";
	con.className = "tc";
	obj.appendChild(con);
	bg.appendChild(obj);
	this.config = function (options) {
		if(options){
			obj.className = "alert "+options.className+" relative translate transition corner";
		}
	};
	this.show = function(text,fun){
		var _this = this;
		if(first){
			first = false;
			// bg.addEventListener('touchstart' ,function(e) {
			// 	_this.hide();
			// }, false);
			document.body.appendChild(bg);
		}
		var callback = fun || hideFun;
		var time = fun ? 0 : 2000;
		clearTimeout(timeoutAnimate);
		clearTimeout(timeoutFun);
		con.innerHTML = text || "";
		bg.style.display = "block";
		obj.style.opacity = 1;
		timeoutAnimate = setTimeout(function(){ obj.style.opacity = 1; },50);
		timeoutFun = setTimeout(callback,time);
	};
	this.hide = hideFun;
};

//Alert.show("asdasd");

//tips
var tips = new function(){	
	var obj = document.createElement("div");
	var box = document.createElement("div");
	var tit = document.createElement("h2");
	var txt = document.createElement("div");
	var btn = document.createElement("div");
	var img = document.createElement("span");
	var con = document.createElement("p");
	var know = document.createElement("a");
	var no = document.createElement("a");
	var yes = document.createElement("a");
    var close = document.createElement("a");
	
	var timeoutBtn,timeoutAnimate,myFun,first = true;
	
	obj.className = "tips fixed w100 h100 transition none";
	box.className = "tips-box relative center max corner transition";
    close.className = "tips-close absolute";
	tit.className = "tips-tit";
	txt.className = "tips-txt";
	btn.className = "tips-btn";
	img.className = "block center";
	con.className = "tc";
	know.className = "fl pointer tc none know";
	no.className = "fl pointer tc none no";
	yes.className = "fl pointer tc none relative yes";
	
	tit.innerHTML = "温馨提示";
	know.innerHTML = "我知道了";
	no.innerHTML = "取 消";
	yes.innerHTML = "确 定";

	txt.appendChild(img);
	txt.appendChild(con);
	btn.appendChild(know);
	btn.appendChild(no);
	btn.appendChild(yes);
    box.appendChild(close);
    box.appendChild(tit);
	box.appendChild(txt);
	box.appendChild(btn);
	obj.appendChild(box);
	
	var hideFun = function(){
		clearTimeout(timeoutAnimate);
		obj.style.opacity = 0;
		box.style.cssText = "-webkit-transform:translateY(-50%) scale(0.4);transform:translateY(-50%) scale(0.4);";
		timeoutAnimate = setTimeout(function(){obj.style.display = "none";},450);
	};
	
	var showFun = function(option, type){
		if(first){ first = false; document.body.appendChild(obj); }
		clearTimeout(timeoutBtn);
		clearTimeout(timeoutAnimate);
        know.innerHTML = option.knowText ? option.knowText : "我知道了";
        no.innerHTML = option.btnTextArr && option.btnTextArr[0] ? option.btnTextArr[0] : "取 消";
        yes.innerHTML = option.btnTextArr && option.btnTextArr[1] ? option.btnTextArr[1] : "确 定";
        know.removeEventListener("click",myFun,false);
        close.removeEventListener("click",hideFun,false);
		no.removeEventListener("click",hideFun,false);
		yes.removeEventListener("click",myFun,false);
		
		var text = option.text || "";
		var icon = option.icon || "warn";
		var btnAble = option.btnAble == undefined ? true : option.btnAble;
        var btnClass = option.btnClass == undefined ? "" : " " + option.btnClass;
        var closeAble = option.closeAble == undefined ? false : option.closeAble;
        var returnFunc = option.returnFunc == undefined ? false : option.returnFunc;
		var tempFun;

        if(btnClass !== ""){
            no.className += btnClass;
            yes.className += btnClass;
        }

		myFun = option.callback || hideFun;

        img.className = "block center " + icon;
		con.innerHTML = text;
		btnAble ? btn.classList.remove("vh") : btn.classList.add("vh");
        closeAble ? close.classList.remove("vh") : close.classList.add("vh");
		
		switch(type){
			case "show" : 
				no.classList.add("none");
				yes.classList.add("none");
				know.classList.remove("none");
				tempFun = function(){
                    know.addEventListener("click",myFun,false);
                    close.addEventListener("click",hideFun,false);
                };
				break;
			case "sure" : 
				know.classList.add("none");
				no.classList.remove("none");
				yes.classList.remove("none");
				tempFun = function(){
                    close.addEventListener("click",hideFun,false);
                    if(returnFunc){
                        no.addEventListener("click",myFun,false);
                        yes.addEventListener("click",hideFun,false);
                    }else{
                        no.addEventListener("click",hideFun,false);
                        yes.addEventListener("click",myFun,false);
                    }
				}
				break;	
		}
		
		obj.style.display = "block";
		timeoutAnimate = setTimeout(function(){
			obj.style.opacity = 1;
			box.style.cssText = "-webkit-transform:translateY(-50%) scale(1);transform:translateY(-50%) scale(1);";
		},50);
		timeoutBtn = setTimeout(tempFun,500);
		
	};
	
	this.show = function(option){showFun(option || {},"show");};
	this.sure = function(option){showFun(option || {},"sure");};
	this.hide = hideFun;

};

//tips.sure({
//	text : "呵呵",
//	icon : "sure",
//	btnAble : true,
//	callback : function(){ alert(111);tips.hide(); }
//});

//layer
function Layer(id){
	var me = this;
	var obj = document.getElementById(id);
	var box = obj.children[0];
	var bg = obj.children[1];
	var timeout;
	
	this.show = function(){
		clearTimeout(timeout);
		obj.style.display = "block";
		timeout = setTimeout(function(){
			obj.style.opacity = 1;
			box.style.cssText = "-webkit-transform:translateY(-50%) scale(1);transform:translateY(-50%) scale(1);";
		},50);
	};	
	
	this.hide = function(){
		clearTimeout(timeout);
		obj.style.opacity = 0;
		box.style.cssText = "-webkit-transform:translateY(-50%) scale(0.4);transform:translateY(-50%) scale(0.4);";
		timeout = setTimeout(function(){
			obj.style.display = "none";
		},450);
	};
}

/*
<div class="layer fixed w100 h100 transition none" id="myLayer">
	<div class="layer-box relative center corner transition">
		//content here
	</div>
</div>
var myLayer = new Layer("myLayer");
myLayer.show();
myLayer.hide();
*/

/*validator*/
function validator(type, value, error) {
	// console.log(type, value.length, error);
	var errorFunc = error && typeof(error) == "function" ? error : function () {};
	switch (type){
		case "productName":
			var myRe = new RegExp("[^\u4e00-\u9fa5(a-zA-Z)()（）-]", "g");
			var myArray = myRe.exec(value);
			if(value == "" || value.length > 14 || myArray != null){
				errorFunc();
			}
			break;
		default:
			break;
	}
}

/* 数字处理 小于10加0*/
function numAddZero(num) {
	var numStr = num >= 10 ? ("" + num) : ("0" + num);
	return numStr;
}


/* 格式化时间 */
function dateToStr(type, time) {

	if(!time || time <= 0){return "未知时间"};

	var date = new Date(time);
	var year = ""+date.getFullYear();
	var month = numAddZero(date.getMonth()+1);
	var day = numAddZero(date.getDate());
	var hour = numAddZero(date.getHours());
	var minute = numAddZero(date.getMinutes());
	var second = numAddZero(date.getSeconds());

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
}

function formatDate(string) {
	var arrOne = string.split(" ");
	var arrTwo = arrOne[0].split("-");
	var newString = arrTwo[0] + "年" + arrTwo[1] + "月" + arrTwo[2] + "日";
	return newString;
}

/* URL参数处理 */
function getUrlParam(key) {
    var search = location.search.substring(1);
    if(search == ""){ return search; }
    var object = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
    return object[key] || "";
}

function replaceMarks(str) {
    return str.replace(/\"/g, "");
}

function formatMoney(money, type) {
	var multiple = 100;
    var mString = "";
	switch (type){
		case "cent":
            mString += parseInt(money / multiple);
			break;
        case "dollar":
            mString += parseInt(money * multiple);
            break;
        default: break;
	}
	return mString;
}


//ajax post
function Post(option){
	var url = option.url || "";
	var data = option.data || "";
	var timeout = option.timeout || 5000;
	var success = option.success || function(){};
	var error = option.error || function(){};
	var isTimeout = false;
	var http = new XMLHttpRequest();
	var timer = setTimeout(function(){
		isTimeout = true;
		http.abort();
		error();
	},timeout);
	http.open("POST",url,true);
	http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	http.onreadystatechange = function(){
		if(http.readyState != 4 || isTimeout){return;}
		clearTimeout(timer);
		if(http.status == 200){
			success(http.responseText);
		}else{
			error();
		}
	}
	http.send(data);
};

/**
 * 字符串进制转换（10转16）.
 * @param str
 * @returns {String}
 */
function decToHex(str) {
	var res=[];
	for(var i = 0; i < str.length; i++)
    	res[i] = ("00" + str.charCodeAt(i).toString(16)).slice(-4);
	return "\\u" + res.join("\\u");
};

/**
 * 字符串进制转换（16转10）.
 * @param str
 * @returns
 */

function hexToDec(str) {
	str = str.replace(/\\/g,"%");
	return unescape(str);
};

/**
 * 去除苹果输入法的表情字符.
 * @param str
 */
function cleanEmoji(str) {
	if (str == undefined || str == "") return str;
	return hexToDec(decToHex(str).replace(/\\\ud[0-9a-f]{3}/ig, ""));
};