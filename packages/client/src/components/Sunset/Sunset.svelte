<script lang="ts">
	import { getTimes, getPosition } from "suncalc";
	import dayjs from "dayjs";
	import SunsetAnimatedBackground from "./SunsetAnimatedBackground.svelte";
	import { onMount } from "svelte";
	import { networkLocation } from "@common/basicStores";
	import {padStart} from 'lodash-es'

	let timeStr: string = "00:00:00";
	let current = dayjs();
	let message: string = ""

	const times = getTimes(
		new Date(),
		networkLocation.get()?.latitude || 0,
		networkLocation.get()?.longitude || 0
	);

	const sunset = dayjs(times.sunsetStart);
	const sunrise = dayjs(times.sunrise);
	const sunsetPos = getPosition(
		times.sunrise,
		networkLocation.get()?.latitude || 0,
		networkLocation.get()?.longitude || 0
	);
	const sunrisePos = getPosition(
		times.sunsetStart,
		networkLocation.get()?.latitude || 0,
		networkLocation.get()?.longitude || 0
	);


	const currentSunPos = getPosition(
		current.toDate(),
		networkLocation.get()?.latitude || 0,
		networkLocation.get()?.longitude || 0
	);

	onMount(() => {
		const handle = () => {
			current = current.add(1, "second");
			const diffSunset = sunset.diff(current, "second");
			const diffSunrise = sunrise.diff(current, "second");
			const currentAction = diffSunset > diffSunrise ? "sunset" : "sunrise";



			const diff = currentAction === "sunset" ? diffSunset : diffSunrise;


			const seconds = diff % 60;
			const minutes = Math.floor(diff / 60) % 60;
			const hours = Math.floor(diff / 3600) % 24;

			timeStr = `${padStart(hours+"", 2, "0")}:${padStart(minutes+"", 2,"0")}:${padStart(seconds+"", 2, "0")}`;
			message = `${currentAction} in`;
		};
		const intervalId = setInterval(handle, 1000);
		handle();

		return () => {
			clearInterval(intervalId);
		};
	});

	// get x,y from azimuth and altitude
	const getXY = (azimuth: number, altitude: number) => {
		const x = Math.cos(altitude) * Math.cos(azimuth);
		const y = Math.cos(altitude) * Math.sin(azimuth);
		return { x, y };
	};

	const c = getXY(currentSunPos.azimuth, currentSunPos.altitude);
</script>

<div class="relative h-full w-full">
	<SunsetAnimatedBackground sunPos={[c.x, c.y]}/>

	<div
		style="z-index:100000"
		class="absolute inset-0 pointer-events-none w-full flex items-center justify-center"
	>
		<div
			class="rounded-xl mb-64 flex flex-col gap-2 text-center text-base-content bg-opacity-50 bg-base-300 p-5 px-10"
		>
			<span class="">{message}</span>

			<span class="text-5xl">{timeStr}</span>
		</div>
	</div>
</div>
