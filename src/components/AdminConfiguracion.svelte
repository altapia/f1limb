<script lang="ts">
	import Edit from "@/icons/Edit.svelte"
	import type { ConfigVO, TemporadaVO } from "@/lib/model"

	let responseMessage: string = ""

	let loading = false
	let configuracionId: string | null = null
	let temporadaId: number | null = null

	// Se obtienen las temporadas
	let temporadas: TemporadaVO[] = []
	async function getTemporadas() {
		loading = true
		temporadas = await fetch("/api/admin/temporada").then((response) => response.json())
		loading = false
	}
	getTemporadas().catch(console.error)

	function temporadaSelected(event: Event) {
		const select = event.target as HTMLSelectElement
		temporadaId = Number(select.value)
		getConfiguraciones(temporadaId).catch(console.error)
	}

	// Se obtienen las configuraciones
	let configuraciones: ConfigVO[] = []
	async function getConfiguraciones(temporadaId: number | null) {
		if (temporadaId == null) return
		configuraciones = []
		loading = true
		configuraciones = await fetch(`/api/admin/configuracion/${temporadaId}`).then((response) =>
			response.json()
		)
		loading = false
	}

	async function actualizar(e: SubmitEvent) {
		e.preventDefault()
		const formData = new FormData(e.currentTarget as HTMLFormElement)
		loading = true
		configuracionId = formData.get("key")?.toString() ?? null
		const response = await fetch(`/api/admin/configuracion/${temporadaId}`, {
			method: "PUT",
			body: formData,
		}).finally(() => {
			loading = false
		})
		const data = await response.json()
		responseMessage = data.message
	}
</script>

<div class="mb-5">
	{#if responseMessage}
		<p class="text-center text-red-500">{responseMessage}</p>
	{/if}

	<section class="my-5 max-w-3xl mx-auto">
		<select class="w-full p-2 mx-2 border border-gray-400" on:change={temporadaSelected}>
			<option value="">Selecciona una temporada</option>
			{#each temporadas as temporada}
				<option value={temporada.id}>{temporada.nombre}</option>
			{/each}
		</select>

		{#if loading && configuraciones.length === 0}
			<div class="flex justify-center mt-5">
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
			</div>
		{/if}
		{#if temporadaId !== null}
			{#each configuraciones as c}
				<form on:submit={actualizar}>
					<div
						class="flex md:flex-row flex-col md:items-end justify-center md:gap-3 md:border-0 border-b border-gray-400 pb-3 md:pb-0 px-3 md:px-0"
					>
						<input type="hidden" name="key" value={c.key} />
						<input type="hidden" name="temporadaId" value={c.temporada_id} />
						<div class="flex flex-col w-full md:w-auto">
							<label class=" mt-3 text-sm text-gray-800 italic" for="key">Key</label>
							<input
								class="border border-gray-400 p-1 bg-gray-200 text-right text-sm"
								name="key"
								value={c.key}
								disabled
							/>
						</div>
						<div class="flex flex-col w-full md:w-auto">
							<label class=" mt-3 text-sm text-gray-800 italic" for="value">Value</label>
							<input class="border border-gray-400 p-1 h-7 w-full" name="value" value={c.value} />
						</div>

						<div class="flex justify-center mt-5">
							{#if loading && configuracionId === c.key}
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
							{#if !loading}
								<button
									type="submit"
									class="flex w-fit cursor-pointer items-center border bg-teal-800 p-1 text-white hover:bg-teal-500 hover:text-black"
								>
									<Edit clas="h-5" />
								</button>
							{/if}
						</div>
					</div>
				</form>
			{/each}
		{/if}
	</section>
</div>
