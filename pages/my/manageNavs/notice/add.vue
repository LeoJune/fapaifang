<template>
	<view>
		<view class="title-contents">
			<view class="top-view status"></view>
			<view class="_top titles">
				<uni-icons color="#555555" class="backIocn" size="22" type="arrowleft" @click="back" />
				<view class="topViewText">发布公告</view>
			</view>
		</view>
		<view class="recordAddCont">

			<view class="recordAddItem">
				<view class="recordAddItemHead">
					公告标题:
					<text class="needTag">*</text>
				</view>
				<textarea class="recordAddTextArea" auto-height @blur="bindTextAreaBlur1" placeholder="请输入内容 (50字以内)" maxlength="50" placeholder-style="font-size:30rpx;color:#cecece" />
			</view>
			<view class="recordAddItem">
				<view class="recordAddItemHead">
					开始时间:
					<text class="needTag">*</text>
				</view>
				<view class="uni-input pickerView" @click="datePicker1">
					<view class="pickerValue" v-if="startTime">{{startTime}}</view>
					<view class="pickerValue noBirData" v-else>请选择公告开始时间</view>
					<uni-icons class="pickerArrowIcon" color="#cccccc" type="arrowright"></uni-icons>
				</view>
			</view>
			<view class="recordAddItem">
				<view class="recordAddItemHead">
					结束时间:
					<text class="needTag">*</text>
				</view>
				<view class="uni-input pickerView" @click="datePicker2">
					<view class="pickerValue" v-if="endTime">{{endTime}}</view>
					<view class="pickerValue noBirData" v-else>请选择公告结束时间</view>
					<uni-icons class="pickerArrowIcon" color="#cccccc" type="arrowright"></uni-icons>
				</view>
			</view>
			<view class="recordAddItem">
				<view class="recordAddItemHead">
					公告内容:
					<text class="needTag">*</text>
				</view>
				<textarea class="recordAddTextArea" @blur="bindTextAreaBlur2" placeholder="请输入内容 (500字以内)" maxlength="500" placeholder-style="font-size:30rpx;color:#cecece" />
			</view>
			
		</view>
		<view class="recordAddSubBtn">
			<button type="warn" class="subBtn" @click="sub">发布公告</button>
		</view>
		<w-picker
			mode="date" 
			startDate="2017" 
			endYear="2030"
			:current="true"
			fields="second"
			@confirm="onConfirm1" 
			ref="date1" 
			themeColor="#f00"
		></w-picker>
		<w-picker
			mode="date" 
			startDate="2017" 
			endYear="2030"
			:current="true"
			fields="second"
			@confirm="onConfirm2" 
			ref="date2" 
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
				title:"",
				content:"",
				startTime:"",
				endTime:"",
				hasclickback:false
			}
		},
		methods: {
			getRate(e){
				const that = this;
				that.rate=e.value
			},
			bindTextAreaBlur1(e){
				this.title=e.detail.value;
			},
			bindTextAreaBlur2(e){
				this.content=e.detail.value;
			},
			datePicker1: function(e) {
				const that = this;
				that.$refs.date1.show();
			},
			onConfirm1(val){
				const that= this;
				that.startTime=val.obj.year+'-'+val.obj.month+'-'+val.obj.day+' '+val.obj.hour+':'+val.obj.minute+':'+val.obj.second;
			},
			datePicker2: function(e) {
				const that = this;
				that.$refs.date2.show();
			},
			onConfirm2(val){
				const that= this;
				that.endTime=val.obj.year+'-'+val.obj.month+'-'+val.obj.day+' '+val.obj.hour+':'+val.obj.minute+':'+val.obj.second;
			},
			sub(){
				const that = this;
				setTimeout(()=>{
					if(that.title==""||that.content==""||that.startTime==""||that.endTime==""){
						uni.showToast({
							title:"请输入必填内容",
							icon:"none"
						})
					}
					else if(new Date(that.startTime)>=new Date(that.endTime)){
						uni.showToast({
							title:"结束时间必须大于开始时间",
							icon:"none"
						})
					}
					else{
						that.subAdd();
						
					}
				},100)
			},
			subAdd(){
				const that = this;
				
				let param = {
					title: that.title,
					content: that.content,
					startTime:that.startTime,
					endTime:that.endTime
				}
				that.$api.noticeAdd(param).then(res => {
					if (res.success) {
						uni.showToast({
							title:"发布成功"
						})
						setTimeout(()=>{
							that.$Router.back(1);
						},1000)	
						var pages = getCurrentPages(); //当前页
						var beforePage = pages[pages.length - 2].route; //上个页面
						if(beforePage=="pages/my/manageNavs/notice/list"){
							that.prevPageReload();
						}	
					} else {
						uni.showToast({
							title: res.message,
							icon: "none"
						})
					}
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
				if(that.title!=""||that.content!=""||that.startTime!=""||that.endTime!=""){	
					uni.showModal({
							content: "退出后将不保留已编辑的内容，确认退出编辑？",
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
.pickerView{
	padding-left: 30rpx;
}
</style>
