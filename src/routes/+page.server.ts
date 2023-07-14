import { Parcours, getDistinctValuesFromDB, sequelize } from '$lib/database';
import { fail } from '@sveltejs/kit';
import { Op } from 'sequelize';
import { z } from 'zod';

export const load = async () => {
	const [heights, numberOfObstacles, numberOfEfforts] = await Promise.all([
		getDistinctValuesFromDB('height'),
		getDistinctValuesFromDB('numberOfObstacles'),
		getDistinctValuesFromDB('numberOfEfforts')
	]);

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

	return {
		form
	};
};

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

		const parcours = await Parcours.findAll({
			limit: result.data.limit,
			where: {
				height: {
					[Op.between]: [result.data.minHeight, result.data.maxHeight]
				},
				numberOfObstacles: {
					[Op.between]: [result.data.minObstacles, result.data.maxObstacles]
				},
				numberOfEfforts: {
					[Op.between]: [result.data.minEfforts, result.data.maxEfforts]
				}
			},
			order: sequelize.random()
		});

		return { parcours: parcours.map((model) => model.dataValues) };
	}
};
