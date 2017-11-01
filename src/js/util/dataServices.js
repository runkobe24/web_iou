define(function(require, exports, module) {
	'use strict';
	/**
	* 公共ajax服务模块
	*
	*/
	var DataServices = function() {
		this.init();
	};

	DataServices.prototype = {
		constructor: DataServices,

		init: function() {
			this.dataServices = [];
		},

		add: function(name, url, dataMap, action) {
			this.dataServices[name] = new CURD(url, dataMap, action);
		},

		get: function(name) {
			return this.dataServices[name];
		}
	};
	
	var CURD = function(url, dataMap, action) {
		this.action = $.extend(true, {
			query: {},
			create: {},
			update: {},
			remove: {}
		}, action);
		this.params = {url: url};
		this.dataMap = dataMap;		
		this.init();
	};

	CURD.prototype = {
		constructor: CURD,

		init: function() {
			for (var x in this.action) {
				this[x] = function(type) {
					return function(params){
						return this.send(params, type);	
					}; 
				}(x);
			}
		},

		//发送信息
		send: function(params, type) {

			var _params = $.extend(true, {data: {}}, this.params, this.action[type], params);
			for (var x in this.dataMap) {
				if (_params.hasOwnProperty(x)) {
					var reg = new RegExp(':\\b' + x + '\\b');
					_params.url = _params.url.replace(reg, _params[x]);
				}
			}
			var timeout = 8000;
			var requetType = _params.method || 'post';
			var url = _params.url;
			var header = '';
			var data =  _params.data || {};
			var httpHandler = $.Deferred();
			var resp = '';
			if(requetType === 'post') {
				var paramConfigPost = {
                    url:url,
                    type:"POST",
                    dataType:'json',
                    data:data,
                    timeout:timeout
                };
				var postObj = $.extend(true,paramConfigPost,this.action[type].customConfig);
                resp = $.ajax(postObj);
			} else {
				var param = [];
				for(x in data){
                    param.push(x + '=' + data[x]);
				}
				// avalon.each(data, function(k, v) {
				// 	param.push(k + '=' + v);
				// });
                url += '?t='+(new Date).getTime()+"&"+ param.join('&');
				var paramConfigGet = {
                    url:url,
                    type:"GET",
                    dataType:'json',
                    timeout:timeout
                };
                var getObj = $.extend(true,paramConfigGet,this.action[type].customConfig);
				resp = $.ajax(getObj);
			}
			return resp;
		}
	};
	
	var ins = new DataServices();
    var machine = "";
    /*switch (location.hostname) {
        //TODO 第一套测试环境
        case "fengchaobox.sit.sf-express.com":
            machine = "http://fengchaobox.sit.sf-express.com@staticResourceContext@";
            break;
        //TODO 第二套测试环境
        case "hibox2.sit.sf-express.com":
            machine = "http://hibox2.sit.sf-express.com@staticResourceContext@";
            break;
        //TODO 生产环境
        case "http://edms.fcbox.com":
            machine = "http://edms.fcbox.com";
            break;
        //TODO 默认本机
		default :
			machine = 'http://'+location.hostname+':'+location.port
    }*/
	//上墙活动接口列表
	ins.add('mallbackend',machine+'/:_method_',{_method_: '@_method_'}, {
		//微信支付接口
        payOrder:{_method_: 'hibox/weixin/wxCommonAuth', method: 'get', data: {}},
		//微信鉴权接口

    });
	return ins;
});