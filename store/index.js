import Vue from 'vue'
import Vuex from 'vuex'

import {
	request,
	getUserInfo,
	getCartlist
} from "../common/utils.js";

Vue.use(Vuex)

/**
 * 登录失效移除token
 */
function removeAccesstoken(res) {
	if (res && res.code == 401) {
		uni.removeStorageSync('access_token');
		uni.removeStorageSync('cartNumber');
	}
}

/**
 * vuex 状态管理
 */
const store = new Vuex.Store({
	state: {
		userinfo: {},
		nickName: "",
		userRank: 0,
		balance: 0,
		isLogin: false,
		cartNumber: 0,
		access_token: '',
		// 
		addressId: 0,
		couponId: 0,
		orderViewCoupon: null,
		coudanInfo: null,
		//客服聊天
		user: {
			home: {
				id: 1,
				name: 'tax',
				img: '/static/images/logo.png'
			},
			customer: {
				id: 2,
				name: 'customer',
				img: '/static/images/public/img_user@2x.png'
			}
		}
	},
	updated: function() {},
	mutations: {
		// 更新用户信息
		updateUserInfo(state, value) {
			state.userinfo = value;
		},
		// 更新用户昵称
		updateNickName(state, value) {
			state.nickName = value;
		},
		// 更新用户是否VIP
		updateUserRank(state, value) {
			state.userRank = value;
		},
		// 更新用户积分
		updateBalance(state, value) {
			state.balance = value;
		},
		// 更新全局购物车数量
		updateCart(state, value) {
			state.cartNumber = value;
			uni.setStorageSync('cartNumber', value);
		},
		// 更新用户在线token
		updateToken(state, value) {
			state.access_token = value;
		},
		// 更新用户确认订单去使用优惠券
		updateCoupon(state, list) {
			state.orderViewCoupon = list;
		},
		// 更新用户确认订单使用优惠券ID
		updateCouponId(state, couponId) {
			state.couponId = couponId;
		},
		// 更新用户确认订单使用优惠券ID
		updateAddressId(state, addressId) {
			state.addressId = addressId;
		},
		// 更新用户凑单 => 已经更新为使用缓存机制
		updateCoudan(state, list) {
			state.coudanInfo = list;
		},
		login(state, message) {
			state.isLogin = message;
		}
	},
	actions: {
		// 首页获取用户信息，提供给模块判断是否登录授权
		getUserInfos: async function({
			commit,
			state
		}) {
			let res = await request({
				access_token: state.access_token ? state.access_token : '',
				url: getUserInfo,
				isNot: true
			});
			if (res && res.data) {
				// console.log(res,'+++++')
				let {
					nickName,
					userRank,
					balance,
					access_token,
					is_checked
				} = res.data;
				let token = `Basic ${Base64.encode(access_token+':')}`
				commit('updateNickName', nickName);
				commit('updateUserRank', userRank);
				commit('updateBalance', balance);
				commit('updateToken', token);
				// res.data = {
				// 	"userName": "XM_5ca583fc70bbe",
				// 	"nickName": "何娟",
				// 	"access_token": "i8kBY-LoBNrED_zdMzFeU9AlWB88kuJO",
				// 	"provinceId": 39,
				// 	"is_checked": 0,
				// 	"version": "12",
				// 	"userRank": 4,
				// 	"rankName": "贵宾会员",
				// 	"balance": 160,
				// 	"servicePhone": "18926772751",
				// 	"isActTime": false,
				// 	"actMenu": [{
				// 		"name": "主会场",
				// 		"sellingPoint": "",
				// 		"pageId": "pages/activeDirectory/midYearActivities/midYearActivities"
				// 	}, {
				// 		"name": "积分会场",
				// 		"sellingPoint": "疯狂砸大奖",
				// 		"pageId": "pages/self/integral/integral/integral"
				// 	}, {
				// 		"name": "秒杀会场",
				// 		"sellingPoint": "限时钜惠快抢",
				// 		"pageId": "pages/homePage/miaosha/miaosha"
				// 	}, {
				// 		"name": "特卖专场",
				// 		"sellingPoint": "让利不止2折",
				// 		"pageId": "pages/activeDirectory/midYearActivities/midYearActivities?type=temai"
				// 	}, {
				// 		"name": "巨划算会场",
				// 		"sellingPoint": "单品直降底价",
				// 		"pageId": "pages/homePage/juhuasuan/juhuasuan"
				// 	}, {
				// 		"name": "满赠会场",
				// 		"sellingPoint": "折上再享75折",
				// 		"pageId": "pages/homePage/anniversary/anniversary?title=1"
				// 	}, {
				// 		"name": "套餐会场",
				// 		"sellingPoint": "最高立省199元",
				// 		"pageId": "pages/homePage/anniversary/anniversary?title=2"
				// 	}]
				// }
				uni.setStorageSync('userinfo', res.data);
				uni.setStorageSync('is_checked', is_checked);
				// uni.setStorageSync('is_checked', 0);
			} else {
				removeAccesstoken(res);
			}
		},
		// 首页获取用户信息，提供给模块min导航显示购物车数量
		getCartInfo: async function({
			commit,
			state
		}) {
			let res = await request({
				access_token: state.access_token ? state.access_token : '',
				url: getCartlist,
				isNot: true
			});
			if (res && res.data) {
				let total = res.data.total;
				commit('updateCart', total.totalCount);
			} else {
				removeAccesstoken(res);
			}
		}
	}
})

export default store
