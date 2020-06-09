<template>
	<view class="content">
		<view class="userPicBox" @click="updatePic">
			<image :src="userData.headImgUrl" class="userPicImg"></image>
			<image src="../../static/images/camera.png" class="cameraIcon"></image>
		</view>
		<view class="userForm">
			<view class="formHead">
				基本资料
			</view>
			<view class="formContent">
				<view class="formInputBox">
					<view class="formInputLabel">
						手机号
					</view>
					<view class="formInputCont">
						<input class="uni-input" disabled="disabled" value="" type="text" v-model="userData.mobile">
					</view>
				</view>
				<view class="formInputBox">
					<view class="formInputLabel">
						昵称
					</view>
					<view class="formInputCont">
						<input class="uni-input" placeholder-style="color:#CECECE" placeholder="请输入(限12字以内)" maxlength="12" type="text"
						 v-model="userData.nickName">
					</view>
				</view>
				<view class="formInputBox">
					<view class="formInputLabel">
						真实姓名
					</view>
					<view class="formInputCont">
						<input class="uni-input" placeholder-style="color:#CECECE" placeholder="请输入" maxlength="6" type="text" v-model="userData.realName">
					</view>
				</view>
				<view class="formInputBox">
					<view class="formInputLabel">
						性别
					</view>
					<view class="formInputCont">
						<picker @change="sexPicker" :range="sexArr">
							<view class="uni-input pickerView">
								<view class="pickerValue">{{sexArr[userData.gender]}}</view>
								<uni-icons class="pickerArrowIcon" color="#cccccc" type="arrowright"></uni-icons>
							</view>
						</picker>
					</view>
				</view>
				<view class="formInputBox">
					<view class="formInputLabel">
						生日
					</view>
					<view class="formInputCont">
						<picker mode="date" @change="datePicker">
							<view class="uni-input pickerView">
								<view class="pickerValue" v-if="userData.birthday!=null">{{userData.birthday}}</view>
								<view class="pickerValue noBirData" v-else>请选择生日</view>
								<uni-icons class="pickerArrowIcon" color="#cccccc" type="arrowright"></uni-icons>
							</view>
						</picker>
					</view>
				</view>
				<view class="formInputBox">
					<view class="formInputLabel">
						推荐码
					</view>
					<view class="formInputCont">
						<input class="uni-input" placeholder-style="color:#CECECE" placeholder="请输入" maxlength="10" type="text" :disabled="noInvitationCode"
						 v-model="userData.invitationCode">
					</view>
				</view>
				<view class="formInputBox">
					<view class="formInputLabel">
						邮箱
					</view>
					<view class="formInputCont">
						<input class="uni-input" placeholder-style="color:#CECECE" placeholder="请输入" maxlength="30" type="text" v-model="userData.email">
					</view>
				</view>
				<view class="formInputBox">
					<view class="formInputLabel">
						身份证
					</view>
					<view class="formInputCont">
						<input class="uni-input" placeholder-style="color:#CECECE" placeholder="请输入" maxlength="18" type="text" v-model="userData.idCardNo">
					</view>
				</view>
				<button type="warn" class="subBtn" @click="updateData">保存</button>
			</view>
		</view>


		<avatar @upload="picUpload" ref="avatar">
		</avatar>
	</view>
</template>

<script>
	import avatar from "../../components/yq-avatar/yq-avatar.vue";
	export default {
		components: {
			avatar
		},
		created() {
			const that = this;

			that.getUserInfo();
		},
		data() {
			return {
				userData: "",
				noUserPic: false,
				noInvitationCode: false,
				sexArr: ["保密",
					"男", "女"
				],
			}
		},
		methods: {
			getUserInfo() {
				const that = this;
				uni.showLoading({
					title: "",
					mask: true
				})
				that.$api.userinfoQuery().then(res => {
					if (res.success) {
						uni.hideLoading();
						let result = res.datas;
						if (!result.headImgUrl) {
							result.headImgUrl = '../../static/images/defaultUserPic.png';
							that.noUserPic = true;
						}
						if (!result.invitationCode == "") {
							that.noInvitationCode = true;
						}
						that.userData = result;
					} else {
						uni.showToast({
							title: res.message,
							icon: "none"
						})
					}
				})
			},
			updatePic() {
				this.$refs.avatar.fChooseImg(0, {
					selWidth: "300upx",
					selHeight: "300upx",
					expWidth: '260upx',
					expHeight: '260upx'
				});
			},
			picUpload(rsp) {
				console.log(rsp);
				this.userData.headImgUrl = rsp.path;
				this.uploadImg(rsp.path);
			},
			uploadImg(path) {
				const that = this;
				let files;
				console.log(path);
				uni.uploadFile({
					url: that.$api.filesUpload, // 后端api接口
					//chooseImage函数调用后获取的本地文件路劲
					name: 'file', //后端通过'file'获取上传的文件对象
					// #ifdef MP-WEIXIN
					filePath:path,
					// #endif
					// #ifndef MP-WEIXIN
					file:path,
					// #endif	
					formData: {
						"groupName": "userimg"
					},
					success: (res) => {
						if (res.statusCode == 200) {
							let result = JSON.parse(res.data);
							console.log(result);
							if(result.success){
								that.userData.headImgUrl=result.datas.picUrl;
								that.noUserPic=false
							}
							else{
								uni.showToast({
									title:"上传失败"
								})
							}
						}
					},
					fail: (error) => {
						console.log(error);
					}
				});

			},
			sexPicker: function(e) {
				const that = this;
				that.userData.gender = e.detail.value;
			},
			datePicker: function(e) {
				const that = this;
				that.userData.birthday = e.detail.value;
			},
			updateData() {
				const that = this;
				var serverData = {};
				serverData.id = that.userData.id;
				serverData.mobile = that.userData.mobile;
				serverData.nickName = that.userData.nickName;
				serverData.realName = that.userData.realName;
				serverData.gender = that.userData.gender;
				serverData.birthday = that.userData.birthday;
				serverData.invitationCode = that.userData.invitationCode;
				serverData.email = that.userData.email;
				serverData.idCardNo = that.userData.idCardNo;
				if (that.noUserPic) {
					serverData.headImgUrl = "";
				}
				else{
					serverData.headImgUrl = that.userData.headImgUrl;
				}
				if (serverData.email != "" && !that.$utils.common.emailTest.test(serverData.email)) {
					uni.showToast({
						title: "请输入正确的邮箱地址",
						icon: "none"
					})
					return;
				} else if (serverData.idCardNo != "" && !that.$utils.common.idCardTest.test(serverData.idCardNo)) {
					uni.showToast({
						title: "请输入正确的身份证号",
						icon: "none"
					})
					return;
				} else {
					uni.showLoading({
						title: "请稍等...",
						mask: true
					})
					let param = serverData;
					that.$api.userinfoUpdate(param).then(res => {
						if (res.success) {
							uni.showToast({
								title: "修改成功"
							})
						
							// #ifdef H5
							var pages = getCurrentPages(); //当前页
							var beforePage = pages[pages.length - 2]; //上个页面
							beforePage.reload()
							// #endif
							// #ifndef H5
							var page = getCurrentPages()[0]
							if (page == undefined || page == null) return;
							page.onLoad()
							// #endif


						} else {
							uni.showToast({
								title: res.message,
								icon: "none"
							})
						}
					})
				}
			}
		}
	}
</script>

<style>
	.content {
		padding: 30rpx;
	}

	.userPicBox {
		position: relative;
		width: 160rpx;
		height: 150rpx;
	}

	.userPicImg {
		width: 140rpx;
		height: 140rpx;
		border-radius: 100%;
	}

	.cameraIcon {
		position: absolute;
		width: 80rpx;
		height: 80rpx;
		bottom: -6rpx;
		right: -10rpx;
	}

	.userForm {
		margin-top: 20rpx;
	}

	.formHead {
		font-size: 44rpx;
		color: #222222;
		padding: 28rpx 0;
		line-height: 40rpx;
	}

	.subBtn {
		height: 92rpx;
		font-size: 32rpx;
		margin: 30rpx;

	}
</style>
