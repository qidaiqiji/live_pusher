/**
 * 是否开启小美程序本地服务=> true 开启；false 不开启
 */
import Base64 from './base64.js';
let USE_DEBUG = typeof window == 'undefined' ? true : false;
// 请求设置
let Env=true;
let _Post = 'http://xm.rdmate.com/company/xiaopost';
let _Get = 'http://xm.rdmate.com/company/xiaoget';
let _xiaomei360 =  Env?'https://api.xiaomei360.com':'https://testapi.xiaomei360.com';

if (USE_DEBUG) {
	_Post = Env?'https://api.xiaomei360.com':'https://testapi.xiaomei360.com';
	_Get = Env?'https://api.xiaomei360.com':'https://testapi.xiaomei360.com';
	_xiaomei360 = Env?'https://api.xiaomei360.com':'https://testapi.xiaomei360.com';
}
export const Post = _Post;
export const Get = _Get;
export const xiaomei360 = _xiaomei360;

// 首页
export let getIndex = `${xiaomei360}/v2/aliyun-live/list`;
// 获取推流地址
export let getPushDetail = `${xiaomei360}/v2/aliyun-live/push-url`;
// 获取验证码
export let getLoginSms = `${xiaomei360}/v2/user/get-sms-check-no`;
// ---- APP自动登录
export let user_apploginwithcode = `${xiaomei360}/v2/user/app-login-with-code`;
// ---- APP注册登录
export let user_appregister = `${xiaomei360}/v2/user/app-register`;

// 信息提示框
export function showMessage(message) {
    uni.showToast({
        icon: "none",
        title: message,
        duration: 1500
    })
}

/**
 * 错误信息提示
 * @param {*} message 可选提示内容
 */
function _errorModal(message) {
    message = message || '数据请求失败，请检查当前网络是否稳定';
    uni.showModal({
        title: "提示",
        content: message
    })
}

/**
 * 登录失效, 提示重新登录
 */
function _showErrorLogin(type) {
    uni.showModal({
        title: '提示',
        content: "登录已失效，请重新授权登录",
        success: (res) => {
            uni.removeStorageSync('access_token');
            uni.removeStorageSync('userinfo');
            if (res.confirm) {
                uni.removeStorageSync('untoken');
                uni.redirectTo({
                    url: '/pages/wxlogin/wxlogin'
                })
            } else if (res.cancel) {
                uni.removeStorageSync('untoken');
                uni.switchTab({
                    url: '/pages/index/index'
                });
            }
        }
    });
}

/**
 * 公共请求, 默认GET请求
 * @param {*} params 
 * 
 */
export const request = async(params) => {
    let {
        method,
        url,
        data,
        header,
        isDebug,
        isNot,
        loading,
        loadingType
    } = params;
    let _url = Get;
    let _data = {};

    if (method) {
        method = method.toUpperCase();
    } else {
        method = "GET";
    }

    if (!USE_DEBUG) {
        // console.log(`USE_DEBUG : ${USE_DEBUG}`);
        // 请求类型
        if (method === 'POST') {
            _url = Post;
            if (data) {
                for (let key in data) {
                    _data[key] = data[key];
                }
            }
        } else if (method === 'GET') {
            let query = '';
            if (data) {
                query = '?';
                for (let key in data) {
                    query += (query == '?') ? `${key}=${data[key]}` : `&${key}=${data[key]}`;
                }
            }
            url = (url + query);
        }

        // 是否更换参数类型
        if (header) {
            _data.url_json = url;
        } else {
            _data.url = url;
        }
    } else {
        _url = url;
        if (data) {
            for (let key in data) {
                _data[key] = data[key];
            }
        }
        console.log(_url + " => " + method);
    }

    let _access_token = uni.getStorageSync('access_token');
    let _header = {
        'Authorization': _access_token ? _access_token : ''
    };

    // 登录失效返回 
    let unRes = {
        data: null,
        msg: "数据请求失败，请检查当前网络是否稳定",
        code: 401
    };

    try {
        (loading && !loadingType) && uni.showNavigationBarLoading();
        (!loading && loadingType) && uni.showLoading({
            title: '加载中'
        });

        var [error, res] = await uni.request({
            method: method,
            url: _url,
            data: _data,
            header: _header,
        });

        (loading && !loadingType) && uni.hideNavigationBarLoading();
        (!loading && loadingType) && uni.hideLoading();

        if (error) {
            console.log(`error:` + JSON.stringify(error));
            _errorModal();
        }
        if (isDebug) {
            console.log(JSON.stringify(res));
        }

        if (res && res.statusCode === 200) {
            let datas = res.data;
            if (datas.status == 401 && !isNot) {
                _showErrorLogin();
                unRes.log = "datas.status";
                return unRes;
            }
            return datas;
        } else if (res && res.statusCode == 401 && !isNot) {
            _showErrorLogin();
            unRes.log = "res.statusCode";
            return unRes;
        }
    } catch (e) {
        console.log(JSON.stringify(`catch` + e));
        _errorModal();
    }
    unRes.log = "try.catch";
    return unRes;
};

/**
 * 获取商品列表
 */
export const getGoodsArray = function(opt, callback) {
    let {
        params,
        access_token
    } = opt;

    let query = '?';
    for (let key in params) {
        if (query == '?') {
            query += `${key}=${params[key]}`;
        } else {
            query += `&${key}=${params[key]}`;
        }
    }
    let _URL = Get + '?url=' + encodeURIComponent(getGoodsList + query);
    let _access_token = access_token || uni.getStorageSync('access_token') || "";
    uni.request({
        method: 'GET',
        url: _URL,
        data: {},
        header: {
            "Authorization": _access_token
        },
        success: function(res) {
            if (res.statusCode === 200) {
                callback && callback(res.data);
            }
        },
        fail: function(res) {
            _errorModal();
        },
        complete: function(e) {}
    });
};

/**
 * 跳转页面
 * @param {Object} urlPath 页面路径
 */
export function goNavigateTo(urlPath) {
    if (urlPath) {
        uni.navigateTo({
            url: urlPath,
            animationType: "slide-in-right",
            animationDuration: 200,
            fail() {
                showMessage('页面不存在');
            }
        });
    } else {
        showMessage('页面路径不存在');
    }
}
		//切割价格大小
export function	split_price(List = [], price = '', attribute = '') {
			let temp_list = List.map(item => {
				if (!attribute) {
					let goodsPrice = item[price];
					let array = goodsPrice.split('.');
					item.big = array[0];
					item.min = array[1] && array[1];
				} else {
					let goodsPrice = item[attribute][price];
					let array = goodsPrice.split('.');
					item[attribute].big = array[0];
					item[attribute].min = array[1] && array[1];
				}
				return item;
			});
			return temp_list;
		}

/**
 * 获取登陆access_token
 * @param {Object} vm 实例模型
 */
export function getAccessToken(vm) {
    let accessToken = uni.getStorageSync('access_token');
    if (accessToken) {
        vm.$store.commit('updateToken', accessToken);
    } else {
        uni.redirectTo({
            url: '/pages/wxlogin/wxlogin'
        })
    }
}

/**
 * 拨打电话
 * @param {*} mobile 默认拨打 18926772751
 */
export function callMobile(mobile) {
    uni.makePhoneCall({
        phoneNumber: mobile || '18926772751',
        fail: function() {
            vm.$api.showMessage('拉起拨打电话失败');
        }
    });
}

/**
 * 设置tabbar角标
 */
export function getTabbarCart(totalCount) {
    try {
        let cartNumber = totalCount || uni.getStorageSync('cartNumber') || 0;
        if (cartNumber && Number(cartNumber) > 0) {
            uni.setTabBarBadge({
                index: 3,
                text: Number(cartNumber) > 100 ? '...' : (cartNumber).toString()
            });
        } else {
            uni.removeTabBarBadge({
                index: 3
            })
        }
    } catch (e) {
        console.log(e)
            //TODO handle the exception
    }
}