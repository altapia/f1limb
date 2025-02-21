<script lang="ts">
	import Edit from "@/icons/Edit.svelte"
	import Trash from "@/icons/Trash.svelte"
	import type { TeamVO } from "@/lib/model"
	let responseMessage: string

	let loading = false
	let teamId: number | null = null

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
		teamId = null
		const response = await fetch("/api/admin/team", {
			method: "POST",
			body: formData,
		}).finally(() => {
			loading = false
		})
		const data = await response.json()
		responseMessage = data.message
		if (response.status == 200) {
			const nombreElement = document.getElementById("nombre") as HTMLInputElement

			if (nombreElement != null) nombreElement.value = ""

			getEquipos().catch(console.error)
		}
	}

	async function actualizar(e: SubmitEvent) {
		e.preventDefault()
		const formData = new FormData(e.currentTarget as HTMLFormElement)
		loading = true
		teamId = Number(formData.get("id"))
		const response = await fetch("/api/admin/team", {
			method: "PUT",
			body: formData,
		}).finally(() => {
			loading = false
		})
		const data = await response.json()
		responseMessage = data.message
	}

	async function eliminar(teamId: number) {
		if (confirm("Seguro?")) {
			const formData = new FormData()
			formData.append("id", teamId.toString())

			loading = true
			teamId = Number(formData.get("id"))

			const response = await fetch("/api/admin/team", {
				method: "DELETE",
				body: formData,
			})

			const data = await response.json()
			responseMessage = data.message
			getEquipos()
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
				{#if loading && teamId === null}
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
				{#if !loading || teamId !== null}
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

	{#each equipos as t}
		<form on:submit={actualizar}>
			<div class="flex items-end gap-3">
				<input type="hidden" name="id" value={t.id} />
				<div class="flex flex-col">
					<label class=" mt-3 text-sm text-gray-800 italic" for="id">ID</label>
					<input
						class="border border-gray-400 p-2 w-10 bg-gray-200 text-right"
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
					{#if loading && teamId === t.id}
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
					{#if !loading || teamId !== t.id}
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
