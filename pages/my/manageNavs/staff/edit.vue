<template>
	<view class="content">
		<view class="userForm">
			<view class="formContent">
				<view class="formInputBox">
					<view class="formInputLabel">
						姓名
					</view>
					<view class="formInputCont">
						<input class="uni-input" placeholder-style="color:#CECECE" placeholder="请输入" maxlength="6" type="text" v-model="userData.name">
					</view>
				</view>
				<view class="formInputBox">
					<view class="formInputLabel">
						手机号
					</view>
					<view class="formInputCont">
						<input class="uni-input" placeholder-style="color:#CECECE" disabled  value="" type="text" v-model="userData.mobile" placeholder="请输入手机号" maxlength="11">
					</view>
				</view>
				
				<view class="formInputBox">
					<view class="formInputLabel">
						性别
					</view>
					<view class="formInputCont">
						<picker @change="sexPicker" :range="sexArr">
							<view class="uni-input pickerView">
								<view class="pickerValue"  v-if="genderText">{{genderText}}</view>
								<view class="pickerValue noBirData" v-else>请选择性别</view>
								<uni-icons class="pickerArrowIcon" color="#cccccc" type="arrowright"></uni-icons>
							</view>
						</picker>
					</view>
				</view>
				<view class="formInputBox">
					<view class="formInputLabel">
						员工类型
					</view>
					<view class="formInputCont">
						<picker @change="typePicker" :range="typeArr">
							<view class="uni-input pickerView">
								<view class="pickerValue"  v-if="typeText">{{typeText}}</view>
								<view class="pickerValue noBirData" v-else>请选择员工类型</view>
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
								<view class="pickerValue" v-if="userData.birthday">{{userData.birthday}}</view>
								<view class="pickerValue noBirData" v-else>请选择生日</view>
								<uni-icons class="pickerArrowIcon" color="#cccccc" type="arrowright"></uni-icons>
							</view>
						</picker>
					</view>
				</view>
				
				<view class="formInputBox">
					<view class="formInputLabel">
						地址
					</view>
					<view class="formInputCont">
						<input class="uni-input" placeholder-style="color:#CECECE" placeholder="请输入" maxlength="50" type="text" v-model="userData.address">
					</view>
				</view>
				
				<button type="warn" class="subBtn" @click="employeeUpdate">保存</button>
			</view>
		</view>


		
	</view>
</template>

<script>
	export default {

		onLoad(options) {
			const that = this;
			that.id = options.id;
			that.getDetail(options.id);
		},
		data() {
			return {
				userData: {
					name:"",
					mobile:"",
					gender:"",
					employeeType:"",
					birthday:"",
					address:""
				},
				genderText:"",
				typeText:"",
				noUserPic: false,
				noInvitationCode: false,
				sexArr: [
					"男", "女"
				],
				typeArr: [
					 "普通员工","管理层"
				],
			}
		},
		methods: {
			
			sexPicker: function(e) {
				const that = this;
				that.userData.gender=e.detail.value;
				that.genderText = that.sexArr[e.detail.value];
			},
			typePicker: function(e) {
				const that = this;
				that.userData.employeeType=e.detail.value;
				that.typeText = that.typeArr[e.detail.value];
			},
			datePicker: function(e) {
				const that = this;
				that.userData.birthday = e.detail.value;
			},
			getDetail(id){
				const that = this;
				let param = {
					id:id
				}
				uni.showLoading({
					title:"加载中..."
				})
				that.$api.employeeDetail(param).then(res => {
					if (res.success) {
						
						let result = res.datas;
						that.userData.name = result.name;
						that.userData.mobile = result.mobile;
						that.userData.gender = result.gender;
						that.userData.employeeType = result.employeeType;
						that.userData.birthday = result.birthday;
						that.userData.address = result.address;
						if(result.gender==0){
							that.genderText = "保密";
						}
						else if(result.gender==1){
							that.genderText = "男";
						}
						else if(result.gender==2){
							that.genderText = "女";
						}
						if(result.employeeType==1){
							that.typeText = "管理层";
						}
						else if(result.employeeType==0){
							that.typeText = "普通员工";
						}
						that.result = result;
						uni.hideLoading();
					} else {
						uni.showToast({
							title: res.message,
							icon: "none"
						})
					}
				})
			},
			employeeUpdate() {
				const that = this;
				var serverData = {};
				serverData.id=that.id;
				serverData.name = that.userData.name;
				serverData.gender = that.userData.gender;
				serverData.birthday = that.userData.birthday;
				serverData.employeeType = that.userData.employeeType;
				serverData.address = that.userData.address;
				if (that.userData.name=="") {
					uni.showToast({
						title: "请输入姓名",
						icon: "none"
					})
					return;
				} else if (that.userData.gender==="") {
					uni.showToast({
						title: "请选择性别",
						icon: "none"
					})
					return;
				} else if (that.userData.employeeType==="") {
					uni.showToast({
						title: "请选择员工类型",
						icon: "none"
					})
					return;
				} else if (that.userData.address=="") {
					uni.showToast({
						title: "请输入地址",
						icon: "none"
					})
					return;
				} else {
					uni.showLoading({
						title: "请稍等...",
						mask: true
					})
					let param = serverData;
					that.$api.employeeUpdate(param).then(res => {
						if (res.success) {
							uni.showToast({
								title: "添加成功"
							})
						
							setTimeout(()=>{
								that.$Router.back(1);
							},1000)	
							var pages = getCurrentPages(); //当前页
							var beforePage = pages[pages.length - 2].route; //上个页面
							that.prevPageReload();

						} else {
							uni.showToast({
								title: res.message,
								icon: "none"
							})
						}
					})
				}
			},
			prevPageReload(){
				var pages = getCurrentPages(); //当前页
				var beforePage = pages[pages.length - 2]; //上个页面
				// #ifdef H5
				beforePage.reload()
				// #endif
				// #ifndef H5
				beforePage.onLoad()
				// #endif
			},
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
