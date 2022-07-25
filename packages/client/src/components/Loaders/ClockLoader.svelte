<script>
	import Clock from 'svelte-loading-spinners/dist/Clock.svelte'

	export let color = "rgb(234 179 8 / var(--tw-bg-opacity))"
	export let size = 20
</script>

<Clock 
	size={size}
	color={color}
/>