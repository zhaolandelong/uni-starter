<template>
	<view class="container">
		<uv-tabs :scrollable="false" :list="list" @click="click"></uv-tabs>
		<Beijing v-show="index === 0"></Beijing>
		<Reits v-show="index === 1"></Reits>
		<Bond v-show="index === 2"></Bond>
		<HK v-show="index === 3"></HK>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import Beijing from './beijing.vue';
	import Bond from './bond.vue';
	import Reits from './reits.vue';
	import HK from './hk.vue';

	const index = ref(0);

	const list = [{
		name: '北交所',
	}, {
		name: 'REITs',
	}, {
		name: '可转债'
	}, {
		name: '港股'
	}];
	const click = (item) => {
		index.value = item.index;
	}
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