<script lang="ts">
	import SyncLoader from "@components/Loaders/SyncLoader.svelte";
	import OverlayModalContainer from "./OverlayModalContainer.svelte";
</script>

<OverlayModalContainer>
	<div slot="header"></div>
	<div
		class="flex items-center justify-center w-full h-full overflow-hidden bg-base-300"
	>	
		<SyncLoader color="white" size={20} />
	</div>
</OverlayModalContainer>
