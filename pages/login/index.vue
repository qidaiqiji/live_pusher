<template>
	<view class="login-page login">
		<view class="logo"><image class="image"  src="../../static/images/login/xm-logo.png"  mode=""></image></view>
		<view class="from">
			<!-- 手机号等信息 -->
			<view class="input phone">
				<text class="login-icon mob"></text>
				<input type="text" placeholder="请输入手机号" v-model="mobile" @blur="getMobileType" />
			</view>
			<view class="input draps" v-if="!showYzm"><drag @successFunction="successDrag" :userMobile="mobile"></drag></view>
			<view class="input code" v-if="showYzm">
				<text class="login-icon yzIcon"></text>
				<input type="text" placeholder="请输入验证码" v-model="checkNo" />
				<view class="code-down" @tap="tryAng" :class="{ disabled: disabled }">{{ message }}</view>
			</view>
			<view class="submit" @tap="toLogins" :disabled="isCode" :class="{ disabled: isCode }"><view>登录/注册</view></view>
			<!-- <view class="tips">
				若您输入的手机号未注册，将会进入注册流程。注册表示您已阅读并同意
				<text class="red" @tap="goPage('./agreement')">《小美诚品用户服务协议》</text>
			</view> -->
		</view>
	</view>
</template>

<script>
import Base64 from '@/common/base64.js';
import drag from '@/components/drag.vue';
var vl = { tel: /^1[345789]\d{9}$/, number: /^\d+$/, iemi: /^\d{15}$/ };
export default {
    components: {
        drag
    },
    data() {
        return {
            disabled: false,
            message: '获取验证码',
            countdown: 60,
            showYzm: false,
            // 服务器需要参数
            mobile: '', //13162855493
            checkNo: '',
            recommand_id: 0,
            //
            loginType: 1,
            clock: null,
            openId: '',
            unionid: '',
            code: '',
            access_token: ''
        };
    },
    onLoad(params) {
        this.access_token = uni.getStorageSync('access_token') || '';
        let { openId, unionid, code } = params;
        this.openId = openId || '';
        this.unionid = unionid || '';
        this.code = code || '';
    },
    computed: {
        isCode: function() {
            if (this.yzCode == '') {
                return true;
            } else {
                return false;
            }
        }
    },
    onUnload() {
        if (this.clock) {
            clearTimeout(this.clock);
        }
        this.clock = null;
    },
    onHide() {
        if (this.clock) {
            clearTimeout(this.clock);
        }
        this.clock = null;
    },
    onShow() {
        if (this.countdown < 60) {
            this.settime();
        }
    },
    methods: {
        getMobileType() {
            if (!vl.tel.test(this.mobile)) {
                this.$api.showMessage('请正确填写手机号');
                return false;
            }
            if (!vl.number.test(this.mobile)) {
                this.$api.showMessage('请正确填写手机号');
                return false;
            }
            if (this.mobile.length > 11) {
                this.$api.showMessage('请正确填写手机号');
                return false;
            }
            return true;
        },
        getCno() {
            if (!vl.number.test(this.checkNo)) {
                this.$api.showMessage('请正确填写验证码');
                return false;
            }
            return true;
        },
        tryAng() {
            if (this.countdown == 60 && !this.disabled) {
                this.getMessage();
            }
        },
        async getMessage() {
            let res = await this.$api.request({
                method: 'POST',
                access_token: this.access_token,
                url: this.$api.getLoginSms,
                data: {
                    type: this.loginType,
                    mobile: this.mobile
                }
            });
            this.$api.showMessage(res && res.msg);
            if (res && res.code == 0) {
                this.settime();
            }
        },
        successDrag(flag) {
            this.showYzm = true;
            this.getMessage();
        },
        settime() {
            let _this = this;
            if (_this.countdown == 0) {
                _this.disabled = false;
                _this.message = '获取验证码';
                _this.countdown = 60;
                clearTimeout(this.clock);
                return;
            } else {
                _this.disabled = true;
                _this.message = _this.countdown + 's后重新获取';
                _this.countdown--;
            }
            this.clock = setTimeout(function() {
                _this.settime();
            }, 1000);
        },
        goPage(path) {
            this.$api.goNavigateTo(path);
        },
        async toLogins() {
            let _this = this;
            // this.$api.goNavigateTo('../loginaddress/loginaddress');
            // return;
            let _data = {
                mobile: _this.mobile,
                checkNo: _this.checkNo,
                recommand_id: _this.recommand_id,
                openId: _this.openId,
                unionid: _this.unionid
                    // code: _this.code
            };
            if (this.getMobileType() && this.getCno()) {
                let res = await this.$api.request({
                    method: 'post',
                    url: this.$api.user_appregister,
                    data: _data
                });
                if (res && res.data) {
                    try {
                        let { access_token, headImgUrl } = res.data;
                        if (access_token) {
                            let token = `Basic ${Base64.encode(access_token + ':')}`;
							// let token = `Basic ${access_token + ':'}`;

                            // uni.showModal({
                            // 	title: '绑定登录成功',
                            // 	content: token + '::' + access_token,
                            // 	success: res => {
                            // 		if (res.confirm) {
                            if (token) {
                                _this.$store.commit('updateToken', token);
                                uni.setStorageSync('access_token', token);
                                uni.setStorageSync('headImgUrl', headImgUrl);
                                setTimeout(function() {
                                    // _this.$api.goNavigateTo('../loginaddress/loginaddress');
									 _this.$api.goNavigateTo('../index/index');
                                }, 200);
                            }
                            // 		}
                            // 	}
                            // });
                        } else {
                            this.$api.showMessage(res && res.msg);
                        }
                    } catch (e) {}
                } else {
                    uni.showModal({
                        title: '提示',
                        content: '注册绑定失败',
                        success: function(res) {}
                    });
                }
            }
        }
    }
};
</script>


<style lang="less" scoped="scoped">
@import url('login.less');
</style>

