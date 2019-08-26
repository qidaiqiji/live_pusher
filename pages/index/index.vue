<template>
	<view id="home">
		<view class="livingBroadcast" style="background-image: url('../../static/images/home/img_bg.png')">
			<view class="livingBroadcastList">
				<block v-for="(item, index) in liveList" :key="index">
					<view class="livingBroadcastItem"  @tap="jumpToDetail(item)">
						<image :src="item.cover"></image>
						<view class="opration_msg">
							<view class="msg_title">{{item.title}}</view>
							<view class="msg_num">
								<view><image src="../../static/images/home/icon_zanting.png"></image></view>
								<view>{{item.viewerCount}}人观看</view>
							</view>
						</view>
					</view>
				</block>
			</view>
		</view>
		<view class="immediatelyStarted">
			<view class="type_title">
				<image src="../../static/images/home/title_icon.png"></image>
				<text>即将开始</text>
			</view>
			<view>
				<block v-for="(liveItem, index) in eveList" :key="index" >
					<IndexRow :liveItem="liveItem" :type="begin"></IndexRow>
				</block>
			</view>
		</view>
		<!-- <view class="highlightReplays">
			<view class="type_title">
				<image></image>
				<text>精彩回放</text>
			</view>
			<view>
				<block v-for='(liveItem,index) in eveList' :key="index">
				   <IndexRow :liveItem="liveItem" :type="playBack"></IndexRow>	
				</block>
			</view>
		</view> -->
	</view>
</template>
<script>
import IndexRow from '@/components/index-row';
export default {
	name: 'home',
	components: {
		IndexRow
	},
	data() {
		return {
			liveList: [],
			playBack: 'playBack',
			begin: 'begin',
			eveList: [],
			deepAction:false,
		};
	},
	onLoad() {
		this.getIndex();
		// this.autoLogin();
	},
	async onPullDownRefresh(){
		try{
			const res = await this.$api.request({
				url: this.$api.getIndex
			});
			this.liveList = res.data.liveList;
			this.eveList = res.data.eveList;
			
			uni.stopPullDownRefresh();
		}catch(err){
			uni.stopPullDownRefresh();
		}
		
	},
	methods: {
		async autoLogin() {
			let tokens = uni.getStorageSync('access_token');
			// try {
			// 	const res = await this.$api.request({
			// 		url: this.$api.user_apploginwithcode,
			// 		token:tokens,
			// 		
			// 	});
			// 	console.log("res",res)
			// } catch (e) {
			// 	console.log(e);
			// }
		},
		jumpToDetail(record) {
			if(!record.isAnchor) {
				uni.showModal({
					title:'提示',
					content:'您不是主播，无法进行直播',
				})
			}else{
				let url = `/pages/pusher/index?id=${record.id}&&img=${record.cover}`
				this.$api.goNavigateTo(url)
			}	
		},
		async getIndex() {
			console.log('11');
			try {
				const res = await this.$api.request({
					url: this.$api.getIndex
				});
				this.liveList = res.data.liveList;
				this.eveList = res.data.eveList;
			} catch (e) {
				console.log(e);
			}
		}
		// 			push() {
		// 				const currentWebview = this.$mp.page.$getAppWebview()
		// 				var pusher = plus.video.createLivePusher("", {
		// 				url:'rtmp://live-in.xiaomei360.com/XM_class/4jinR6?auth_key=1562759180-0-0-3a2291ba770120ab9de4d95018aa39e5',
		// 				top:'0px',
		// 				left:'0px',
		// 				width: '100%',
		// 				height: '100%',
		// 				position: 'static'
		// 				});
		// 				currentWebview.append(pusher);
		// 				pusher.start();
		// 			}
	}
};
</script>
<style>
@import url('./index.less');
</style>
