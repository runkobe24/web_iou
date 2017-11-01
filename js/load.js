'use strict';

/*! Sea.js 3.0.1 | seajs.org/LICENSE.md */
!function(a,b){function c(a){return function(b){return{}.toString.call(b)=="[object "+a+"]"}}function d(){return B++}function e(a){return a.match(E)[0]}function f(a){for(a=a.replace(F,"/"),a=a.replace(H,"$1/");a.match(G);)a=a.replace(G,"/");return a}function g(a){var b=a.length-1,c=a.charCodeAt(b);return 35===c?a.substring(0,b):".js"===a.substring(b-2)||a.indexOf("?")>0||47===c?a:a+".js"}function h(a){var b=v.alias;return b&&x(b[a])?b[a]:a}function i(a){var b=v.paths,c;return b&&(c=a.match(I))&&x(b[c[1]])&&(a=b[c[1]]+c[2]),a}function j(a){var b=v.vars;return b&&a.indexOf("{")>-1&&(a=a.replace(J,function(a,c){return x(b[c])?b[c]:a})),a}function k(a){var b=v.map,c=a;if(b)for(var d=0,e=b.length;e>d;d++){var f=b[d];if(c=z(f)?f(a)||a:a.replace(f[0],f[1]),c!==a)break}return c}function l(a,b){var c,d=a.charCodeAt(0);if(K.test(a))c=a;else if(46===d)c=(b?e(b):v.cwd)+a;else if(47===d){var g=v.cwd.match(L);c=g?g[0]+a.substring(1):a}else c=v.base+a;return 0===c.indexOf("//")&&(c=location.protocol+c),f(c)}function m(a,b){if(!a)return"";a=h(a),a=i(a),a=h(a),a=j(a),a=h(a),a=g(a),a=h(a);var c=l(a,b);return c=h(c),c=k(c)}function n(a){return a.hasAttribute?a.src:a.getAttribute("src",4)}function o(a,b,c,d){var e;try{importScripts(a)}catch(f){e=f}b(e)}function p(a,b,c,d){var e=Z.createElement("script");c&&(e.charset=c),A(d)||e.setAttribute("crossorigin",d),q(e,b,a),e.async=!0,e.src=a,ca=e,ba?aa.insertBefore(e,ba):aa.appendChild(e),ca=null}function q(a,b,c){function d(c){a.onload=a.onerror=a.onreadystatechange=null,v.debug||aa.removeChild(a),a=null,b(c)}var e="onload"in a;e?(a.onload=d,a.onerror=function(){D("error",{uri:c,node:a}),d(!0)}):a.onreadystatechange=function(){/loaded|complete/.test(a.readyState)&&d()}}function r(){if(ca)return ca;if(da&&"interactive"===da.readyState)return da;for(var a=aa.getElementsByTagName("script"),b=a.length-1;b>=0;b--){var c=a[b];if("interactive"===c.readyState)return da=c}}function s(a){function b(){l=a.charAt(k++)}function c(){return/\s/.test(l)}function d(){return'"'==l||"'"==l}function e(){var c=k,d=l,e=a.indexOf(d,c);if(-1==e)k=m;else if("\\"!=a.charAt(e-1))k=e+1;else for(;m>k;)if(b(),"\\"==l)k++;else if(l==d)break;o&&(p.push(a.substring(c,k-1)),o=0)}function f(){for(k--;m>k;)if(b(),"\\"==l)k++;else{if("/"==l)break;if("["==l)for(;m>k;)if(b(),"\\"==l)k++;else if("]"==l)break}}function g(){return/[a-z_$]/i.test(l)}function h(){var b=a.slice(k-1),c=/^[\w$]+/.exec(b)[0];q={"if":1,"for":1,"while":1,"with":1}[c],n={"break":1,"case":1,"continue":1,"debugger":1,"delete":1,"do":1,"else":1,"false":1,"if":1,"in":1,"instanceof":1,"return":1,"typeof":1,"void":1}[c],u="return"==c,s={"instanceof":1,"delete":1,"void":1,"typeof":1,"return":1}.hasOwnProperty(c),o=/^require\s*(?:\/\*[\s\S]*?\*\/\s*)?\(\s*(['"]).+?\1\s*[),]/.test(b),o?(c=/^require\s*(?:\/\*[\s\S]*?\*\/\s*)?\(\s*['"]/.exec(b)[0],k+=c.length-2):k+=/^[\w$]+(?:\s*\.\s*[\w$]+)*/.exec(b)[0].length-1}function i(){return/\d/.test(l)||"."==l&&/\d/.test(a.charAt(k))}function j(){var b=a.slice(k-1),c;c="."==l?/^\.\d+(?:E[+-]?\d*)?\s*/i.exec(b)[0]:/^0x[\da-f]*/i.test(b)?/^0x[\da-f]*\s*/i.exec(b)[0]:/^\d+\.?\d*(?:E[+-]?\d*)?\s*/i.exec(b)[0],k+=c.length-1,n=0}if(-1==a.indexOf("require"))return[];for(var k=0,l,m=a.length,n=1,o=0,p=[],q=0,r=[],s,t=[],u;m>k;)if(b(),c())!u||"\n"!=l&&"\r"!=l||(s=0,u=0);else if(d())e(),n=1,u=0,s=0;else if("/"==l)if(b(),"/"==l)k=a.indexOf("\n",k),-1==k&&(k=a.length);else if("*"==l){var v=a.indexOf("\n",k);k=a.indexOf("*/",k),-1==k?k=m:k+=2,u&&-1!=v&&k>v&&(s=0,u=0)}else n?(f(),n=0,u=0,s=0):(k--,n=1,u=0,s=1);else if(g())h();else if(i())j(),u=0,s=0;else if("("==l)r.push(q),n=1,u=0,s=1;else if(")"==l)n=r.pop(),u=0,s=0;else if("{"==l)u&&(s=1),t.push(s),u=0,n=1;else if("}"==l)s=t.pop(),n=!s,u=0;else{var w=a.charAt(k);";"==l?s=0:"-"==l&&"-"==w||"+"==l&&"+"==w||"="==l&&">"==w?(s=0,k++):s=1,n="]"!=l,u=0}return p}function t(a,b){this.uri=a,this.dependencies=b||[],this.deps={},this.status=0,this._entry=[]}if(!a.seajs){var u=a.seajs={version:"3.0.1"},v=u.data={},w=c("Object"),x=c("String"),y=Array.isArray||c("Array"),z=c("Function"),A=c("Undefined"),B=0,C=v.events={};u.on=function(a,b){var c=C[a]||(C[a]=[]);return c.push(b),u},u.off=function(a,b){if(!a&&!b)return C=v.events={},u;var c=C[a];if(c)if(b)for(var d=c.length-1;d>=0;d--)c[d]===b&&c.splice(d,1);else delete C[a];return u};var D=u.emit=function(a,b){var c=C[a];if(c){c=c.slice();for(var d=0,e=c.length;e>d;d++)c[d](b)}return u},E=/[^?#]*\//,F=/\/\.\//g,G=/\/[^\/]+\/\.\.\//,H=/([^:\/])\/+\//g,I=/^([^\/:]+)(\/.+)$/,J=/{([^{]+)}/g,K=/^\/\/.|:\//,L=/^.*?\/\/.*?\//;u.resolve=m;var M="undefined"==typeof window&&"undefined"!=typeof importScripts&&z(importScripts),N=/^(about|blob):/,O,P,Q=!location.href||N.test(location.href)?"":e(location.href);if(M){var R;try{var S=Error();throw S}catch(T){R=T.stack.split("\n")}R.shift();for(var U,V=/.*?((?:http|https|file)(?::\/{2}[\w]+)(?:[\/|\.]?)(?:[^\s"]*)).*?/i,W=/(.*?):\d+:\d+\)?$/;R.length>0;){var X=R.shift();if(U=V.exec(X),null!=U)break}var Y;if(null!=U)var Y=W.exec(U[1])[1];P=Y,O=e(Y||Q),""===Q&&(Q=O)}else{var Z=document,$=Z.scripts,_=Z.getElementById("seajsnode")||$[$.length-1];P=n(_),O=e(P||Q)}if(M)u.request=o;else{var Z=document,aa=Z.head||Z.getElementsByTagName("head")[0]||Z.documentElement,ba=aa.getElementsByTagName("base")[0],ca;u.request=p}var da,ea=u.cache={},fa,ga={},ha={},ia={},ja=t.STATUS={FETCHING:1,SAVED:2,LOADING:3,LOADED:4,EXECUTING:5,EXECUTED:6,ERROR:7};t.prototype.resolve=function(){for(var a=this,b=a.dependencies,c=[],d=0,e=b.length;e>d;d++)c[d]=t.resolve(b[d],a.uri);return c},t.prototype.pass=function(){for(var a=this,b=a.dependencies.length,c=0;c<a._entry.length;c++){for(var d=a._entry[c],e=0,f=0;b>f;f++){var g=a.deps[a.dependencies[f]];g.status<ja.LOADED&&!d.history.hasOwnProperty(g.uri)&&(d.history[g.uri]=!0,e++,g._entry.push(d),g.status===ja.LOADING&&g.pass())}e>0&&(d.remain+=e-1,a._entry.shift(),c--)}},t.prototype.load=function(){var a=this;if(!(a.status>=ja.LOADING)){a.status=ja.LOADING;var c=a.resolve();D("load",c);for(var d=0,e=c.length;e>d;d++)a.deps[a.dependencies[d]]=t.get(c[d]);if(a.pass(),a._entry.length)return a.onload(),b;var f={},g;for(d=0;e>d;d++)g=ea[c[d]],g.status<ja.FETCHING?g.fetch(f):g.status===ja.SAVED&&g.load();for(var h in f)f.hasOwnProperty(h)&&f[h]()}},t.prototype.onload=function(){var a=this;a.status=ja.LOADED;for(var b=0,c=(a._entry||[]).length;c>b;b++){var d=a._entry[b];0===--d.remain&&d.callback()}delete a._entry},t.prototype.error=function(){var a=this;a.onload(),a.status=ja.ERROR},t.prototype.exec=function(){function a(b){var d=c.deps[b]||t.get(a.resolve(b));if(d.status==ja.ERROR)throw Error("module was broken: "+d.uri);return d.exec()}var c=this;if(c.status>=ja.EXECUTING)return c.exports;if(c.status=ja.EXECUTING,c._entry&&!c._entry.length&&delete c._entry,!c.hasOwnProperty("factory"))return c.non=!0,b;var e=c.uri;a.resolve=function(a){return t.resolve(a,e)},a.async=function(b,c){return t.use(b,c,e+"_async_"+d()),a};var f=c.factory,g=z(f)?f.call(c.exports={},a,c.exports,c):f;return g===b&&(g=c.exports),delete c.factory,c.exports=g,c.status=ja.EXECUTED,D("exec",c),c.exports},t.prototype.fetch=function(a){function c(){u.request(g.requestUri,g.onRequest,g.charset,g.crossorigin)}function d(a){delete ga[h],ha[h]=!0,fa&&(t.save(f,fa),fa=null);var b,c=ia[h];for(delete ia[h];b=c.shift();)a===!0?b.error():b.load()}var e=this,f=e.uri;e.status=ja.FETCHING;var g={uri:f};D("fetch",g);var h=g.requestUri||f;return!h||ha.hasOwnProperty(h)?(e.load(),b):ga.hasOwnProperty(h)?(ia[h].push(e),b):(ga[h]=!0,ia[h]=[e],D("request",g={uri:f,requestUri:h,onRequest:d,charset:z(v.charset)?v.charset(h):v.charset,crossorigin:z(v.crossorigin)?v.crossorigin(h):v.crossorigin}),g.requested||(a?a[g.requestUri]=c:c()),b)},t.resolve=function(a,b){var c={id:a,refUri:b};return D("resolve",c),c.uri||u.resolve(c.id,b)},t.define=function(a,c,d){var e=arguments.length;1===e?(d=a,a=b):2===e&&(d=c,y(a)?(c=a,a=b):c=b),!y(c)&&z(d)&&(c=b===s?[]:s(""+d));var f={id:a,uri:t.resolve(a),deps:c,factory:d};if(!M&&!f.uri&&Z.attachEvent&&b!==r){var g=r();g&&(f.uri=g.src)}D("define",f),f.uri?t.save(f.uri,f):fa=f},t.save=function(a,b){var c=t.get(a);c.status<ja.SAVED&&(c.id=b.id||a,c.dependencies=b.deps||[],c.factory=b.factory,c.status=ja.SAVED,D("save",c))},t.get=function(a,b){return ea[a]||(ea[a]=new t(a,b))},t.use=function(b,c,d){var e=t.get(d,y(b)?b:[b]);e._entry.push(e),e.history={},e.remain=1,e.callback=function(){for(var b=[],d=e.resolve(),f=0,g=d.length;g>f;f++)b[f]=ea[d[f]].exec();c&&c.apply(a,b),delete e.callback,delete e.history,delete e.remain,delete e._entry},e.load()},u.use=function(a,b){return t.use(a,b,v.cwd+"_use_"+d()),u},t.define.cmd={},a.define=t.define,u.Module=t,v.fetchedList=ha,v.cid=d,u.require=function(a){var b=t.get(t.resolve(a));return b.status<ja.EXECUTING&&(b.onload(),b.exec()),b.exports},v.base=O,v.dir=O,v.loader=P,v.cwd=Q,v.charset="utf-8",u.config=function(a){for(var b in a){var c=a[b],d=v[b];if(d&&w(d))for(var e in c)d[e]=c[e];else y(d)?c=d.concat(c):"base"===b&&("/"!==c.slice(-1)&&(c+="/"),c=l(c)),v[b]=c}return D("config",a),u}}}(this);!function(){function a(a){h[a.name]=a}function b(a){return a&&h.hasOwnProperty(a)}function c(a){for(var c in h)if(b(c)){var d=","+h[c].ext.join(",")+",";if(d.indexOf(","+a+",")>-1)return c}}function d(a,b){var c=g.XMLHttpRequest?new g.XMLHttpRequest:new g.ActiveXObject("Microsoft.XMLHTTP");return c.open("GET",a,!0),c.onreadystatechange=function(){if(4===c.readyState){if(c.status>399&&c.status<600)throw new Error("Could not load: "+a+", status = "+c.status);b(c.responseText)}},c.send(null)}function e(a){a&&/\S/.test(a)&&(g.execScript||function(a){(g.eval||eval).call(g,a)})(a)}function f(a){return a.replace(/(["\\])/g,"\\$1").replace(/[\f]/g,"\\f").replace(/[\b]/g,"\\b").replace(/[\n]/g,"\\n").replace(/[\t]/g,"\\t").replace(/[\r]/g,"\\r").replace(/[\u2028]/g,"\\u2028").replace(/[\u2029]/g,"\\u2029")}var g=window,h={},i={};a({name:"text",ext:[".tpl",".html"],exec:function(a,b){e('define("'+a+'#", [], "'+f(b)+'")')}}),a({name:"json",ext:[".json"],exec:function(a,b){e('define("'+a+'#", [], '+b+")")}}),a({name:"handlebars",ext:[".handlebars"],exec:function(a,b){var c=['define("'+a+'#", ["handlebars"], function(require, exports, module) {','  var source = "'+f(b)+'"','  var Handlebars = require("handlebars")["default"]',"  module.exports = function(data, options) {","    options || (options = {})","    options.helpers || (options.helpers = {})","    for (var key in Handlebars.helpers) {","      options.helpers[key] = options.helpers[key] || Handlebars.helpers[key]","    }","    return Handlebars.compile(source)(data, options)","  }","})"].join("\n");e(c)}}),seajs.on("resolve",function(a){var d=a.id;if(!d)return"";var e,f;(f=d.match(/^(\w+)!(.+)$/))&&b(f[1])?(e=f[1],d=f[2]):(f=d.match(/[^?]+(\.\w+)(?:\?|#|$)/))&&(e=c(f[1])),e&&-1===d.indexOf("#")&&(d+="#");var g=seajs.resolve(d,a.refUri);e&&(i[g]=e),a.uri=g}),seajs.on("request",function(a){var b=i[a.uri];b&&(d(a.requestUri,function(c){h[b].exec(a.uri,c),a.onRequest()}),a.requested=!0)}),define("seajs/seajs-text/1.1.1/seajs-text",[],{})}();!function(){function a(a){return function(b){return{}.toString.call(b)=="[object "+a+"]"}}function b(a){return"[object Function]"=={}.toString.call(a)}function c(a,c,e,f){var g=u.test(a),h=r.createElement(g?"link":"script");if(e){var i=b(e)?e(a):e;i&&(h.charset=i)}void 0!==f&&h.setAttribute("crossorigin",f),d(h,c,g,a),g?(h.rel="stylesheet",h.href=a):(h.async=!0,h.src=a),p=h,t?s.insertBefore(h,t):s.appendChild(h),p=null}function d(a,b,c,d){function f(){a.onload=a.onerror=a.onreadystatechange=null,c||seajs.data.debug||s.removeChild(a),a=null,b()}var g="onload"in a;return!c||!v&&g?(g?(a.onload=f,a.onerror=function(){seajs.emit("error",{uri:d,node:a}),f()}):a.onreadystatechange=function(){/loaded|complete/.test(a.readyState)&&f()},void 0):(setTimeout(function(){e(a,b)},1),void 0)}function e(a,b){var c,d=a.sheet;if(v)d&&(c=!0);else if(d)try{d.cssRules&&(c=!0)}catch(f){"NS_ERROR_DOM_SECURITY_ERR"===f.name&&(c=!0)}setTimeout(function(){c?b():e(a,b)},20)}function f(a){return a.match(x)[0]}function g(a){for(a=a.replace(y,"/"),a=a.replace(A,"$1/");a.match(z);)a=a.replace(z,"/");return a}function h(a){var b=a.length-1,c=a.charAt(b);return"#"===c?a.substring(0,b):".js"===a.substring(b-2)||a.indexOf("?")>0||".css"===a.substring(b-3)||"/"===c?a:a+".js"}function i(a){var b=w.alias;return b&&q(b[a])?b[a]:a}function j(a){var b,c=w.paths;return c&&(b=a.match(B))&&q(c[b[1]])&&(a=c[b[1]]+b[2]),a}function k(a){var b=w.vars;return b&&a.indexOf("{")>-1&&(a=a.replace(C,function(a,c){return q(b[c])?b[c]:a})),a}function l(a){var c=w.map,d=a;if(c)for(var e=0,f=c.length;f>e;e++){var g=c[e];if(d=b(g)?g(a)||a:a.replace(g[0],g[1]),d!==a)break}return d}function m(a,b){var c,d=a.charAt(0);if(D.test(a))c=a;else if("."===d)c=g((b?f(b):w.cwd)+a);else if("/"===d){var e=w.cwd.match(E);c=e?e[0]+a.substring(1):a}else c=w.base+a;return 0===c.indexOf("//")&&(c=location.protocol+c),c}function n(a,b){if(!a)return"";a=i(a),a=j(a),a=k(a),a=h(a);var c=m(a,b);return c=l(c)}function o(a){return a.hasAttribute?a.src:a.getAttribute("src",4)}var p,q=a("String"),r=document,s=r.head||r.getElementsByTagName("head")[0]||r.documentElement,t=s.getElementsByTagName("base")[0],u=/\.css(?:\?|$)/i,v=+navigator.userAgent.replace(/.*(?:AppleWebKit|AndroidWebKit)\/?(\d+).*/i,"$1")<536;seajs.request=c;var w=seajs.data,x=/[^?#]*\//,y=/\/\.\//g,z=/\/[^/]+\/\.\.\//,A=/([^:/])\/+\//g,B=/^([^/:]+)(\/.+)$/,C=/{([^{]+)}/g,D=/^\/\/.|:\//,E=/^.*?\/\/.*?\//,r=document,F=location.href&&0!==location.href.indexOf("about:")?f(location.href):"",G=r.scripts,H=r.getElementById("seajsnode")||G[G.length-1];f(o(H)||F),seajs.resolve=n,define("seajs/seajs-css/1.0.5/seajs-css",[],{})}();

seajs.config({
    alias: {
        /*库/框架/插件*/
        'jquery': 'js/libs/jquery.min',
        'vue': 'js/libs/vue',
        'vue-resource': 'js/libs/vue-resource',
        'vue-config': 'js/libs/vue-config',
        'elementUi': 'plugins/elementUI/elementUi',
        'common': 'js/util/common',
        'moment': 'js/util/moment.min',
        'math': 'js/util/math',
        //公共组件
        'header': 'plugins/public/header/header',//头部
        'leftMenu': 'plugins/public/left-menu/left-menu',//左菜单
        'footer': 'plugins/public/footer/footer',//底部
        'alert': 'plugins/public/alert/alert',//弹窗

        /*业务模块*/
        'index': 'js/controller/index',//首页
        'login': 'js/controller/login',//登录页
        'register': 'js/controller/register',//注册页
        'help': 'js/controller/help',//使用指南
        'forgetPwd': 'js/controller/forgetPwd',//忘记密码
        'forgetPwdCode': 'js/controller/forgetPwdCode',//重置密码
        'forgetPwdAnswer': 'js/controller/forgetPwdAnswer',//重置密码问题验证


        //账户设置
        'accountSetting': 'js/controller/accountSetting/accountSetting.js?t=' + new Date().getTime(),//账户设置
        'authentication': 'js/controller/accountSetting/authentication.js?t=' + new Date().getTime(),//实名认证
        'personApprove': 'js/controller/accountSetting/personApprove.js?t=' + new Date().getTime(),//个人认证
        'companyApprove': 'js/controller/accountSetting/companyApprove.js?t=' + new Date().getTime(),//企业认证
        'authenticaSuccess': 'js/controller/accountSetting/authenticaSuccess.js?t=' + new Date().getTime(),//实名认证成功
        'cardManage': 'js/controller/accountSetting/cardManage.js?t=' + new Date().getTime(),//管理银行卡
        'addCard': 'js/controller/accountSetting/addCard.js?t=' + new Date().getTime(),//添加银行卡
        'updateEmail': 'js/controller/accountSetting/updateEmail.js?v=1.0.js?t=' + new Date().getTime(),//绑定邮箱

        'updateLoginPw': 'js/controller/accountSetting/updateLoginPw.js?t=' + new Date().getTime(),//修改登录密码入口
        'loginPwdconditionVerify': 'js/controller/accountSetting/loginPwdconditionVerify.js?t=' + new Date().getTime(),//修改登录密码两种方式

        'setPayPwd': 'js/controller/accountSetting/setPayPwd.js?t=' + new Date().getTime(),//设置支付密码
        'updatePayPw': 'js/controller/accountSetting/updatePayPw.js?t=' + new Date().getTime(),//修改支付密码入口
        'payPwdconditionVerify': 'js/controller/accountSetting/payPwdconditionVerify.js?t=' + new Date().getTime(),//修改支付密码两种方式

        'updatePayQues': 'js/controller/accountSetting/updatePayQues.js?t=' + new Date().getTime(),//修改密保问题

        //账户总览
        'account_overview': 'js/controller/myAccount/account_overview',//账户总览个人
        'account_credit': 'js/controller/myAccount/account_credit.js?t=' + new Date().getTime(),//信用详情
        'account_recharge': 'js/controller/myAccount/account_recharge.js?t=' + new Date().getTime(),//充值
        'account_wd': 'js/controller/myAccount/account_wd',//提现
        'account_wd_tip': 'js/controller/myAccount/account_wd_tip.js?t=' + new Date().getTime(),//提现提交
        'gy_account_overview': 'js/controller/myAccount/gy_account_overview.js?t=' + new Date().getTime(),//账户总览供应商

        //我的运条
        'luck_bill': 'js/controller/myIou/luck_bill.js?t=' + new Date().getTime(),//运条账单
        'luck_bill_details': 'js/controller/myIou/luck_bill_details.js?t=' + new Date().getTime(),//运条账单详情
        'luck_bill_no': 'js/controller/myIou/luck_bill_no.js?t=' + new Date().getTime(),//运条账单详情
        'my_luck': 'js/controller/myIou/my_luck.js?t=' + new Date().getTime(),//运条账单详情
        'pay_back': 'js/controller/myIou/pay_back.js?t=' + new Date().getTime(),//运条账单详情
        'pay_back_ok': 'js/controller/myIou/pay_back_ok.js?t=' + new Date().getTime(),//运条账单详情
        'openIou': 'js/controller/myIou/openIou.js?t=' + new Date().getTime(),//开通运条


        //交易记录

        'trans_info_tip': 'js/controller/orderRecord/trans_info_tip.js?t=' + new Date().getTime(),//运条账单详情
        'trans_mer_payment': 'js/controller/orderRecord/trans_mer_payment.js?t=' + new Date().getTime(),//运条账单详情
        'trans_payment': 'js/controller/orderRecord/trans_payment.js?t=' + new Date().getTime(),//运条账单详情
        'trans_record': 'js/controller/orderRecord/trans_record',//交易记录
        'trans_record2': 'js/controller/orderRecord/trans_record2.js?t=' + new Date().getTime()//运条账单详情
    },
    base: ''

});
//判断是否登录
var loginFlag = false;
loginFlag = localStorage.userId ? true : false;
//接口根目录
var baseUrl = '';
if (document.location.host == "fs.by56.com") {
    baseUrl = 'https://' + document.location.host;
} else {
    baseUrl = 'http://' + document.location.host;
}
var ifOpenIou = {}; //是否可以开通运条

// 配置全局ajax
function setupAjax() {
    $.ajaxSetup({
        cache: false,
        beforeSend: function (a, b) {
            /* var url = '/order/payStatus';
             if(url != b.url) {
             //loading();
             }*/
        },
        success: function (resData) {
            console.log(resData);
        },
        complete: function (XHR, TS) {
            // createMask();
            var resText = XHR.responseText;
            var timeOut = "__com.fcbox.ad.login.core.login.timeout__";
            var otherLogin = "__com.fcbox.ad.user.other.place.login__ ";
            var noPermissionTxt = '__com.fcbox.ad.permission.denied__';
            if (resText == otherLogin) {
                $("#tip").tip({ content: "此账号已在别处登录，将跳转回登录页面！" });

                setTimeout(function () {
                    window.location.href = '/login.html';
                }, 3000);
            };
            if (resText == noPermissionTxt) {
                $("#tip").tip({ content: "您未有该操作的权限！" });
            }
            if (resText == timeOut || resText == otherLogin) {
                tip();
                $("#tip").tip({ content: "此账号已在别处登录，将跳转回登录页面！" });
                setTimeout(function () {
                    window.location.href = '/login.html';
                }, 3000);
            }
        }
    });
}
//自动登录
function autoLogin(id) {
    var vue = new Vue();
    vue.$http({
        url: baseUrl + '/iou/login/autoLogin',
        method: 'POST',
        params: {
        },
        credentials: true
    }).then(
        function (res) {
            //成功
            if (res.data.code == "200") {
                localStorage.userId = res.data.data.userId;
                localStorage.userName = res.data.data.username;
                localStorage.phone = res.data.data.mobile;
                ifOpenIou.tranPwdFlag = res.data.data.tranPwdFlag;//是否完成账户的支付密码设置
                ifOpenIou.securityFlag = res.data.data.securityFlag;//是否完成账户密保问题设置
                ifOpenIou.authStatus = res.data.data.authStatus;//是否完成账户实名认证
                ifOpenIou.isBindEmail = res.data.data.isBindEmail || true;//是否完成绑定邮箱

                loginFlag = true;

                seajs.use(id);
            } else {
                //登陆信息失效（超时）
                localStorage.removeItem("userId");
                localStorage.removeItem("userName");
                loginFlag = false;
                seajs.use(id);
                // 提交之前记得取消注释
                if (!(window.location.pathname == "/index.html" ||
                    window.location.pathname == "/pages/forgetPwd.html" ||
                    window.location.pathname == "/pages/help.html" ||
                    window.location.pathname == "/pages/register.html" ||
                    window.location.pathname == "/pages/forgetPwdCode.html" ||
                    window.location.pathname == "/pages/forgetPwdAnswer.html")) {
                    location.href = '/index.html';
                }
            }
        }, function (res) {
            //失败
            seajs.use(id);
            if (!(window.location.pathname == "/index.html" ||
                window.location.pathname == "/pages/forgetPwd.html" ||
                window.location.pathname == "/pages/help.html" ||
                window.location.pathname == "/pages/register.html" ||
                window.location.pathname == "/pages/forgetPwdCode.html" ||
                window.location.pathname == "/pages/forgetPwdAnswer.html")) {
                location.href = '/index.html';
            }
        });
}

//公共加载
function load(id) {
    seajs.use(['vue'], function () {
        seajs.use(['vue-resource'], function () {
            seajs.use(['vue-config'], function () {
                seajs.use(['moment'], function () {
                    seajs.use(['jquery'], function () {
                        seajs.use(['elementUi'], function () {
                            if (id) {
                                //setupAjax();
                                //自动登录
                                autoLogin(id);
                            }
                        });
                    });
                });
            });
        });
    });
}

/*baseUrl = 'http://'+document.location.host;//'https://fs.by56.com:8443';//'http://120.77.236.138:8082';
console.log(document.location.host);*/
// 提取按钮权限
function getPermission(permItem) {
    var storage = localStorage || {};
    var permissionList = JSON.parse(storage.getItem('permission'));
    var filterList = permissionList.filter(function (item) {
        return permItem == item.treeCode;
    });
    return !!filterList.length;
}
