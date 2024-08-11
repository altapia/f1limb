<script lang="ts">
	import Edit from "@/icons/Edit.svelte"
	import Trash from "@/icons/Trash.svelte"
	import UserCircle from "@/icons/UserCircle.svelte"
	import type { ApuestaVO } from "@/lib/model"
	export let apuesta: ApuestaVO
	let responseMessage: string

	async function submit(e: SubmitEvent) {
		e.preventDefault()
		const formData = new FormData(e.currentTarget as HTMLFormElement)

		const response = await fetch("/api/admin/apuesta/update", {
			method: "POST",
			body: formData,
		})
		const data = await response.json()
		if (response.status == 200) {
			location.href = "/gp/" + apuesta.gp?.id + "/admin"
			return
		}
		responseMessage = data.message
	}

	async function eliminar() {
		if (confirm("Seguro?")) {
			const formData = new FormData()
			formData.append("id", apuesta.id ? apuesta.id.toString() : "")
			const response = await fetch("/api/admin/apuesta/delete", {
				method: "DELETE",
				body: formData,
			})
			const data = await response.json()
			if (response.status == 200) {
				location.href = "/gp/" + apuesta.gp?.id + "/admin"
				return
			}
			responseMessage = data.message
		}
	}
</script>

<h2 class="my-5 flex max-w-max items-center p-2 text-2xl font-semibold">
	<UserCircle clas="mr-1 h-7 w-7 text-teal-700" />
	{apuesta.user?.nombre}
</h2>
<div class="mb-5">
	{#if responseMessage}
		<p class="text-center text-red-500">{responseMessage}</p>
	{/if}
	<form on:submit={submit}>
		<input type="hidden" name="id" value={apuesta.id} />
		<div class="flex flex-col">
			<label class=" mt-3 text-sm text-gray-800 italic" for="desc">Descripción</label>
			<textarea class="border border-gray-400 p-2" rows="3" id="desc" name="descripcion"
				>{apuesta.descripcion}</textarea
			>
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
					value={apuesta.importe}
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
					value={apuesta.cuota}
				/>
			</div>
			<div class="w-full flex flex-col">
				<label class=" mt-3 text-sm text-gray-800 italic" for="estado">Estado</label>
				<select
					id="estado"
					name="estado"
					bind:value={apuesta.estado}
					class="border border-gray-400 p-2"
					class:bg-transparent={apuesta.estado === 1}
					class:bg-green-300={apuesta.estado === 2}
					class:bg-red-300={apuesta.estado === 3}
				>
					<option value={1}>Pendiente</option>
					<option value={2}> Acertada </option>
					<option value={3}> Fallada </option>
				</select>
			</div>
			<div class="w-full flex flex-col">
				<label class=" mt-3 text-sm text-gray-800 italic" for="ganancia">Ganancia</label>
				<span class="border border-gray-400 p-2 bg-gray-200">{apuesta.ganancia}</span>
			</div>
		</div>
		<div class="flex w-full justify-center mt-5">
			<button
				type="submit"
				class="flex w-fit cursor-pointer items-center border bg-teal-800 p-2 text-white hover:bg-teal-500 hover:text-black"
			>
				<Edit />
				Actualizar
			</button>
			<button
				on:click={eliminar}
				type="button"
				class="flex w-fit cursor-pointer items-center border bg-red-700 p-2 text-white hover:bg-red-500 hover:text-black"
			>
				<Trash clas="mr-1 h-4 w-4" />
				Eliminar
			</button>
		</div>
	</form>
</div>
