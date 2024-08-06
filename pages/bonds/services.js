import {
	getOSS,
	putOSS,
	serverRequest,
} from '../../utils.js';

const fetchJisiluCookie = () => uni.request({
	url: 'https://api.zldlwq.top/fetch_jisilu_cookie'
}).then(res => res.data);

const fetchJisiluList = (Cookie) => serverRequest('https://www.jisilu.cn/webapi/cb/list/', {
	headers: {
		Host: 'www.jisilu.cn',
		Referer: 'https://www.jisilu.cn/web/data/cb/list',
		Cookie,
		// Columns: '1,70,2,3,5,6,11,12,14,15,16,29,30,32,34,44,46,47,50,52,53,54,56,57,58,59,60,62,63,67',
		Init: '1',
	}
}, {
	'content-type': 'application/json',
}).then(res => res.data);

const JISILU_COOKIE_FINENAME = 'jisilu-cookie.txt1';

export const fetchJisiluListAndHandleCookie = async () => {
	let cookie = await getOSS(JISILU_COOKIE_FINENAME);
	const {
		data
	} = await fetchJisiluList(cookie || '');
	if (Array.isArray(data) && data.length > 99) {
		return data;
	}
	cookie = await fetchJisiluCookie();
	await putOSS(JISILU_COOKIE_FINENAME, cookie);
	return await fetchJisiluListAndHandleCookie();
}

export const fetchConvertibleBondsByCsv = () => uni.request({
	url: `https://www.qmtptrade.com/kzz/${dayjs().add(-1,'day').format('YYYYMMDD')}.csv`
}).then(res => csv2json(res.data));

export const fetchJisilu = () => uni.request({
	url: 'https://api.zldlwq.top/jisilu_bonds'
}).then(res => res.data);

export const fetchJisiluStock = (codes) =>
	uni.request({
		url: `https://api.zldlwq.top/jisilu_stocks?codes=${codes}`
	}).then(res => res.data);