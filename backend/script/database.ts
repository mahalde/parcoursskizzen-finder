import { Database } from "sqlite3";
import { Parcours, Tournament } from "./types";

export function initDb(fileName: string): Database {
  const db = new Database(fileName);

  db.run(`CREATE TABLE IF NOT EXISTS parcours (
    location TEXT,
    tournamentName TEXT,
    organizer TEXT,
    competitionName TEXT,
    date TEXT,
    link TEXT,
    numberOfObstacles NUMBER,
    numberOfEfforts NUMBER,
    height NUMBER)`);

  return db;
}

export function insertIntoDb(
  db: Database,
  parcours: Parcours[],
  tournament: Tournament
) {
  db.serialize(() => {
    const stmt = db.prepare(`INSERT INTO parcours
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);

    for (const p of parcours) {
      stmt.run(
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

    stmt.finalize();
  });

  console.log(`Inserted ${parcours.length} maps for ${tournament.link}`);
}
