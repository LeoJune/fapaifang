<template>
	<view>
		<view class="title-contents">
			<view class="top-view status"></view>
			<view class="_top titles">
				<uni-icons color="#555555" class="backIocn" size="22" type="arrowleft" @click="back" />
				<view class="topViewText">操作确认</view>
			</view>
		</view>
		<view class="recordAddCont">
			<view class="recordAddItem" v-if="type==2">
				<view class="recordAddItemHead">
					尽职调查附件:
					<text class="needTag">*</text>
				</view>
				<view class="annexList" v-if="appendixList.length>0">
					<view class="annexItem" v-for="(item,index) in appendixList" :key="index">
						<view class="annexItemBox">
							<view class="lookAnnex" @click="previewImage(item)">
								附件
							</view>
							<uni-icons type="clear" class="clearAnnex" size="18" color="#b8b8b8" @click="clearAnnex(index)"></uni-icons>
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
				</view>
				<textarea class="recordAddTextArea" @blur="bindTextAreaBlur" auto-height="" placeholder="请输入内容 (200字以内，非必填)" maxlength="200"
				 placeholder-style="font-size:30rpx;color:#cecece" />
			</view>
		</view>
		<view class="recordAddSubBtn">
			<button type="warn" class="subBtn" @click="sub">完成</button>
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
				type:"",
				visitId:"",
				textArea:"",
				appendixList:[],
				imgList:[],
				memo:"",
			}
		},
		onLoad(options) {
			const that = this;
			that.type = options.type;
			that.visitId = options.visitId;
			
		},
		methods: {
			getRate(e){
				const that = this;
				that.rate=e.value
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
						if(size>1024*1024*100){
							uni.showToast({
								title:"文件过大，请小于100M",
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
			previewImage(url) {
				const that = this;
				that.imgList = [];
				that.imgList.push(url);
				uni.previewImage({
					urls: that.imgList,
					current: that.imgList[0]
				});	
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
				that.appendixList.push(data.picUrl);
			},
			sub(){
				const that = this;
				setTimeout(()=>{
					if(that.type==2&&that.appendixList.length==0){
						uni.showToast({
							title:"请上传附件",
							icon:"none"
						})
					}
					else{
						
						uni.showModal({
							content: "提交后将不可再次修改，确认提交？",
							confirmText: "确认提交",
							cancelText: "取消",
							success: function (res) {
								if (res.confirm) {
									that.visitSub();
									
								} else if (res.cancel) {
									
								}	
							}
						});	
						
					}
				},100)
			},
			visitSub(){
				const that = this;
				let interfaceUrl;
				let param;
				if(that.type==1){
					interfaceUrl=that.$api.visitPayDo;//付款标记
					param = {
						visitId: that.visitId,
						memo:that.memo
					}
				}
				else if(that.type==2){
					interfaceUrl=that.$api.visitDiligenceDo;//尽职调查
					var appendixUrls="";
					for(var i in that.appendixList){
						appendixUrls += that.appendixList[i]+","
					}
					appendixUrls = appendixUrls.substring(0,appendixUrls.length-1);
					param = {
						visitId: that.visitId,
						memo:that.memo,
						appendixUrls:appendixUrls
					}
				}
				else if(that.type==3){
					interfaceUrl=that.$api.visitLoanDo;//贷款
					param = {
						visitId: that.visitId,
						memo:that.memo
					}
				}
				else if(that.type==4){
					interfaceUrl=that.$api.visitAuctionDo;//参拍
					param = {
						visitId: that.visitId,
						memo:that.memo
					}
				}
				else if(that.type==5){
					interfaceUrl=that.$api.visitTransferDo;//办理过户
					param = {
						visitId: that.visitId,
						memo:that.memo
					}
				}
				else if(that.type==6){
					interfaceUrl=that.$api.visitreTreatDo;//腾退
					param = {
						visitId: that.visitId,
						memo:that.memo
					}
				}
				else if(that.type==7){
					interfaceUrl=that.$api.visitOverDo;//交房
					param = {
						visitId: that.visitId,
						memo:that.memo
					}
				}
				
				interfaceUrl(param).then(res => {
					if (res.success) {
						uni.showToast({
							title:"提交成功"
						})
						setTimeout(()=>{
							that.$Router.back(1);
						},1000)	
						var pages = getCurrentPages(); //当前页
						var beforePage = pages[pages.length - 2].route; //上个页面
						if(beforePage=="pages/my/manageNavs/process/index"){
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
				if(that.appendixList.length!=0||that.memo!=""){	
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
.recordAddTextArea{
	height: 100rpx;
}
</style>
