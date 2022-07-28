<script lang="ts">
	import { getTimes, getPosition } from "suncalc";
	import dayjs, { Dayjs } from "dayjs";
	import SunsetAnimatedBackground from "./SunsetAnimatedBackground.svelte";
	import { onMount } from "svelte";
	import { networkLocation } from "@common/basicStores";
	import { clamp, padStart, startCase } from "lodash-es";
	import Compass from "@components/Compass/Compass.svelte";
import { openModal } from "@components/Modals/controllers";
	// import { f } from "msw/lib/glossary-297d38ba";

	let timeStr: string = "00:00:00";
	let currentDate = dayjs();
	let nextDate = dayjs().add(1, "day");
	let message: string = "";
	let currentAction: "sunset" | "sunrise" = "sunset";

	let targetSunPos: any;

	$: longitude = +($networkLocation?.longitude || 0);
	$: latitude = +($networkLocation?.latitude || 0);

	$: times = getTimes(currentDate.toDate(), latitude, longitude);

	$: timesNextDate = getTimes(nextDate.toDate(), latitude, longitude);

	$: sunset = dayjs(times.sunsetStart);
	$: sunrise = dayjs(times.sunrise);
	$: sunsetNextDate = dayjs(timesNextDate.sunsetStart);
	$: sunriseNextDate = dayjs(timesNextDate.sunrise);

	$: currentSunPos = getPosition(currentDate.toDate(), latitude, longitude);

	$: timeStr = getTimeString(currentDate);

	$: sunCoordinates = getXYFromAltitude(
		currentSunPos.altitude,
		currentSunPos.azimuth
	);

	onMount(() => {
		const handle = () => {
			currentDate = currentDate.clone().add(1, "second");
		};
		const intervalId = setInterval(handle, 1000);
		handle();
		return () => {
			clearInterval(intervalId);
		};
	});

	const getTimeString = (currentDate: Dayjs) => {
		let diffSunset = sunset.diff(currentDate, "second");
		let diffSunrise = sunrise.diff(currentDate, "second");
		let timeStr = "";
		let t = times;
		if (diffSunrise < 0) {
			t = getTimes(
				currentDate.clone().add(1, "day").toDate(),
				latitude,
				longitude
			);
			const sunrise = dayjs(t.sunrise);
			diffSunrise = sunrise.diff(currentDate, "second");
		}

		if (diffSunset < 0) {
			t = getTimes(
				currentDate.clone().add(1, "day").toDate(),
				latitude,
				longitude
			);
			const sunset = dayjs(t.sunset);
			diffSunset = sunset.diff(currentDate, "second");
		}

		currentAction = diffSunset < diffSunrise ? "sunset" : "sunrise";

		const diff = currentAction === "sunset" ? diffSunset : diffSunrise;

		targetSunPos =
			currentAction === "sunset"
				? getPosition(t.sunset, latitude, longitude)
				: getPosition(t.sunrise, latitude, longitude);

		const seconds = diff % 60;
		const minutes = Math.floor(diff / 60) % 60;
		const hours = Math.floor(diff / 3600) % 24;

		timeStr = `${padStart(hours + "", 2, "0")}:${padStart(
			minutes + "",
			2,
			"0"
		)}:${padStart(seconds + "", 2, "0")}`;
		message = `${currentAction} in`;
		return timeStr;
	};

	const getXYFromAltitude = (altitude: number, azimuth: number) => {
		const windowHeight = window.innerHeight;
		const windowWidth = window.innerWidth;

		const halfWindowHeight = windowHeight / 2;
		const halfWindowWidth = windowWidth / 2;

		const radius = Math.min(halfWindowHeight, halfWindowWidth) * 0.5;

		const altitudeAngle = interpolateAltitudeAngle(altitude);
		const azimuthAngle = interpolateAzimuthAngle(azimuth);

		let x =
			4 * radius * Math.cos(azimuthAngle) * (azimuth < 0 ? -1 : 1) +
			halfWindowWidth;
		let y =
			4 * radius * Math.sin(2 * Math.PI - altitudeAngle) +
			halfWindowHeight *1.5;
		return { x, y };
	};

	const interpolate = (
		[minX, maxX]: [number, number],
		[minY, maxY]: [number, number]
	) => {
		var slope = (maxY - minY) / (maxX - minX);
		return (x: number) => {
			return (x - minX) * slope + minY;
		};
	};

	const interpolateAltitudeAngle = interpolate(
		[-Math.PI / 2, Math.PI / 2],
		[-Math.PI / 2, Math.PI / 2]
	);

	const interpolateAzimuthAngle = interpolate(
		[(-Math.PI * 3) / 4, (Math.PI * 3) / 4],
		[-Math.PI / 2, Math.PI / 2]
	);

	const isDeviceOrientationSupported = (): Promise<boolean> => {
		return new Promise((res, rej) => {
			const handle = (event: DeviceOrientationEvent) => {
				if(event.alpha || event.beta || event.gamma){
					res(true);
				}else{
					res(false);	
				}
			}
			window.addEventListener("deviceorientation", handle);
			setTimeout(() => {
				window.removeEventListener("deviceorientation", handle);
				res(false);
			}, 1000);
		})
	};

	const handleClickMessage = () => {
		openModal(() => import("@components/Modals/DisplayTimesModal.svelte"), {
			times: times
		})
	}
</script>

<button
	on:click={() => {
		currentDate = currentDate.clone().add(1, "hour");
	}}>add hour</button
>

<button
	on:click={() => {
		currentDate = currentDate.clone().add(-1, "hour");
	}}>sub hour</button
>
<div class="relative h-full w-full">
	<SunsetAnimatedBackground x={sunCoordinates.x} y={sunCoordinates.y} />

	<div
		style="z-index:100000"
		class="absolute inset-0 pointer-events-none w-full flex items-center justify-center"
	>
		<div
			class="rounded-xl mb-64 flex flex-col gap-2 text-center text-base-content bg-opacity-50 bg-base-300 p-5 px-10"
		>
			<span class="pointer-events-auto" role="button" on:click={handleClickMessage}>{startCase(message)}</span>

			<span class="text-5xl">{timeStr}</span>

			{#await isDeviceOrientationSupported() then isSupported}
				{#if isSupported && targetSunPos}
					<Compass
						altitude={targetSunPos.altitude}
						azimuth={targetSunPos.azimuth}
					/>
				{:else}
					<div>
						<span>
							{
								currentAction === 'sunrise' ? 'In East' : 'In West'
							}
						</span>
					</div>
				{/if}
			{/await}
		</div>
	</div>
</div>
