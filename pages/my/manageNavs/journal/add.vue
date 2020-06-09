<template>
	<view>
		<view class="title-contents">
			<view class="top-view status"></view>
			<view class="_top titles">
				<uni-icons color="#555555" class="backIocn" size="22" type="arrowleft" @click="back" />
				<view class="topViewText">新增日志</view>
			</view>
		</view>
		<view class="recordAddCont">
			<view class="recordAddItem">
				<view class="recordAddItemHead">
					客户名称：
					<text class="needTag">*</text>
				</view>
				<view class="recordSelItem" @click="searchCustomer">
					<view :class="{'recordSelInput':true,'nowrap':true,'hasSeled':customerId!=0 }">
						{{customerName}}
					</view>
					<uni-icons type="arrowright" size="18" color="#b8b8b8"></uni-icons>
				</view>
			</view>
			<view class="recordAddItem">
				<view class="recordAddItemHead">
					意向房源：
					<text class="needTag">*</text>
				</view>
				<view class="recordSelItem" @click="searchHouse">
					<view :class="{'recordSelInput':true,'nowrap':true,'hasSeled':paimaiId!=0 }">
						{{houseName}}
					</view>
					<uni-icons type="arrowright" size="18" color="#b8b8b8"></uni-icons>
				</view>
			</view>
			<view class="recordAddItem">
				<view class="recordAddItemHead">
					沟通自评分:
					<text class="needTag">*</text>
				</view>
				<view class="recordSelItem">
					<uni-rate class="recordDetailRate" :margin="8" :is-fill="false" color="#dadada" active-color="#d03b41" @change="getRate"
					 :size="18" :value="evaluateScore" />
				</view>
			</view>
			<view class="recordAddItem">
				<view class="recordAddItemHead">
					日志描述:
					<text class="needTag">*</text>
				</view>
				<textarea class="recordAddTextArea" @blur="bindTextAreaBlur" placeholder="请输入内容" maxlength="300" placeholder-style="font-size:30rpx;color:#cecece" />
				</view>
		</view>
		<view class="recordAddSubBtn">
			<button type="warn" class="subBtn" @click="sub">提交日志</button>
		</view>
	</view>
</template>

<script>
	import uniRate from '@/components/uni-rate/uni-rate.vue'
	export default {
		components: {
			uniRate
		},
		data() {
			return {
				customerId:0,
				customerName:"请选择客户",
				paimaiId:0,
				houseSource:"",
				houseName:"请选择房源",
				evaluateScore:0,
				content:"",
				hasclickback:false
			}
		},
		onShow() {
			console.log(this.userId)
		},
		methods: {
			getRate(e){
				const that = this;
				that.evaluateScore=e.value
			},
			bindTextAreaBlur(e){
				this.content=e.detail.value;
			},
			sub(){
				const that = this;
				setTimeout(()=>{
					if(that.customerId==0||that.paimaiId==0||that.evaluateScore==0||that.textArea==""){
						uni.showToast({
							title:"请输入必填内容",
							icon:"none"
						})
					}
					else{
						
						uni.showModal({
							content: "日志提交后将不可再次修改，确认提交日志？",
							confirmText: "确认提交",
							cancelText: "取消",
							success: function (res) {
								if (res.confirm) {
									uni.showLoading({
										title:"提交中..."
									})
									let param = {
										paimaiId: that.paimaiId,
										houseSource: that.houseSource,
										customerId:that.customerId,
										content:that.content,
										evaluateScore:that.evaluateScore
									}
									that.$api.dailyAdd(param).then(res => {
										if (res.success) {
											uni.showToast({
												title:"提交成功"
											})
											setTimeout(()=>{
												that.$Router.back(1);
											},1000)	
											var pages = getCurrentPages(); //当前页
											var beforePage = pages[pages.length - 2].route; //上个页面
											if(beforePage=="pages/my/manageNavs/journal/list"){
												that.prevPageReload();
											}			
										} else {
											uni.showToast({
												title: res.message,
												icon: "none"
											})
										}
									})
									// uni.showToast({
									// 	title:"提交成功"
									// })
								} else if (res.cancel) {
									
								}	
							}
						});	
						
					}
				},100)
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
			searchCustomer(){
				const that = this;
				that.$Router.push({
					path:"/pages/my/manageNavs/searchCustomer"
				})
			},
			searchHouse(){
				const that = this;
				that.$Router.push({
					path:"/pages/my/manageNavs/searchHouse"
				})
			},
			back(){
				const that = this;
				if(that.paimaiId!=0||that.customerId!=0||that.evaluateScore!=0||that.content!=""){	
					uni.showModal({
							content: "退出后将不保留已编辑的内容，确认退出日志编辑？",
							confirmText: "继续编辑",
							cancelText: "退出",
						success: function (res) {
							if (res.confirm) {
					
							} else if (res.cancel) {
								that.$Router.back(1);
							}	
						}
					});		
				}
				else{
					that.$Router.back(1);
				}		
			}
		},
		
	}
</script>

<style>
.recordAddCont{
	padding: 30rpx 30rpx 140rpx 30rpx;
}
.title-contents{
	height: calc(var(--status-bar-height) + 92rpx);
}
.titles{
	height: 92rpx;
	z-index: 998;
}
.title-contents .backIocn {
	line-height: 60rpx;
}
</style>
