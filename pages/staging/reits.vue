<template>
	<view class="container">
		<uni-table stripe emptyText="暂无更多数据" :loading="loading">
			<uni-tr>
				<uni-th align="center" width="75">名称</uni-th>
				<uni-th align="center" width="60">项目类型</uni-th>
				<uni-th align="center" width="50">代码<br />价格</uni-th>
				<uni-th align="center" width="45">上市日</uni-th>
				<uni-th align="center" width="45">发售始<br />发售止</uni-th>
				<uni-th align="center" width="60">中签率<br />中签所需</uni-th>
				<uni-th align="center" width="60">首日涨幅<br />约合年化</uni-th>
				<uni-th align="center">最新价格<br />累计涨幅</uni-th>
				<!-- <uni-th>业务</uni-th> -->
			</uni-tr>
			<uni-tr v-for="(info, index) in infos" :key="index">
				<uni-td align="center">{{info.EXPAND_NAME_ABBR}}</uni-td>
				<uni-td align="center">{{info.ITEMTYPE_NAME}}</uni-td>
				<uni-td
					align="center">{{info.APPLY_CODE}}<br />{{typeof info.SALE_PRICE === 'number'?`￥${info.SALE_PRICE.toFixed(2)}`:'-'}}</uni-td>
				<uni-td align="center">
					{{info.LISTING_DATE?dayjs(info.LISTING_DATE).format('YYYY-MM-DD'):'-'}}
				</uni-td>
				<uni-td align="center">
					{{dayjs(info.SUBSCRIBE_START_DATE).format('MM-DD')}}
					<br />
					{{dayjs(info.SUBSCRIBE_END_DATE).format('MM-DD')}}
				</uni-td>
				<uni-td align="center">
					{{typeof info.PUBLIC_VSA_RATIO === 'number'?`${info.PUBLIC_VSA_RATIO.toFixed(2)}%`: '-'}}
					<br />
					{{typeof info.NEED_FUND === 'number'?`${(info.NEED_FUND/10000).toFixed(2)}万`: '-'}}
				</uni-td>
				<uni-td align="center">
					{{typeof info.LD_CHANGE_RATE === 'number'?`${info.LD_CHANGE_RATE.toFixed(2)}%`:'-'}}
					<br />
					{{typeof info.LD_YIELD === 'number'?`${info.LD_YIELD.toFixed(2)}%`:'-'}}
				</uni-td>
				<uni-td align="center">
					{{typeof info.f2 === 'number'?`￥${info.f2.toFixed(2)}`:'-'}}
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
		fetchReitsStaging
	} from './services.js'

	const infos = ref([]);
	const loading = ref(false);
	const pageNumber = ref(1);
	const pageSize = 20;
	const total = ref(0);

	const fetchData = (pageNumber) => {
		loading.value = true;
		fetchReitsStaging({
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