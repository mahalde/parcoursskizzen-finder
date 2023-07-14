import { fail } from '@sveltejs/kit';
import { sql } from '@vercel/postgres';
import { z } from 'zod';

const heights = [
	0.1, 0.3, 0.4, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1, 1.05, 1.1, 1.15, 1.2,
	1.25, 1.3, 1.35, 1.4, 1.45, 1.5, 1.55, 1.6, 1.8, 1.9
];

const numberOfObstacles = [
	0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 24, 25
];

const numberOfEfforts = [
	0, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 28
];

const form = [
	{
		name: 'minHeight',
		label: 'Min. Höhe',
		values: heights,
		displays: heights.map((height) => `${height}m`)
	},
	{
		name: 'maxHeight',
		label: 'Max. Höhe',
		values: heights,
		displays: heights.map((height) => `${height}m`)
	},
	{
		name: 'minObstacles',
		label: 'Min. Hindernisse',
		values: numberOfObstacles,
		displays: numberOfObstacles.map(
			(obstacle) => `${obstacle} Hindernis${obstacle === 1 ? '' : 'se'}`
		)
	},
	{
		name: 'maxObstacles',
		label: 'Max. Hindernisse',
		values: numberOfObstacles,
		displays: numberOfObstacles.map(
			(obstacle) => `${obstacle} Hindernis${obstacle === 1 ? '' : 'se'}`
		)
	},
	{
		name: 'minEfforts',
		label: 'Min. Sprünge',
		values: numberOfEfforts,
		displays: numberOfEfforts.map((effort) => `${effort} ${effort === 1 ? 'Sprung' : 'Sprünge'}`)
	},
	{
		name: 'maxEfforts',
		label: 'Max. Sprünge',
		values: numberOfEfforts,
		displays: numberOfEfforts.map((effort) => `${effort} ${effort === 1 ? 'Sprung' : 'Sprünge'}`)
	}
];

export const load = async () => ({ form });

const castToNumber = (value: unknown) => (isNaN(value as number) ? undefined : Number(value));

const ParcoursSchema = z.object({
	minHeight: z.preprocess(castToNumber, z.number().min(-1).default(-1)),
	maxHeight: z.preprocess(castToNumber, z.number().min(0).default(10)),
	minObstacles: z.preprocess(castToNumber, z.number().min(-1).default(-1)),
	maxObstacles: z.preprocess(castToNumber, z.number().min(0).default(100)),
	minEfforts: z.preprocess(castToNumber, z.number().min(-1).default(-1)),
	maxEfforts: z.preprocess(castToNumber, z.number().min(0).default(100)),
	limit: z.number().min(25).max(100).default(25)
});

export const actions = {
	async default({ request }) {
		const formData = await request.formData();

		const result = ParcoursSchema.safeParse(Object.fromEntries(formData));

		if (!result.success) {
			console.log(result.error.flatten().fieldErrors);
			return fail(400, { error: 'Ungültige Eingabedaten' });
		}

		const parcours = await sql`
			SELECT * FROM parcours
			WHERE height BETWEEN ${result.data.minHeight} AND ${result.data.maxHeight}
			AND numberOfObstacles BETWEEN ${result.data.minObstacles} AND ${result.data.maxObstacles}
			AND numberOfEfforts BETWEEN ${result.data.minEfforts} AND ${result.data.maxEfforts}
			ORDER BY RANDOM()
			LIMIT ${result.data.limit};
		`;

		console.log(parcours);

		return { parcours: parcours.rows };
	}
};
