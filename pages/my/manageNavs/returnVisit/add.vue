<template>
	<view>
		<view class="title-contents">
			<view class="top-view status"></view>
			<view class="_top titles">
				<uni-icons color="#555555" class="backIocn" size="22" type="arrowleft" @click="back" />
				<view class="topViewText">新增回访</view>
			</view>
		</view>
		<view class="recordAddCont">
			<view class="recordAddItem">
				<view class="recordAddItemHead">
					客户和房源：
					<text class="needTag">*</text>
				</view>
				<view class="recordSelItem heiAuto" @click="searchVisit">
					<view class="visitResBox" v-if="oriVisitId!=0">
						<view class="visitResInfo1 nowrap">
							<text class="customerName" v-if="customerName!=''">{{customerName}}</text>
							<text class="customerMobile">{{customerMobile}}</text>
						</view>
						<view class="visitResInfo2 nowrap">
							{{houseName}}
						</view>
					</view>
					<view class="recordSelInput" v-else>
						请选择客户
					</view>
					<uni-icons type="arrowright" size="18" color="#b8b8b8"></uni-icons>
				</view>
			</view>
			<view class="recordAddItem" v-if="employeeName!=''">
				<view class="recordAddItemHead">
					业务员:
				</view>
				<view class="recordSelItem">
					<view class="recordSelInput nowrap hasSeled">
						{{employeeName}}
					</view>
				</view>
			</view>
			<view class="recordAddItem">
				<view class="recordAddItemHead">
					回访时间:
					<text class="needTag">*</text>
				</view>
				<view class="recordSelItem">
					<view class="recordSelInput nowrap" @click="datePicker" v-if="visitTime==''">
						请选择回访时间
					</view>
					<view class="recordSelInput nowrap hasSeled" @click="datePicker" v-else>
						{{visitTime}}
					</view>
				</view>
			</view>
			<view class="recordAddItem">
				<view class="recordAddItemHead">
					回访内容:
					<text class="needTag">*</text>
				</view>
				<textarea class="recordAddTextArea" @blur="bindTextAreaBlur" placeholder="请输入内容" maxlength="300" placeholder-style="font-size:30rpx;color:#cecece" />
				</view>
		</view>
		<view class="recordAddSubBtn">
			<button type="warn" class="subBtn" @click="sub">提交回访</button>
		</view>
		<w-picker
			mode="date" 
			startYear="2017" 
			endYear="2029"
			:current="false"
			fields="second"
			@confirm="onConfirmDate"
			:disabled-after="false"
			ref="date"
			themeColor="#f00"
		></w-picker>
	</view>
	
</template>

<script>
	import wPicker from "@/components/w-picker/w-picker.vue";
	export default {
		 components:{
		        wPicker
		    },
		data() {
			return {
				oriVisitId:0,
				customerName:"",
				customerMobile:'',
				employeeName:'',
				houseName:"",
				visitTime:"",
				content:"",
				paimaiId:"",
				houseSource:"",
				hasclickback:false
			}
		},
		onShow() {
			console.log(this.userId)
		},
		methods: {
			bindTextAreaBlur(e){
				this.content=e.detail.value;
			},
			datePicker: function(e) {
				const that = this;
				that.$refs.date.show();
			},
			onConfirmDate(val){
				const that= this;
				that.visitTime=val.result;
			},
			sub(){
				const that = this;
				setTimeout(()=>{
					if(that.oriVisitId==0||that.content==""||that.visitTime==""){
						uni.showToast({
							title:"请输入必填内容",
							icon:"none"
						})
					}
					else{	
						uni.showModal({
							content: "回访提交后将不可再次修改，确认提交日志？",
							confirmText: "确认提交",
							cancelText: "取消",
							success: function (res) {
								if (res.confirm) {
									uni.showLoading({
										title:"提交中..."
									})
									let param = {
										oriVisitId: that.oriVisitId,
										visitTime:that.visitTime,
										content:that.content
									}
									that.$api.returnvisitAdd(param).then(res => {
										if (res.success) {
											uni.showToast({
												title:"提交成功"
											})
											setTimeout(()=>{
												that.$Router.back(1);
											},1000)	
											var pages = getCurrentPages(); //当前页
											var beforePage = pages[pages.length - 2].route; //上个页面
											if(beforePage=="pages/my/manageNavs/returnVisit/list"){
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
			searchVisit(){
				const that = this;
				that.$Router.push({
					path:"/pages/my/manageNavs/searchVisit"
				})
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
			back(){
				const that = this;
				if(that.oriVisitId!=0||that.content!=""||that.visitTime!=""){	
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
