<template>
	<view class="container">
		<uni-table stripe emptyText="暂无更多数据" :loading="loading">
			<uni-tr>
				<uni-th align="center" width="65">名称代码</uni-th>
				<uni-th align="center" width="60">申购日期<br />发行价格</uni-th>
				<uni-th align="center" width="75">中签率<br />中签所需</uni-th>
				<uni-th align="center" width="60">上市日期<br />首日涨幅</uni-th>
				<uni-th align="center" width="90">百股获利<br />约合年化</uni-th>
				<uni-th align="center">最新价格<br />累计涨幅</uni-th>
				<!-- <uni-th>业务</uni-th> -->
			</uni-tr>
			<uni-tr v-for="(info, index) in infos" :key="index">
				<uni-td align="center">{{info.SECURITY_NAME_ABBR}}<br />{{info.SECURITY_CODE}}</uni-td>
				<uni-td align="center">
					{{dayjs(info.APPLY_DATE).format('MM-DD')}}
					<br />
					￥{{info.ISSUE_PRICE.toFixed(2)}}
				</uni-td>
				<uni-td align="center">
					{{typeof info.ONLINE_ISSUE_LWR === 'number'?`${info.ONLINE_ISSUE_LWR.toFixed(2)}%`: '-'}}
					<br />
					{{typeof info.APPLY_AMT_100 === 'number'?`${(info.APPLY_AMT_100 / 10000).toFixed(2)}万`: '-'}}
				</uni-td>
				<uni-td align="center">
					{{info.SELECT_LISTING_DATE?dayjs(info.SELECT_LISTING_DATE).format('MM-DD'):'-'}}
					<br />
					{{typeof info.LD_CLOSE_CHANGE === 'number'?`${info.LD_CLOSE_CHANGE.toFixed(2)}%`:'-'}}
				</uni-td>
				<uni-td align="center">
					{{typeof info.PER_SHARES_INCOME === 'number'?`￥${info.PER_SHARES_INCOME.toFixed(2)}`:'-'}}
					<br />
					{{typeof info.CAPTURE_PROFIT === 'number'?`${info.CAPTURE_PROFIT.toFixed(2)}%`:'-'}}
				</uni-td>
				<uni-td align="center">
					{{typeof info.NEWEST_PRICE === 'number'?`￥${info.NEWEST_PRICE.toFixed(2)}`:'-'}}
					<br />
					{{typeof info.NEW_CHANGE_RATE === 'number'?`${info.NEW_CHANGE_RATE.toFixed(2)}%`:'-'}}
				</uni-td>
				<!-- <uni-td>{{info.MAIN_BUSINESS}}</uni-td> -->
			</uni-tr>
		</uni-table>
		<uni-pagination :show-icon="true" :total="total" v-model="pageNumber" :page-size="pageSize" />
	</view>
</template>

<script setup>
	import {
		watchEffect,
		ref
	} from 'vue';
	import dayjs from 'dayjs';
	import {
		fetchBeijingStaging
	} from './services.js'

	const infos = ref([]);
	const loading = ref(false);
	const pageNumber = ref(1);
	const pageSize = 20;
	const total = ref(0);

	const fetchData = (pageNumber) => {
		loading.value = true;
		fetchBeijingStaging({
				// filter: `(APPLY_DATE>='${dayjs()
				//     .add(-90, 'days')
				//     .format('YYYY-MM-DD')}')`,
				pageNumber,
				pageSize
			})
			.then((res) => {
				infos.value = res.result.data;
				total.value = res.result.count;
			})
			.finally(() => {
				loading.value = false;
			});
	}

	watchEffect(() => {
		fetchData(pageNumber.value);
	});
</script>

<style lang="less">
	.container {
		padding: 0;
		font-size: 12px;
		line-height: 18px;

		.uni-table {

			&-th,
			&-td {
				font-size: 12px;
				font-weight: 400;
				vertical-align: middle;
				padding: 4px;
			}
		}
	}
</style>