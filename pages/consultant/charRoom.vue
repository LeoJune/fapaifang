<template>
	<view class="container">
		<view class="chatBox">
			<scroll-view :scroll-top="scrollTop" style="height: 100%;" scroll-y="true" :scroll-into-view="viewId" class="scrollBox"
			 @scrolltoupper="upper" @scrolltolower="lower" @scroll="scroll">
				<view class="msgList">
					<view class="chattopLoadingBox" v-if="loadStatus=='loading'">
						<image src="../../static/images/loading.gif" class="loadingIcon" mode=""></image>
					</view>
					<view class="message" v-for="(item,index) in chatList" :key="index" :id="'mid'+item.itemId">
						<view class="time">
							<text class="time-text">{{ item.chatTime }}</text>
						</view>
						<view class="main" :class="item.style">
							<view class="user">
								<!-- yourname：就是消息的 from -->
								<!-- <text class="user-text">{{ item.yourname + ' ' + item.time}}</text> -->
							</view>
							<image class="avatar" v-if="item.style=='self'" :src="myPic" />
							<image class="avatar" v-else :src="chatUserPic" />
							<view :class="{'msg':true,'imgMsg':item.msgType==2||item.msgType==3}">
								<view v-if="item.msgType==2 || item.msgType==3">
									<image v-if="item.msgType==2" :src="item.chatMsg" style="width:250rpx;display: block;" mode="widthFix" @tap="previewImage"
									 :data-url="item.chatMsg" />
									<view class="videoBox" v-if="item.msgType==3" @tap="playVideo(item.chatMsg)">
										<image class="videoCover" v-if="item.coverPath" mode="widthFix" :src="item.coverPath" />
										<image src="../../static/images/videoPlay.png" class="videoPlayBtn" mode="" v-if="item.loading!=2&&item.loading!=3"></image>
									</view>

								</view>
								<view v-else-if="item.msgType==1">
									<view class="template">
										<text class="msg-text" style="float:left;">{{ item.chatMsg}}</text>
									</view>
								</view>
								<view class="loadingBox" v-if="(item.msgType==2||item.msgType==3)&&item.loading==1">
									<image class="loadingIcon" src="../../static/images/loading.gif" mode=""></image>
									<text class="loadingText">上传中...</text>
								</view>
								<view class="loadingBox loadingError" v-if="(item.msgType==2||item.msgType==3)&&item.loading==2">
									<uni-icons type="info-filled" color="#f44a33" class="errorIcon"></uni-icons>
									<text class="loadingText">上传失败</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="chatInput">
			<view class="inputTopBox">
				<input class="chatInputCon" type="text" placeholder="发送消息" placeholder-style="color:#B8B8B8;" @confirm="sendMsg"
				 v-model="chatText" />
				<view class="sendMsg" @click="sendMsg" v-if="chatText.length>0">发送</view>
			</view>
			<view class="inputBottomBox">
				<view class="mediaSel">
					<image class="mediaIcon" src="../../static/images/picSel.png" mode="" @click="selMedia('image',1)"></image>
				</view>
				<view class="mediaSel2">
					<image class="mediaIcon" src="../../static/images/vedioSel.png" mode="" @click="selMedia('video',1)"></image>
				</view>
				<view class="mediaSel">
					<image class="mediaIcon" src="../../static/images/cameraSel.png" mode="" @click="selMedia('image',2)"></image>
				</view>
			</view>
			<uni-popup ref="showVideo" class="videoPop" type="center" :mask-click="true">
				<view class="showVideoBox">
					<video class="video" id="myVideo" ref='myVideo' :src="videoSrc" controls></video>
					<view class="uni-image-close" @click="cancel">
						<uni-icons type="clear" color="#fff" size="30" />
					</view>
				</view>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	var socket;

	export default {
		data() {
			return {
				chatRel: '',
				myUserId: "",
				timer: null,
				timeout:60000,
				myPic: "",
				chatUserId: "",
				chatUserPic: "",
				chatUserName: "",
				chatText: "",
				viewId: "",
				isOpened: 0,
				scrollTop: 0,
				pageNum: 1,
				itemId: 1,
				videoSrc: "",
				loadStatus: 'more',
				old: {
					scrollTop: 0
				},
				chatList: [],
				videoContext: null

			}
		},
		onLoad(options) {
			const that = this;
			let myUserId = options.myUserId;
			let chatUserId = options.chatUserId;
			that.myUserId = myUserId;
			that.chatUserId = chatUserId;
			that.chatRel = parseInt(myUserId) > parseInt(chatUserId) ? (chatUserId + '_' + myUserId) : (myUserId + '_' +
				chatUserId);
			that.openSocket(myUserId);
			that.getHistory(1);

		},
		onReady() {
			this.videoContext = uni.createVideoContext('myVideo')
			setTimeout(() => {
				this.goBottom();
			}, 100)
		},
		onShow() {
			if (this.isOpened == 0) {
				this.openSocket(this.myUserId);
			}
		},
		methods: {
			getHistory(pageNum) {
				const that = this;
				let param = {
					chatRel: that.chatRel,
					startPage: pageNum
				}
				that.loadStatus = "loading";
				that.$api.chatHistory(param).then(res => {
					if (res.success) {
						let oppoUserId = res.datas.oppoUserId;
						if (oppoUserId == that.myUserId) {
							that.myPic = res.datas.oppoUserHeadImg ? res.datas.oppoUserHeadImg :
								'../../static/images/defaultUserPic.png';
							that.chatUserPic = res.datas.userHeadImg ? res.datas.userHeadImg : '../../static/images/defaultUserPic.png';
							that.chatUserName = res.datas.userNickName;
						} else {
							that.myPic = res.datas.userHeadImg ? res.datas.userHeadImg : '../../static/images/defaultUserPic.png';
							that.chatUserPic = res.datas.oppoUserHeadImg ? res.datas.oppoUserHeadImg :
								'../../static/images/defaultUserPic.png';
							that.chatUserName = res.datas.oppoUserNickName;
						}
						uni.setNavigationBarTitle({
							title: that.chatUserName
						});
						let result = res.datas.rows;
						for (var i in result) {
							if (result[i].fromUserId == that.myUserId) {
								result[i].style = "self";
							} else {
								result[i].style = "";
							}
							if (result[i].msgType == 3) {
								result[i].coverPath = result[i].chatMsg + that.$utils.common.ossVideoCoverSuffix;
							}
							result[i].itemId = that.itemId;
							that.itemId++;
						}
						let chatList1 = that.chatList;
						let finalList = result.concat(chatList1);
						that.chatList = finalList;
						if (pageNum == 1) {
							setTimeout(() => {
								that.goBottom();
							}, 300)

						} else {
							setTimeout(() => {
								that.viewId = "mid" + (pageNum * 10);
							}, 100)
						}
						let total = res.datas.total;
						let totalPageNum = Math.ceil(total / 10);
						if (parseInt(totalPageNum) > parseInt(that.pageNum)) {
							that.pageNum++;
							that.loadStatus = "more";
						} else {
							that.loadStatus = "noMore";
						}
					} else {
						uni.showToast({
							title: res.message,
							icon: "none"
						})
					}
				})
			},
			heartCheckStart(){
				this.timer = setInterval(() => {
					if (this.isOpened == 1) {
						console.log("连接状态，发送消息保持连接");
						uni.sendSocketMessage({
							data: "ping",
							success: (res) => {
								console.log(res);
							},
							fail: (error) => {
								console.log(error);
							},
						});
						// 如果获取到消息，说明连接正常，重置心跳检测
						this.heartCheckReset();
						this.heartCheckStart();
					} else {
					      console.log("断开连接，尝试重连");
					      this.openSocket(this.myUserId);
					  }
				}, this.timeout)
			},
			heartCheckReset(){
				 clearTimeout(this.timer);
			},
			openSocket(id) {
				const that = this;
				var socketUrl = "wss://mobile.fpw365.cn/ws/imchannel/" + id;
				uni.connectSocket({
					url: socketUrl,
					complete: (e) => {
						console.log("openSocket complete" + JSON.stringify(e))
					},
					fail(error) {
						console.log("openSocket error" +  JSON.stringify(error));
					}
				})
				//打开事件
				uni.onSocketOpen(function(res) {
					console.log('WebSocket 已打开');
					that.isOpened = 1;
					that.heartCheckReset();
					that.heartCheckStart();
				});
				//获得消息事件
				uni.onSocketMessage(function(res) {
					console.log(msg.data);
					that.heartCheckReset();
					that.heartCheckStart();
					//发现消息进入    开始处理前端触发逻辑
					var obj;
					try {
						obj = JSON.parse(msg.data);
					} catch (e) {
						console.log(e);
					}
					console.log(obj);
					if (obj != undefined) {
						if (obj.fromUserId && obj.fromUserId == -1) {

						} else {
							that.listenMsg(obj);

						}
					} else {

					}
				});
				//关闭事件
				uni.onSocketClose(function(res) {
					console.log('WebSocket 已关闭！');
					that.isOpened = 0;
				});
				//发生了错误事件
				uni.onSocketError(function(res) {
					console.log('WebSocket连接打开失败，请检查！');
					that.isOpened = 0;
				});
			},
			listenMsg(data) {
				const that = this;
				let addData = {
					chatMsg: data.chatContent,
					chatTime: data.sendTime,
					fromUserId: data.fromUserId,
					msgType: data.contentType,
					toUserId: data.toUserId
				}
				if (data.contentType == 3) {
					addData.coverPath = data.chatContent + that.$utils.common.ossVideoCoverSuffix;
				}
				that.chatList.push(addData);
				setTimeout(() => {
					that.goBottom();
				}, 100)
			},
			selMedia(type, source) {
				const that = this;
				var mediaType;

				if (type == "image") {
					var sourceType;
					if (source == 1) {
						sourceType = ['album'];
					} else {
						sourceType = ['camera'];
					}
					uni.chooseImage({
						count: 1, //默认9
						sizeType: ['original'], //可以指定是原图还是压缩图，默认二者都有
						sourceType: sourceType, //从相册选择
						success: function(res) {
							let size = res.tempFiles[0].size;
							if (size > 1024 * 1024 * 200) {
								uni.showToast({
									title: "文件过大",
									icon: "none"
								})
							} else {
								that.uploadImg(res);
							}
						}
					});
				} else if (type == "video") {
					uni.chooseVideo({
						count: 1,
						sourceType: ['camera', 'album'],
						success: function(res) {
							console.log(res);
							if (res.size > 1024 * 1024 * 200) {
								uni.showToast({
									title: "文件过大",
									icon: "none"
								})
							} else {
								that.uploadVideo(res);
							}
						}
					});

				}
			},
			uploadImg(fileRes) {
				const that = this;
				let addData = {
					chatMsg: fileRes.tempFilePaths[0],
					chatTime: that.$utils.formatTime(new Date()),
					fromUserId: that.myUserId,
					msgType: '2',
					style: 'self',
					toUserId: that.chatUserId,
					loading: 1
				}
				that.chatList.push(addData);
				setTimeout(() => {
					that.goBottom();
				}, 100)
				var theIndex = (that.chatList.length - 1);
				let files;
				// #ifdef MP-WEIXIN
				files = fileRes.tempFilePaths[0];
				// #endif
				// #ifndef MP-WEIXIN
				files = fileRes.tempFiles[0];
				// #endif
				uni.uploadFile({
					url: that.$api.filesUpload, // 后端api接口
					//chooseImage函数调用后获取的本地文件路劲
					name: 'file', //后端通过'file'获取上传的文件对象
					// #ifdef MP-WEIXIN
					filePath: files,
					// #endif
					// #ifndef MP-WEIXIN
					file: files,
					// #endif	
					formData: {
						"groupName": "chat"
					},
					success: (res) => {
						if (res.statusCode == 200) {
							let result = JSON.parse(res.data);
							console.log(result);
							if (result.success) {
								that.addImgChat(result.datas);
								that.chatList[theIndex].loading = 0;
							} else {
								uni.showToast({
									title: "上传失败"
								})
								that.chatList[theIndex].loading = 2;
							}

						}
					},
					fail: (error) => {
						console.log(error);
						uni.showToast({
							title: "上传失败",
							icon: 'none'
						})
					}
				});

			},
			addImgChat(data) {
				const that = this;
				console.log(data)
				if (that.isOpened == 0) {
					console.log("open socket");
					that.openSocket(that.myUserId);
				}
				let sendData = {
					"contentType": 2,
					"toUserId": that.chatUserId,
					"chatContent": data.picUrl
				}
				uni.sendSocketMessage({
					data: JSON.stringify(sendData),
					success: (res) => {
						console.log(res);
					},
					fail: (error) => {
						console.log(error);
					},
				});

			},
			uploadVideo(fileRes) {
				const that = this;
				let addData = {
					chatMsg: fileRes.tempFilePath,
					chatTime: that.$utils.formatTime(new Date()),
					fromUserId: that.myUserId,
					msgType: '3',
					style: 'self',
					toUserId: that.chatUserId,
					loading: 1
				}
				that.chatList.push(addData);
				setTimeout(() => {
					that.goBottom();
				}, 100)
				var theIndex = (that.chatList.length - 1);
				console.log(theIndex);
				let files;
				// #ifdef MP-WEIXIN
				files = fileRes.tempFilePath;
				// #endif
				// #ifndef MP-WEIXIN
				files = fileRes.tempFile;
				// #endif
				uni.uploadFile({
					url: that.$api.filesUpload, // 后端api接口
					//chooseImage函数调用后获取的本地文件路劲
					name: 'file', //后端通过'file'获取上传的文件对象
					// #ifdef MP-WEIXIN
					filePath: files,
					// #endif
					// #ifndef MP-WEIXIN
					file: files,
					// #endif	
					formData: {
						"groupName": "chat"
					},
					success: (res) => {
						if (res.statusCode == 200) {
							let result = JSON.parse(res.data);
							console.log(result);
							if (result.success) {
								that.addVideoChat(result.datas);
								that.chatList[theIndex].loading = 0;
								that.chatList[theIndex].coverPath = result.datas.picUrl + that.$utils.common.ossVideoCoverSuffix;
							} else {
								uni.showToast({
									title: "上传失败"
								})
								that.chatList[theIndex].loading = 2;
							}

						}
					},
					fail: (error) => {
						console.log(error);
						uni.showToast({
							title: "上传失败",
							icon: 'none'
						})
					}
				});

			},
			playVideo(url) {
				const that = this;
				that.videoSrc = url;
				that.videoContext = uni.createVideoContext('myVideo')
				that.$nextTick(() => {
					that.$refs.showVideo.open();
					setTimeout(() => {
						that.videoContext.requestFullScreen();
						that.videoContext.play();
					}, 300)

				})



			},
			cancel() {
				const that = this;
				that.$nextTick(() => {
					that.$refs.showVideo.close()
				})
				that.videoContext.pause();
			},
			addVideoChat(data) {
				const that = this;
				console.log(data)
				if (that.isOpened == 0) {
					console.log("open socket");
					that.openSocket(that.myUserId);
				}
				let sendData = {
					"contentType": 3,
					"toUserId": that.chatUserId,
					"chatContent": data.picUrl
				}
				uni.sendSocketMessage({
					data: JSON.stringify(sendData),
					success: (res) => {
						console.log(res);
					},
					fail: (error) => {
						console.log(error);
					},
				})
			},
			sendMsg() {
				const that = this;

				if (that.isOpened == 0) {
					console.log("open socket");
					that.openSocket(that.myUserId);
				}
				let sendData = {
					"contentType": 1,
					"toUserId": that.chatUserId,
					"chatContent": that.chatText
				}
				uni.sendSocketMessage({
					data: JSON.stringify(sendData)
				});

				let addData = {
					chatMsg: that.chatText,
					chatTime: that.$utils.formatTime(new Date()),
					fromUserId: that.myUserId,
					msgType: '1',
					style: 'self',
					toUserId: that.chatUserId
				}
				that.chatList.push(addData);
				that.chatText = "";
				setTimeout(() => {
					that.goBottom();
				}, 100)
			},
			previewImage(event) {
				var url = event.target.dataset.url;
				uni.previewImage({
					urls: [url] // 需要预览的图片 http 链接列表
				});
			},
			upper: function(e) {
				const that = this;
				if (that.loadStatus == "noMore") {
					return;
				} else if (that.pageNum != 1) {
					that.getHistory(that.pageNum);
				}
			},
			lower: function(e) {
				console.log("到底")
			},
			scroll: function(e) {
				this.old.scrollTop = e.detail.scrollTop
			},
			goTop: function(e) {
				this.scrollTop = this.old.scrollTop
				this.$nextTick(function() {
					this.scrollTop = 0
				});
				uni.showToast({
					icon: "none",
					title: "纵向滚动 scrollTop 值已被修改为 0"
				})
			},
			goBottom: function() {
				const that = this;
				that.scrollTop = that.old.scrollTop
				that.$utils.getBoxheight(`.msgList`, (rects) => {
					that.$nextTick(function() {
						that.scrollTop = rects[0].height
					});
				});
			}
		}
	}
</script>

<style>
	page {
		background-color: #f4f4f4;
		width: 100%;
		height: 100%;
	}

	.scrollBox {
		overflow-anchor: none;
	}

	.msgList {
		overflow-anchor: none;
	}

	.container {
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;
	}

	.chatBox {
		width: 100%;
		flex: 1;
		overflow: hidden;
	}

	.chatInput {
		width: 100%;
		height: 154rpx;
		background-color: #FFFFFF;
		box-sizing: border-box;
		padding: 16rpx 30rpx 0 30rpx;
	}

	.message {
		width: 92%;
		height: auto;
		padding: 30rpx;


	}

	.message .main {
		position: relative;
	}

	.time {
		margin: 14rpx 0;
		text-align: center;
	}

	.time .time-text {
		display: inline-block;
		font-size: 24rpx;
		color: #B8B8B8;
	}

	.user .user-text {
		margin: auto 100rpx 8rpx;
		font-size: 20rpx;
		color: #dcdcdc;
		display: block;
	}

	.avatar {
		width: 82rpx;
		height: 82rpx;
		border-radius: 42rpx;
		border: 1rpx solid #FFFFFF;
		position: absolute;
		left: 0;
		top: -10rpx;
		z-index: 3;
	}

	.msg {
		display: inline-block;
		padding: 20rpx 20rpx 20rpx 80rpx;
		margin-left: 20rpx;
		max-width: calc(85% - 80rpx);
		min-height: 40rpx;
		font-size: 24rpx;
		/*overflow: hidden;*/
		text-align: left;
		word-break: break-all;
		background-color: #fff;
		border-radius: 26rpx;
		position: relative;
		margin-top: 14rpx;
	}

	.msg .msg_poprightarrow {
		position: absolute;
		right: -10rpx;
		height: 18rpx;
		width: 18rpx;
		margin-top: -10rpx;
	}

	.msg .msg_popleftarrow {
		position: absolute;
		left: -14rpx;
		height: 18rpx;
		width: 18rpx;
		margin-top: -10rpx;
	}

	.msg .msg-text {
		line-height: 40rpx;
		font-size: 32rpx;
		margin: 0;
	}

	/*.msg:before {
		content: " ";
		position: absolute;
		top: 9px;
		right: 100%;
		border: 6px solid transparent;
		border-right-color: #EDEDED;
	}*/

	.self {
		text-align: right;
	}

	.self .avatar {
		left: auto;
		right: 0;
	}

	.user {
		position: relative;
		bottom: -30rpx;
	}

	.self .msg {
		background-color: #DBF0FF;
		color: #222222;
		padding: 20rpx 80rpx 20rpx 20rpx;
		margin-right: 20rpx;
		margin-left: 0;
	}

	.imgMsg {
		margin-left: 100rpx !important;
		padding: 0 !important;
		border-radius: 10rpx;
		overflow: hidden;
		border: 1rpx solid #E5E5E5;
		position: relative;
	}

	.loadingBox {
		position: absolute;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		background-color: rgba(0, 0, 0, .5);
		z-index: 3;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}

	.loadingIcon {
		width: 40rpx;
		height: 40rpx;
	}

	.loadingText {
		color: #FFFBE8;
		font-size: 24rpx;
		margin-top: 10rpx;
	}

	.errorIcon {
		width: 40rpx;
		height: 40rpx;
	}

	.self .msg:before {
		right: inherit;
		left: 100%;
		border-right-color: transparent;
		border-left-color: #b2e281;
	}

	.self .imgMsg {
		margin-right: 100rpx !important;
	}

	.template {
		display: inline;
	}

	.videoPlay {
		width: 200rpx;
		height: 200rpx;
	}

	.err {
		width: 32rpx;
		height: 32rpx;
		position: absolute;
		left: -40rpx;
	}

	.inputTopBox {
		display: flex;
		height: 70rpx;
		align-items: center;
	}

	.chatInputCon {
		flex: 1;
		height: 100%;
		line-height: 70rpx;
		padding-left: 20rpx;
		background-color: #F7F7F7;
		font-size: 30rpx;
		border-radius: 10rpx;
	}

	.sendMsg {
		width: 100rpx;
		height: 70rpx;
		margin-left: 20rpx;
		text-align: center;
		background-color: #F44A33;
		color: #FFFFFF;
		font-size: 30rpx;
		line-height: 70rpx;
		border-radius: 10rpx;
	}

	.inputBottomBox {
		width: 100%;
		height: 40rpx;
		margin-top: 14rpx;
		display: flex;
		align-items: center;
	}

	.mediaSel {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.mediaSel2 {
		flex: 2;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.mediaIcon {
		display: block;
		width: 40rpx;
		height: 40rpx;
	}

	.uni-image-close {
		margin-top: 30rpx;
		text-align: center;
	}

	.video {
		width: 750rpx;
	}

	.videoBox {
		width: 300rpx;
		min-height: 150rpx;
		position: relative;
		background-color: #000000;
	}

	.videoCover {
		width: 100%;

	}

	.videoPlayBtn {
		position: absolute;
		width: 104rpx;
		height: 104rpx;
		left: 50%;
		top: 50%;
		transform: translateX(-50%) translateY(-50%);
	}

	.chattopLoadingBox {
		width: 100%;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.loadingIcon {
		width: 30rpx;
		height: 30rpx;
		display: block;
	}
</style>
