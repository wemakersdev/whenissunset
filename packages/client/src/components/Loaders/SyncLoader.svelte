<script>
	import Circle3 from 'svelte-loading-spinners/dist/Circle3.svelte'

	export let color = "rgb(234 179 8 / var(--tw-bg-opacity))"
	export let size = 20
</script>

<Circle3 
	ballTopLeft={color}
	ballTopRight={color}
	ballBottomLeft={color}
	ballBottomRight={color}
	size={size}
/>