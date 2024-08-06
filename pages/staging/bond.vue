<template>
	<view class="container">
		<uni-table stripe emptyText="暂无更多数据" :loading="loading">
			<uni-tr>
				<uni-th align="center" width="70">名称代码</uni-th>
				<uni-th align="center" width="70">申购日期<br />发布日期</uni-th>
				<uni-th align="center" width="60">中签率<br />(十万分之)</uni-th>
				<uni-th align="center" width="70">上市日期<br />信用评级</uni-th>
				<uni-th align="center" width="70">正股简称<br />正股代码</uni-th>
			</uni-tr>
			<uni-tr v-for="(info, index) in infos" :key="index">
				<uni-td align="center">{{info.SECURITY_NAME_ABBR}}<br />{{info.SECURITY_CODE}}</uni-td>
				<uni-td align="center">
					{{info.PUBLIC_START_DATE?dayjs(info.PUBLIC_START_DATE).format('MM-DD'):'-'}}
					<br />
					{{info.BOND_START_DATE?dayjs(info.BOND_START_DATE).format('MM-DD'):'-'}}
				</uni-td>
				<uni-td align="center">
					{{typeof info.ONLINE_GENERAL_LWR === 'number'?`${(info.ONLINE_GENERAL_LWR*1000).toFixed(2)}%‰`: '-'}}
				</uni-td>
				<uni-td align="center">
					{{info.LISTING_DATE?dayjs(info.LISTING_DATE).format('MM-DD'):'-'}}
					<br />
					{{info.RATING}}
				</uni-td>
				<uni-td align="center">{{info.SECURITY_SHORT_NAME}}<br />{{info.CONVERT_STOCK_CODE}}</uni-td>
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
		fetchBondStaging
	} from './services.js'

	const infos = ref([]);
	const loading = ref(false);
	const pageNumber = ref(1);
	const pageSize = 20;
	const total = ref(0);

	const fetchData = (pageNumber) => {
		loading.value = true;
		fetchBondStaging({
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