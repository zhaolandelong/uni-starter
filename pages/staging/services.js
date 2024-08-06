import {
	jsonp,
	serverRequest
} from '../../utils.js';

const DEFAULT_LIST_QUERY = {
	pageNumber: 1,
	pageSize: 50,
	sortTypes: -1, // -1 desc; 1 asc
	columns: 'ALL',
	client: 'WEB',
	source: 'WEB',
};

const STAGING_QUERY = {
	beijing: {
		sortColumns: 'APPLY_DATE',
		reportName: 'RPT_NEEQ_ISSUEINFO_LIST',
		quoteColumns: 'f14~01~SECURITY_CODE~SECURITY_NAME_ABBR,f2~01~SECURITY_CODE,f3~01~SECURITY_CODE,NEW_CHANGE_RATE~01~SECURITY_CODE',
		quoteType: '0',
		source: 'NEEQSELECT',
	},
	stock: {
		sortColumns: 'APPLY_DATE,SECURITY_CODE',
		sortTypes: '-1,-1',
		reportName: 'RPTA_APP_IPOAPPLY',
		columns: 'SECURITY_CODE,SECURITY_NAME,TRADE_MARKET_CODE,APPLY_CODE,TRADE_MARKET,MARKET_TYPE,ORG_TYPE,ISSUE_NUM,ONLINE_ISSUE_NUM,OFFLINE_PLACING_NUM,TOP_APPLY_MARKETCAP,PREDICT_ONFUND_UPPER,ONLINE_APPLY_UPPER,PREDICT_ONAPPLY_UPPER,ISSUE_PRICE,LATELY_PRICE,CLOSE_PRICE,APPLY_DATE,BALLOT_NUM_DATE,BALLOT_PAY_DATE,LISTING_DATE,AFTER_ISSUE_PE,ONLINE_ISSUE_LWR,INITIAL_MULTIPLE,INDUSTRY_PE_NEW,OFFLINE_EP_OBJECT,CONTINUOUS_1WORD_NUM,TOTAL_CHANGE,PROFIT,LIMIT_UP_PRICE,INFO_CODE,OPEN_PRICE,LD_OPEN_PREMIUM,LD_CLOSE_CHANGE,TURNOVERRATE,LD_HIGH_CHANG,LD_AVERAGE_PRICE,OPEN_DATE,OPEN_AVERAGE_PRICE,PREDICT_PE,PREDICT_ISSUE_PRICE2,PREDICT_ISSUE_PRICE,PREDICT_ISSUE_PRICE1,PREDICT_ISSUE_PE,PREDICT_PE_THREE,ONLINE_APPLY_PRICE,MAIN_BUSINESS,PAGE_PREDICT_PRICE1,PAGE_PREDICT_PRICE2,PAGE_PREDICT_PRICE3,PAGE_PREDICT_PE1,PAGE_PREDICT_PE2,PAGE_PREDICT_PE3,SELECT_LISTING_DATE,IS_BEIJING,INDUSTRY_PE_RATIO,INDUSTRY_PE,IS_REGISTRATION',
		quoteColumns: 'f2~01~SECURITY_CODE~NEWEST_PRICE',
		quoteType: '0',
		filter: "(APPLY_DATE>'2010-01-01')",
	},
	bond: {
		sortColumns: 'PUBLIC_START_DATE',
		reportName: 'RPT_BOND_CB_LIST',
		quoteColumns: 'f2~01~CONVERT_STOCK_CODE~CONVERT_STOCK_PRICE,f235~10~SECURITY_CODE~TRANSFER_PRICE,f236~10~SECURITY_CODE~TRANSFER_VALUE,f2~10~SECURITY_CODE~CURRENT_BOND_PRICE,f237~10~SECURITY_CODE~TRANSFER_PREMIUM_RATIO,f239~10~SECURITY_CODE~RESALE_TRIG_PRICE,f240~10~SECURITY_CODE~REDEEM_TRIG_PRICE,f23~01~CONVERT_STOCK_CODE~PBV_RATIO',
		quoteType: '0',
	},
	reits: {
		sortColumns: 'SUBSCRIBE_START_DATE',
		reportName: 'RPT_CUSTOM_REITS_APPLY_LIST_MARKET',
		quoteColumns: 'f14~09~SECURITY_CODE~LTD_SECURITY_NAME,f2~09~SECURITY_CODE~f2,NEW_DISCOUNT_RATIO~09~SECURITY_CODE,NEW_CHANGE_RATE~09~SECURITY_CODE,NEW_DIVIDEND_RATE_TTM~09~SECURITY_CODE',
	},
};

const objectToQueryString = (obj) => Object.keys(obj)
	.map(key => {
		const encodedKey = encodeURIComponent(key);
		const encodedValue = encodeURIComponent(obj[key]);
		return `${encodedKey}=${encodedValue}`;
	})
	.join('&');

export const fetchBeijingStaging = (params) => jsonp(`https://datacenter-web.eastmoney.com/api/data/v1/get?${objectToQueryString(
	Object.assign({}, DEFAULT_LIST_QUERY, STAGING_QUERY.beijing, params)
)}`);

export const fetchReitsStaging = (params) => jsonp(`https://datacenter-web.eastmoney.com/api/data/v1/get?${objectToQueryString(
	Object.assign({}, DEFAULT_LIST_QUERY, STAGING_QUERY.reits, params)
)}`);

export const fetchBondStaging = (params) => jsonp(`https://datacenter-web.eastmoney.com/api/data/v1/get?${objectToQueryString(
	Object.assign({}, DEFAULT_LIST_QUERY, STAGING_QUERY.bond, params)
)}`);

export const fetchHkStaging = (params) => serverRequest('https://ft.iqdii.com/views/eipo/eipo_pc?style=w&Lan=CN').then(
	res => {
		return JSON.parse(decodeURIComponent(res.data.match(/var strmes = '(.+)';/)[1]).replace(/\n/g, ''));
	});