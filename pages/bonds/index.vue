<template>
	<view class="container">
		<uni-table stripe emptyText="暂无更多数据" :loading="loading">
			<uni-tr>
				<uni-th width="70">可转债</uni-th>
				<uni-th align="center" width="60">现价<br />正股PB</uni-th>
				<uni-th align="center" width="80">总市值<br />评级</uni-th>
				<uni-th align="center" width="80">剩余年限<br />剩余规模</uni-th>
				<uni-th align="center" width="80">行业</uni-th>
				<uni-th align="center" width="80">回售价<br />到期收益</uni-th>
				<uni-th align="center">负债率</uni-th>
			</uni-tr>
			<uni-tr v-for="(item, index) in records" :key="index">
				<uni-td>{{item.bond_nm}}<br />{{item.bond_id}}</uni-td>
				<uni-td align="center">{{item.price}}<br />{{item.pb}}</uni-td>
				<uni-td align="center">{{item.market_value}}亿<br />{{item.rating_cd}}</uni-td>
				<uni-td align="center">{{item.year_left}}年<br />{{item.curr_iss_amt}}亿</uni-td>
				<uni-td align="center">{{item.industry}}</uni-td>
				<uni-td align="center">{{item.put_convert_price}}<br />{{item.ytm_rt}}%</uni-td>
				<uni-td align="center">{{item.debt}}%</uni-td>
			</uni-tr>
		</uni-table>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue';
	import {
		fetchJisiluListAndHandleCookie,
		fetchJisiluStock,
	} from './services.js';
	import dayjs from 'dayjs';

	const records = ref([]);
	const loading = ref(false);

	onMounted(() => {
		loading.value = true;
		fetchJisiluListAndHandleCookie().then(async bonds => {
			// TODO: 股票质押率
			const result = [];
			const filteredBondDatas = bonds.filter(bond => bond.volume > 0 &&
				bond.price > 0 && bond.price < 120 && bond.pb > 1.5 && ['A+', 'AA-', 'AA', 'AA+',
					'AAA'
				].includes(bond.rating_cd) && !['R', 'O'].includes(bond
					.redeem_icon) && bond.put_convert_price !== '' && bond.year_left >
				1.5 && bond.curr_iss_amt > 0.5 && bond.ytm_rt > 0
			);

			const storageKey = `local-storage=${dayjs().format('YYYYMMDD')}`;
			let stockDatas;
			const storageData = uni.getStorageSync(storageKey);
			if (storageData) {
				stockDatas = storageData;
			} else {
				stockDatas = await fetchJisiluStock(filteredBondDatas.map(bond => bond.stock_id));
				uni.setStorageSync(storageKey, stockDatas);
			}

			stockDatas.forEach((stock, i) => {
				const {
					industry,
					market_value,
					debt,
				} = stock;
				if (market_value < 250 && debt > 0 && debt < 70) {
					result.push({
						...stock,
						...filteredBondDatas[i],
					})
				}
			});
			records.value = result;
		}).finally(() => {
			loading.value = false;
		})
	})
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
			}
		}
	}
</style>