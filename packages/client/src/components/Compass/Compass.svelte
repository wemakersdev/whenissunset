<script lang="ts">
	import { onMount } from "svelte";
	import { debounce, head } from "lodash-es";

	export let azimuth: number;
	export let altitude: number;

	let heading: number = 0;

	const handler = (event: any) => {
		heading = event.alpha;

		if (typeof event.webkitCompassHeading !== "undefined") {
			heading = event.webkitCompassHeading; //iOS non-standard
		}
	};


	const getRotationForSun = (azimuth: number, heading: number) => {
		const rotation = (azimuth - heading)
		return rotation;
	}

</script>



<div class="flex items-center justify-center py-5">

	<div style="transform: rotateZ({heading - 45}deg);" class="h-6 w-1 relative arrow bg-base-content">
	
	</div>
</div>

<style lang="postcss">

	.arrow:after{

		/* create a triangle on the arrow */
		content: "";
		position: absolute;
		top: -10px;
		left: -8px;
		width: 0;
		height: 0;
		border-left: 10px solid transparent;
		border-right: 10px solid transparent;
		border-bottom: 10px solid #fff;
		transform: rotate(-360deg);
		z-index: -1;
	}
</style>


<svelte:window on:deviceorientation={handler} />
