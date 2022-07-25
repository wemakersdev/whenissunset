<script lang="ts">
	import ErrorView from "@components/Error/ErrorView.svelte";
	import SyncLoader from "@components/Loaders/SyncLoader.svelte";

	export let getFetch: () => () => Promise<Response>;
	export let response: Response | undefined = undefined;
	
	const fetch = async () => {
		const callback = getFetch()
		const res = await callback();
		response = res;
		return res;
	};
</script>

{#await fetch()}
	<slot name="waiting">
		<div class="h-full w-full flex items-center justify-center">
			<SyncLoader />
		</div>
	</slot>

{:then response}
	<slot 
		{response}
	/>
{:catch error}
	<slot name="error" {error}>
		<div class="h-full w-full flex items-center justify-center">
			<ErrorView {error} />
		</div>
	</slot>
{/await}
