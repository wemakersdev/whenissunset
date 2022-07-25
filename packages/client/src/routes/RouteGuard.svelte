<script lang="ts">
  import ErrorView from "@components/Error/ErrorView.svelte";
  import Ban from "../icons/Ban.svelte";

  export let condition: (() => Promise<boolean> | boolean) | undefined =
    undefined;
</script>

{#if condition}
  {#await condition()}
    waiting...
  {:then allowRoute}
    {#if !allowRoute}
      <div class="flex flex-col items-center justify-center h-full gap-4">
        <span class="w-10 h-10">
          <Ban />
        </span>
        <span class="text-lg"> Not Allowed </span>
      </div>
    {:else}
      <slot />
    {/if}
  {:catch err}
    <ErrorView error={err} />
  {/await}
{:else}
  <slot />
{/if}
