/**
 * Created by Administrator on 2017/7/28.
 */

define(function(require,exports,module) {
    require('vue-resource');//引入
    require('header');//引入
    require('leftMenu');//引入
    require('footer');//引入
    require('alert');//引入
    require('common');//引入
    window.onresize = function(){
        model.contentWidth = document.body.clientWidth-210;
    }
    var step1ing = '../../images/step1ing.png',
        step1ed = '../../images/step1ed.png',
        step2 = '../../images/step2.png',
        step2ing = '../../images/step2ing.png',
        step2ed = '../../images/step2ed.png',
        step3 = '../../images/step3.png',
        step3ing = '../../images/step3ing.png';
    var model = new Vue({
        el:"#app",
        data :{
            contentWidth:document.body.clientWidth-210,
            contentHeight:window.innerHeight-67,
            parentHeadTit:'账户设置',
            currHeadTit:'实名认证',
            isParent:true,
            stepNum1 : true,
            stepNum2 :  false,
            stepNum3 :  false, //每一步的显示标志

            step1 : step1ing,
            step2 : step2,
            step3 : step3,

            isChecked:true,//是否选中单选框
            errorMsg:'',//错误信息

            uploadData : {
                fileType:"bizLicense",
                userId:"userid:f76a5b9f3f1d471093a6af6e04d387b4"
            },
            uploadData2 : {
                fileType:"bailment",
                userId:"userid:f76a5b9f3f1d471093a6af6e04d387b4"
            },
            imageUrl : '',

            apply_name:'',//申请人姓名
            apply_phone:'',//申请人手机号
            bank_account_type:'E',//银行账户类型E-对公账户 ，P-个人账户
            bank_card_id:'',//银行账号
            bank_name:'',//开户银行
            biz_license_img:'',//企业营业执照图片地址
            biz_license_no:'',//企业营业执照注册号
            company_name:'',//企业名称
            compnay_location_detail:'',//企业地址详细
            id_no:'',//	个人身份证号
            legal_person_auth_img:'',//法人委托授权书图片地址
            legal_person_id:'',//法人身份证号
            legal_person_name:'',//法人姓名
            pre_phone:'',//银行预留手机号
            real_name:'',//真实姓名
            user_id:'',//用户id
            office_tel:'',//办公电话
            fileName:'',//文件名
            fileName2:'',//文件名
            company_location_province:'',//省
            company_location_city:'',//市
            company_location_district:'',//区
            //模拟数据
            options1: [],//省List
            value1: '',//选中的
            options2: [],//市List
            value2: '',
            options3: [],//区List
            value3: '',
            licenseFlag: false,//营业执照注册号是否正确

            bankList : [],
            bankName : '',
            cardType : '',
            iconUrl : ''
        },
        watch: {
            fileUrl: function (newValue, oldValue) {
                var vm = this
                console.log(newValue);
                console.log(oldValue);
            },
            value1:function (newValue, oldValue) {//选择了省份则查对应的城市
                model.company_location_province = $("#province input").val();
                model.getPosition(newValue,2);
                model.value2='';
                model.value3='';
                model.company_location_city='';
                model.company_location_district='';
            },
            value2:function (newValue, oldValue) {//选择了城市则查对应的地区
                model.company_location_city = $("#city input").val();
                model.getPosition(newValue,3);
                model.value3='';
                model.company_location_district='';
            },
            value3:function (newValue, oldValue) {//选择了城市则查对应的地区
                model.company_location_district = $("#area input").val();
            },
            isChecked:function (newValue, oldValue) {
                console.log(newValue);
                console.log(oldValue);
            },
            biz_license_no:function (newValue, oldValue) {
                model.verifyRegistrationNo(newValue);//校验营业执照注册码
            },
            bank_card_id : function (newValue, oldValue) {
                if(newValue.length>15&&newValue.length<20){
                    var authNo = newValue.substring(0,6);
                    for(var i=0;i<model.bankList.length;i++){
                        for (var key in model.bankList[i]) {
                            if(authNo == key){
                                model.bankName = model.bankList[i][key].bankName;
                                model.cardType = model.bankList[i][key].cardType;
                                model.iconUrl = model.bankList[i][key].iconUrl||'https://acc.by56.com:8443/bankcard/CGB.png';
                            }
                        }
                    }
                }
            }
        },
        mounted : function () {
            this.getPosition();
            console.log($("#r4").attr("checked"));
            $.getJSON('/json/bankcard.json',function (data) {
                model.bankList = data;
            })
        },
        methods:{
            verifyRegistrationNo : function (num) {
                this.$http({
                    url : baseUrl+'/iou/base/validateBusinessNo',
                    method : 'GET',
                    params : {
                        businessNo:num
                    },
                    //emulateJSON:true
                }).then(
                    function (res) {
                        //成功
                        if(res.data.code=="200"){
                           var resData = res.data.data;
                            model.licenseFlag = resData;
                        }else{
                            return false;
                        }
                    },function (res) {
                        return false;
                    }
                );
            },
            switchRadio1 : function () {
                model.isChecked = true;
                //切换时清空数据
                model.bank_name = '';
                model.bank_card_id = '';
                model.real_name = '';
                model.id_no = '';
                model.pre_phone = '';
            },
            switchRadio2 : function () {
                model.isChecked = false;
                //切换时清空数据
                model.bank_name = '';
                model.bank_card_id = '';
                model.real_name = '';
                model.id_no = '';
                model.pre_phone = '';
            },
            showAlert : function () {//弹窗提示
                var alert = Vue.$alert({
                    visible:true,
                    msgType:error,
                    text1:model.errorMsg,
                    cancelCallback:function (e) {//取消回调
                        e.visible=false;
                    },
                    confirmCallback:function (e) {//确定回调
                        //判断个人认证还是企业认证
                        e.visible=false;
                    }
                });
                return alert;
            },
            getPosition : function (areaId,level) {
                this.$http({
                    url : baseUrl+'/iou/base/linkageAreaList',
                    method : 'GET',
                    params : {
                        areaId:areaId,
                        level:level
                    },
                    //emulateJSON:true
                }).then(
                    function (res) {
                        //成功
                        if(res.data.code=="200"){
                            var resData = res.data.data;
                            var innerObj = {};
                            if(level==1||level==''||level==undefined){
                                for(var i=0;i<resData.length;i++){
                                    var innerObj = {value:resData[i].areaId,label:resData[i].areaName};
                                    model.options1.push(innerObj);
                                }
                            }
                            if(level==2){
                                model.options2=[];
                                for(var i=0;i<resData.length;i++){
                                    var innerObj = {value:resData[i].areaId,label:resData[i].areaName};
                                    model.options2.push(innerObj);
                                }
                            }
                            if(level==3){
                                model.options3=[];
                                for(var i=0;i<resData.length;i++){
                                    var innerObj = {value:resData[i].areaId,label:resData[i].areaName};
                                    model.options3.push(innerObj);
                                }
                            }

                        }else{

                        }
                    },function (res) {

                    }
                );
            },
            handleAvatarSuccess : function(res, file) {
                this.$message.success('上传成功!');
                model.fileName = file.name;
                model.biz_license_img = res.data[0].filePath;
            },
            beforeAvatarUpload : function(file) {
                const isJPG = file.type === 'image/jpeg'||'image/png'||'image/jpg'||'image/bmp';
                const isLt2M = file.size / 1024 / 1024 < 5;

                if (!isJPG) {
                    this.$message.error('上传图片只能是 JPG，png，jpeg，bmp!');
                }
                if (!isLt2M) {
                    this.$message.error('上传图片大小不能超过 5MB!');
                   }
                    return isJPG && isLt2M;
            },
            handleAvatarSuccess2 : function(res, file) {
                this.$message.success('上传成功!');
                model.fileName2 = file.name;
                model.legal_person_auth_img = res.data[0].filePath;
            },
            beforeAvatarUpload2 : function(file) {
                const isJPG = file.type === 'image/jpeg'||'image/png'||'image/jpg'||'image/bmp';
                const isLt2M = file.size / 1024 / 1024 < 5;

                if (!isJPG) {
                    this.$message.error('上传图片只能是 JPG，png，jpeg，bmp!');
                }
                if (!isLt2M) {
                    this.$message.error('上传图片大小不能超过 5MB!');
                   }
                    return isJPG && isLt2M;
            },
            authStep1 : function () {
                if(model.company_name==""){
                    model.errorMsg='请输入企业名称';
                    model.showAlert();
                    return false;
                }else if(!model.licenseFlag){
                    model.errorMsg='请输入z正确的营业执照注册号';
                    model.showAlert();
                    return false;
                }else if(model.biz_license_img==''){
                    model.errorMsg='请上传营业执照扫描件';
                    model.showAlert();
                    return false;
                }else if(model.legal_person_name==''){
                    model.errorMsg='请填写法人姓名';
                    model.showAlert();
                    return false;
                }else if(model.legal_person_id==''){
                    model.errorMsg='请填写法人身份证号';
                    model.showAlert();
                    return false;
                }else if(!Global.IdentityCodeValid(model.legal_person_id)){
                    model.errorMsg='请正确填写身份证号';
                    model.showAlert();
                    return false;
                }else if(model.value1==''){
                    model.errorMsg='请选择省份或直辖市';
                    model.showAlert();
                    return false;
                }else if(model.value2==''){
                    model.errorMsg='请选择城市';
                    model.showAlert();
                    return false;
                }else if(model.value3==''){
                    model.errorMsg='请选择地区';
                    model.showAlert();
                    return false;
                }else if(model.compnay_location_detail==''){
                    model.errorMsg='请输入详细地址';
                    model.showAlert();
                    return false;
                }else if(!Global.moblieVerify(model.office_tel)){
                    model.errorMsg='请输入正确的办公电话';
                    model.showAlert();
                    return false;
                }
                return true;
            },
            authStep2 : function () {//第二部参数校验
                if(model.isChecked == true){//企业
                    if(model.bank_name==''){
                        model.errorMsg='请输入开户银行名称';
                        model.showAlert();
                        return false;
                    }else if(model.bank_card_id=='') {
                        model.errorMsg = '请输入银行卡号';
                        model.showAlert();
                        return false;
                    }else if(!Global.luhnCheck(model.bank_card_id)) {
                        model.errorMsg = '请输入正确的银行卡号';
                        model.showAlert();
                        return false;
                    }
                }else{//个人
                    if(model.real_name==''){
                        model.errorMsg='请输入真实姓名';
                        model.showAlert();
                        return false;
                    }else if(!Global.IdentityCodeValid(model.id_no)) {
                        model.errorMsg = '请输入正确的身份证号';
                        model.showAlert();
                        return false;
                    }else if(model.bank_card_id=='') {
                        model.errorMsg = '请输入银行卡号';
                        model.showAlert();
                        return false;
                    }else if(!Global.luhnCheck(model.bank_card_id)) {
                        model.errorMsg = '请输入正确的银行卡号';
                        model.showAlert();
                        return false;
                    }else if(!Global.moblieVerify(model.pre_phone)) {
                        model.errorMsg = '请输入正确的手机号';
                        model.showAlert();
                        return false;
                    }
                }
                return true;
            },
            authStep3 : function () {
                if(model.apply_name==''){
                    model.errorMsg='请输入申请人姓名';
                    model.showAlert();
                    return false;
                }else if(!Global.moblieVerify(model.apply_phone)) {
                    model.errorMsg = '请输入正确的手机号';
                    model.showAlert();
                    return false;
                }else if(model.legal_person_auth_img=='') {
                    model.errorMsg = '请上传法人授权委托书';
                    model.showAlert();
                    return false;
                }
                return true;
            },
            next1 : function () {
                //进行第一步参数校验
                if(model.authStep1()){
                    this.stepNum1 = false;
                    this.stepNum2 = true;
                    this.stepNum3 = false;

                    this.step1 = step1ed;
                    this.step2 = step2ing;
                    this.step3 = step3;
                }
            },
            next2 : function () {
                if(model.authStep2()){
                    this.stepNum1 = false;
                    this.stepNum2 = false;
                    this.stepNum3 = true;

                    this.step1 = step1ed;
                    this.step2 = step2ed;
                    this.step3 = step3ing;
                }
            },
            sure : function () {
                //进行参数校验然后调用企业验证接口
                if(model.authStep3){
                    model.companyApprove();
                }
            },
            last1 : function () {
                this.stepNum1 = true;
                this.stepNum2 = false;
                this.stepNum3 = false;

                this.step1 = step1ing;
                this.step2 = step2;
                this.step3 = step3;
            },
            last2 : function () {
                this.stepNum1 = false;
                this.stepNum2 = true;
                this.stepNum3 = false;

                this.step1 = step1ed;
                this.step2 = step2ing;
                this.step3 = step3;
            },
            companyApprove : function () {
                if(model.isChecked==true){
                    model.bank_account_type="E";
                }else{
                    model.bank_account_type="P";
                }
                this.$http({
                    url : baseUrl+'/iou/unionPay/cropCertification',
                    method : 'POST',
                    params : {
                        apply_name:model.apply_name,//申请人姓名
                        apply_phone:model.apply_phone,//申请人手机号
                        bank_account_type:model.bank_account_type,//银行账户类型E-对公账户 ，P-个人账户
                        bank_card_id:model.bank_card_id,//银行账号6228480402564890018（农业银行）
                        reg_bank_name:model.bank_name,//开户银行
                        biz_license_img:model.biz_license_img,//model.biz_license_img,//企业营业执照图片地址
                        biz_license_no:model.biz_license_no,//企业营业执照注册号 110108000000016
                        company_location_province:model.company_location_province,//企业地址省份
                        company_location_city:model.company_location_city,//企业地址城市
                        company_location_district:model.company_location_district,//企业地址地区
                        company_name:model.company_name,//企业名称
                        compnay_location_detail:model.compnay_location_detail,//企业地址详细
                        id_no:model.id_no,      //	个人身份证号
                        legal_person_auth_img:model.legal_person_auth_img,//model.legal_person_auth_img,//法人委托授权书图片地址
                        legal_person_id:model.legal_person_id,//法人身份证号
                        legal_person_name:model.legal_person_name,//法人姓名
                        pre_phone:model.pre_phone,//银行预留手机号
                        real_name:model.real_name,//真实姓名
                        user_id:localStorage.userId,//用户id
                        office_tel:model.office_tel,//办公电话
                        bank_icon:model.iconUrl,
                        card_type:model.cardType,
                        bank_name:model.bankName
                    },
                    //emulateJSON:true
                }).then(
                    function (res) {
                        model.errorMsg = res.data.message;
                        //成功
                        if(res.data.code=="200"){
                             //跳转成功页面
                            location.href = 'authenticaSuccess.html';
                        }else{
                            model.showAlert();
                        }
                    },function (res) {
                        model.errorMsg = "系统错误，认证失败";
                        model.showAlert();
                    }
                );
            }
        }
    })

})