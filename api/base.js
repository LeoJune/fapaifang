/**
 * 接口域名的管理
 */
//
let domainurl = "";
let restPath = "";

if (process.env.NODE_ENV == 'development') {
	domainurl = 'https://mobile.fpw365.cn'
	// #ifdef H5
	domainurl = '/proxy'; //代理跨域 https://mobile.fpw365.cn
	// #endif
	restPath = '';

} else {
	domainurl = 'https://mobile.fpw365.cn'
	restPath = '';
}

const base = {
	default: domainurl,
}

export default base;
