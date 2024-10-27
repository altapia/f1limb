<script lang="ts">
	import Check from "@/icons/Check.svelte"
	import Clock from "@/icons/Clock.svelte"
	import Close from "@/icons/Close.svelte"
	import Edit from "@/icons/Edit.svelte"
	import AtOff from "@/icons/AtOff.svelte"
	import type { UserVO } from "@/lib/model"
	import UserCircle from "@/icons/UserCircle.svelte"
	export let listApuestasUser: UserVO[]
	let responseMessage: string

	async function onChange(e: Event, id: number | undefined) {
		const target = e.target as HTMLSelectElement
		const newEstado = target.value
		const formData = new FormData()
		if (!id) {
			return
		}
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

	let verSinCuota = false
</script>

<div class="flex justify-end">
	<label class="inline-flex items-center cursor-pointer">
		<input type="checkbox" class="sr-only peer" on:change={() => (verSinCuota = !verSinCuota)} />
		<div
			class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full
			peer peer-checked:after:translate-x-full peer-checked:after:border-white
			after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300
			after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"
		></div>
		<span class="flex text-teal-800 ml-2">
			<AtOff clas="mr-1 h-5 w-5 text-teal-800" /> Sin Cuota
		</span>
	</label>
</div>

{#each listApuestasUser as u}
	{#if u.apuestas && u.apuestas.length > 0}
		<li class="my-3 flex flex-col">
			<h4 class=" flex font-semibold text-xl">
				<UserCircle clas="mr-1 h-7 w-7 text-teal-700" />
				{u.nombre}
			</h4>
			{#each u.apuestas as ap, index}
				{#if !verSinCuota || (verSinCuota && ap.cuota == null)}
					<ul class="ml-2">
						<li
							class="p-2 flex flex-col md:grid md:grid-cols-[1fr_120px_50px] items-center justify-between"
							class:bg-gray-200={index % 2 == 0}
							class:bg-gray-100={index % 2 != 0}
						>
							<div class="flex md:items-center items-start flex-col md:flex-row w-full">
								<div class="flex md:items-center items-start">
									{#if ap.estado == 1}
										<span>
											<Clock clas="mr-1 h-5 w-5 text-gray-500" />
										</span>
									{/if}
									{#if ap.estado == 2}
										<span>
											<Check clas="mr-1 h-5 w-5 text-green-500" />
										</span>
									{/if}
									{#if ap.estado == 3}
										<span>
											<Close clas="mr-1 h-5 w-5 text-red-500" />
										</span>
									{/if}
									<span>{@html ap.descripcion}</span>
								</div>
								<div class="flex md:ml-3 w-full md:w-fit justify-end">
									<span class="mx-1 font-semibold">{ap.importe}€</span>
									{#if ap.cuota}
										<span class="font-semibold">@{ap.cuota}</span>
									{/if}
								</div>
							</div>

							<div class="flex flex-row items-center">
								<div class="flex flex-col items-center justify-center">
									<div class="flex">
										<div
											id={"loading-" + ap.id}
											class="invisible inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em]
												text-teal-500 motion-reduce:animate-[spin_1.5s_linear_infinite]"
											role="status"
										>
											<span
												class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
												>Loading...</span
											>
										</div>
										<select
											id={"select-" + ap.id}
											on:change={(e) => onChange(e, ap.id)}
											bind:value={ap.estado}
											class="rounded p-2"
											class:bg-yellow-200={ap.estado === 0}
											class:bg-transparent={ap.estado === 1}
											class:bg-green-300={ap.estado === 2}
											class:bg-red-300={ap.estado === 3}
										>
											<option value={0}>Borrador</option>
											<option value={1}>Pendiente</option>
											<option value={2}>Acertada</option>
											<option value={3}>Fallada</option>
										</select>
									</div>
									<p class="invisble mx-1 text-xs" id={"msg-" + ap.id}></p>
								</div>
								<div class="flex justify-center">
									<a href={"./admin/" + ap.id} class="text-teal-500 mx-3"><Edit /></a>
								</div>
							</div>
						</li>
					</ul>
				{/if}
			{/each}
		</li>
	{/if}
{/each}
