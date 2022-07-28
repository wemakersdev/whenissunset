<script lang="ts">
	import type {GetTimesResult} from 'suncalc'
	import OverlayModalContainer from './OverlayModalContainer.svelte';
	import dayjs, {type Dayjs} from 'dayjs'
	import {startCase} from 'lodash-es'
	
	export let times: GetTimesResult;

	let currentDate = dayjs();

	$: timesMap = Object.entries(times).map(([key, value]) => {
		const diff = dayjs(value).diff(currentDate, "second");
		if(diff < 0 ){
			return [key, dayjs(value).add(1, "day")];
		}else{
			return [key, dayjs(value)];
		}
	}) as [string, Dayjs][];
</script>

<OverlayModalContainer
	label="All Times"
>
<div class="flex flex-col gap-1">
	{#each timesMap  as [key, item]}
		<div class="flex flex-row bg-base-200 px-4 py-2 rounded-lg">
			<span class="w-1/2">
				{startCase(key)}  
			</span>
			<span class="w-1/2">
				{item.fromNow()}
			</span>
		</div>
	{/each}
</div>
</OverlayModalContainer>