<script lang="ts">
	import Edit from "@/icons/Edit.svelte"
	import Trash from "@/icons/Trash.svelte"
	import type { GpVO, TemporadaVO } from "@/lib/model"
	import SelectFlag from "./SelectFlag.svelte"
	import SelectCircuit from "./SelectCircuit.svelte"
	let responseMessage: string = ""

	let loading = false
	let gpId: number | null = null
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
		console.log(temporadaId)
		getParticipantes(temporadaId).catch(console.error)
	}

	// Se obtienen los gps
	let gps: GpVO[] = []
	async function getParticipantes(temporadaId: number | null) {
		if (temporadaId == null) return
		loading = true
		gps = await fetch(`/api/admin/gp/${temporadaId}`).then((response) => response.json())
		loading = false
	}

	async function crear(e: SubmitEvent) {
		e.preventDefault()
		const formData = new FormData(e.currentTarget as HTMLFormElement)

		loading = true
		gpId = null
		const response = await fetch(`/api/admin/gp/${temporadaId}`, {
			method: "POST",
			body: formData,
		}).finally(() => {
			loading = false
		})
		const data = await response.json()
		responseMessage = data.message
		if (response.status == 200) {
			/*
			nombre: test
flag: bandera
circuit: las américas
libres1: 2025-02-10T19:25
libres2: 2025-02-11T19:26
libres3: 2025-02-13T19:26
clasificacion: 2025-02-14T19:26
clasificacionSprint: 2025-02-15T19:26
sprint: 2025-02-16T19:26
carrera: 2025-02-17T19:26
			*/
			const nombreElement = document.getElementById("nombre") as HTMLInputElement
			const flagElement = document.getElementById("flag") as HTMLInputElement
			const circuitElement = document.getElementById("circuit") as HTMLInputElement
			const libres1Element = document.getElementById("libres1") as HTMLInputElement
			const libres2Element = document.getElementById("libres2") as HTMLInputElement
			const libres3Element = document.getElementById("libres3") as HTMLInputElement
			const clasificacionElement = document.getElementById("clasificacion") as HTMLInputElement
			const clasificacionSprintElement = document.getElementById(
				"clasificacionSprint"
			) as HTMLInputElement
			const sprintElement = document.getElementById("sprint") as HTMLInputElement
			const carreraElement = document.getElementById("carrera") as HTMLInputElement

			if (nombreElement != null) nombreElement.value = ""
			if (flagElement != null) flagElement.value = ""
			if (circuitElement != null) circuitElement.value = ""
			if (libres1Element != null) libres1Element.value = ""
			if (libres2Element != null) libres2Element.value = ""
			if (libres3Element != null) libres3Element.value = ""
			if (clasificacionElement != null) clasificacionElement.value = ""
			if (clasificacionSprintElement != null) clasificacionSprintElement.value = ""
			if (sprintElement != null) sprintElement.value = ""
			if (carreraElement != null) carreraElement.value = ""

			getParticipantes(temporadaId).catch(console.error)
		}
	}

	async function actualizar(e: SubmitEvent) {
		e.preventDefault()
		const formData = new FormData(e.currentTarget as HTMLFormElement)
		loading = true
		gpId = Number(formData.get("id"))

		if (formData.get("carrera") != null && formData.get("carrera") != "") {
			formData.set("carrera", new Date(formData.get("carrera") as string).toISOString())
		}
		if (formData.get("clasificacion") != null && formData.get("clasificacion") != "") {
			formData.set("clasificacion", new Date(formData.get("clasificacion") as string).toISOString())
		}
		if (formData.get("libres1") != null && formData.get("libres1") != "") {
			formData.set("libres1", new Date(formData.get("libres1") as string).toISOString())
		}
		if (formData.get("libres2") != null && formData.get("libres2") != "") {
			formData.set("libres2", new Date(formData.get("libres2") as string).toISOString())
		}
		if (formData.get("libres3") != null && formData.get("libres3") != "") {
			formData.set("libres3", new Date(formData.get("libres3") as string).toISOString())
		}
		if (formData.get("clasificacionSprint") != null && formData.get("clasificacionSprint") != "") {
			formData.set(
				"clasificacionSprint",
				new Date(formData.get("clasificacionSprint") as string).toISOString()
			)
		}
		if (formData.get("sprint") != null && formData.get("sprint") != "") {
			formData.set("sprint", new Date(formData.get("sprint") as string).toISOString())
		}

		const response = await fetch(`/api/admin/gp/${temporadaId}`, {
			method: "PUT",
			body: formData,
		}).finally(() => {
			loading = false
		})
		const data = await response.json()
		responseMessage = data.message
	}

	async function eliminar(id: number) {
		if (confirm("Seguro?")) {
			const formData = new FormData()
			loading = true
			gpId = id
			formData.append("id", id.toString())
			const response = await fetch(`/api/admin/gp/${temporadaId}`, {
				method: "DELETE",
				body: formData,
			})

			const data = await response.json()
			if (data.status != 200) {
				responseMessage = data.error
			} else {
				responseMessage = data.message
			}
			getParticipantes(temporadaId)
				.catch(console.error)
				.finally(() => {
					loading = false
				})
		}
	}

	/**
	 * Formatea la fecha "2024-10-18T17:30:00.000Z";a "2024-10-18T17:30"
	 * @param date
	 */
	function formatDate(date: Date | undefined) {
		if (date == null) return ""
		const d = new Date(date)
		const year = d.getFullYear()
		const month = d.getMonth() + 1
		const day = d.getDate()
		const hour = d.getHours()
		const minute = d.getMinutes()
		return `${year}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}T${
			hour < 10 ? "0" + hour : hour
		}:${minute < 10 ? "0" + minute : minute}`
	}
</script>

<div class="mb-5">
	{#if responseMessage}
		<p class="text-center text-red-500">{responseMessage}</p>
	{/if}

	<section class="my-5 px-2">
		<select class="w-full p-2 mx-2 border border-gray-400" on:change={temporadaSelected}>
			<option value="">Selecciona una temporada</option>
			{#each temporadas as temporada}
				<option value={temporada.id}>{temporada.nombre}</option>
			{/each}
		</select>

		{#if temporadaId !== null}
			{#each gps as gp}
				<form on:submit={actualizar}>
					<div
						class="flex flex-col md:items-end justify-center border-b border-gray-400 pb-3 md:pb-0 px-3 md:px-0"
					>
						<input type="hidden" name="id" value={gp.id} />
						<div class="flex md:flex-row flex-col w-full gap-3">
							<div class="flex flex-col w-full md:w-auto">
								<label class=" mt-3 text-sm text-gray-800 italic" for="id">ID</label>
								<input
									class="border border-gray-400 p-1 w-8 h-7 bg-gray-200 text-right text-sm"
									name="id"
									value={gp.id}
									disabled
								/>
							</div>
							<div class="flex flex-col w-full md:w-auto">
								<label class=" mt-3 text-sm text-gray-800 italic" for="nombre">Nombre</label>
								<input
									class="border border-gray-400 p-1 h-7 w-full"
									name="nombre"
									value={gp.nombre}
								/>
							</div>
							<div class="flex flex-col w-full md:w-auto">
								<label class=" mt-3 text-sm text-gray-800 italic" for="flag">Flag</label>

								<div class="flex">
									<SelectFlag id={gp.id} />
									<input
										class="border border-gray-400 p-1 h-7 w-full"
										name="flag"
										id={"flag-" + gp.id}
										value={gp.flag}
									/>
								</div>
							</div>
							<div class="flex flex-col w-full md:w-auto">
								<label class=" mt-3 text-sm text-gray-800 italic" for="circuit">Circuito</label>
								<div class="flex">
									<SelectCircuit id={gp.id} />
									<input
										class="border border-gray-400 p-1 h-7 w-full"
										name="circuit"
										id={"circuit-" + gp.id}
										value={gp.circuit}
									/>
								</div>
							</div>
							<div class="flex flex-col w-full md:w-auto">
								<label class=" mt-3 text-sm text-gray-800 italic" for="clasificacion"
									>Clasificación</label
								>
								<input
									type="datetime-local"
									class="border border-gray-400 p-1 h-7 w-full"
									name="clasificacion"
									value={formatDate(gp.clasificacion)}
								/>
							</div>

							<div class="flex flex-col w-full md:w-auto">
								<label class=" mt-3 text-sm text-gray-800 italic" for="carrera">Carrera</label>
								<input
									type="datetime-local"
									class="border border-gray-400 p-1 h-7 w-full"
									name="carrera"
									value={formatDate(gp.carrera)}
								/>
							</div>
						</div>
						<div class="flex md:flex-row flex-col w-full gap-3">
							<div class="flex flex-col w-full md:w-auto">
								<label class=" mt-3 text-sm text-gray-800 italic" for="libres1">libres1</label>
								<input
									type="datetime-local"
									class="border border-gray-400 p-1 h-7 w-full"
									name="libres1"
									value={formatDate(gp.libres1)}
								/>
							</div>
							<div class="flex flex-col w-full md:w-auto">
								<label class=" mt-3 text-sm text-gray-800 italic" for="libres2">libres2</label>
								<input
									type="datetime-local"
									class="border border-gray-400 p-1 h-7 w-full"
									class:bg-gray-200={gp.libres2 == null}
									name="libres2"
									value={formatDate(gp.libres2)}
								/>
							</div>
							<div class="flex flex-col w-full md:w-auto">
								<label class=" mt-3 text-sm text-gray-800 italic" for="libres3">libres3</label>
								<input
									type="datetime-local"
									class="border border-gray-400 p-1 h-7 w-full"
									class:bg-gray-200={gp.libres3 == null}
									name="libres3"
									value={formatDate(gp.libres3)}
								/>
							</div>

							<div class="flex flex-col w-full md:w-auto">
								<label class=" mt-3 text-sm text-gray-800 italic" for="clasificacionSprint"
									>Clasificación Sprint</label
								>
								<input
									type="datetime-local"
									class="border border-gray-400 p-1 h-7 w-full"
									class:bg-gray-200={gp.clasificacionSprint == null}
									name="clasificacionSprint"
									value={formatDate(gp.clasificacionSprint)}
								/>
							</div>
							<div class="flex flex-col w-full md:w-auto">
								<label class=" mt-3 text-sm text-gray-800 italic" for="sprint">Sprint</label>
								<input
									type="datetime-local"
									class="border border-gray-400 p-1 h-7 w-full"
									class:bg-gray-200={gp.sprint == null}
									name="sprint"
									value={formatDate(gp.sprint)}
								/>
							</div>
						</div>

						<div class="flex justify-between mt-5">
							{#if loading && gpId === gp.id}
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
							{#if !loading || gpId !== gp.id}
								<button
									type="submit"
									class="flex w-fit cursor-pointer items-center border bg-teal-800 p-1 text-white hover:bg-teal-500 hover:text-black"
								>
									<Edit clas="h-5" />
								</button>
								<button
									type="button"
									class="flex w-fit cursor-pointer items-center border bg-red-700 p-1 text-center text-white hover:bg-red-500 hover:text-black"
									on:click={() => eliminar(gp.id ?? 0)}
								>
									<Trash clas="mx-1 h-4 w-4" />
								</button>
							{/if}
						</div>
					</div>
				</form>
			{/each}

			<hr class="my-2" />

			<form on:submit={crear}>
				<div class="flex md:flex-row flex-col justify-center gap-3">
					<div class="flex flex-col">
						<div class="flex flex-col w-full md:w-auto">
							<label class=" mt-3 text-sm text-gray-800 italic" for="nombre">Nombre</label>
							<input class="border border-gray-400 p-1 h-7" id="nombre" name="nombre" value="" />
						</div>
						<div class="flex flex-col w-full md:w-auto">
							<label class=" mt-3 text-sm text-gray-800 italic" for="flag">Flag</label>
							<div class="flex">
								<SelectFlag />
								<input class="border border-gray-400 p-1 h-7" id="flag" name="flag" value="" />
							</div>
						</div>
						<div class="flex flex-col w-full md:w-auto">
							<label class=" mt-3 text-sm text-gray-800 italic" for="circuit">Circuito</label>
							<div class="flex">
								<SelectCircuit />
								<input
									class="border border-gray-400 p-1 h-7"
									id="circuit"
									name="circuit"
									value=""
								/>
							</div>
						</div>
					</div>
					<div class="flex flex-col">
						<div class="flex flex-col w-full md:w-auto">
							<label class=" mt-3 text-sm text-gray-800 italic" for="libres1">Libres1</label>
							<input
								type="datetime-local"
								class="border border-gray-400 p-1 h-7"
								id="libres1"
								name="libres1"
								value=""
							/>
						</div>
						<div class="flex flex-col w-full md:w-auto">
							<label class=" mt-3 text-sm text-gray-800 italic" for="libres2">Libres2</label>
							<input
								type="datetime-local"
								class="border border-gray-400 p-1 h-7"
								id="libres2"
								name="libres2"
								value=""
							/>
						</div>
						<div class="flex flex-col w-full md:w-auto">
							<label class=" mt-3 text-sm text-gray-800 italic" for="libres3">Libres3</label>
							<input
								type="datetime-local"
								class="border border-gray-400 p-1 h-7"
								id="libres3"
								name="libres3"
								value=""
							/>
						</div>
					</div>
					<div class="flex flex-col">
						<div class="flex flex-col w-full md:w-auto">
							<label class=" mt-3 text-sm text-gray-800 italic" for="clasificacion"
								>Clasificación</label
							>
							<input
								type="datetime-local"
								class="border border-gray-400 p-1 h-7"
								id="clasificacion"
								name="clasificacion"
								value=""
							/>
						</div>
						<div class="flex flex-col w-full md:w-auto">
							<label class=" mt-3 text-sm text-gray-800 italic" for="clasificacionSprint"
								>Clasificación Sprint</label
							>
							<input
								type="datetime-local"
								class="border border-gray-400 p-1 h-7"
								id="clasificacionSprint"
								name="clasificacionSprint"
								value=""
							/>
						</div>
						<div class="flex flex-col w-full md:w-auto">
							<label class=" mt-3 text-sm text-gray-800 italic" for="sprint">Sprint</label>
							<input
								type="datetime-local"
								class="border border-gray-400 p-1 h-7"
								id="sprint"
								name="sprint"
								value=""
							/>
						</div>
						<div class="flex flex-col w-full md:w-auto">
							<label class=" mt-3 text-sm text-gray-800 italic" for="carrera">Carrera</label>
							<input
								type="datetime-local"
								class="border border-gray-400 p-1 h-7"
								id="carrera"
								name="carrera"
								value=""
							/>
						</div>
					</div>
				</div>
				<div class="flex justify-center mt-5">
					{#if loading && gpId === null}
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
					{#if !loading || gpId !== null}
						<button
							class="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4"
							type="submit"
						>
							+
						</button>
					{/if}
				</div>
			</form>
		{/if}
	</section>
</div>
