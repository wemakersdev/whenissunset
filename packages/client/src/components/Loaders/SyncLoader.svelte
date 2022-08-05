<script>
	import Circle3 from 'svelte-loading-spinners/dist/Circle3.svelte'

	export let color = "hsla(var(--bc))"
	export let size = 20

	$: console.log({color})
	
</script>

<Circle3 
	ballTopLeft={color}
	ballTopRight={color}
	ballBottomLeft={color}
	ballBottomRight={color}
	size={size}
/>