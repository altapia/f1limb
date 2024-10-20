<script lang="ts">
	import New from "@/icons/New.svelte"
	import UserCircle from "@/icons/UserCircle.svelte"
	import type { UserVO } from "@/lib/model"
	export let gpId: number
	export let listUsers: UserVO[]
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
	<UserCircle clas="mr-1 h-7 w-7 text-teal-700" />
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
			<textarea class="border border-gray-400 p-2" rows="3" id="desc" name="descripcion" required
			></textarea>
		</div>
		<div class="flex flex-col md:flex-row gap-3">
			<div class="w-full flex flex-col">
				<label class=" mt-3 text-sm text-gray-800 italic" for="importe">Importe</label>
				<input
					required
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
					step="0.001"
					class="border border-gray-400 p-2"
					id="cuota"
					name="cuota"
				/>
			</div>
			<div class="w-full flex flex-col">
				<label class=" mt-3 text-sm text-gray-800 italic" for="estado">Estado</label>
				<select id="estado" name="estado" class="border border-gray-400 p-2" required>
					<option value={0}>Borrador</option>
					<option value={1}>Pendiente</option>
					<option value={2}>Acertada</option>
					<option value={3}>Fallada</option>
				</select>
			</div>
			<div class="w-full flex flex-col">
				<label class=" mt-3 text-sm text-gray-800 italic" for="user">Usuario</label>
				<select id="user" name="userId" class="border border-gray-400 p-2" required>
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
				<New clas="mr-1 h-6 w-6" />
				Crear
			</button>
		</div>
	</form>
</div>
