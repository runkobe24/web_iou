(function(win){
	var api = function (path, param, success, error) {
        var url = win.Config.ajaxUrl + "" + path;
        var data = param ? Global.paramToStr(param) : "";
        url = param ? url + "?" + data : url;

        var sucFunc = success || function () {};
        var errFunc = error || function () {};
        var xhr = new XMLHttpRequest();
        var isTimeout = false;

        xhr.timeout = 10000;
        xhr.ontimeout = function(event){
            isTimeout = true;
            xhr.abort();
            win.Global.alertDialog.show("接口超时！");
            errFunc();
        }

        xhr.open("GET", url, true);
        // console.error(param, data, url);

        xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        xhr.onreadystatechange = function(){
            
            if(isTimeout){return;}

            if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                // console.log(xhr.responseText);
                // console.log(xhr.getResponseHeader("Set-Cookie"));
                var data = xhr.responseText ? JSON.parse(xhr.responseText) : {};
                if(data.msg!=''&&data.msg!=null){
                    win.Global.alertDialog.show(data.msg);
                }
            }else{
                errFunc();
            }
        };
        xhr.send(data);
        // xhr.abort();
    };

    win.API ={
    	reward:{
    		'getRewardPageConfig':function(param, success, error){
    			api('hibox/weixin/reward/getRewardPageConfig', param, success, error);
    		},

    		'getPayMessage':function(param,success,error){
    			api('/getPayMessage', param, success, error);
    		},

    		'getWXShareConfig':function(param, success, error){
    			api('/getWXShareConfig', param, success, error);
    		}
    	},

    	success:{
    		'getSuccessPageConfig':function(param,success,error){

    		},

    		'getWxShareConfig':function(param,success,error){

    		}
    	}
    }
})(window)