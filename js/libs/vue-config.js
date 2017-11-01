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