const my = [

	{
		path: '/pages/my/login',
		name: 'login',
		meta: {
			title: '登录',
		},
	},
	{
		path: '/pages/my/register',
		name: 'register',
		meta: {
			title: '注册',
		},
	},
	{
		path: '/pages/my/setPassword',
		name: 'setPassword',
		meta: {
			title: '注册2',
		},
	},
	{
		path: '/pages/my/forgetpwd',
		name: 'forgetpwd',
		meta: {
			title: '忘记密码',
		},
	},
	{
		path: '/pages/my/forgetpwd2',
		name: 'forgetpwd2',
		meta: {
			title: '忘记密码2',
		},
	},
	{
		path: '/pages/my/selfPage',
		name: 'selfPage',
		meta: {
			title: '个人主页',
			needLogin:true
		},
	},
	{
		path: '/pages/my/edit',
		name: 'edit',
		meta: {
			title: '编辑资料',
			needLogin:true
		},
	},
	{
		path: '/pages/my/navs/myCollection',
		name: 'myCollection',
		meta: {
			title: '我的收藏',
			needLogin:true
		},
	},
	{
		path: '/pages/my/navs/history',
		name: 'history',
		meta: {
			title: '最近浏览',
			needLogin:true
		},
	},
	{
		path: '/pages/my/navs/recordTypeC',
		name: 'recordTypeC',
		meta: {
			title: '交易记录',
			needLogin:true
		},
	},
	{
		path: '/pages/my/navs/recordTypeB',
		name: 'recordTypeB',
		meta: {
			title: '交易记录',
			needLogin:true
		},
	},
	{
		path: '/pages/my/navs/feedback',
		name: 'feedback',
		meta: {
			title: '帮助与反馈',
			needLogin:true
		},
	},
	{
		path: '/pages/my/manageNavs/journal/list',
		name: 'journalList',
		meta: {
			title: '日志',
			needLogin:true
		},
	},
	{
		path: '/pages/my/manageNavs/journal/detail',
		name: 'journalDetail',
		meta: {
			title: '日志详情',
			needLogin:true
		},
	},
	{
		path: '/pages/my/manageNavs/journal/add',
		name: 'journalAdd',
		meta: {
			title: '新增日志',
			needLogin:true
		},
	},
	{
		path: '/pages/my/manageNavs/searchCustomer',
		name: 'searchCustomer',
		meta: {
			title: '选择一个客户',
			needLogin:true
		},
	},
	{
		path: '/pages/my/manageNavs/searchHouse',
		name: 'searchHouse',
		meta: {
			title: '选择一个房源',
			needLogin:true
		},
	},
	{
		path: '/pages/my/manageNavs/searchVisit',
		name: 'searchVisit',
		meta: {
			title: '选择客户和房源',
			needLogin:true
		},
	},
	{
		path: '/pages/my/manageNavs/returnVisit/list',
		name: 'returnVisitList',
		meta: {
			title: '回访',
			needLogin:true
		},
	},
	{
		path: '/pages/my/manageNavs/returnVisit/detail',
		name: 'returnVisitDetail',
		meta: {
			title: '回访详情',
			needLogin:true
		},
	},
	{
		path: '/pages/my/manageNavs/returnVisit/add',
		name: 'returnVisitAdd',
		meta: {
			title: '新增回访',
			needLogin:true
		},
	},
	{
		path: '/pages/my/manageNavs/contract/list',
		name: 'contractList',
		meta: {
			title: '合同',
			needLogin:true
		},
	},
	{
		path: '/pages/my/manageNavs/contract/detail',
		name: 'contractDetail',
		meta: {
			title: '合同详情',
			needLogin:true
		},
	},
	{
		path: '/pages/my/manageNavs/contract/add',
		name: 'contractAdd',
		meta: {
			title: '新增合同',
			needLogin:true
		},
	},
	{
		path: '/pages/my/manageNavs/payTag/list',
		name: 'payTagList',
		meta: {
			title: '付款标记',
			needLogin:true
		},
	},
	{
		path: '/pages/my/manageNavs/payTag/detail',
		name: 'payTagDetail',
		meta: {
			title: '付款标记详情',
			needLogin:true
		},
	},
	{
		path: '/pages/my/manageNavs/inquire/list',
		name: 'inquireList',
		meta: {
			title: '尽职调查',
			needLogin:true
		},
	},
	{
		path: '/pages/my/manageNavs/inquire/detail',
		name: 'inquireDetail',
		meta: {
			title: '尽职调查详情',
			needLogin:true
		},
	},
	{
		path: '/pages/my/manageNavs/loan/list',
		name: 'loanList',
		meta: {
			title: '贷款',
			needLogin:true
		},
	},
	{
		path: '/pages/my/manageNavs/loan/detail',
		name: 'loanDetail',
		meta: {
			title: '贷款详情',
			needLogin:true
		},
	},
	{
		path: '/pages/my/manageNavs/hasJoin/list',
		name: 'hasJoinList',
		meta: {
			title: '参拍',
			needLogin:true
		},
	},
	{
		path: '/pages/my/manageNavs/hasJoin/detail',
		name: 'hasJoinDetail',
		meta: {
			title: '参拍详情页',
			needLogin:true
		},
	},
	{
		path: '/pages/my/manageNavs/transfer/list',
		name: 'transferList',
		meta: {
			title: '办理过户',
			needLogin:true
		},
	},
	{
		path: '/pages/my/manageNavs/transfer/detail',
		name: 'transferDetail',
		meta: {
			title: '办理过户详情页',
			needLogin:true
		},
	},
	{
		path: '/pages/my/manageNavs/vacate/list',
		name: 'vacateList',
		meta: {
			title: '腾退',
			needLogin:true
		},
	},
	{
		path: '/pages/my/manageNavs/vacate/detail',
		name: 'vacateDetail',
		meta: {
			title: '腾退详情页',
			needLogin:true
		},
	},
	{
		path: '/pages/my/manageNavs/handed/list',
		name: 'handedList',
		meta: {
			title: '交房',
			needLogin:true
		},
	},
	{
		path: '/pages/my/manageNavs/handed/detail',
		name: 'handedDetail',
		meta: {
			title: '交房详情页',
			needLogin:true
		},
	},
	{
		path: '/pages/my/manageNavs/notice/list',
		name: 'noticeList',
		meta: {
			title: '公告',
			needLogin:true
		},
	},
	{
		path: '/pages/my/manageNavs/notice/listC',
		name: 'noticeListC',
		meta: {
			title: '公告',
			needLogin:true
		},
	},
	{
		path: '/pages/my/manageNavs/notice/detail',
		name: 'noticeDetail',
		meta: {
			title: '公告详情',
			needLogin:true
		},
	},
	{
		path: '/pages/my/manageNavs/notice/add',
		name: 'noticeAdd',
		meta: {
			title: '发布公告',
			needLogin:true
		},
	},
	{
		path: '/pages/my/manageNavs/notice/edit',
		name: 'noticeEdit',
		meta: {
			title: '公告编辑',
			needLogin:true
		},
	},
	{
		path: '/pages/my/manageNavs/staff/list',
		name: 'staffList',
		meta: {
			title: '员工',
			needLogin:true
		},
	},
	{
		path: '/pages/my/manageNavs/staff/detail',
		name: 'staffDetail',
		meta: {
			title: '员工详情',
			needLogin:true
		},
	},
	{
		path: '/pages/my/manageNavs/staff/edit',
		name: 'staffEdit',
		meta: {
			title: '编辑资料',
			needLogin:true
		},
	},
	{
		path: '/pages/my/manageNavs/staff/add',
		name: 'staffAdd',
		meta: {
			title: '新增员工',
			needLogin:true
		},
	},
	{
		path: '/pages/my/manageNavs/staff/distribution',
		name: 'distribution',
		meta: {
			title: '分配钻值',
			needLogin:true
		},
	},
	{
		path: '/pages/my/manageNavs/staff/detailed',
		name: 'staffDetailed',
		meta: {
			title: '激励明细',
			needLogin:true
		},
	},
	{
		path: '/pages/my/manageNavs/exchange/index',
		name: 'exchangeIndex',
		meta: {
			title: '兑换名额',
			needLogin:true
		},
	},
	{
		path: '/pages/my/manageNavs/exchange/detailed',
		name: 'exchangeDetailed',
		meta: {
			title: '兑换明细',
			needLogin:true
		},
	},
	{
		path: '/pages/my/manageNavs/process/index',
		name: 'processIndex',
		meta: {
			title: '流程明细',
			needLogin:true
		},
	},
	{
		path: '/pages/my/manageNavs/process/allDaily',
		name: 'allDaily',
		meta: {
			title: '全部日志',
			needLogin:true
		},
	},
	{
		path: '/pages/my/manageNavs/process/allReturn',
		name: 'allReturn',
		meta: {
			title: '全部回访',
			needLogin:true
		},
	},
	{
		path: '/pages/my/manageNavs/process/operate',
		name: 'processOperate',
		meta: {
			title: '操作确认',
			needLogin:true
		},
	},
	{
		path: '/pages/consultant/charRoom',
		name: 'charRoom',
		meta: {
			title: '聊天',
			needLogin:true
		},
	},
	{
		path: '/pages/my/otherSelfPage',
		name: 'otherSelfPage',
		meta: {
			title: '个人主页',
			needLogin:true
		},
	},
	{
		path: '/pages/my/agreement/agreement1',
		name: 'agreement1',
		meta: {
			title: '服务协议'
		},
	},
	{
		path: '/pages/my/agreement/agreement2',
		name: 'agreement2',
		meta: {
			title: '隐私协议'
		},
	},
	{
		path: '/pages/my/statisticsEmy',
		name: 'statisticsEmy',
		meta: {
			title: '员工成交排行'
		},
	},
	{
		path: '/pages/my/statisticsCus',
		name: 'statisticsCus',
		meta: {
			title: '推荐客户排行'
		},
	}
]
export default my
