<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import '../app.css';
	export let data;
	export let form;

	let loading = false;
	const handleSubmit: SubmitFunction = ({ formData }) => {
		loading = true;
		const keysWithValue = new Set();
		for (const [key, value] of formData.entries()) {
			if (value !== '--') {
				keysWithValue.add(key);
			}
		}

		const keys = [...formData.keys()];
		keys.forEach((key) => {
			if (!keysWithValue.has(key)) {
				formData.delete(key);
			}
		});

		return async ({ result }) => {
			loading = false;
			await applyAction(result);
		};
	};

	function convertDate(rawDate: string) {
		const date = new Date(parseInt(rawDate));
		return `${padDate(date.getDate())}.${padDate(
			date.getMonth() + 1
		)}.${date.getFullYear()} ${padDate(date.getHours())}:${padDate(date.getMinutes())}`;
	}

	function padDate(date: number) {
		return date.toString().padStart(2, '0');
	}

	function displayData(data: number | null | undefined, suffix?: string) {
		if (data === null || data === undefined || data === -1) {
			return '--';
		}

		if (suffix) {
			return data + suffix;
		}

		return data;
	}
</script>

<div class="flex flex-col items-center gap-10">
	<section class="text-center">
		<h1 class="text-4xl font-bold mt-4 mb-2">Parcoursskizzen</h1>
		<p>Über 19.000 Skizzen zur Auswahl!</p>
	</section>

	<form use:enhance={handleSubmit} method="POST" class="grid grid-cols-2 gap-8">
		{#each data.form as control (control.name)}
			<div>
				<label class="flex flex-col">
					<span>
						{control.label}
					</span>
					<select name={control.name} class="border border-gray-200 rounded-lg p-1">
						<option>--</option>
						{#each control.values as value, i}
							<option {value}>{control.displays[i]}</option>
						{/each}
					</select>
				</label>
			</div>
		{/each}
		<button
			disabled={loading}
			type="submit"
			class="col-span-full flex justify-center bg-yellow-400 text-yellow-900 rounded p-2"
		>
			{#if loading}
				<svg
					aria-hidden="true"
					class="w-6 h-6 mr-2 text-yellow-600 animate-spin fill-yellow-400"
					viewBox="0 0 100 101"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
						fill="currentColor"
					/>
					<path
						d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
						fill="currentFill"
					/>
				</svg>
			{/if}
			Zufällige Skizzen finden</button
		>
	</form>

	<main>
		{#if form?.error}
			<span class="text-red-500">{form.error}</span>
		{:else if form?.parcours?.length}
			<div class="flex flex-wrap gap-2 items-stretch justify-center m-4">
				{#each form.parcours as parcours (parcours.link)}
					<div class="p-4 shrink basis-72 border border-gray-200 rounded shadow">
						<div class="h-full grid grid-rows-[auto_1fr_auto_auto]">
							<div class="text-gray-500">
								{parcours.location}{parcours.date ? ', ' + convertDate(parcours.date) : ''}
							</div>
							<p class="text-xl">{parcours.competitionName}</p>
							<div class="mt-4 gap-x-2 flex justify-between flex-wrap">
								<div>
									<div class="uppercase">Höhe:</div>
									<div class="text-right">{displayData(parcours.height, 'm')}</div>
								</div>
								<div>
									<div class="uppercase">Hindernisse:</div>
									<div class="text-right">{displayData(parcours.numberOfObstacles)}</div>
								</div>
								<div>
									<div class="uppercase">Sprünge:</div>
									<div class="text-right">{displayData(parcours.numberOfEfforts)}</div>
								</div>
							</div>
							<a
								class="mt-8 text-blue-400 underline text-center"
								href={parcours.link}
								target="_blank">Parcoursskizze anschauen</a
							>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="text-center">
				<p>Keine Skizzen gefunden</p>
				<p>Vielleicht solltest du die Filter anpassen 👀</p>
			</div>
		{/if}
	</main>

	<footer class="mt-auto">
		<div class="text-center">
			<p>Made with ❤ by <a class="underline" href="https://instagram.com/mahalde_">Malte</a></p>
			<p>
				Icons erstellt von
				<a class="underline" href="https://www.freepik.com" title="Freepik">Freepik</a>
				from
				<a class="underline" href="https://www.flaticon.com/de/" title="Flaticon"
					>www.flaticon.com</a
				>
			</p>
		</div>
	</footer>
</div>
