<script lang="ts">
	import Edit from "@/icons/Edit.svelte"
	import Trash from "@/icons/Trash.svelte"
	import type { UserVO } from "@/lib/model"
	let responseMessage: string

	let loading = false
	let userId: number | null = null

	// Se obtienen los usuarios
	let usuarios: UserVO[] = []
	async function getUsuarios() {
		loading = true
		usuarios = await fetch("/api/admin/user").then((response) => response.json())
		loading = false
	}
	getUsuarios().catch(console.error)

	async function crear(e: SubmitEvent) {
		e.preventDefault()
		const formData = new FormData(e.currentTarget as HTMLFormElement)

		loading = true
		userId = null
		const response = await fetch("/api/admin/user", {
			method: "POST",
			body: formData,
		}).finally(() => {
			loading = false
		})
		const data = await response.json()
		responseMessage = data.message
		if (response.status == 200) {
			const nombreElement = document.getElementById("nombre") as HTMLInputElement
			const emailElement = document.getElementById("email") as HTMLInputElement
			const adminElement = document.getElementById("admin") as HTMLInputElement
			const telegramElement = document.getElementById("telegramId") as HTMLInputElement

			if (nombreElement != null) nombreElement.value = ""
			if (emailElement != null) emailElement.value = ""
			if (adminElement != null) adminElement.value = "false"
			if (telegramElement != null) telegramElement.value = ""

			getUsuarios().catch(console.error)
		}
	}

	async function actualizar(e: SubmitEvent) {
		e.preventDefault()
		const formData = new FormData(e.currentTarget as HTMLFormElement)
		loading = true
		userId = Number(formData.get("id"))
		const response = await fetch("/api/admin/user", {
			method: "PUT",
			body: formData,
		}).finally(() => {
			loading = false
		})
		const data = await response.json()
		responseMessage = data.message
	}

	async function eliminar(usuarioId: number) {
		if (confirm("Seguro?")) {
			const formData = new FormData()
			loading = true
			userId = Number(formData.get("id"))
			formData.append("id", usuarioId.toString())
			const response = await fetch("/api/admin/user", {
				method: "DELETE",
				body: formData,
			})

			const data = await response.json()
			responseMessage = data.message
			getUsuarios()
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
			<div class="flex flex-col">
				<label class=" mt-3 text-sm text-gray-800 italic" for="email">Email</label>
				<input class="border border-gray-400 p-2" id="email" name="email" value="" />
			</div>
			<div class="flex flex-col">
				<label class=" mt-3 text-sm text-gray-800 italic" for="admin">Admin</label>
				<select class="border border-gray-400 p-2" id="admin" name="admin">
					<option value="0">No</option>
					<option value="1">Si</option>
				</select>
			</div>
			<div class="flex flex-col">
				<label class=" mt-3 text-sm text-gray-800 italic" for="telegramId">ID Telegram</label>
				<input
					class="border border-gray-400 p-2"
					id="telegramId"
					type="number"
					name="telegramId"
					value=""
				/>
			</div>
			<div class="flex">
				{#if loading && userId === null}
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
				{#if !loading || userId !== null}
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

	{#each usuarios as u}
		<form on:submit={actualizar}>
			<div class="flex items-end gap-3">
				<input type="hidden" name="id" value={u.id} />
				<div class="flex flex-col">
					<label class=" mt-3 text-sm text-gray-800 italic" for="id">ID</label>
					<input
						class="border border-gray-400 p-2 w-10 bg-gray-200 text-right"
						name="id"
						value={u.id}
						disabled
					/>
				</div>
				<div class="flex flex-col">
					<label class=" mt-3 text-sm text-gray-800 italic" for="nombre">Nombre</label>
					<input class="border border-gray-400 p-2 w-full" name="nombre" value={u.nombre} />
				</div>
				<div class="flex flex-col">
					<label class=" mt-3 text-sm text-gray-800 italic" for="email">Email</label>
					<input class="border border-gray-400 p-2" id="email" name="email" value={u.email} />
				</div>
				<div class="flex flex-col">
					<label class=" mt-3 text-sm text-gray-800 italic" for="admin">Admin</label>
					<select
						class="border border-gray-400 p-2"
						class:bg-yellow-500={u.admin}
						name="admin"
						value={u.admin}
					>
						<option value={false}>No</option>
						<option value={true}>Si</option>
					</select>
				</div>
				<div class="flex flex-col">
					<label class=" mt-3 text-sm text-gray-800 italic" for="telegramId">ID Telegram</label>
					<input class="border border-gray-400 p-2" name="telegramId" value={u.telegramId} />
				</div>
				<div class="flex justify-between mt-5">
					{#if loading && userId === u.id}
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
					{#if !loading || userId !== u.id}
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
							on:click={() => eliminar(u.id ?? 0)}
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
