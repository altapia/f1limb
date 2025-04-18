<!-- modal para seleccionar entre todos los img que hay en la carpeta img -->

<script>
	import Close from "@/icons/Close.svelte"
	import New from "@/icons/New.svelte"
	import { onMount } from "svelte"

	let showModal = false
	let images = [
		{ name: "circuit_albert-park.png", url: "/img/circuit_albert-park.png" },
		{ name: "circuit_americas.png", url: "/img/circuit_americas.png" },
		{ name: "circuit_bahrain.png", url: "/img/circuit_bahrain.png" },
		{ name: "circuit_baku.png", url: "/img/circuit_baku.png" },
		{ name: "circuit_emilia_romagna.png", url: "/img/circuit_emilia_romagna.png" },
		{ name: "circuit_gilles-villeneuve.avif", url: "/img/circuit_gilles-villeneuve.avif" },
		{ name: "circuit_hermanos-rodrigez.avif", url: "/img/circuit_hermanos-rodrigez.avif" },
		{ name: "circuit_hungaroring.avif", url: "/img/circuit_hungaroring.avif" },
		{ name: "circuit_jeddah.png", url: "/img/circuit_jeddah.png" },
		{ name: "circuit_jose-carlos-pace.avif", url: "/img/circuit_jose-carlos-pace.avif" },
		{ name: "circuit_las-vegas-strip.avif", url: "/img/circuit_las-vegas-strip.avif" },
		{ name: "circuit_lusail.png", url: "/img/circuit_lusail.png" },
		{ name: "circuit_marina-bay.png", url: "/img/circuit_marina-bay.png" },
		{ name: "circuit_miami.png", url: "/img/circuit_miami.png" },
		{ name: "circuit_monaco.png", url: "/img/circuit_monaco.png" },
		{ name: "circuit_montmelo.png", url: "/img/circuit_montmelo.png" },
		{ name: "circuit_monza.png", url: "/img/circuit_monza.png" },
		{ name: "circuit_redbull_ring.avif", url: "/img/circuit_redbull_ring.avif" },
		{ name: "circuit_shanghai.avif", url: "/img/circuit_shanghai.avif" },
		{ name: "circuit_silverstone.avif", url: "/img/circuit_silverstone.avif" },
		{ name: "circuit_spa-francorchamps.avif", url: "/img/circuit_spa-francorchamps.avif" },
		{ name: "circuit_suzuka.png", url: "/img/circuit_suzuka.png" },
		{ name: "circuit_yas-marina.avif", url: "/img/circuit_yas-marina.avif" },
		{ name: "circuit_zandvoort.png", url: "/img/circuit_zandvoort.png" },
	]

	function toggleModal() {
		showModal = !showModal
	}

	function handleImageClick(imageName) {
		document.getElementById("circuit").value = imageName
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
