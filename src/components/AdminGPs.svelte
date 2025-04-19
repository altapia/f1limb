<script lang="ts">
	import Edit from "@/icons/Edit.svelte"
	import Trash from "@/icons/Trash.svelte"
	import type { GpVO, TemporadaVO } from "@/lib/model"
	import SelectFlag from "./SelectFlag.svelte"
	import SelectCircuit from "./SelectCircuit.svelte"
	import Send from "@/icons/Send.svelte"
	import Modal from "./Modal.svelte"
	let responseMessage: string = ""

	let showModal = false
	let loading = false
	let gpId: number | undefined
	let gpEditar: GpVO | null = null
	let temporadaId: number | null = null
	let temporada: TemporadaVO | undefined

	// Se obtienen las temporadas
	let temporadas: TemporadaVO[] = []
	async function getTemporadas() {
		loading = true
		temporadas = await fetch("/api/admin/temporada").then((response) => response.json())
		loading = false
	}
	getTemporadas().catch(console.error)

	async function temporadaSelected(event: Event) {
		const select = event.target as HTMLSelectElement
		temporadaId = Number(select.value)
		if (temporadaId == null) return

		temporada = await temporadas.find((t) => t.id === temporadaId)

		getListaGPs(temporadaId).catch(console.error)
	}

	// Se obtienen los gps
	let gps: GpVO[] = []
	async function getListaGPs(temporadaId: number | null) {
		if (temporadaId == null) return
		loading = true
		gps = await fetch(`/api/admin/gp/${temporadaId}`).then((response) => response.json())
		loading = false
	}

	async function crear(e: SubmitEvent) {
		e.preventDefault()
		const formData = new FormData(e.currentTarget as HTMLFormElement)

		loading = true
		gpId = undefined
		const response = await fetch(`/api/admin/gp/${temporadaId}`, {
			method: "POST",
			body: formData,
		}).finally(() => {
			loading = false
		})
		const data = await response.json()
		responseMessage = data.message
		if (response.status == 200) {
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
			const limiteApostarElement = document.getElementById("limite_apostar") as HTMLInputElement

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
			if (limiteApostarElement != null) limiteApostarElement.value = ""

			getListaGPs(temporadaId).catch(console.error)

			gpEditar = null
			gpId = undefined
			showModal = false
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
		if (formData.get("limite_apostar") != null && formData.get("limite_apostar") != "") {
			formData.set(
				"limite_apostar",
				new Date(formData.get("limite_apostar") as string).toISOString()
			)
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

		if (response.status == 200) {
			gpEditar = null
			gpId = undefined
			showModal = false
			getListaGPs(temporadaId).catch(console.error)
		}
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

				gpEditar = null
				gpId = undefined
				showModal = false
			}
			getListaGPs(temporadaId)
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

	/**
	 * Formatea la fecha a dd/mm/yyyy HH:mm
	 * @param date
	 */
	function formatDate2(date: Date | undefined) {
		if (date == null) return ""
		const d = new Date(date)
		const year = d.getFullYear()
		const month = d.getMonth() + 1
		const day = d.getDate()
		const hour = d.getHours()
		const minute = d.getMinutes()
		return `${day < 10 ? "0" + day : day}/${
			month < 10 ? "0" + month : month
		}/${year} ${hour < 10 ? "0" + hour : hour}:${minute < 10 ? "0" + minute : minute}`
	}
</script>

<div class="mb-5">
	{#if responseMessage}
		<p class="text-center text-red-500">{responseMessage}</p>
	{/if}

	<section class="my-5 px-2">
		<select class="w-full p-2 border border-gray-400" on:change={temporadaSelected}>
			<option value="">Selecciona una temporada</option>
			{#each temporadas as temporada}
				<option value={temporada.id}>{temporada.nombre}</option>
			{/each}
		</select>
		<!-- 
		{#if temporadaId !== null}
			<div class="flex justify-end items-center">
				<button
					class="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 mt-4"
					type="button"
					on:click={() => {
						gpId = null
						gpEditar = null
						showModal = true
					}}
				>
					+ Nuevo GP
				</button>
			</div>
		{/if} -->

		{#if temporadaId !== null}
			<div class="w-full overflow-x-scroll">
				<table class="w-full overflow-x-scroll">
					<thead>
						<tr class="bg-gray-200 text-gray-600">
							<th class="p-2 text-left">ID</th>
							<th class="p-2 text-left">Nombre</th>
							<th class="p-2 text-left">Clasificación</th>
							<th class="p-2 text-left">Carrera</th>
							<th class="p-2 text-left whitespace-nowrap">Limite Apostar</th>
							<th class="p-2 text-left">
								<button
									class="bg-teal-500 hover:bg-teal-700 text-white py-2 px-4 whitespace-nowrap"
									type="button"
									on:click={() => {
										gpId = undefined
										gpEditar = null
										showModal = true
									}}
								>
									+ Nuevo
								</button>
							</th>
						</tr>
					</thead>
					<tbody class="text-gray-600">
						{#each gps as gp}
							<tr class="border-b border-gray-300 hover:bg-gray-100">
								<td class="p-2">{gp.id}</td>
								<td class="p-2 flex items-center"
									><img class="mr-2 h-4" src={"/img/" + gp.flag} alt="flag" />{gp.nombre}
								</td>
								<td class="p-2">{formatDate2(gp.clasificacion)}</td>
								<td class="p-2">{formatDate2(gp.carrera)}</td>
								<td class="p-2">{formatDate2(gp.limite_apostar)}</td>
								<td class="p-2">
									<button
										class="flex w-fit cursor-pointer items-center border bg-teal-800 p-1 text-white hover:bg-teal-500 hover:text-black"
										on:click={() => {
											gpId = gp.id
											gpEditar = gp
											showModal = true
										}}
									>
										<Edit clas="h-5" />
									</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<!-- Ventana modal de edición -->

			<Modal bind:showModal>
				{#snippet header()}
					<h2 class="text-lg font-bold text-gray-800">
						{#if gpId != null}
							Editando GP {gpId}
						{:else}
							Nuevo GP
						{/if}
						<span class="text-sm text-gray-500 italic">{temporada?.nombre}</span>
					</h2>
				{/snippet}

				<!-- {#if gpId !== null && gpEditar != null} -->
				<form on:submit={gpId != null ? actualizar : crear}>
					<div class="flex flex-col justify-center pb-3 px-3">
						<input type="hidden" name="id" value={gpEditar?.id} />

						<div class="flex flex-col md:flex-row w-full gap-3">
							<div class="flex flex-col w-full">
								<label class=" mt-3 text-sm text-gray-800 italic" for="nombre">Nombre</label>

								<input
									class="border border-gray-400 p-1 h-7 w-full"
									name="nombre"
									value={gpEditar?.nombre}
								/>
							</div>
							<div class="flex flex-col w-full">
								<label class=" mt-3 text-sm text-gray-800 italic" for="flag">Flag</label>

								<div class="flex">
									<SelectFlag />
									<!-- 
											Hacerlo reactivo, hay que cambiar el modal de banderas
											<img class="h-7" src={"/img/" + gpEditar.flag} alt="flag" /> -->
									<input
										class="border border-gray-400 p-1 h-7 w-full"
										name="flag"
										id="flag"
										value={gpEditar?.flag}
									/>
								</div>
							</div>
							<div class="flex flex-col w-full">
								<label class=" mt-3 text-sm text-gray-800 italic" for="circuit">Circuito</label>
								<div class="flex">
									<SelectCircuit />
									<input
										class="border border-gray-400 p-1 h-7 w-full"
										name="circuit"
										id="circuit"
										value={gpEditar?.circuit}
									/>
								</div>
							</div>
						</div>
						<div class="flex flex-col md:flex-row w-full gap-3">
							<div class="flex flex-col w-full">
								<label class=" mt-3 text-sm text-gray-800 italic" for="clasificacion"
									>Clasificación</label
								>
								<input
									type="datetime-local"
									class="border border-gray-400 p-1 h-7 w-full"
									name="clasificacion"
									value={formatDate(gpEditar?.clasificacion)}
								/>
							</div>

							<div class="flex flex-col w-full">
								<label class=" mt-3 text-sm text-gray-800 italic" for="carrera">Carrera</label>
								<input
									type="datetime-local"
									class="border border-gray-400 p-1 h-7 w-full"
									name="carrera"
									value={formatDate(gpEditar?.carrera)}
								/>
							</div>
							<div class="flex flex-col w-full">
								<label class=" mt-3 text-sm text-gray-800 italic" for="limite_apostar"
									>Límite apostar</label
								>
								<input
									type="datetime-local"
									class="border border-gray-400 p-1 h-7 w-full"
									name="limite_apostar"
									value={formatDate(gpEditar?.limite_apostar)}
								/>
							</div>
						</div>
						<div class="flex flex-col md:flex-row w-full gap-3">
							<div class="flex flex-col w-full">
								<label class=" mt-3 text-sm text-gray-800 italic" for="libres1">libres1</label>
								<input
									type="datetime-local"
									class="border border-gray-400 p-1 h-7 w-full"
									name="libres1"
									value={formatDate(gpEditar?.libres1)}
								/>
							</div>
							<div class="flex flex-col w-full">
								<label class=" mt-3 text-sm text-gray-800 italic" for="libres2">libres2</label>
								<input
									type="datetime-local"
									class="border border-gray-400 p-1 h-7 w-full"
									class:bg-gray-200={gpEditar?.libres2 == null}
									name="libres2"
									value={formatDate(gpEditar?.libres2)}
								/>
							</div>
							<div class="flex flex-col w-full">
								<label class=" mt-3 text-sm text-gray-800 italic" for="libres3">libres3</label>
								<input
									type="datetime-local"
									class="border border-gray-400 p-1 h-7 w-full"
									class:bg-gray-200={gpEditar?.libres3 == null}
									name="libres3"
									value={formatDate(gpEditar?.libres3)}
								/>
							</div>
						</div>
						<div class="flex flex-col md:flex-row w-full gap-3">
							<div class="flex flex-col w-full md:w-auto">
								<label class=" mt-3 text-sm text-gray-800 italic" for="clasificacionSprint"
									>Clasificación Sprint</label
								>
								<input
									type="datetime-local"
									class="border border-gray-400 p-1 h-7 w-full"
									class:bg-gray-200={gpEditar?.clasificacionSprint == null}
									name="clasificacionSprint"
									value={formatDate(gpEditar?.clasificacionSprint)}
								/>
							</div>
							<div class="flex flex-col w-full md:w-auto">
								<label class=" mt-3 text-sm text-gray-800 italic" for="sprint">Sprint</label>
								<input
									type="datetime-local"
									class="border border-gray-400 p-1 h-7 w-full"
									class:bg-gray-200={gpEditar?.sprint == null}
									name="sprint"
									value={formatDate(gpEditar?.sprint)}
								/>
							</div>
						</div>

						<div class="flex justify-between mt-5">
							{#if loading && gpId === gpEditar?.id}
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
							{#if !loading || gpId !== gpEditar?.id}
								<button
									type="submit"
									class="flex w-fit cursor-pointer items-center border bg-teal-800 p-1 text-white hover:bg-teal-500 hover:text-black"
								>
									<Send clas="h-5" />
								</button>
								<button
									type="button"
									class="flex w-fit cursor-pointer items-center border bg-red-700 p-1 text-center text-white hover:bg-red-500 hover:text-black"
									on:click={() => eliminar(gpEditar?.id ?? 0)}
								>
									<Trash clas="mx-1 h-4 w-4" />
								</button>
							{/if}
						</div>
					</div>
				</form>
				<!-- 	{/if} -->
			</Modal>
			<!-- 
			<hr class="my-2 border-gray-300" />

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
						<div class="flex flex-col w-full md:w-auto">
							<label class=" mt-3 text-sm text-gray-800 italic" for="limite_apostar"
								>Limite apostar</label
							>
							<input
								type="datetime-local"
								class="border border-gray-400 p-1 h-7"
								id="limite_apostar"
								name="limite_apostar"
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
			</form> -->
		{/if}
	</section>
</div>
