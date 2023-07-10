import * as cheerio from 'cheerio';
import { initDB, insertIntoDB } from './database.js';
import { getAllTournaments, getAllParcourses } from './parse.js';
import { mapAsync } from './utils.js';
import { analyzePDF } from './pdf.js';

const MIN_YEAR = 2014;
const MAX_YEAR = new Date().getFullYear();
const EQUI_SCORE_BASE_URL = 'https://equi-score.de/results';

async function main() {
	try {
		const db = initDB('database.db');

		for (let year = MIN_YEAR; year <= MAX_YEAR; year++) {
			const resultURL = new URL(EQUI_SCORE_BASE_URL);
			resultURL.searchParams.set('year', year.toString());

			const resultPage = await fetch(resultURL).then((res) => res.text());
			const $ = cheerio.load(resultPage);

			const tournaments = getAllTournaments($);

			for (const tournament of tournaments) {
				let resultPage;
				try {
					resultPage = await fetch(tournament.link).then((res) => res.text());
				} catch (e) {
					console.error(e);
					continue;
				}

				const $ = cheerio.load(resultPage);

				const parcourses = getAllParcourses($);

				if (parcourses.length === 0) {
					continue;
				}

				const parsedParcourses = (await mapAsync(parcourses, analyzePDF)).filter(
					(parcours) => parcours !== null
				);

				insertIntoDB(db, parsedParcourses, tournament);
			}
		}

		db.close();
	} catch (e) {
		console.error(e);
	}
}

main();
