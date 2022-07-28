<script lang="ts">

  import { rootElement, theme } from "../../common/basicStores";

  export let isModalOpen = false;
  

</script>

<div
  bind:this={$rootElement}
  data-theme={$theme}
  class="flex flex-col w-full h-full bg-base-300 text-base-content"
>
	<div class="w-full">
		<slot name="header" />
	</div>

	<div class="relative flex flex-row flex-grow w-full">
		<div class="sidebar">
			<slot name="sidebar" />
		</div>

		<div class="relative flex-grow">
			<div class="absolute inset-0">
				<slot name="body" />
				<slot/>
			</div>
		</div>
	</div>

	{#if isModalOpen}
		<div class="fixed inset-0" style="z-index: 100000">
			<slot name="modal" />
		</div>
	{/if}
</div>
