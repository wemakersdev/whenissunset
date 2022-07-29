<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import { overlayModal } from "../../common/basicStores";
  import Cancel from "../../icons/Cancel.svelte";

  const dispatch = createEventDispatcher();

  export let close: () => void = () => {
    overlayModal.close();
    dispatch("close");
  };
  export let label: string = "";
  export let absolutePositionedHeader: boolean = false;
</script>

<div class="absolute inset-0 flex flex-col bg-base-100">
  <slot name="header" {close} {label}>
    <div 
      class="flex items-center justify-between px-6 py-4 header"
      class:absolutePositionedHeader
    >
      <span class="text-xl font-semibold uppercase">{label}</span>
      <span>
        <button on:click={() => close()} class="btn btn-circle ">
          <span class="inline-block w-5 h-5">
            <Cancel />
          </span>
        </button>
      </span>
    </div>
  </slot>

  <div class="relative flex flex-grow">
    <div class="absolute inset-0 px-6">
      <slot {close} />
    </div>
  </div>
</div>


<style lang="postcss">
  .absolutePositionedHeader {
    @apply absolute top-0 left-0 right-0 z-20;
  }
</style>


<svelte:window
  on:keydown={(e) => {
    if (e.key === "Escape") {
      close()
    }
  }}
/>