import dayjs from 'dayjs';
import {
	csv2json
} from 'json-2-csv';

const parseUrl = (url) => {
	const match = url.match(/^(https?:)?\/\/([^/?#]+)?([^?#]+)?(\?[^#]*)?(#.*)?$/);
	const [, protocol, hostname, pathname, search] = match || [];
	return {
		protocol: protocol || '',
		hostname: hostname || '',
		pathname: pathname || '',
		search: search || ''
	};
}

export const serverRequest = (url, options = {}, responseHeaders) =>
	new Promise((rev, rej) => {
		const {
			protocol,
			hostname,
			pathname,
			search
		} = parseUrl(url);
		const {
			method = 'GET', ...rest
		} = options;
		uni.request({
			url: 'https://api.zldlwq.top/server_request',
			method: 'POST',
			header: {
				'Content-Type': 'application/json'
			},
			data: {
				options: {
					hostname,
					path: pathname + search,
					method,
					...rest
				},
				type: protocol.slice(0, -1),
				responseHeaders,
			},
			success(res) {
				rev(res);
			},
			fail(err) {
				rej(err);
			}
		})
	});

export const jsonp = (url) => {
	const callback = `jsonpCallBack_${Date.now()}`;
	const separator = url.includes('?') ? '&' : '?';
	let promiseResult;
	if (['web', 'h5'].includes(uni.getSystemInfoSync().uniPlatform)) {
		promiseResult = uni.request({
			url: `${url}${separator}callback=${callback}`
		});
	} else {
		promiseResult = serverRequest(`${url}${separator}callback=${callback}`);
	}
	return promiseResult.then(res => JSON.parse(res.data.slice(callback
		.length + 1, -2)));
}

export const putOSS = (filename, content) => uni.request({
	url: 'https://api.zldlwq.top/fetch_oss',
	method: 'PUT',
	data: {
		filename,
		content,
	}
}).then(res => res.data);

export const getOSS = (filename) => uni.request({
	url: `https://api.zldlwq.top/fetch_oss?filename=${filename}`,
}).then(res => {
	if (res.data.code === 0) {
		return res.data.data.content;
	}
	console.error(res.data);
	return undefined;
});

export const isSH = (code) => code.startsWith('60') || code.startsWith('68');