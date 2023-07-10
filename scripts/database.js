import sqlite3 from 'sqlite3';

export function initDB(/** @type {string} */ filename) {
	const db = new sqlite3.Database(filename);

	db.run(`CREATE TABLE IF NOT EXISTS parcours (
		location text,
		tournamentName text,
		organizer text,
		competitionName text,
		date text,
		link text,
		numberOfObstacles number,
		numberOfEfforts number,
		height number
	);`);

	return db;
}

export function insertIntoDB(/** @type {import('sqlite3').Database} */ db, parcourses, tournament) {
	db.serialize(() => {
		const statement = db.prepare(`INSERT INTO parcours
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`);

		for (const p of parcourses) {
			statement.run(
				tournament.location,
				tournament.name,
				tournament.organizer,
				p.name,
				p.date,
				p.link,
				p.numberOfObstacles,
				p.numberOfEfforts,
				p.height
			);
		}

		statement.finalize();
	});

	console.log(`Inserted ${parcourses.length} maps for ${tournament.link}`);
}
