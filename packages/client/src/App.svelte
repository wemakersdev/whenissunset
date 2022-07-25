<script lang="ts">
	import { overlayModal } from "@common/basicStores";
	import ErrorView from "@components/Error/ErrorView.svelte";

	import Layout from "@components/Layout/Layout.svelte";

	import ServiceWorker from "@components/ServiceWorker.svelte";
	import Routes from "@routes/Routes.svelte";
</script>

<Layout isModalOpen={$overlayModal.isOpen}>
	<ServiceWorker />
	<Routes />
	<svelte:fragment slot="modal">
		{#if $overlayModal.component}
			<svelte:component
				this={$overlayModal.component}
				{...$overlayModal.props || {}}
			/>
		{:else}
			<ErrorView error={new Error("No Modal Provided")} />
		{/if}
	</svelte:fragment>
</Layout>
