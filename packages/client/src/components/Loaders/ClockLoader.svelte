<script>
	import Clock from 'svelte-loading-spinners/dist/Clock.svelte'

	export let color = "hsla(var(--bc))"
	export let size = 20
</script>

<Clock 
	size={size}
	color={color}
/>