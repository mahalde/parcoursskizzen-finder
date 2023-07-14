import { sql } from '@vercel/postgres';

export async function initDB() {
	await sql`CREATE TABLE IF NOT EXISTS parcours (
		location text,
		tournamentName text,
		organizer text,
		competitionName text,
		date text,
		link text,
		numberOfObstacles number,
		numberOfEfforts number,
		height number
	);`;
}

export async function insertIntoDB(parcourses, tournament) {
	for (const p of parcourses) {
		await sql`
			INSERT INTO parcours VALUES (
				${tournament.location},
				${tournament.name},
				${tournament.organizer},
				${p.name},
				${p.date},
				${p.link},
				${p.numberOfObstacles},
				${p.numberOfEfforts},
				${p.height}
			);
		`;
	}
	console.log(`Inserted ${parcourses.length} maps for ${tournament.link}`);
}
