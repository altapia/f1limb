<!-- modal para seleccionar entre todos los img que hay en la carpeta img -->

<script>
	import Close from "@/icons/Close.svelte"
	import New from "@/icons/New.svelte"
	import { onMount } from "svelte"

	export let id = undefined
	let showModal = false
	let images = [
		{ name: "flag_arabia.avif", url: "/img/flag_arabia.avif" },
		{ name: "flag_australia.avif", url: "/img/flag_australia.avif" },
		{ name: "flag_austria.avif", url: "/img/flag_austria.avif" },
		{ name: "flag_azerbaijan.avif", url: "/img/flag_azerbaijan.avif" },
		{ name: "flag_bahrain.avif", url: "/img/flag_bahrain.avif" },
		{ name: "flag_belgica.avif", url: "/img/flag_belgica.avif" },
		{ name: "flag_brasil.avif", url: "/img/flag_brasil.avif" },
		{ name: "flag_canada.avif", url: "/img/flag_canada.avif" },
		{ name: "flag_china.avif", url: "/img/flag_china.avif" },
		{ name: "flag_emiratos.avif", url: "/img/flag_emiratos.avif" },
		{ name: "flag_espana.avif", url: "/img/flag_espana.avif" },
		{ name: "flag_hungria.avif", url: "/img/flag_hungria.avif" },
		{ name: "flag_italia.avif", url: "/img/flag_italia.avif" },
		{ name: "flag_japon.avif", url: "/img/flag_japon.avif" },
		{ name: "flag_mexico.avif", url: "/img/flag_mexico.avif" },
		{ name: "flag_monaco.avif", url: "/img/flag_monaco.avif" },
		{ name: "flag_paisesbajos.avif", url: "/img/flag_paisesbajos.avif" },
		{ name: "flag_qatar.avif", url: "/img/flag_qatar.avif" },
		{ name: "flag_singapur.avif", url: "/img/flag_singapur.avif" },
		{ name: "flag_uk.avif", url: "/img/flag_uk.avif" },
		{ name: "flag_usa.avif", url: "/img/flag_usa.avif" },
	]

	function toggleModal() {
		showModal = !showModal
	}

	function handleImageClick(imageName) {
		if (!id) {
			document.getElementById("flag").value = imageName
		} else {
			document.getElementById("flag-" + id).value = imageName
		}
		toggleModal()
	}

	function handleOutsideClick(event) {
		if (event.target === event.currentTarget) {
			toggleModal()
		}
	}

	onMount(() => {
		const handleEscape = (event) => {
			if (event.key === "Escape" && showModal) {
				toggleModal()
			}
		}

		window.addEventListener("keydown", handleEscape)

		return () => {
			window.removeEventListener("keydown", handleEscape)
		}
	})
</script>

<button
	type="button"
	on:click={toggleModal}
	class="bg-teal-500 hover:bg-teal-700 text-white font-bold h-7 w-7"
>
	<New class="h-5 w-5" />
</button>

{#if showModal}
	<div class="fixed inset-0 bg-black/50 flex items-center justify-center">
		<div class="bg-white rounded-lg shadow-xl">
			<div class="flex justify-between items-center p-4">
				<h2 class="text-2xl font-bold mb-4">Circuito</h2>
				<button type="button" on:click={() => toggleModal()}><Close clas="h-5 w-5" /></button>
			</div>
			<div class="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[90vh] overflow-y-auto p-4">
				{#each images as image}
					<button type="button" on:click={() => handleImageClick(image.name)}>
						<img
							src={image.url}
							alt={image.name}
							class=" w-40 object-containt cursor-pointer hover:opacity-75 transition-opacity"
						/>
						<span class="text-center max-w-full">{image.name}</span>
					</button>
				{/each}
			</div>
		</div>
	</div>
{/if}
