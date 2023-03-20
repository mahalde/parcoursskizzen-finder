import * as database from "./database";
import * as pdf from "./pdf";
import * as automation from "./puppeteer";
import { mapAsync } from "./utils";

async function main() {
  try {
    const db = database.initDb("database.db");
    const { browser, page } = await automation.initBrowser();

    const minYear = 2012;
    const maxYear = new Date().getFullYear();

    for (let i = minYear; i <= maxYear; i++) {
      await automation.goToResultPage(page, i);

      const allTournaments = await automation.getAllTournamentsOnPage(page);

      for (const tournament of allTournaments) {
        const minimalParcours = await automation.findParcours(page, tournament);

        if (minimalParcours.length === 0) {
          continue;
        }

        const parcours = await mapAsync(minimalParcours, pdf.analyzePDF);

        database.insertIntoDb(db, parcours, tournament);
      }
    }

    await browser.close();

    db.close();
  } catch (e) {
    console.error(e);
  }
}

main();
