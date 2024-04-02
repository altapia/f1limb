<script lang="ts">
	import Edit from "@/icons/Edit.svelte"
	import type { Apuesta } from "@/lib/model"
	export let listApuestas: Apuesta[]
	let responseMessage: string

	async function onChange(e: Event, id: number) {
		const target = e.target as HTMLSelectElement
		const newEstado = target.value
		const formData = new FormData()
		formData.append("id", id.toString())
		formData.append("estado", newEstado)

		let loadingEle = document.getElementById("loading-" + id)
		if (loadingEle) {
			loadingEle.style.display = "block"
		}
		let msgEle = document.getElementById("msg-" + id)
		if (msgEle) {
			msgEle.innerText = ""
		}
		const response = await fetch("/api/admin/apuesta/estado", {
			method: "POST",
			body: formData,
		}).finally(() => {
			if (loadingEle) {
				loadingEle.style.display = "none"
			}
		})
		const data = await response.json()
		responseMessage = data.message
		if (msgEle) {
			msgEle.innerText = responseMessage
			document.getElementById("loading-" + id)?.classList.remove("invisible")
		}
	}
</script>

{#each listApuestas as ap, index}
	<li
		class="my-3 flex flex-col md:flex-row items-center justify-between"
		class:bg-gray-200={index % 2 == 0}
	>
		<div class="flex items-center">
			<span class="mr-1 font-semibold">{ap.user.nombre}</span>

			{#if ap.estado == 1}
				<span>
					<svg
						class="mr-1 h-5 w-5 text-gray-500"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<path
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
						></path>
					</svg>
				</span>
			{/if}
			{#if ap.estado == 2}
				<span>
					<svg
						class="mr-1 h-5 w-5 text-green-500"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<path
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="m5 12 4.7 4.5 9.3-9"
						></path>
					</svg>
				</span>
			{/if}
			{#if ap.estado == 3}
				<span>
					<svg
						class="mr-1 h-5 w-5 text-red-500"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<path
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18 18 6m0 12L6 6"
						></path>
					</svg>
				</span>
			{/if}
			<span>{@html ap.descripcion}</span>
			<span class="mx-1 font-semibold">{ap.importe}€</span>
			<span class="font-semibold">@{ap.cuota}</span>

			<a href={"./admin/" + ap.id} class="text-teal-500 mx-3"><Edit /></a>
		</div>
		<div class="flex flex-col items-center">
			<div class="flex">
				<div
					id={"loading-" + ap.id}
					class="invisible inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-teal-500 motion-reduce:animate-[spin_1.5s_linear_infinite]"
					role="status"
				>
					<span
						class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
						>Loading...</span
					>
				</div>
				<select
					id={"select-" + ap.id}
					on:change={(e) => onChange(e, ap.id)}
					bind:value={ap.estado}
					class="p-2"
					class:bg-transparent={ap.estado === 1}
					class:bg-green-300={ap.estado === 2}
					class:bg-red-300={ap.estado === 3}
				>
					<option value={1}>Pendiente</option>
					<option value={2}> Acertada </option>
					<option value={3}> Fallada </option>
				</select>
			</div>
			<p class="invisble mx-1 text-xs" id={"msg-" + ap.id}></p>
		</div>
	</li>
{/each}
