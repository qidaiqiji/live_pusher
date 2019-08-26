<template>
	<view class="content">		
	<!-- 	<view class="liveArea">
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
				<view class="goodsIcon" @tap="addGoods">
					<view class="liveGoods">直播商品</view>
				</view>
				<view class="btnArea">
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
		</view> -->
		<view class="liveArea">
			<image :src="imgUrl" class="cover"></image>
		</view>
		<view class="fixedBottom">
			<view class="goodsIcon" @tap="addGoods">
				<view class="liveGoods">
					<image src="../../static/images/icon_shop.png"></image>
					直播商品
					<view class="count">{{goodsList.length}}</view>
				</view>
			</view>
			<view class="btnArea">
				<view class="startBtn" @tap="plusReady" v-if="!isPlay">
					<view class="redDot"></view>
				</view>
				<view class="stopBtn" v-if="isPlay" @tap="stopLive">
					<view class="btnWrap">
						<view class="imgWrap">
							<image src="../../static/images/home/icon_stop.png"></image>
						</view>
						<!-- <view>关闭</view> -->
					</view>
				</view>
			</view>
			<view class="switchCamera" @tap="switchCamera">
				<image src="../../static/images/camera.png"></image>
				<!-- <view class="btnWrap">
					<view class="imgWrap">
						<image src="../../static/images/home/icon_stop.png"></image>
					</view>
					<view>关闭</view>
				</view> -->
			</view>
		</view>
	</view>
</template>
<script>
	var pusher
	export default {
		onUniNViewMessage:function(e){
			console.log("eeee",e)
		  console.log("App.vue收到数据")
		},
		data() {
			return {
				id:'',
				url:'111',
				isPlay:false,
				countDown:3,
				isPause:false,
				pusher:null,
				imgUrl:'',
				goodsList:[]
			}
		},
		
		created() {
		    const goodsListNVue = uni.getSubNVueById('goodsList');
			// const beforeStart = uni.getSubNVueById('beforeStart');
			const viewerCount = uni.getSubNVueById('viewerCount');
			const timer = uni.getSubNVueById('timer');
			this.goodsListNVue = goodsListNVue;
			this.viewerCount = viewerCount;
			this.timer = timer;
			// this.beforeStart = beforeStart;
		},
		onLoad(params) {
			this.id = params.id;
			this.imgUrl = params.img;
			this.getPushDetail(this.id);
			this.getLiveList(this.id);
			this.getViewer(this.id)
		},
		onHide(){
			plus.webview.postMessageToUniNView({startCount:false},this.timer.id);
			pusher.stop();
			pusher.close();
			let id = this.id;
			that.$api.request({
				url: that.$api.forbideLive,
				data:{id},
			})
		},
		// onShow(){
		// 	
		// },
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
							if(result.confirm || result.cancel) {
								that.$api.goNavigateTo("/pages/index/index")
							}
						},
					})
				}else{
					this.url = res.data.url;
				}
			},
			async getLiveList(id) {
				const res= await this.$api.request({
					url: this.$api.getLiveList,
					data:{id},
				})
				// this.getLiveList
				this.goodsList = res.data.goodsList;
				plus.webview.postMessageToUniNView(res.data,this.goodsListNVue.id)
			},
			async getViewer(id) {
				const res= await this.$api.request({
					url: this.$api.getViewerCounter,
					data:{id},
				})
				plus.webview.postMessageToUniNView(res.data,this.viewerCount.id)
			},
			addGoods(){
				this.goodsListNVue.show('slide-in-bottom', 300, function(){  
					
				});	
				// this.viewerCount.show()
				// console.log("uuu",uni.getSubNVueById())
			},
			plusReady() {
				let that = this;
				const currentWebview = this.$mp.page.$getAppWebview();  
				pusher = plus.video.createLivePusher("liveArea", {    
					url:this.url,    
					top:'0px',    
					left:'0px',  
					bottom:'190rpx',
					width: '100%',    
					height: '75%',  
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
							that.viewerCount.show()
							// that.timer.show()
							plus.webview.postMessageToUniNView({startCount:true},that.timer.id)
							// getApp().globalData.start = true
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
				let id = that.id;
				uni.showModal({
					title:'提示',
					content:'确定要关闭直播吗',
					confirmText:'关闭',
					success(result) {
						if(result.confirm) {
							pusher.stop();
							pusher.close();
							that.$api.request({
								url: that.$api.forbideLive,
								data:{id},
							})
							that.$api.goNavigateTo("/pages/index/index")
						}
					}
				})
			},
			switchCamera(){
				pusher.switchCamera();
			},
		}
	}
</script>

<style lang="less">
	.content{
		position: relative;
		// height: calc(100vh - 88rpx);
		height: 100vh;
		background: rgba(0,0,0,0.7);
	}
	.liveArea{
		width: 100%;
		height: 100vh;
		background: #000;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.fixedBottom{
		width: 100%;
		height: 190rpx;
		position: absolute;
		left: 0;
		bottom: 0;
		background: #000;
		padding: 20rpx 0;
	}
	
	.btnArea{
		width:100%;
		display: flex;
		justify-content:center;
		
		.startBtn{
			width: 170rpx;
			height: 170rpx;
			background: #fff;
			border-radius: 50%;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.redDot{
			width: 150rpx;
			height: 150rpx;
			border-radius: 50%;
			background: red;
		}
	}
	.goodsIcon{
		width: 30%;
		height: 190rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		padding-left: 20rpx;
		position: absolute;
		left: 0;
		top: 0;
	}
	.liveGoods{
		width:168rpx;
		height:58rpx;
		background:linear-gradient(0deg,rgba(254,108,197,1),rgba(255,102,153,1));
		border-radius:29rpx;
		font-size:24rpx ;
		color: #fff;
		line-height: 58rpx;
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
		padding:0 10rpx;
		position:relative;
		image{
			width: 30rpx;
			height: 30rpx;
			margin-right: 10rpx;
		}
		.count{
			position: absolute;
			width:36rpx;
			height:24rpx;
			background:rgba(255,255,255,1);
			border-radius:12rpx;
			top: -12rpx;
			color: #FF6699;
			left: 46rpx;
			text-align: center;
			line-height: 24rpx;
			font-size: 20rpx;
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
	.switchCamera{
		position: absolute;
		right: 0;
		top: 0;
		width: 20%;
		height: 170rpx;
		display:flex;
		align-items:center;
		image{
			width: 38rpx;
			height: 38rpx;
		}
	}
	
</style>
