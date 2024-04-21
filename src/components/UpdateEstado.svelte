<script lang="ts">
	import Check from "@/icons/Check.svelte"
	import Clock from "@/icons/Clock.svelte"
	import Close from "@/icons/Close.svelte"
	import Edit from "@/icons/Edit.svelte"
	import type { UserVO } from "@/lib/model"
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
</script>

{#each listApuestasUser as u}
	{#if u.apuestas && u.apuestas.length > 0}
		<li class="my-3 flex flex-col">
			<h4 class="font-semibold text-xl">{u.nombre}</h4>

			{#each u.apuestas as ap, index}
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
								<span class="font-semibold">@{ap.cuota}</span>
							</div>
						</div>

						<div class="flex flex-row items-center">
							<div class="flex flex-col items-center justify-center">
								<div class="flex">
									<div
										id={"loading-" + ap.id}
										class="invisible inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-teal-500 motion-reduce:animate-[spin_1.5s_linear_infinite]"
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
										class:bg-transparent={ap.estado === 1}
										class:bg-green-300={ap.estado === 2}
										class:bg-red-300={ap.estado === 3}
									>
										<option value={1}>Pendiente</option>
										<option value={2}> Acertada </option>
										<option value={3}> Fallada </option>
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
			{/each}
		</li>
	{/if}
{/each}
