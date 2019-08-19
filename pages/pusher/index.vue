<template>
	<view class="content">		
		<view class="liveArea">
			<view class="backUrl">
				<image :src="imgUrl" class="cover"></image>
			</view>
			<view class="floatArea">
				<view class="pauseBtn" v-if="isPlay" @tap="pauseLive">
					<view class="btnWrap">
						<view class="imgWrap">
							<image :src="isPause?'../../static/images/home/icon_play.png':'../../static/images/home/icon_pause.png'"></image>	
						</view>
						<view>{{isPause?'继续':'暂停'}}</view>
					</view>
				</view>
				<view class="startBtn" @tap="plusReady" v-if="!isPlay">
					<view class="redDot"></view>
				</view>
				<view class="stopBtn" v-if="isPlay" @tap="stopLive">
					<view class="btnWrap">
						<view class="imgWrap">
							<image src="../../static/images/home/icon_stop.png"></image>
						</view>
						<view>关闭</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	var pusher
	export default {
		data() {
			return {
				id:'',
				url:'111',
				isPlay:false,
				countDown:3,
				isPause:false,
				pusher:null,
				imgUrl:'',
			}
		},
		onLoad(params) {
			this.id = params.id;
			this.imgUrl = params.img;
			this.getPushDetail(this.id);
		},
		methods: {
			async getPushDetail(id) {
				const res= await this.$api.request({
					url: this.$api.getPushDetail,
					data:{id},
				})
				let that = this;
				if(res.code != 0) {
					uni.showModal({
						title:'提示',
						content:res.msg,
						cancelText:'取消',
						confirmText:'返回列表',
						success(result) {
							console.log("result",result)
							if(result.confirm || result.cancel) {
								that.$api.goNavigateTo("/pages/index/index")
							}
						},
					})
				}else{
					this.url = res.data.url;
				}
				
			},
			plusReady() {
				let that = this;
				const currentWebview = this.$mp.page.$getAppWebview();  
				pusher = plus.video.createLivePusher("liveArea", {    
					url:this.url,    
					top:'0px',    
					left:'0px',    
					width: '100%',    
					height: '73%',  
					position: 'static'    
				});    
				currentWebview.append(pusher);  
				pusher.preview();
				uni.showModal({
					title:'提示',
					content:'请确认是否开始直播',
					cancelText:'取消',
					confirmText:'开始直播',
					success(result) {
						if(result.confirm) {
							that.isPlay = true;
							that.startPusher();
						}
					},
				})
			},
			// 开始推流
			startPusher() {
				pusher.start();
			},
			// 暂停和恢复
			pauseLive() {
				let that = this;
				if(this.isPause) {
					uni.showModal({
						title:'提示',
						content:'是否继续',
						confirmText:'继续',
						success(result) {
							if(result.confirm) {
								that.isPause = false;
								pusher.resume();
							}
						}
					})
				}else{
					uni.showModal({
						title:'提示',
						content:'是否要暂停直播？若要继续直播，可点击播放按钮继续',
						confirmText:'暂停',
						success(result) {
							if(result.confirm) {
								that.isPause = true;
								pusher.pause();
							}
						}
					})
				}
			},
			// 停止
			stopLive() {
				let that = this;
				let url = `/pages/index/index`
				uni.showModal({
					title:'提示',
					content:'确定要关闭直播吗',
					confirmText:'关闭',
					success(result) {
						if(result.confirm) {
							pusher.stop();
							pusher.close();
							that.$api.goNavigateTo(url)
						}
					}
				})
			}
				
		}
	}
</script>

<style lang="less">
	.liveArea{
		width: 100%;
		height: calc(100vh - 44px);
		background: rgba(0,0,0,.5);
		// background: rgba(255,255,255);
		position: relative;
	}
	.backUrl{
		width: 100%;
		height: calc(100% - 220rpx);
	}
	.cover{
		width: 100%;
		height: 100%;
	}
	
	.floatArea{
		position: fixed;
		width: 100%;
		height: 170rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
		bottom: 24rpx;
	}
	.btnWrap{
		width: 140rpx;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.startBtn{
		width: 140rpx;
		height: 140rpx;
		background: #000;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 50%;
		.redDot{
			width: 50rpx;
			height: 50rpx;
			border-radius: 50%;
			background: red;
		}
	}
	.imgWrap{
		width: 140rpx;
		height: 140rpx;
		display: flex;
		align-items: center;
		margin-bottom: 10rpx;
		image{
			width: 100%;
			height: 100%;
		}
	}
</style>
