/**
 * Created by Administrator on 2017/9/6.
 */

/**
 * 时间日期格式化处理
 */
Vue.filter('moment', function (value, formatString) {
    formatString = formatString || 'YYYY-MM-DD HH:mm:ss';
    return moment(value).format(formatString);
});

/**
 * 金额补全0.00
 */
Vue.filter('money',function (money, formatMoney) {
    money = parseFloat(money);
    if (isNaN(money)) {
        return '';
    }else{
        money = money+"";
        var temp = money.split("\.");
        var mylength=0;
        if(temp.length>=2){
            mylength=temp[1].length;
        }
        switch(mylength){
            case 0:
                formatMoney=money+".00";
                break;
            case 1:
                formatMoney=money+"0";
                break;
            default:
                formatMoney=money;
                break;
        }
        return formatMoney;
    }
})