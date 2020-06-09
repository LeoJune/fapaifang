import base from './base'; // 导入接口域名列表
import request from '@/common/request.js'; // 导入request实例
import qs from 'qs';
const api = {}
//#########################登录注册###########################//
api.login = params => request.globalRequest(`${base.default}/api/auth/login`, 'POST', params); // 登录
api.bymobile = params => request.globalRequest(`${base.default}/api/register/bymobile`, 'POST', params); //注册
api.isphonecanuse = params => request.globalRequest(`${base.default}/api/register/isphonecanuse`, 'POST', params); //校验手机号
api.sendvcode = params => request.globalRequest(`${base.default}/api/mobile/sendvcode`, 'POST', params); //发送验证码
api.updatepassword = params => request.globalRequest(`${base.default}/api/password/update`, 'POST', params); //修改密码


//#########################个人信息###########################//
api.userinfoQuery = params => request.globalRequest(`${base.default}/api/v/userinfo/query`, 'POST', params); //查询用户基本信息
api.userinfoUpdate = params => request.globalRequest(`${base.default}/api/v/userinfo/update`, 'POST', params); //修改用户基本信息
api.queryjiumenu = params => request.globalRequest(`${base.default}/api/m/employee/queryjiumenu`, 'POST', params); //用户九宫格菜单
api.userinfoByid = params => request.globalRequest(`${base.default}/api/v/userinfo/byid`, 'POST', params); //查询其他用户基本信息

//#########################管理菜单###########################//
api.dailyList = params => request.globalRequest(`${base.default}/api/m/employee/daily/querylist`, 'POST', params); //日志列表
api.dailyAdd = params => request.globalRequest(`${base.default}/api/m/employee/daily`, 'POST', params); //写日志
api.dailyDetail = params => request.globalRequest(`${base.default}/api/m/employee/daily/detail`, 'POST', params); //日志详情

api.returnvisitList = params => request.globalRequest(`${base.default}/api/m/returnvisit/querylist`, 'POST', params); //回访列表
api.returnvisitAdd = params => request.globalRequest(`${base.default}/api/m/returnvisit/add`, 'POST', params); //新增回访
api.returnvisitDetail = params => request.globalRequest(`${base.default}/api/m/returnvisit/detail`, 'POST', params); //回访详情

api.contractList = params => request.globalRequest(`${base.default}/api/m/contract/search`, 'POST', params); //合同列表
api.contractDetail = params => request.globalRequest(`${base.default}/api/m/contract/detail`, 'POST', params); //合同详情
api.contractAdd = params => request.globalRequest(`${base.default}/api/m/contract/add`, 'POST', params); //新增合同

api.appuserSearch = params => request.globalRequest(`${base.default}/api/m/appuser/search`, 'POST', params); //搜索用户
api.housevisitList = params => request.globalRequest(`${base.default}/api/m/housevisit/search`, 'POST', params); //看房列表

api.housepayList = params => request.globalRequest(`${base.default}/api/m/housevisit/pay/query`, 'POST', params); //付款标记
api.housepayDetail = params => request.globalRequest(`${base.default}/api/m/housevisit/pay/detail`, 'POST', params); //付款标记详情

api.diligenceList = params => request.globalRequest(`${base.default}/api/m/housevisit/diligence/query`, 'POST', params); //尽职调查
api.diligenceDetail = params => request.globalRequest(`${base.default}/api/m/housevisit/diligence/detail`, 'POST', params); //尽职调查详情

api.loanList = params => request.globalRequest(`${base.default}/api/m/housevisit/loan/query`, 'POST', params); //贷款
api.loanDetail = params => request.globalRequest(`${base.default}/api/m/housevisit/loan/detail`, 'POST', params); //贷款详情

api.auctionList = params => request.globalRequest(`${base.default}/api/m/housevisit/auction/query`, 'POST', params); //参拍
api.auctionDetail = params => request.globalRequest(`${base.default}/api/m/housevisit/auction/detail`, 'POST', params); //参拍详情

api.transferList = params => request.globalRequest(`${base.default}/api/m/housevisit/transfer/query`, 'POST', params); //办理过户
api.transferDetail = params => request.globalRequest(`${base.default}/api/m/housevisit/transfer/detail`, 'POST', params); //办理过户详情

api.retreatList = params => request.globalRequest(`${base.default}/api/m/housevisit/retreat/query`, 'POST', params); //腾退
api.retreatDetail = params => request.globalRequest(`${base.default}/api/m/housevisit/retreat/detail`, 'POST', params); //腾退详情

api.overList = params => request.globalRequest(`${base.default}/api/m/housevisit/over/query`, 'POST', params); //交房
api.overDetail = params => request.globalRequest(`${base.default}/api/m/housevisit/over/detail`, 'POST', params); //交房详情

api.noticeListC = params => request.globalRequest(`${base.default}/api/notice/search`, 'POST', params); //公告
api.noticeListB = params => request.globalRequest(`${base.default}/api/m/notice/search`, 'POST', params); //公告(管理端)
api.noticeDetail = params => request.globalRequest(`${base.default}/api/notice/querybyid`, 'POST', params); //公告详情
api.noticeAdd = params => request.globalRequest(`${base.default}/api/m/notice/add`, 'POST', params); //新增公告
api.noticeDelete = params => request.globalRequest(`${base.default}/api/m/notice/deletebyid`, 'POST', params); //删除公告
api.noticeUpdate = params => request.globalRequest(`${base.default}/api/m/notice/update`, 'POST', params); //编辑公告
api.noticeHasunread = params => request.globalRequest(`${base.default}/api/notice/hasunread`, 'POST', params); //判断是否有未读公告

api.employeeList = params => request.globalRequest(`${base.default}/manage/employee/search`, 'POST', params); //员工列表
api.employeeAdd = params => request.globalRequest(`${base.default}/manage/employee/add`, 'POST', params); //新增员工
api.employeeDelete = params => request.globalRequest(`${base.default}/manage/employee/delete`, 'POST', params); //删除员工
api.employeeDetail = params => request.globalRequest(`${base.default}/api/m/employee/detail`, 'POST', params); //员工详情
api.employeeUpdate = params => request.globalRequest(`${base.default}/manage/employee/update`, 'POST', params); //修改员工信息

api.housevisitDetail = params => request.globalRequest(`${base.default}/api/m/housevisit/querybyid`, 'POST', params); //流程详情
api.housevisitDetailBycontractid = params => request.globalRequest(`${base.default}/api/m/housevisit/querybycontractid `, 'POST', params); //流程详情（通过合同查询）
api.housevisitDailyList = params => request.globalRequest(`${base.default}/api/m/employee/daily/querybyvisitid`, 'POST', params); //流程详情日志列表
api.housevisitReturnList = params => request.globalRequest(`${base.default}/api/v/returnvisit/search`, 'POST', params); //流程详情回访列表
api.housevisitcontract = params => request.globalRequest(`${base.default}/api/m/contract/detailbyvisitid`, 'POST', params); //流程详情中合同
api.visitPayDo = params => request.globalRequest(`${base.default}/api/m/housevisit/pay`, 'POST', params); //流程详情-付款标记打钩
api.visitDiligenceDo = params => request.globalRequest(`${base.default}/api/m/housevisit/diligence`, 'POST', params); //流程详情-尽职调查打钩
api.visitLoanDo = params => request.globalRequest(`${base.default}/api/m/housevisit/loan`, 'POST', params); //流程详情-贷款打钩
api.visitAuctionDo = params => request.globalRequest(`${base.default}/api/m/housevisit/auction`, 'POST', params); //流程详情-参拍打钩
api.visitTransferDo = params => request.globalRequest(`${base.default}/api/m/housevisit/transfer`, 'POST', params); //流程详情-办理过户打钩
api.visitreTreatDo = params => request.globalRequest(`${base.default}/api/v/returnvisit/retreat`, 'POST', params); //流程详情-腾退打钩
api.visitOverDo = params => request.globalRequest(`${base.default}/api/v/returnvisit/over`, 'POST', params); //流程详情-交房打钩

api.quotaexchange = params => request.globalRequest(`${base.default}/api/m/diamond/quotaexchange`, 'POST', params); //用钻换取名额
api.noofoneneed = params => request.globalRequest(`${base.default}/manage/diamond/noofoneneed`, 'POST', params); //一个名额多少钻
api.availableqty = params => request.globalRequest(`${base.default}/manage/diamond/availableqty`, 'POST', params); //钻余额
api.exchangelogs = params => request.globalRequest(`${base.default}/api/m/diamond/exchangelogs`, 'POST', params); //查询钻兑换明细
api.availableqtybyempid = params => request.globalRequest(`${base.default}/api/m/diamond/availableqtybyempid`, 'POST', params); //查询钻兑换明细
api.givediamond = params => request.globalRequest(`${base.default}/manage/diamond/give`, 'POST', params); //分配钻
api.givelogs = params => request.globalRequest(`${base.default}/api/m/diamond/givelogs`, 'POST', params); //分配钻明细

api.checkpermission = params => request.globalRequest(`${base.default}/api/m/employee/checkpermission`, 'POST', params); //权限相关

api.salereport = params => request.globalRequest(`${base.default}/api/m/emp/salereport`, 'POST', params); //员工成交排行
api.bindreport = params => request.globalRequest(`${base.default}/api/m/appuser/bindreport`, 'POST', params); //推荐客户排行
api.transactionstatistics = params => request.globalRequest(`${base.default}/api/transactionstatistics/query`, 'POST', params); //成交统计
api.housestatisticscount = params => request.globalRequest(`${base.default}/api/housestatisticscount/query`, 'POST', params); //拍品数量统计
api.housestatisticsamount = params => request.globalRequest(`${base.default}/api/housestatisticsamount/query`, 'POST', params); //拍品金额统计
api.transratiostatistics = params => request.globalRequest(`${base.default}/api/transratiostatistics/query`, 'POST', params); //趋势-折价率统计
api.corptransactionstatistics = params => request.globalRequest(`${base.default}/api/corptransactionstatistics/query`, 'POST', params); //公司成交数量统计


//#########################房源相关###########################//
api.provinceandcity = params => request.globalRequest(`${base.default}/api/provinceandcity/query`, 'POST', params); //省市
api.getProvince = params => request.globalRequest(`${base.default}/api/province/query`, 'POST', params); //省
api.getCity = params => request.globalRequest(`${base.default}/api/city/query`, 'POST', params); //市
api.getCounty = params => request.globalRequest(`${base.default}/api/county/query`, 'POST', params); //区
api.houseList = params => request.globalRequest(`${base.default}/api/house/info/pagelist`, 'POST', params); //房源列表页
api.recommendList = params => request.globalRequest(`${base.default}/api/v/house/recommend`, 'POST', params); //推荐房源列表
api.houseSearch = params => request.globalRequest(`${base.default}/api/house/search`, 'POST', params); //房源搜索
api.houseArea = params => request.globalRequest(`${base.default}/api/house/area`, 'POST', params); //区域选房
api.houseDetail = params => request.globalRequest(`${base.default}/manage/house/detail/query`, 'POST', params); //房源详情页
api.houseDetailRecord = params => request.globalRequest(`${base.default}/manage/house/record/query`, 'POST', params); //房源详情页-竞买记录
api.dealdoneList = params => request.globalRequest(`${base.default}/api/house/dealdone`, 'POST', params); //同区域成交
api.collectState = params => request.globalRequest(`${base.default}/api/v/house/collect/state`, 'POST', params); //是否收藏
api.houseLeaks = params => request.globalRequest(`${base.default}/api/house/leaks`, 'POST', params); //捡漏必看
api.houseCollect = params => request.globalRequest(`${base.default}/api/v/house/collect/do`, 'POST', params); //房源收藏
api.collectList = params => request.globalRequest(`${base.default}/api/v/house/collect/pagelist`, 'POST', params); //我的收藏
api.browsesAdd = params => request.globalRequest(`${base.default}/api/v/house/browses/add`, 'POST', params); //新增浏览记录
api.browsesList = params => request.globalRequest(`${base.default}/api/v/house/browses/search`, 'POST', params); //浏览记录
api.querynotice = params => request.globalRequest(`${base.default}/api/house/detail/querynotice`, 'POST', params); //竞买须知
api.queryannouncement = params => request.globalRequest(`${base.default}/api/house/detail/queryannouncement`, 'POST', params); //竞买公告
api.queryproductdescription = params => request.globalRequest(`${base.default}/api/house/detail/queryproductdescription`, 'POST', params); //标的物详情



//#########################咨询相关###########################//
api.chatGetcsinfo = params => request.globalRequest(`${base.default}/api/v/chat/getcsinfo`, 'POST', params); //咨询时获取顾问信息
api.mychatList = params => request.globalRequest(`${base.default}/api/v/mychat/list`, 'POST', params); //查询我的咨询列表-主列表
api.chatHistory = params => request.globalRequest(`${base.default}/api/v/chat/history`, 'POST', params); //查询咨询历史记录

//上传
api.filesUpload = `${base.default}/api/files/upload`;






export default api;
// const that = this;
// let param = {
// 	paimaiId: paimaiId,
// 	houseSource: houseSource
// }
// that.$api.houseDetail(param).then(res => {
// 	if (res.success) {

// 	} else {
// 		uni.showToast({
// 			title: res.message,
// 			icon: "none"
// 		})
// 	}
// })
