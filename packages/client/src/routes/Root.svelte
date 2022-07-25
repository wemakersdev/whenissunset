<script lang="ts">
import { networkLocation, type IDisplayLocation } from "@common/basicStores";

	import Sunset from "@components/Sunset/Sunset.svelte";
import WaitUntil from "@components/WaitUntil/WaitUntil.svelte";


const promise = new Promise(async (res, rej) => {
		const response: {
			data: {
				geo: IDisplayLocation;
			};
		} = await fetch("/api/geo").then((res) => res.json());

		if (response?.data?.geo) {
			networkLocation.set({
				...(response?.data?.geo || {}),
				label: "Your Location",
			});

			res(true);
		} else {
			rej(new Error("No Location Found"));
		}
	});
</script>

<WaitUntil promises={[promise]}>
	<Sunset />
</WaitUntil>
