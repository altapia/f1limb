<script>
	import Close from "@/icons/Close.svelte"

	let { showModal = $bindable(), header, children } = $props()

	let dialog = $state() // HTMLDialogElement

	$effect(() => {
		if (dialog) {
			// Asegúrate que el elemento dialog exista
			if (showModal) {
				dialog.showModal()
			} else {
				// Solo intenta cerrar si está abierto para evitar errores
				if (dialog.open) {
					dialog.close()
				}
			}
		}
	})
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<dialog
	class="fixed inset-0 mx-auto my-8 w-4xl"
	bind:this={dialog}
	onclose={() => (showModal = false)}
	onclick={(e) => {
		if (e.target === dialog) dialog.close()
	}}
>
	<div class="flex justify-between items-center p-2 rounded-t-md">
		{@render header?.()}
		<button type="button" class="cursor-pointer w-3" onclick={() => dialog.close()}>
			<Close class="w-3 h-3" />
		</button>
	</div>
	<div>
		{@render children?.()}
	</div>
</dialog>

<style>
	/* 	dialog {
		max-width: 32em;
		border-radius: 0.2em;
		border: none;
		padding: 0;
	} */
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}
	dialog > div {
		padding: 1em;
	}
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
