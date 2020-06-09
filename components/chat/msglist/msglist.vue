<template>
	<view
		scroll-y="true"
		:class="view"
		class="wrap"
		@tap="onTap"
		@scroll="scrollmore"
		@scrolltoupper="refresh"
		upper-threshold='-50'
		:scroll-into-view="toView">
		<view class="message" v-for="item in chatMsg" :key="item.mid" :id="item.mid">
			<view class="time">
				<text class="time-text">{{ item.time }}</text>
			</view>
			<view class="main" :class="item.style">
				<view class="user">
					<!-- yourname：就是消息的 from -->
					<!-- <text class="user-text">{{ item.yourname + ' ' + item.time}}</text> -->
				</view>
				<image class="avatar" src="../../../static/images/defaultUserPic.png"/>
				<view :class="{'msg':true,'imgMsg':item.msg.type=='img'||item.msg.type=='video'}">
					<view v-if="item.msg.type == 'img' || item.msg.type == 'video'">
						<image  v-if="item.msg.type == 'img'"
								:src="item.msg.data"
								style="width:250rpx;display: block;"
								mode="widthFix"
								@tap="previewImage"
								:data-url="item.msg.data" />
						<video v-if="item.msg.type == 'video'" :src="item.msg.data" controls autoplay />
					</view>
					<audio-msg
						v-if="item.msg.type == 'audio'"
						:msg="item"></audio-msg>
					<view v-else-if="item.msg.type == 'txt' || item.msg.type == 'emoji'">
						<view class="template" v-for="(d_item, d_index) in item.msg.data" :key="d_index">
							<text v-if="d_item.type == 'txt'"  class="msg-text" style="float:left;">{{ d_item.data }}</text>
							
							<image  v-if="d_item.type == 'emoji'"
									class="avatar"
									:src="'/static/images/faces/' + d_item.data"
									style="width:25px; height:25px; margin:0 0 2px 0; float:left;" />
							
						</view>
					</view>
				
				</view>
			</view>
		</view>
	</view>
	<!-- <view style="height: 1px;"></view> -->
</template>

<script>
	//import audioMsg from "@/components/chat/msglist/type/audio/audio.vue";
	
	let LIST_STATUS = {
		SHORT: "scroll_view_change",
		NORMAL: "scroll_view"
	};
	let page = 0;
	let Index = 0;
	let curMsgMid = ''
	let isFail = false
	export default {
		// components: {
		// 	audioMsg
		// },
		props: {
			username: {
				type: Object,
				value: {},
			},
		},
		data() {
			return {
				view: LIST_STATUS.NORMAL,
				toView: "",
				chatMsg: [{
					"info": {
						"from": "cc",
						"to": "xyliu"
					},
					"username": "cc",
					"yourname": "cc",
					"msg": {
						"type": "txt",
						"data": [{
							"data": "1111",
							"type": "txt"
						}]
					},
					"style": "",
					"time": "2020-4-13 15:32:07",
					"mid": "txt726641563890878140",
					"chatType": "chat"
				}, {
					"info": {
						"from": "cc",
						"to": "xyliu"
					},
					"username": "cc",
					"yourname": "cc",
					"msg": {
						"type": "txt",
						"data": [{
							"data": "萨达四大的萨达四大的萨达四大的萨达四大的萨达四大的。",
							"type": "txt"
						}]
					},
					"style": "",
					"time": "2020-4-13 15:32:07",
					"mid": "txt726701128158283456",
					"chatType": "chat"
				}, {
					"info": {
						"from": "xyliu",
						"to": "cc"
					},
					"username": "cc",
					"yourname": "xyliu",
					"msg": {
						"type": "txt",
						"data": [{
							"data": "123123",
							"type": "txt"
						}]
					},
					"style": "self",
					"time": "2020-4-16 21:27:40",
					"mid": "txtWEBIM_4afe1049c4",
					"chatType": "singleChat"
				},
				{
					"info": {
						"from": "cc",
						"to": "xyliu"
					},
					"username": "cc",
					"yourname": "cc",
					"msg": {
						"type": "img",
						"data": "../../static/images/logo.png",
					},
					"style": "",
					"time": "2020-4-16 21:27:40",
					"mid": "txtWEBIM_4afe10485c4",
					"chatType": "singleChat"
				}, {
					"info": {
						"from": "xyliu",
						"to": "cc"
					},
					"username": "cc",
					"yourname": "xyliu",
					"msg": {
						"type": "txt",
						"data": [{
							"data": "发热管非个人体会天人合一认同和任何人特让他特让他",
							"type": "txt"
						}]
					},
					"style": "self",
					"time": "2020-4-16 21:27:40",
					"mid": "txtWEBIM_4afe1049c5",
					"chatType": "singleChat"
				},
				{
					"info": {
						"from": "xyliu",
						"to": "cc"
					},
					"username": "cc",
					"yourname": "xyliu",
					"msg": {
						"type": "img",
						"data":  "../../static/images/userTopBg.png",
					},
					"style": "self",
					"time": "2020-4-16 21:27:40",
					"mid": "txtWEBIM_4afe1049c7",
					"chatType": "singleChat"
				}],
				visibility: false,
			}
		},
		beforeMount(){
			this.visibility = true;
			page = 0;
			Index = 0;
		},
		beforeDestroy() {
			this.visibility = false;
		},
		created() {
			
		},
		
		onReady() {
			
		},
		methods: {
			
			normalScroll(){
				this.view = LIST_STATUS.NORMAL
			},
			
			shortScroll(){
				this.view = LIST_STATUS.SHORT
			},
			
			onTap(){
				// console.log('onTap');
				this.$emit('msglistTap');
				// this.triggerEvent("msglistTap", null, { bubbles: true });
			},
			
			previewImage(event){
				var url = event.target.dataset.url;
				uni.previewImage({
					urls: [url]		// 需要预览的图片 http 链接列表
				});
			},
			
			
		}
	}
</script>

<style>
	page{
		background-color: #f4f4f4;
	}
	/*.chat-bg{
		position:fixed;
		width: 100%;
		height: 100%;
		z-index: 0;
		top: 50px;
	}*/
	.scroll_view,
	.scroll_view_change {
		/*width: 100%;
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 150rpx;*/
		margin-bottom: 174rpx;
	}
	
	.scroll_view_X,
	.scroll_view_change_X{
		margin-bottom: 244rpx;
	}
	
	.scroll_view_change {
		/*bottom: 440rpx;*/
		margin-bottom: 590rpx;
	}
	
	.message {
		width: 92%;
		height: auto;
		padding:30rpx;
		
	
	}
	.message .main{
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
	
	.msg .msg_popleftarrow{
		position:absolute;
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
	.imgMsg{
		margin-left: 100rpx !important;
		padding: 0 !important;
		border-radius: 10rpx;
		overflow: hidden;
		border: 1rpx solid #E5E5E5;
	}
	.self .msg:before {
		right: inherit;
		left: 100%;
		border-right-color: transparent;
		border-left-color: #b2e281;
	}
	.self .imgMsg{
		margin-right: 100rpx !important;
	}
	.template {
		display: inline;
	}
	.err{
		width: 32rpx;
		height: 32rpx;
		position: absolute;
		left: -40rpx;
	}
	.hide{
		display: none;
	}
	.show{
		display: block;
	}

</style>
