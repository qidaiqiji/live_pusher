// 请求设置
const websitePost = 'http://xm.rdmate.com/company/xiaopost';
const websiteGet = 'http://xm.rdmate.com/company/xiaoget';

/**
 * 请求公共类型
 * @param {*} method 	GET/POST
 * @param {*} URL 		请求地址
 * @param {*} data 		请求参数
 * @param {*} success 	请求成功
 * @param {*} fail 		请求失败
 */
function _request(method, URL, data, success, fail) {
    let access_token = uni.getStorageSync('access_token');
    let _header = {
        "Authorization": access_token ? access_token : ''
    };
    uni.request({
        method: method,
        url: URL,
        data: data,
        header: _header,
        success: function(res) {
            if (res.statusCode === 200) {
                typeof success == 'function' && success(res.data);
            } else if (res && res.statusCode == 401) {
                _showErrorLogin();
            }
        },
        fail: function(res) {
            uni.showModal({
                title: "提示",
                content: '数据请求失败，请检查当前网络是否稳定。'
            });
            typeof fail == 'function' && fail(res);
        },
        complete: function(e) {
			uni.hideLoading();
            uni.hideNavigationBarLoading();
        }
    });
}

/**
 * 登录失效提示
 */
function _showErrorLogin() {
    uni.showModal({
        title: '提示',
        content: "登录已失效，请重新授权登录",
        success: (res) => {
            if (res.confirm) {
                uni.redirectTo({
                    url: '/pages/wxlogin/wxlogin'
                })
            } else if (res.cancel) {
                uni.removeStorageSync('access_token');
                uni.removeStorageSync('userinfo');
                uni.switchTab({
                    url: '/pages/index/index'
                });
            }
        }
    });
}

/**
 * GET 请求
 * @param {*} opt 
 */
function _Get(opt) {
    let { url, data, success } = opt;

    let query = '';
    if (data) {
        query = '?';
        for (let key in data) {
            if (query == '?') {
                query += `${key}=${data[key]}`;
            } else {
                query += `&${key}=${data[key]}`;
            }
        }
    }
    let _URL = websiteGet + '?url=' + encodeURIComponent(url + query);
    _request("GET", _URL, {}, success);
};

/**
 * POST 请求
 * @param {*} opt 
 */
function _Post(opt) {
    let { url, data, header, success } = opt;

    if (header) {
        data.url_json = url;
    } else {
        data.url = url;
    }
    _request("POST", websitePost, data, success);
};


let http = function(opt) {
    let { method } = opt;
    method = method ? method : 'GET';
    if (method.toUpperCase() == 'GET') {
        _Get(opt);
    } else if (method.toUpperCase() == 'POST') {
        _Post(opt);
    }
}

export default http;