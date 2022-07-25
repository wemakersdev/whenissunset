<script lang="ts">
  export let error: Error;

  $: console.trace(error);
</script>

<div class="text-red-400">
  <div class="text-2xl">
    {error.message}
  </div>
  <div class="text-sm">
    {error.stack}
  </div>
</div>
