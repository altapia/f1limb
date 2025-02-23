<script lang="ts">
	import Edit from "@/icons/Edit.svelte"
	import Trash from "@/icons/Trash.svelte"
	import type { ParticipanteVO, TeamVO, TemporadaVO, UserVO } from "@/lib/model"
	let responseMessage: string = ""

	let loading = false
	let participanteId: number | null = null
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

	// Se obtienen los participantes
	let participantes: ParticipanteVO[] = []
	async function getParticipantes(temporadaId: number | null) {
		if (temporadaId == null) return
		loading = true
		participantes = await fetch(`/api/admin/participante/${temporadaId}`).then((response) =>
			response.json()
		)
		loading = false
	}

	// Se obtienen los usuarios
	let usuarios: UserVO[] = []
	async function getUsuarios() {
		loading = true
		usuarios = await fetch("/api/admin/user").then((response) => response.json())
		loading = false
	}
	getUsuarios().catch(console.error)

	// Se obtienen los equipos
	let equipos: TeamVO[] = []
	async function getEquipos() {
		loading = true
		equipos = await fetch("/api/admin/team").then((response) => response.json())
		loading = false
	}
	getEquipos().catch(console.error)

	async function crear(e: SubmitEvent) {
		e.preventDefault()
		const formData = new FormData(e.currentTarget as HTMLFormElement)

		loading = true
		participanteId = null
		const response = await fetch(`/api/admin/participante/${temporadaId}`, {
			method: "POST",
			body: formData,
		}).finally(() => {
			loading = false
		})
		const data = await response.json()
		responseMessage = data.message
		if (response.status == 200) {
			const userElement = document.getElementById("userId") as HTMLInputElement
			const teamElement = document.getElementById("teamId") as HTMLInputElement

			if (userElement != null) userElement.value = ""
			if (teamElement != null) teamElement.value = ""

			getParticipantes(temporadaId).catch(console.error)
		}
	}

	async function actualizar(e: SubmitEvent) {
		e.preventDefault()
		const formData = new FormData(e.currentTarget as HTMLFormElement)
		loading = true
		participanteId = Number(formData.get("id"))
		const response = await fetch(`/api/admin/participante/${temporadaId}`, {
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
			participanteId = id
			formData.append("id", id.toString())
			const response = await fetch(`/api/admin/participante/${temporadaId}`, {
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

		{#if temporadaId !== null}
			<form on:submit={crear}>
				<div class="flex md:flex-row flex-col md:items-end justify-center gap-3">
					<div class="flex flex-col w-full md:w-auto">
						<label class=" mt-3 text-sm text-gray-800 italic" for="userId">Usuario</label>
						<select class="w-full p-2 mx-2 border border-gray-400" name="userId" id="userId">
							<option value="">Selecciona un usuario</option>
							{#each usuarios as u}
								<option value={u.id}>{u.nombre}</option>
							{/each}
						</select>
					</div>
					<div class="flex flex-col w-full md:w-auto">
						<label class=" mt-3 text-sm text-gray-800 italic" for="teamId">Equipo</label>
						<select class="w-full p-2 mx-2 border border-gray-400" name="teamId" id="teamId">
							<option value="">Selecciona un equipo</option>
							{#each equipos as e}
								<option value={e.id}>{e.nombre}</option>
							{/each}
						</select>
					</div>
					<div class="flex justify-center">
						{#if loading && participanteId === null}
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
						{#if !loading || participanteId !== null}
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

			{#each participantes as p}
				<form on:submit={actualizar}>
					<div
						class="flex md:flex-row flex-col md:items-end justify-center md:gap-3 md:border-0 border-b border-gray-400 pb-3 md:pb-0 px-3 md:px-0"
					>
						<input type="hidden" name="id" value={p.id} />
						<input type="hidden" name="temporadaId" value={p.temporada?.id} />
						<div class="flex flex-col w-full md:w-auto">
							<label class=" mt-3 text-sm text-gray-800 italic" for="id">ID</label>
							<input
								class="border border-gray-400 p-1 w-8 bg-gray-200 text-right text-sm"
								name="id"
								value={p.id}
								disabled
							/>
						</div>
						<div class="flex flex-col w-full md:w-auto">
							<label class=" mt-3 text-sm text-gray-800 italic" for="userId">Usuario</label>
							<select
								disabled
								class="w-full p-1 border border-gray-400"
								name="userId"
								value={p.user?.id}
							>
								<option value="">Selecciona un usuario</option>
								{#each usuarios as u}
									<option value={u.id}>{u.nombre}</option>
								{/each}
							</select>
						</div>
						<div class="flex flex-col w-full md:w-auto">
							<label class=" mt-3 text-sm text-gray-800 italic" for="teamId">Equipo</label>
							<select class="w-full p-1 border border-gray-400" name="teamId" value={p.team?.id}>
								<option value="">Selecciona un equipo</option>
								{#each equipos as e}
									<option value={e.id}>{e.nombre}</option>
								{/each}
							</select>
						</div>
						<div class="flex justify-between mt-5">
							{#if loading && participanteId === p.id}
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
							{#if !loading || participanteId !== p.id}
								<button
									type="submit"
									class="flex w-fit cursor-pointer items-center border bg-teal-800 p-1 text-white hover:bg-teal-500 hover:text-black"
								>
									<Edit clas="h-5" />
								</button>
								<button
									type="button"
									class="flex w-fit cursor-pointer items-center border bg-red-700 p-1 text-center text-white hover:bg-red-500 hover:text-black"
									on:click={() => eliminar(p.id ?? 0)}
								>
									<Trash clas="mx-1 h-4 w-4" />
								</button>
							{/if}
						</div>
					</div>
				</form>
			{/each}
		{/if}
	</section>
</div>
