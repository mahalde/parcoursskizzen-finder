import * as puppeteer from "puppeteer";
import { MinimalParcours, Tournament } from "./types";
import { mapAsync, removeWhitespace } from "./utils";
import { isValid, parse } from "date-fns";
import { de } from "date-fns/locale";

const equiScoreBaseURL = "https://equi-score.de/results?";

export async function initBrowser() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  return { browser, page };
}

export async function goToResultPage(page: puppeteer.Page, year: number) {
  const params = new URLSearchParams();
  params.set("year", year.toString());

  await page.goto(equiScoreBaseURL + params.toString());
}

export async function getAllTournamentsOnPage(
  page: puppeteer.Page
): Promise<Tournament[]> {
  const boxes = await page.$$("[id^=evt]");

  return mapAsync(boxes, mapToTournament);
}

async function mapToTournament(
  el: puppeteer.ElementHandle<Element>
): Promise<Tournament> {
  const name = await getTextContent(await el.$(".evt_caption"));
  const organizer = await getTextContent(await el.$(".evt_showoffice"));
  const location = await getTextContent(await el.$(".evt_locator"));
  const link = await getProperty(await el.$("a"), "href");
  return {
    name,
    organizer,
    location,
    link,
  };
}

const parcoursXPath = '//img[contains(@src,"parcour")]';
const linkXPath = "./parent::a";
const boxXPath = './ancestor::div[contains(@class,"row")]';
const dateXPath = "./ancestor::div/preceding::div/h2";

export async function findParcours(
  page: puppeteer.Page,
  tournament: Tournament
): Promise<MinimalParcours[]> {
  await page.goto(tournament.link);

  const parcoursImgs = await page.$x(parcoursXPath);

  if (parcoursImgs.length === 0) {
    return [];
  }

  const parcours: MinimalParcours[] = [];

  for (const img of parcoursImgs) {
    const linkEl = (await img.$x(linkXPath))[0];
    const link = await getProperty(linkEl, "href");

    const dateEls = await img.$x(dateXPath);
    const dateStr = removeWhitespace(
      await getTextContent(dateEls[dateEls.length - 1])
    );
    let date = parse(dateStr, "EEEE,d.MMMMyyyy", new Date(), { locale: de });

    const row = (await img.$x(boxXPath))[0];
    const timeStr = await getTextContent((await row.$x("./div[1]"))[0]);
    const tempDate = parse(timeStr, "HH:mm", date);
    date = isValid(tempDate) ? tempDate : date;

    const name = await getTextContent(
      (await row.$x("./div[3]/div[last()]"))[0]
    );

    parcours.push({
      link,
      name,
      date,
    });
  }

  return parcours;
}

async function getProperty(
  el: puppeteer.ElementHandle | puppeteer.JSHandle,
  property: string
): Promise<string> {
  return (await (await el.getProperty(property)).jsonValue<string>()).trim();
}

function getTextContent(
  el: puppeteer.ElementHandle | puppeteer.JSHandle
): Promise<string> {
  return getProperty(el, "textContent");
}
