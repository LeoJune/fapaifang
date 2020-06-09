const home = [
	{
      path: '/pages/home/index',
      aliasPath:'/',  //对于h5端你必须在首页加上aliasPath并设置为/
      name: 'index',
        meta: {
	        title: '首页',
	    },
    },
	{
	  path: '/pages/home/searchDetail',
	  name: 'searchDetail',
	    meta: {
	        title: '搜索'
	    },
	},
	{
	  path: '/pages/home/goodsDetail',
	  name: 'goodsDetail',
	    meta: {
	        title: '拍品详情页',
			needLogin:true
	    },
	},
	{
	  path: '/pages/home/areaHousing',
	  name: 'areaHousing',
	    meta: {
	        title: '区域选房'
	    },
	},
	{
	  path: '/pages/home/leakHousing',
	  name: 'leakHousing',
	    meta: {
	        title: '捡漏必看',
	    },
	},
	{
	  path: '/pages/home/areaPrice',
	  name: 'areaPrice',
	    meta: {
	        title: '区域均价',
	    },
	},
    {
	    path: '/pages/consultant/index',
        name: 'consultant',
        meta: {
	        title: '咨询',
	    },
	},{
	    path: '/pages/my/index',
        name: 'my',
        meta: {
	        title: '我的',
	    },
	},
]
export default home