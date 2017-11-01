/**
 * Created by Administrator on 2017/7/25.
 */
Vue.component('fs-header', {
    props: {
        headCurrTit: String,
        headerParentTit: String,
        isParent: Boolean,
        goto:String,
        
    },
    template:   '<div class="fs-header" >'+
                   '<div class="header-box">'+
                      '<div class="header-inner">' +
                        '<h1 class="header-text"><span class="headerParentTit"><a :href="goto" style="color:black;">{{headerParentTit}}</a><span v-show="isParent">&nbsp;&nbsp;>&nbsp;&nbsp;</span></span><span class="headerCurrTit">{{headCurrTit}}</span></h1>'+
                        '<img class="userHead" @click="showSetting" :src="userFace"/>'+
                      '</div>'+
                      '<div v-show="settingFlag" class="header-setting">' +
                        '<ul>' +
                            '<li><img class="headerPic" :src="userFace" @click="toggleModal"/></li>'+
                            '<li><span class="userName">{{name}}</span></li>'+
                            '<li @click="toAccountSetting" class="header-settingLi" @mouseenter="enter1" @mouseleave="leave1" style="top: 48px;"><img :src="img1"/><span class="header-settingText">账户设置</span></li>'+
                            '<li @click="loginOut" class="header-outLi"  @mouseenter="enter2" @mouseleave="leave2" style="top: 64px;"><img style="width: 16px;"  :src="img2"/><span class="header-settingText" >退出</span></li>'+
                        '</ul>'+
                     '</div>'+
                   '</div>' +
                   '<div class="changeAvatarBG" v-show="showModal">' +
                        '<div class="changeAvatarModal">' +
                            "<div class=\"camTitle\">修改头像</div>" +
                            // "<div class=\"camClose\" @click=\"toggleModal\">&times;</div>" +
                            "<label for=\"updateAvatar\" class=\"updateAva\">点击上传</label>" +
                            "<input ref=\"avatarInput\" v-show=\"false\" id=\"updateAvatar\" name=\"updateAvatar\" type=\"file\" accept=\".jpg, .jpeg, .png\" @change=\"updateAvatar\">" +
                            "<div class=\"fsAvatars\">" +
                                "<div ref=\"avatar1\" class=\"avatar1\">" +
                                    "<img :src=\"imageUrl\" v-if=\"imageUrl\" alt=\"180 * 180\">" +
                                    "<div class=\"legend\">支持jpg/png格式图片且小于2M</div>" +
                                "</div>" +
                                "<div class=\"avatar2\">" +
                                    "<img :src=\"imageUrl\" v-if=\"imageUrl\" alt=\"80 * 80\">" +
                                "</div>" +
                                "<div class=\"avatar3\">" +
                                    "<img :src=\"imageUrl\" v-if=\"imageUrl\" alt=\"40 * 40\">" +
                                "</div>" +
                            "</div>" +
                            "<div class=\"avatarButtons\">" +
                                "<el-button @click=\"toggleModal\">取消</el-button>" +
                                "<el-button type=\"primary\" @click=\"confirm\">确认</el-button>" +
                            "</div>" +
                        '</div>' +
                    '</div>' +
               '</div>'
    ,
    data:function () {
        return {
            name:localStorage.userName,
            headerWidth:window.screen.width-210,
            img1:'../../images/setting.png',
            img2:'../../images/out.png',
            settingFlag:false,
            //用户头像
            uploadData: {
                fileType: "avatar",
                userId: localStorage.userId
            },
            // 头像线上地址
            uploadAvatarAddress: {
                avatarImg: '',
                userId: localStorage.userId
            },
            postUrl: 'https://fs.by56.com' + '/acc/fileUpload/upload', // 文件上传接口
            postAddressUrl: 'https://fs.by56.com' + '/iou/userDetail/updateUserDetail', // 线上头像地址接口
            imageUrl: '',
            showModal: false,
            userFace: '../../images/personV.png' // 用户头像
        };
    },
    mounted:function(){
        //防止事件冒泡
        var stopPropagation =function (e) {
            if (e.stopPropagation)
                e.stopPropagation();
            else
                e.cancelBubble = true;
        };
        $(document).on('click',function(){
            $('.header-setting').css('display','none');
        });
        $('.header-setting').bind('click',function(e){
            stopPropagation(e);
        });
        $('.userHead').bind('click',function(e){
            $('.header-setting').css('display','block');
            stopPropagation(e);
        });
        this.queryuserStatus();
    },
    methods:{
        enter1:function () {
            this.img1 = '../../images/setting-select.png'
        },
        leave1:function () {
            this.img1 = '../../images/setting.png'
        },
        enter2:function () {
            this.img2 = '../../images/out-select.png'
        },
        leave2:function () {
            this.img2 = '../../images/out.png'
        },
        loginOut:function () {
            this.$http({
                url : baseUrl+'/iou/login/logout',
                method : 'POST',
                params : {
                    'userId':localStorage.userId
                }
                //emulateJSON:true
            }).then(
                function (res) {
                    //成功
                    if(res.data.code=="200"){
                        //退出清除登录信息缓存
                        localStorage.removeItem("userId");
                        localStorage.removeItem("userName");
                        loginFlag = false;
                        location.href='../../index.html';
                        localStorage.removeItem("iouStatus");
                    }else{
                        //系统异常
                    }
                },function (res) {
                    //失败

                }

            );
        },
        toAccountSetting: function () {
            // todo: 由于是组件，要用绝对路径
            location.href = '/pages/accountSetting/accountSetting.html';
        },
        showSetting:function () {
            this.settingFlag = true;
        },
        confirm: function() {
            var self = this;
            this.$message.info("开始上传，请耐心等待");
            // 获取图片
            var imgFile = this.$refs.avatarInput.files && this.$refs.avatarInput.files[0];
            if(imgFile) {
                var imgType = imgFile.type;
                var imgSize = imgFile.size;
                // 不是jpg或者png
                if(imgType !== "image/png" && imgType !== "image/jpg" && imgType !== "image/jpeg") {
                    this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!');
                    return
                }
                // 尺寸小于2M
                if(imgSize > 1024 * 200) {
                    this.$message.error('上传头像图片大小不能超过 200KB!');
                    return
                }
                // 上传表单数据
                var formData = new FormData();
                formData.append("avatar", imgFile);
                if(this.uploadData) {
                    Object.keys(this.uploadData).map(function(key) {
                        formData.append(key, self.uploadData[key]);
                    });
                }
                // 请求上传图片
                if (typeof XMLHttpRequest === 'undefined') {
                    console.log("xhr not supported");
                    return;
                }
                var xhr = new XMLHttpRequest();
                // 失败
                xhr.onerror = function (e) {
                    self.$message.error("上传失败");
                };
                // 成功
                xhr.onload = function () {
                    if (xhr.readyState === xhr.DONE) {
                        if (xhr.status === 200) {
                            self.$message.success("上传成功");
                            self.showModal = !self.showModal;
                            self.userFace = self.imageUrl;
                            // 获取返回数据
                            self.uploadAvatarAddress.avatarImg = JSON.parse(xhr.response).data[0].filePath;
                            self.sendAddress();
                        }
                    }
                };
                xhr.open('post', this.postUrl, true);
                xhr.send(formData);
            }
        },
        sendAddress: function() {
            var self = this;
            var xhr = new XMLHttpRequest();
            // 上传数据
            var formData = new FormData();
            if(this.uploadAvatarAddress) {
                Object.keys(this.uploadAvatarAddress).map(key => {
                    formData.append(key, this.uploadAvatarAddress[key]);
                });
            }
            // 失败
            xhr.onerror = function (e) {
                console.log("上传图片地址失败")
            };
            // 成功
            xhr.onload = function () {
                if (xhr.readyState === xhr.DONE) {
                    if (xhr.status === 200) {
                        console.log("上传图片地址成功");
                    }
                }
            };
            xhr.open('post', this.postAddressUrl, true);
            xhr.send(formData);
        },
        updateAvatar: function() {
            this.imageUrl = URL.createObjectURL(this.$refs.avatarInput.files[0]);
        },
        queryuserStatus : function () {
            var self = this;
            var userInfo = {};
            this.$http({
                url : baseUrl+'/iou/user/userStatus',
                method : 'GET',
                params : {
                    userId:localStorage.userId
                },
            }).then(
                function (res) {
                    userInfo = res.data.data;
                    var avatarImg = userInfo.avatarImg;
                    if(avatarImg) {
                        self.userFace = avatarImg;
                        console.log("获取头像成功")
                    }
                    self.$emit('user-info-received', userInfo)
                },function (res) {
                    console.log("获取头像失败")
                }
            );
        },
        toggleModal: function() {
            this.showModal = !this.showModal
        }
}
})
