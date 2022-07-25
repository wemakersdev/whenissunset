<script lang="ts">

  import SyncLoader from "@components/Loaders/SyncLoader.svelte";
  //@ts-ignore
  import Loadable from "svelte-loadable/Loadable.svelte";

  export let loader: () => Promise<any>;

  $:_loader = loader as any

  const logError = (err: any) => {
    console.error(err);
    return `${err}`;
  };
</script>

<Loadable let:component loader={_loader}>
  <div
    slot="loading"
    class="flex items-center justify-center w-full h-full overflow-hidden bg-base-300"
  >
    <SyncLoader color="white" size={20} />
  </div>
  <div
    slot="error"
    let:error
    class="justify-center w-full h-full overflow-hidden flex-center bg-base-300 text-base-content"
  >
    {logError(error)}

    <br />
  </div>
  <slot {component} />
</Loadable>
