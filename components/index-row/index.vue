<template>
	<view>
		<view class='index_row'>
		  <view class='row_left' @tap="jumpToDetail(liveItem.id)">
			<image :src="liveItem.cover"></image>
			<view class='item_tag isLive' v-if="type === 'begin'&&liveItem.isAnchor">
			  <image src='../../static/images/home/icon_guanzhu.png'></image>
			  <view>去开播</view>
			</view>
			<view class='item_tag_not' v-if="type === 'begin'&&!liveItem.isAnchor">
			  <view class='item_tag subscribed' v-if="liveItem.hasReminder">
				<image src='../../static/images/home/icon_yidingyue.png'></image>
				<view>已想看</view>
			  </view>
			  <view class='item_tag subscription' v-if="!liveItem.hasReminder">
				<image src='../../static/images/home/icon_xiangkan.png'></image>
				<view>想看</view>
			  </view>
			</view>
			<!-- <view class='item_tag playBack' v-if="type === playBack">
				<view>回放</view>
				<view>11111111人</view>
			</view> -->
		  </view>
		  <view class='row_right'>
			<view class='right_title'>
			  <text>{{liveItem.title}}</text> 
			 </view>
			<view class='right_goods'>
			  <block v-for='(goods,index) in liveItem.goodsList' :key='index'>
				<view v-if="index<3">
				  <image :src='goods.thumb'></image>
				</view>
			  </block>
			</view>
			<view class='right_date' v-if="type !== 'playBack'"> {{liveItem.startAt}}开播</view>
			<view class='right_date_end' v-if="type == 'playBack'"> 已播</view>
		  </view>
		</view>
	</view>	
</template>

<script>
	export default {
	  props: ['liveItem','type'],
	  data() {
	    return {
	
		};
	  },
	  methods: {
			jumpToDetail(id) {
					let url = `/pages/pusher/index?id=${id}`
					this.$api.goNavigateTo(url)
			},
	  }
	};
</script>

<style lang="less">
	.index_row {
	  width: 702rpx;
	  height: 288rpx;
	  display: flex;
	  align-items: center;
	  overflow: hidden;
	  margin: 0 auto;
	  border-bottom: 1rpx solid #E5E5E5;
	}

	.row_left {
	  width: 320rpx;
	  height: 224rpx;
	  border-radius: 10rpx;
	  margin-right: 34rpx;
	  position: relative;
	  /* background: #aae; */
	}

	.row_left>image {
	  width: 320rpx;
	  height: 224rpx;
	}

	.right_title {
	  width: 340rpx;
	  height: 78rpx;
	  font-size: 32rpx;
	  font-family: PingFangSC-Regular;
	  font-weight: 400;
	  color: rgba(47, 58, 64, 1);
	  line-height: 1.3;
	  overflow: hidden;
	  text-overflow: ellipsis;
	  display: -webkit-box;
	  -webkit-line-clamp: 2;
	  -webkit-box-orient: vertical;
	}

	.right_goods {
	  width: 340rpx;
	  height: 88rpx;
	  display: flex;
	  align-items: center;
	  margin: 16rpx 0rpx;
	}

	.right_goods>view{
	width:88rpx;
	height:88rpx;
	border:1rpx solid rgba(229,229,229,1);
	border-radius:10rpx;
	margin-right: 12rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	}

	.right_goods>view>image{
	width:88rpx;
	height:88rpx;
	}

	.right_date{
	  width:340rpx;
	height:24rpx;
	font-size:24rpx;
	font-family:PingFangSC-Regular;
	font-weight:400;
	color:rgba(255,102,153,1);
	line-height:1;
	}
	.right_date_end{
		width:340rpx;
	height:24rpx;
	font-size:24rpx;
	font-family:PingFangSC-Regular;
	font-weight:400;
	color:#A8B6B8;
	line-height:1;
	}
	.item_tag{
	  height:32rpx;
	border-radius:16rpx;
	padding: 0 16rpx 0 12rpx;
	display: flex;
	align-items: center;
	position: absolute;
	bottom: 4rpx;
	left: 6rpx;
	}
	.item_tag>image{
	  width: 26rpx;
	  height: 26rpx;
	}
	.item_tag>view{
	height:20rpx;
	font-size:20rpx;
	font-family:PingFangSC-Regular;
	font-weight:400;
	color:rgba(255,254,254,1);
	line-height:20rpx;
	margin-left: 6rpx;
	}
	.isLive{
	  /* width:117px; */
	background:rgba(86,202,255,1);
	}
	.subscription{
	  background:rgba(250,156,94,1);
	}
	.subscribed{
	  background:rgba(255,255,255,0.8);

	}
	.subscribed>view{
	  color: #FA9C5E;
	}
	.playBack{
	  background:rgba(254,195,212,0.9);
	  padding: 0;
	}
	.playBack>view:nth-child(1){
	width:70rpx;
	height:32rpx;
	background:rgba(255,102,153,1);
	border-radius:16rpx;
	margin-left: 0rpx;
	text-align: center;
	line-height: 32rpx;
	font-size:20rpx;
	font-family:PingFang-SC-Medium;
	font-weight:500;
	color:rgba(252,252,252,1);
	}
	.playBack>view:nth-child(2){
	height:20rpx;
	font-size:20rpx;
	font-family:PingFang-SC-Medium;
	font-weight:500;
	color:rgba(255,255,255,1);
	line-height:1.2;
	margin-left: 8rpx;
	padding-right: 16rpx;
	}
</style>

