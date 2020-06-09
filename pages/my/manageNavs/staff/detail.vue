<template>
	<view>
		<view class="recordDetailPage" v-if="result">
			<view class="recordPersonBox">
				<view class="recordPersonInfo">
					<view class="recordPersonInfoCont">
						<view class="recordPersonName">{{result.name}}（{{result.genderText}}，{{result.age}}岁）</view>
						<view class="recordTime">
							{{result.updateTime}} 由<text class="editerName">{{result.updateEmployeeName}}</text>修改
						</view>
					</view>
				</view>
				<view class="czBtns">
					<image src="../../../../static/images/edit.png" class="czIcons" @click="gotoEdit"></image>
				</view>
			</view>
			<view class="recordDetailCont">
				<view class="recordDetailItem">
					<view class="detailHead">
						<view class="detailHeadTitle">
							手机号:
						</view>
						
					</view>
					<view class="recordDetailText">{{result.mobile}}</view>
				</view>
				<view class="recordDetailItem">
					<view class="detailHead">
						<view class="detailHeadTitle">
							员工类型:
						</view>
					</view>
					<view class="recordDetailText" v-if="result.employeeType==0">普通员工</view>
					<view class="recordDetailText" v-else>管理层</view>
				</view>
				<view class="recordDetailItem">
					<view class="detailHead">
						<view class="detailHeadTitle">
							家庭住址:
						</view>
					</view>
					<view class="recordDetailText">{{result.address}}</view>
				</view>
				<view class="recordDetailItem">
					<view class="detailHead">
						<view class="detailHeadTitle">
							推荐码:
						</view>
					</view>
					<view class="recordDetailText">{{result.referrCode}}</view>
				</view>
				<view class="recordDetailItem">
					<view class="detailHead">
						<view class="detailHeadTitle">
							钻值:
						</view>	
					</view>
					<view class="recordDetailText">{{result.diamondTotal}}</view>
				</view>
				<view class="recordDetailItem">
					<view class="detailHead">
						<view class="detailHeadTitle">
							创建人:
						</view>	
					</view>
					<view class="recordDetailText">{{result.createEmployeeName}} ({{result.createTime}}）</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id:"",
				result:"",
			}
		},
		onLoad(options) {
			const that = this;
			that.id = options.id;
			that.getDetail(options.id);

		},
		methods: {
			reload(){
				this.getDetail(this.id);
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
						var nowYear = parseInt(new Date().getFullYear());
						var birdayYear = parseInt(result.birthday.substring(0,4));
						result.age = nowYear-birdayYear;
						
						if(result.gender==0){
							result.genderText = "保密";
						}
						else if(result.gender==1){
							result.genderText = "男";
						}
						else{
							result.genderText = "女";
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
			gotoEdit(){
				this.$Router.push({
					path:"/pages/my/manageNavs/staff/edit",
					query:{
						id:this.id
					}
				})
			}
		}
	}
</script>

<style>
	.czBtns{
		width: 76rpx !important;
	}
	.editerName{
		color: #00BBC3;
		margin:0 10rpx;
	}
</style>
