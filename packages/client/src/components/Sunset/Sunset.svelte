<script lang="ts">
	import { getTimes, getPosition } from "suncalc";
	import dayjs from "dayjs";
	import SunsetAnimatedBackground from "./SunsetAnimatedBackground.svelte";
	import { onMount } from "svelte";
	import { networkLocation } from "@common/basicStores";

	let timeStr: string = "00:00:00";
	let current = dayjs();

	const times = getTimes(
		new Date(),
		networkLocation.get()?.latitude || 0,
		networkLocation.get()?.longitude || 0
	);

	const sunset = dayjs(times.sunset);
	const sunrise = dayjs(times.sunrise);
	const sunsetPos = getPosition(
		times.sunrise,
		networkLocation.get()?.latitude || 0,
		networkLocation.get()?.longitude || 0
	);

	onMount(() => {
		const handle = () => {
			current = current.add(1, "second");
			const diff = sunset.diff(current, "second");

			const seconds = diff % 60;
			const minutes = Math.floor(diff / 60) % 60;
			const hours = Math.floor(diff / 3600) % 24;

			timeStr = `${hours}:${minutes}:${seconds}`;
		};
		const intervalId = setInterval(handle, 1000);
		handle();

		return () => {
			clearInterval(intervalId);
		};
	});

	console.log({sunsetPos})
</script>

<div class="relative h-full w-full">
	<SunsetAnimatedBackground />

	<div
		style="z-index:100000"
		class="absolute inset-0 pointer-events-none w-full flex items-center justify-center"
	>
		<div
			class="rounded-xl mb-64 flex flex-col gap-2 text-center text-base-content bg-opacity-50 bg-base-300 p-5 px-10"
		>
			<span class="">Sunset in</span>

			<span class="text-5xl">{timeStr}</span>

			<span>
				azimuth: {sunsetPos.azimuth.toFixed(4)}°, altitude: {sunsetPos.altitude.toFixed(4)}°
			</span>
		</div>
	</div>
</div>
