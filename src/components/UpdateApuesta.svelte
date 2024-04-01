<script lang="ts">
	import type { Apuesta } from "@/lib/model"
	export let apuesta: Apuesta
	let responseMessage: string

	async function onChange(e: Event, id: number) {
		const target = e.target as HTMLSelectElement
		const newEstado = target.value
		const formData = new FormData()
		formData.append("id", id.toString())
		formData.append("estado", newEstado)

		let loadingEle = document.getElementById("loading-" + id)
		if (loadingEle) {
			loadingEle.style.display = "block"
		}
		let msgEle = document.getElementById("msg-" + id)
		if (msgEle) {
			msgEle.innerText = ""
		}
		const response = await fetch("/api/admin/apuesta/estado", {
			method: "POST",
			body: formData,
		}).finally(() => {
			if (loadingEle) {
				loadingEle.style.display = "none"
			}
		})
		const data = await response.json()
		responseMessage = data.message
		if (msgEle) {
			msgEle.innerText = responseMessage
			document.getElementById("loading-" + id)?.classList.remove("invisible")
		}
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

	{apuesta.user.nombre}
</h2>
<div class="mb-5">
	<div class="flex flex-col">
		<label class=" mt-3 text-sm text-gray-800 italic" for="desc">Descripción</label>
		<textarea class="border border-gray-400 p-2" rows="3" id="desc">{apuesta.descripcion}</textarea>
	</div>
	<div class="flex flex-col md:flex-row gap-3">
		<div class="w-full flex flex-col">
			<label class=" mt-3 text-sm text-gray-800 italic" for="importe">Importe</label>
			<input
				type="number"
				class="border border-gray-400 p-2"
				id="importe"
				value={apuesta.importe}
			/>
		</div>
		<div class="w-full flex flex-col">
			<label class=" mt-3 text-sm text-gray-800 italic" for="cuota">Cuota</label>
			<input type="number" class="border border-gray-400 p-2" id="cuota" value={apuesta.cuota} />
		</div>
		<div class="w-full flex flex-col">
			<label class=" mt-3 text-sm text-gray-800 italic" for="estado">Estado</label>
			<select
				id="estado"
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
	</div>
	<div class="flex w-full justify-center mt-5">
		<button
			type="submit"
			class="flex w-fit cursor-pointer items-center border bg-teal-800 p-2 text-white hover:bg-teal-500 hover:text-black"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="mr-1 h-4 w-4"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
				></path>
			</svg> Enviar
		</button>
		<button
			type="submit"
			class="flex w-fit cursor-pointer items-center border bg-red-700 p-2 text-white hover:bg-red-500 hover:text-black"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="mr-1 h-4 w-4"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
				></path>
			</svg> Eliminar
		</button>
	</div>
</div>
