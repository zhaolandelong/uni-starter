<template>
	<view class="container">
		<uni-table stripe emptyText="暂无更多数据" :loading="loading">
			<uni-tr>
				<uni-th align="center" width="80">名称代码</uni-th>
				<uni-th align="center" width="80">申购价<br />行业</uni-th>
				<uni-th align="center" width="70">申购起止日期</uni-th>
				<uni-th align="center" width="70">上市日期</uni-th>
			</uni-tr>
			<uni-tr v-for="(info, index) in infos" :key="index">
				<uni-td align="center">{{info.ShortName}}<br />{{info.Symbol}}</uni-td>
				<uni-td align="center">
					{{info.Price.replace('—','~')}}
					<br />
					{{info.Industry}}
				</uni-td>
				<uni-td align="center">
					{{info.Startdate?dayjs(info.Startdate).format('MM-DD'):'-'}}
					<br />
					{{info.Enddate?dayjs(info.Enddate).format('MM-DD'):'-'}}
				</uni-td>
				<uni-td align="center">
					{{info.ListedDate?dayjs(info.ListedDate).format('MM-DD'):'-'}}
				</uni-td>
			</uni-tr>
		</uni-table>
	</view>
</template>

<script setup>
	import {
		watchEffect,
		ref
	} from 'vue';
	import dayjs from 'dayjs';
	import {
		fetchHkStaging
	} from './services.js'

	const infos = ref([]);
	const loading = ref(false);

	const fetchData = () => {
		loading.value = true;
		fetchHkStaging()
			.then((res) => {
				infos.value = res.data;
			})
			.finally(() => {
				loading.value = false;
			});
	}

	watchEffect(() => {
		fetchData();
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