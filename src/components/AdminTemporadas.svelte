<script lang="ts">
	import Edit from "@/icons/Edit.svelte"
	import Trash from "@/icons/Trash.svelte"
	import type { TemporadaVO } from "@/lib/model"
	let responseMessage: string

	let loading = false
	let temporadaId: number | null = null

	// Se obtienen las temporadas
	let temporadas: TemporadaVO[] = []
	async function getTemporadas() {
		loading = true
		temporadas = await fetch("/api/admin/temporada").then((response) => response.json())
		loading = false
	}
	getTemporadas().catch(console.error)

	async function crear(e: SubmitEvent) {
		e.preventDefault()
		const formData = new FormData(e.currentTarget as HTMLFormElement)

		const response = await fetch("/api/admin/temporada", {
			method: "POST",
			body: formData,
		})
		const data = await response.json()
		responseMessage = data.message
		if (response.status == 200) {
			const nombreElement = document.getElementById("nombre") as HTMLInputElement

			if (nombreElement != null) nombreElement.value = ""

			getTemporadas().catch(console.error)
		}
	}

	async function actualizar(e: SubmitEvent) {
		e.preventDefault()
		const formData = new FormData(e.currentTarget as HTMLFormElement)
		loading = true
		temporadaId = Number(formData.get("id"))
		const response = await fetch("/api/admin/temporada", {
			method: "PUT",
			body: formData,
		}).finally(() => {
			loading = false
		})
		const data = await response.json()
		responseMessage = data.message
	}

	async function eliminar(temporadaId: number) {
		if (confirm("Seguro?")) {
			const formData = new FormData()
			formData.append("id", temporadaId.toString())

			loading = true
			temporadaId = Number(formData.get("id"))

			const response = await fetch("/api/admin/temporada", {
				method: "DELETE",
				body: formData,
			})

			const data = await response.json()
			responseMessage = data.message
			getTemporadas()
				.catch(console.error)
				.finally(() => {
					loading = false
				})
		}
	}
</script>

<div class="mb-5">
	{#if responseMessage}
		<p class="text-center text-red-500">{responseMessage}</p>
	{/if}
	<form on:submit={crear}>
		<div class="flex items-end gap-3">
			<div class="flex flex-col">
				<label class=" mt-3 text-sm text-gray-800 italic" for="nombre">Nombre</label>
				<input class="border border-gray-400 p-2" id="nombre" name="nombre" value="" />
			</div>
			<div class="flex">
				{#if loading && temporadaId === null}
					<div
						class="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em]
						text-teal-500 motion-reduce:animate-[spin_1.5s_linear_infinite]"
						role="status"
					>
						<span
							class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
							>Loading...</span
						>
					</div>
				{/if}
				{#if !loading || temporadaId !== null}
					<button
						class="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4"
						type="submit"
					>
						+
					</button>
				{/if}
			</div>
		</div>
	</form>
	<hr class="my-2" />
	<div>
		{#each temporadas as t}
			<form on:submit={actualizar}>
				<div class="flex items-end gap-3">
					<input type="hidden" name="id" value={t.id} />
					<div class="flex flex-col">
						<label class=" mt-3 text-sm text-gray-800 italic" for="id">ID</label>
						<input
							class="border border-gray-400 p-2 w-10 bg-gray-200 text-right"
							id="id"
							name="id"
							value={t.id}
							disabled
						/>
					</div>
					<div class="flex flex-col">
						<label class=" mt-3 text-sm text-gray-800 italic" for="nombre">Nombre</label>
						<input class="border border-gray-400 p-2 w-full" name="nombre" value={t.nombre} />
					</div>
					<div class="flex justify-between mt-5">
						{#if loading && temporadaId === t.id}
							<div
								class="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em]
									text-teal-500 motion-reduce:animate-[spin_1.5s_linear_infinite]"
								role="status"
							>
								<span
									class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
									>Loading...</span
								>
							</div>
						{/if}
						{#if !loading || temporadaId !== t.id}
							<button
								type="submit"
								class="flex w-fit cursor-pointer items-center border bg-teal-800 p-2 text-white hover:bg-teal-500 hover:text-black"
							>
								<Edit />
								Actualizar
							</button>
							<button
								type="button"
								class="flex w-fit cursor-pointer items-center border bg-red-700 p-2 text-white hover:bg-red-500 hover:text-black"
								on:click={() => eliminar(t.id ?? 0)}
							>
								<Trash clas="mr-1 h-4 w-4" />
								Eliminar
							</button>
						{/if}
					</div>
				</div>
			</form>
		{/each}
	</div>
</div>
