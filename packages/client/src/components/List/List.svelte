<script lang="ts">
	import Plus from "@icons/Plus.svelte";

	export let list: any[] = [];
	export let key: string = "";
	export let emptyMessage: string = "List is empty";
	export let addButtonMessage: string = "Add New";
	export let addButtonIcon: any = Plus;
	export let addItem: (event: MouseEvent) => void = () => {};
</script>

{#if list.length > 0}
	{#each list as item, index (item.id)}
		<slot {index} {item} />
	{/each}
{:else}
	<slot name="empty">
		<div
			class="h-full w-full flex items-center justify-center flex-col gap-10"
		>
			<div class="text-4xl">
				{emptyMessage}
			</div>
			<button
				class="btn btn-success flex flex-row gap-2"
				on:click={addItem}
			>
				<span class="inline-block h-5 w-5">
					<svelte:component this={addButtonIcon} />
				</span>
				<span>
					{addButtonMessage}
				</span>
			</button>
		</div>
	</slot>
{/if}
