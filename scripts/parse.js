import { isValid, parse } from 'date-fns';
import { de } from 'date-fns/locale/index.js';

const EQUI_SCORE_RESULTS_BASE_URL = 'https://results.equi-score.de';

export const getAllTournaments = (/** @type {import('cheerio').CheerioAPI} */ $) => {
	const boxes = $('[id^=evt]');

	return boxes.toArray().map((el) => mapTournament($, el));
};

const mapTournament = (
	/** @type {import('cheerio').CheerioAPI} */ $,
	/** @type {import('cheerio').Element} */ el
) => {
	const name = $('.evt_caption', el).text().trim();
	const organizer = $('.evt_showoffice', el).text().trim();
	const location = $('.evt_locator', el).text().trim();
	const /** @type {string} */ link = $('a', el).attr('href');

	return {
		name,
		organizer,
		location,
		link
	};
};

export const getAllParcourses = (/** @type {import('cheerio').CheerioAPI} */ $) => {
	const parcoursLinks = $('a[href*="parcour"]');

	if (parcoursLinks.length === 0) {
		return [];
	}

	const parcourses = parcoursLinks
		.map((i, el) => {
			const row = $(el).parentsUntil('.row').parent();
			const rawDate = row.prevUntil('.th_date').last().prev().text().replace(/\s/g, '');
			const /** @type {string} */ link = EQUI_SCORE_RESULTS_BASE_URL + $(el).attr('href');

			let date = parse(rawDate, 'EEEE,d.MMMMyyyy', new Date(), { locale: de });
			let rawTime = row.children().first().text().replace(/\s/g, '');
			const dateWithTime = parse(rawTime, 'HH:mm', date);
			date = isValid(dateWithTime) ? dateWithTime : date;

			const name = row.children().eq(2).children().last().text().replace(/\n/g, ' ').trim();

			return {
				name,
				date,
				link
			};
		})
		.toArray();

	return parcourses;
};
