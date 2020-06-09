<template>
	<view>
		<view class="title-contents">
			<view class="top-view status"></view>
			<view class="_top titles">
				<uni-icons color="#555555" class="backIocn" size="22" type="arrowleft" @click="back" />
				<view class="topViewText">新增合同</view>
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
					合同附件:
					<text class="needTag">*</text>
				</view>
				<view class="annexList" v-if="appendixList.length>0">
					<view class="annexItem" v-for="(item,index) in appendixList" :key="index">
						<view class="annexItemBox">
							<view class="lookAnnex" @click="previewImage(index)">
								附件
							</view>
							<uni-icons type="clear" class="clearAnnex" size="18" color="#b8b8b8" @click="clearAnnex(index)"></uni-icons>
						</view>
						<view class="annexTitle">
							<view class="annexTitleLabel">
								附件标题：
							</view>
							<input type="text" class="uni-input" placeholder="请输入(60字以内)" maxlength="60" placeholder-style="color:#CECECE;" v-model="item.title">
						</view>
					</view>
				</view>
				<view class="annexUploadBtn" @click="addAnnex">
					请上传附件
				</view>
				</view>
			<view class="recordAddItem">
				<view class="recordAddItemHead">
					备注:
					<text class="needTag">*</text>
				</view>
				<textarea class="recordAddTextArea" @blur="bindTextAreaBlur" placeholder="请输入内容" maxlength="300" placeholder-style="font-size:30rpx;color:#cecece" />
				</view>
		</view>
		<view class="recordAddSubBtn">
			<button type="warn" class="subBtn" @click="sub">提交合同</button>
		</view>
	</view>
</template>

<script>
	import permision from "@/common/permission.js"
	export default {
		data() {
			return {
				oriVisitId:0,
				customerName:"",
				customerMobile:'',
				employeeName:'',
				houseName:"",
				appendixList:[],
				imageList:[],
				memo:"",
				paimaiId:"",
				houseSource:"",
				appUserId:"",
				hasclickback:false
			}
		},
		methods: {
			getRate(e){
				const that = this;
				that.evaluateScore=e.value
			},
			bindTextAreaBlur(e){
				this.memo=e.detail.value;
			},
			addAnnex(){
				uni.chooseImage({
					sourceType: ['camera', 'album'],
					sizeType: ['original'],
					count: 1,
					success: (res) => {
						console.log(res);
						let size = res.tempFiles[0].size;
						if(size>1024*1024*200){
							uni.showToast({
								title:"文件过大",
								icon:"none"
							})
						}
						else{
							this.uploadImg(res);
						}
						
					},
					fail: (err) => {
						// #ifdef APP-PLUS
						if (err['code'] && err.code !== 0 && this.sourceTypeIndex === 2) {
							this.checkPermission(err.code);
						}
						// #endif
						// #ifdef MP
						uni.getSetting({
							success: (res) => {
								let authStatus = false;
								switch (this.sourceTypeIndex) {
									case 0:
										authStatus = res.authSetting['scope.camera'];
										break;
									case 1:
										authStatus = res.authSetting['scope.album'];
										break;
									case 2:
										authStatus = res.authSetting['scope.album'] && res.authSetting['scope.camera'];
										break;
									default:
										break;
								}
								if (!authStatus) {
									uni.showModal({
										title: '授权失败',
										content: 'Hello uni-app需要从您的相机或相册获取图片，请在设置界面打开相关权限',
										success: (res) => {
											if (res.confirm) {
												uni.openSetting()
											}
										}
									})
								}
							}
						})
						// #endif
					}
				})
			},
			previewImage: function(index) {
				uni.previewImage({
					current: this.imageList[index],
					urls: this.imageList
				})
			},
			clearAnnex(index){
				const that = this;
				that.appendixList.splice(index,1);
				that.imageList.splice(index,1);
			},
			uploadImg(fileRes) {
				const that = this;
				uni.showLoading({
					title:'上传中...'
				})
				let files;
				// #ifdef MP-WEIXIN
				files=fileRes.tempFilePaths[0];
				// #endif
				// #ifndef MP-WEIXIN
				files=fileRes.tempFiles[0];
				// #endif
				uni.uploadFile({
					url: that.$api.filesUpload, // 后端api接口
					//chooseImage函数调用后获取的本地文件路劲
					name: 'file', //后端通过'file'获取上传的文件对象
					// #ifdef MP-WEIXIN
					filePath:files,
					// #endif
					// #ifndef MP-WEIXIN
					file:files,
					// #endif	
					formData: {
						"groupName": "userimg"
					},
					success: (res) => {
						if (res.statusCode==200) {
							let result = JSON.parse(res.data);
							console.log(result);
							if(result.success){
								that.addAnnexHtml(result.datas,fileRes);
								uni.showToast({
									title:"上传成功"
								})
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
						uni.showToast({
							title:"上传失败",
							icon:'none'
						})
					}
				});
			
			},
			addAnnexHtml(data,fileRes){
				const that = this;
				that.imageList = that.imageList.concat(fileRes.tempFilePaths);
				let adds={
					origiName:data.fileName,
					title:"",
					url:data.picUrl
				}
				that.appendixList.push(adds);
			},
			sub(){
				const that = this;
				setTimeout(()=>{
					if(that.oriVisitId==0||that.appendixList.length==0||that.content==""){
						uni.showToast({
							title:"请输入必填内容",
							icon:"none"
						})
						return;
					}
					if(that.appendixList.length>0){
						for(var i in that.appendixList){
							if(that.appendixList[i].title==""){
								uni.showToast({
									title:"请输入附件标题",
									icon:"none"
								})
								return;
							}
						}
					}
						
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
										appUserId: that.appUserId,
										appendixList:that.appendixList,
										houseSource:that.houseSource,
										memo:that.memo,
										paimaiId:that.paimaiId
									}
									that.$api.contractAdd(param).then(res => {
										if (res.success) {
											uni.showToast({
												title:"提交成功"
											})
											setTimeout(()=>{
												that.$Router.back(1);
											},1000)	
											var pages = getCurrentPages(); //当前页
											var beforePage = pages[pages.length - 2].route; //上个页面
											if(beforePage=="pages/my/manageNavs/contract/list"){
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
			async checkPermission(code) {
				let type = code ? code - 1 : this.sourceTypeIndex;
				let status = permision.isIOS ? await permision.requestIOS(sourceType[type][0]) :
					await permision.requestAndroid(type === 0 ? 'android.permission.CAMERA' :
						'android.permission.READ_EXTERNAL_STORAGE');
			
				if (status === null || status === 1) {
					status = 1;
				} else {
					uni.showModal({
						content: "没有开启权限",
						confirmText: "设置",
						success: function(res) {
							if (res.confirm) {
								permision.gotoAppSetting();
							}
						}
					})
				}
			
				return status;
			},
			back(){
				const that = this;
				if(that.oriVisitId!=0||that.appendixList.length!=0||that.memo!=""){	
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
