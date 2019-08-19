<template>
	<view class="drag" ref="dragDiv">
		<view class="drag_bg" :style="{width: width+'px'}"></view>
		<view class="drag_text" :class="[showText ? 'show' : '']">{{ confirmWords }}</view>
		<view ref="moveDiv" @touchstart="mousedownFn($event)" @touchmove="mouseMoveFn" @touchend="moseUpFn" :class="{ handler_ok_bg: confirmSuccess }" class="handler handler_bg"
		 style="position: absolute;top: 0px;left: 0px;" :style="{left: width+'px'}"></view>
	</view>
</template>

<script>
	export default {
		props: {
			userMobile: 0
		},
		watch: {
			userMobile(newVal, oldVal) {
				if (newVal) {
					var vl = {
						tel: /^1[345789]\d{9}$/,
						number: /^\d+$/,
						iemi: /^\d{15}$/
					};
					if (!vl.tel.test(newVal) || !vl.number.test(newVal)) {
						this.validMobile = false;
						return false;
					}
					this.validMobile = true;
					return true;
				}
			}
		},
		data() {
			return {
				beginClientX: 0 /*距离屏幕左端距离*/ ,
				mouseMoveStata: false /*触发拖动状态  判断*/ ,
				maxwidth: '' /*拖动最大宽度，依据滑块宽度算出来的*/ ,
				confirmWords: '右滑验证' /*滑块文字*/ ,
				confirmSuccess: false /*,验证成功判断*/ ,
				showText: false,

				validMobile: false,
				width: 0
			};
		},
		methods: {
			mousedownFn: function(e) {
				// this.validMobile = true;
				if (!this.confirmSuccess && this.validMobile) {
					e.preventDefault && e.preventDefault(); //阻止文字选中等 浏览器默认事件
					this.mouseMoveStata = true;
					let _touch= e.touches[0] || e.changedTouches[0];
					this.beginClientX = _touch.clientX;
				} else {
					this.$api.showMessage('请正确填写手机号');
				}
			}, //mousedoen 事件
			successFunction() {
				this.confirmSuccess = true;
				this.confirmWords = '验证成功';
				this.width = this.maxwidth;
				// if (window.addEventListener) {
				// 	document.getElementsByTagName('html')[0].removeEventListener('touchmove', this.mouseMoveFn);
				// 	document.getElementsByTagName('html')[0].removeEventListener('touchend', this.moseUpFn);
				// } else {
				// 	document.getElementsByTagName('html')[0].removeEventListener('touchend', () => {});
				// }
				// document.getElementsByClassName('drag_text')[0].style.color = '#fff';
				// document.getElementsByClassName('handler')[0].style.left = this.maxwidth + 'px';
				// document.getElementsByClassName('drag_bg')[0].style.width = this.maxwidth + 'px';
				this.$emit('successFunction', this.confirmSuccess);
			}, //验证成功函数
			mouseMoveFn(e) {
				if (this.mouseMoveStata) {
					let _touch= e.touches[0] || e.changedTouches[0];
					let width = _touch.clientX - this.beginClientX;
					this.width = width;
					if (width > 0 && width <= this.maxwidth) {
						// document.getElementsByClassName('handler')[0].style.left = width + 'px';
						// document.getElementsByClassName('drag_bg')[0].style.width = width + 'px';
						// let handler = document.getElementsByClassName('handler')[0];
						// let drag_bg = document.getElementsByClassName('drag_bg')[0];
						// if (handler) {
						// 	handler.style.left = width + 'px';
						// }
						// if (drag_bg) {
						// 	drag_bg.style.width = width + 'px';
						// }
						if (width > this.maxwidth / 2) {
							this.showText = true;
						}
					} else if (width > this.maxwidth) {
						this.successFunction();
					}
				}
			}, //mousemove事件
			moseUpFn(e) {
				if(this.mouseMoveStata){
					this.mouseMoveStata = false;
					let _touch= e.touches[0] || e.changedTouches[0];
					var width = _touch.clientX - this.beginClientX;
					if (width < this.maxwidth) {
						// document.getElementsByClassName('handler')[0].style.left = 0 + 'px';
						// document.getElementsByClassName('drag_bg')[0].style.width = 0 + 'px';
						// let handler = document.getElementsByClassName('handler')[0];
						// let drag_bg = document.getElementsByClassName('drag_bg')[0];
						// if (handler) {
						// 	handler.style.left = 0 + 'px';
						// }
						// if (drag_bg) {
						// 	drag_bg.style.width = 0 + 'px';
						// }
						this.width = 0;
						this.showText = false;
					}
				}
			} //mouseup事件
		},
		mounted() {
			this.maxwidth = uni.upx2px(662)-uni.upx2px(98);
			// this.maxwidth = this.$refs.dragDiv.$el.clientWidth - this.$refs.moveDiv.$el.clientWidth;
			// document.getElementsByTagName('html')[0].addEventListener('touchmove', this.mouseMoveFn);
			// document.getElementsByTagName('html')[0].addEventListener('touchend', this.moseUpFn);
		}
	};
</script>

<style lang="less" scoped>
	.drag {
		position: relative;
		background-color: #f3f3f3;
		width: 662upx;
		height: 88upx;
		line-height: 88upx;
		margin: auto;
		text-align: center;
		border-radius: 4upx;
	}

	.handler {
		width: 98upx;
		height: 88upx;
		cursor: move;
	}

	.handler_bg {
		background: #fff url(../static/images/login/icon_righ@2x.png);
		background-size: 100% auto;
	}

	.handler_ok_bg {
		background: #ff3366;
	}

	.drag_bg {
		background-color: #ff3366;
		height: 88upx;
		width: 0upx;
	}

	.drag_text {
		position: absolute;
		top: 0upx;
		width: 100%;
		text-align: center;
		-moz-user-select: none;
		-webkit-user-select: none;
		user-select: none;
		-o-user-select: none;
		-ms-user-select: none;
		color: #889696;
		font-size: 28upx;

		&.show {
			color: #fff;
		}
	}
</style>

