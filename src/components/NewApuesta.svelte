<script lang="ts">
	import Edit from "@/icons/Edit.svelte"
	import type { Apuesta, User } from "@/lib/model"
	export let gpId: number
	export let listUsers: User[]
	let responseMessage: string

	async function submit(e: SubmitEvent) {
		e.preventDefault()
		const formData = new FormData(e.currentTarget as HTMLFormElement)

		const response = await fetch("/api/admin/apuesta/new", {
			method: "POST",
			body: formData,
		})
		const data = await response.json()
		if (response.status == 200) {
			location.href = "/gp/" + gpId + "/admin"
			return
		}
		responseMessage = data.message
	}
</script>

<h2 class="my-5 flex max-w-max items-center p-2 text-2xl font-semibold">
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke-width="1.5"
		stroke="currentColor"
		class="mr-1 h-7 w-7 text-teal-700"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
		></path>
	</svg>

	Nueva apuesta
</h2>
<div class="mb-5">
	{#if responseMessage}
		<p class="text-center text-red-500">{responseMessage}</p>
	{/if}
	<form on:submit={submit}>
		<input type="hidden" name="gpId" value={gpId} />
		<div class="flex flex-col">
			<label class=" mt-3 text-sm text-gray-800 italic" for="desc">Descripción</label>
			<textarea class="border border-gray-400 p-2" rows="3" id="desc" name="descripcion"></textarea>
		</div>
		<div class="flex flex-col md:flex-row gap-3">
			<div class="w-full flex flex-col">
				<label class=" mt-3 text-sm text-gray-800 italic" for="importe">Importe</label>
				<input
					type="number"
					step="0.01"
					class="border border-gray-400 p-2"
					id="importe"
					name="importe"
				/>
			</div>
			<div class="w-full flex flex-col">
				<label class=" mt-3 text-sm text-gray-800 italic" for="cuota">Cuota</label>
				<input
					type="number"
					step="0.01"
					class="border border-gray-400 p-2"
					id="cuota"
					name="cuota"
				/>
			</div>
			<div class="w-full flex flex-col">
				<label class=" mt-3 text-sm text-gray-800 italic" for="estado">Estado</label>
				<select id="estado" name="estado" class="border border-gray-400 p-2">
					<option value={1}>Pendiente</option>
					<option value={2}> Acertada </option>
					<option value={3}> Fallada </option>
				</select>
			</div>
			<div class="w-full flex flex-col">
				<label class=" mt-3 text-sm text-gray-800 italic" for="user">Usuario</label>
				<select id="user" name="userId" class="border border-gray-400 p-2">
					<option value="" class="text-gray-300">Seleccione...</option>
					{#each listUsers as user}
						<option value={user.id}>{user.nombre}</option>
					{/each}
				</select>
			</div>
		</div>
		<div class="flex w-full justify-center mt-5">
			<button
				type="submit"
				class="flex w-fit cursor-pointer items-center border bg-teal-800 p-2 text-white hover:bg-teal-500 hover:text-black"
			>
				<Edit />
				Crear
			</button>
		</div>
	</form>
</div>
