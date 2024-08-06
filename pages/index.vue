<template>
	<view class="container">
		<uni-section title="近期打新" type="line">
			<uni-list :border="true">
				<!-- 北交所 -->
				<uni-list-item v-for="bj in bjStgs" :title="bj.SECURITY_NAME_ABBR" :note="bj.SECUCODE"
					:right-text="`申购日：${dayjs(bj.APPLY_DATE).format('MM-DD')}`" badge-text="北" :show-badge="true"
					:badge-style="{backgroundColor: '#cf1322',marginLeft: '6px'}"
					:style="{backgroundColor: '#fff1f0', fontWeight: dayjs(bj.APPLY_DATE).isBefore(todayEnd)? 'bold':'normal' }" />
				<!-- REITs -->
				<uni-list-item v-for="reit in reitStgs" :title="reit.EXPAND_NAME_ABBR"
					:note="reit.APPLY_CODE + ' / ' + reit.ITEMTYPE_NAME"
					:right-text="`发售始：${dayjs(reit.SUBSCRIBE_START_DATE).format('MM-DD')}\n发售止：${dayjs(reit.SUBSCRIBE_END_DATE).format('MM-DD')}`"
					badge-text="R" :show-badge="true" :badge-style="{backgroundColor: '#7cb305',marginLeft: '6px'}"
					:style="{backgroundColor: '#fcffe6', fontWeight: dayjs(reit.SUBSCRIBE_START_DATE).isBefore(todayEnd)? 'bold':'normal' }" />
				<!-- 可转债 -->
				<uni-list-item v-for="bond in bondStgs" :title="`${bond.SECURITY_NAME_ABBR} (${bond.SECURITY_CODE})`"
					:note="`${bond.RATING} / ${bond.SECURITY_SHORT_NAME}(${bond.CONVERT_STOCK_CODE})${isSH(bond.CONVERT_STOCK_CODE)?`\n配售所需：${Math.ceil(1000/bond.FIRST_PER_PREPLACING)} * 0.5 = ${Math.round(500/bond.FIRST_PER_PREPLACING)}`:''}`"
					:right-text="`申购日：${dayjs(bond.PUBLIC_START_DATE).format('MM-DD')}${isSH(bond.CONVERT_STOCK_CODE)?`\n配债日：${dayjs(bond.PUBLIC_START_DATE).add(-1,'d').format('MM-DD')}`:''}`"
					badge-text="债" :show-badge="true" :badge-style="{backgroundColor: '#0958d9',marginLeft: '6px'}"
					:style="{backgroundColor: '#e6f4ff', fontWeight: dayjs(bond.PUBLIC_START_DATE).add(isSH(bond.CONVERT_STOCK_CODE)?-1:0, 'd').isBefore(todayEnd)? 'bold':'normal' }" />
				<!-- 港股 -->
				<uni-list-item v-for="hk in hkStgs" :title="hk.ShortName" :note="hk.Symbol + ' / ' + hk.Industry"
					:right-text="`申购始：${dayjs(hk.Startdate).format('MM-DD')}\n申购止：${dayjs(hk.Enddate).format('MM-DD')}`"
					badge-text="港" :show-badge="true" :badge-style="{backgroundColor: '#fa8c16',marginLeft: '6px'}"
					:style="{backgroundColor: '#fff7e6', fontWeight: dayjs(hk.Startdate).isBefore(todayEnd)? 'bold':'normal' }" />
			</uni-list>
		</uni-section>
		<uni-section title="近期上市" type="line">
			<!-- 北交所 -->
			<uni-list-item v-for="bj in bjOnlines" :title="bj.SECURITY_NAME_ABBR" :note="bj.SECUCODE"
				:right-text="`申购止：${dayjs(bj.APPLY_DATE).format('MM-DD')}\n上市日：${bj.SELECT_LISTING_DATE?dayjs(bj.SELECT_LISTING_DATE).format('MM-DD'):'-'}`"
				badge-text="北" :show-badge="true" :badge-style="{backgroundColor: '#cf1322',marginLeft: '6px'}"
				:style="{backgroundColor: '#fff1f0', fontWeight: dayjs(bj.SELECT_LISTING_DATE).isBefore(todayEnd)? 'bold':'normal' }" />
			<!-- REITs -->
			<uni-list-item v-for="reit in reitOnlines" :title="reit.EXPAND_NAME_ABBR"
				:note="reit.APPLY_CODE + ' / ' + reit.ITEMTYPE_NAME"
				:right-text="`申购止：${dayjs(reit.SUBSCRIBE_END_DATE).format('MM-DD')}\n上市日：${reit.LISTING_DATE?dayjs(reit.LISTING_DATE).format('MM-DD'):'-'}`"
				badge-text="R" :show-badge="true" :badge-style="{backgroundColor: '#7cb305',marginLeft: '6px'}"
				:style="{backgroundColor: '#fcffe6', fontWeight: dayjs(reit.LISTING_DATE).isBefore(todayEnd)? 'bold':'normal' }" />
			<!-- 可转债 -->
			<uni-list-item v-for="bond in bondOnlines" :title="`${bond.SECURITY_NAME_ABBR} (${bond.SECURITY_CODE})`"
				:note="`${bond.RATING} / ${bond.SECURITY_SHORT_NAME}(${bond.CONVERT_STOCK_CODE})${isSH(bond.CONVERT_STOCK_CODE)?`\n配售所需：${Math.ceil(1000/bond.FIRST_PER_PREPLACING)} * 0.6 = ${Math.round(600/bond.FIRST_PER_PREPLACING)}`:''}`"
				:right-text="`申购止：${dayjs(bond.PUBLIC_START_DATE).format('MM-DD')}\n上市日：${bond.LISTING_DATE?dayjs(bond.LISTING_DATE).format('MM-DD'):'-'}`"
				badge-text="债" :show-badge="true" :badge-style="{backgroundColor: '#0958d9',marginLeft: '6px'}"
				:style="{backgroundColor: '#e6f4ff', fontWeight: dayjs(bond.LISTING_DATE).isBefore(todayEnd)? 'bold':'normal' }" />
			<!-- 港股 -->
			<uni-list-item v-for="hk in hkOnlines" :title="hk.ShortName" :note="hk.Symbol + ' / ' + hk.Industry"
				:right-text="`申购止：${dayjs(hk.Enddate).format('MM-DD')}\n上市日：${dayjs(hk.ListedDate).format('MM-DD')}`"
				badge-text="港" :show-badge="true" :badge-style="{backgroundColor: '#fa8c16',marginLeft: '6px'}"
				:style="{backgroundColor: '#fff7e6', fontWeight: dayjs(hk.ListedDate).isBefore(todayEnd)? 'bold':'normal' }" />
		</uni-section>
	</view>
</template>

<script setup>
	import {
		watchEffect,
		ref
	} from 'vue';
	import dayjs from 'dayjs';
	import {
		fetchBeijingStaging,
		fetchBondStaging,
		fetchReitsStaging,
		fetchHkStaging,
	} from './staging/services.js';
	import {
		isSH
	} from '../utils.js';

	const loading = ref(false);
	const yestodayDayjs = dayjs().add(-1, 'day');
	const todayEnd = dayjs().endOf('day');
	const bjStgs = ref([]);
	const bjOnlines = ref([]);
	const reitStgs = ref([]);
	const reitOnlines = ref([]);
	const bondStgs = ref([]);
	const bondOnlines = ref([]);
	const hkStgs = ref([]);
	const hkOnlines = ref([]);

	const fetchData = () => {
		loading.value = true;
		uni.showLoading();
		Promise.all([
			fetchBeijingStaging({
				pageSize: 10
			}).then(res => res.result.data),
			fetchReitsStaging({
				pageSize: 10
			}).then(res => res.result.data),
			fetchBondStaging({
				pageSize: 20
			}).then(res => res.result.data),
			fetchHkStaging().then(res => res.data),
		]).then(arr => {
			const _bjStgs = [];
			const _bjOnlines = [];
			for (const bj of arr[0]) {
				if (!dayjs(bj.APPLY_DATE).isBefore(yestodayDayjs)) {
					_bjStgs.push(bj);
					continue;
				}
				if (!bj.SELECT_LISTING_DATE || !dayjs(bj.SELECT_LISTING_DATE).isBefore(yestodayDayjs)) {
					_bjOnlines.push(bj);
				} else {
					break;
				}
			}
			bjStgs.value = _bjStgs.reverse();
			bjOnlines.value = _bjOnlines.reverse();

			const _reitStgs = [];
			const _reitOnlines = [];
			for (const reit of arr[1]) {
				if (!dayjs(reit.SUBSCRIBE_END_DATE).isBefore(yestodayDayjs)) {
					_reitStgs.push(reit);
					continue;
				}
				if (!reit.LISTING_DATE || !dayjs(reit.LISTING_DATE).isBefore(yestodayDayjs)) {
					_reitOnlines.push(reit);
				} else {
					break;
				}
			}
			reitStgs.value = _reitStgs.reverse();
			reitOnlines.value = _reitOnlines.reverse();

			const _bondStgs = [];
			const _bondOnlines = [];
			for (const bond of arr[2]) {
				if (!dayjs(bond.PUBLIC_START_DATE).isBefore(yestodayDayjs)) {
					_bondStgs.push(bond);
					continue;
				}
				if (!bond.LISTING_DATE || !dayjs(bond.LISTING_DATE).isBefore(yestodayDayjs)) {
					_bondOnlines.push(bond);
				} else {
					break;
				}
			}
			bondStgs.value = _bondStgs.reverse();
			bondOnlines.value = _bondOnlines.reverse();

			const _hkStgs = [];
			const _hkOnlines = [];
			for (const hk of arr[3]) {
				if (!dayjs(hk.Enddate).isBefore(yestodayDayjs)) {
					_hkStgs.push(hk);
					continue;
				}
				if (!hk.ListedDate || !dayjs(hk.ListedDate).isBefore(yestodayDayjs)) {
					_hkOnlines.push(hk);
				} else {
					break;
				}
			}
			hkStgs.value = _hkStgs.reverse();
			hkOnlines.value = _hkOnlines.reverse();
		}).finally(() => {
			loading.value = false;
			uni.hideLoading();
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