<script lang="ts">
  import { swRegistration } from '@common/basicStores'
  import { initServiceWorker } from '@ServiceWorker/serviceWorkerUtils'
  import { createEventDispatcher, onMount } from 'svelte'

  const dispatch = createEventDispatcher()

  onMount(() => {
    if ($swRegistration) {
      return
    } else {
      handleRegisterServiceWorker()
    }
  })

  const handleRegisterServiceWorker = async () => {
    try {
      const reg = await initServiceWorker()
      $swRegistration = reg
	  dispatch("ready", reg)
    } catch (err) {
      console.error(err)
    }
  }

</script>
<slot registration={$swRegistration} />