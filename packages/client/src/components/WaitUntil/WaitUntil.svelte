<script lang="ts">
	import ErrorView from "@components/Error/ErrorView.svelte";
	import SyncLoader from "@components/Loaders/SyncLoader.svelte";

	export let promises: Promise<any>[] = [];
	export let noFailures = true;

	$: promise = Promise.all(
		noFailures ? promises.map((p) => p.catch(console.error)) : promises
	);
</script>

{#await promise}
	<slot name="waiting">
		<div class="h-full w-full flex items-center justify-center">
			<SyncLoader />
		</div>
	</slot>
{:then}
	<slot />
{:catch error}
	<ErrorView {error} />
{/await}
