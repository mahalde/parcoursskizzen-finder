import { MinimalParcours, Parcours } from "./types";
import * as pdfjs from "pdfjs-dist";

const heightRegEx = /(?:(?:Höhe)|(?:Height)):\s*?(\d{1,2},\d{1,2})/;
const obstacleRegEx = /(?:(?:Hindernisse)|(?:Obstacles)):\s*?(\d{1,2})/;
const effortsRegEx = /(?:(?:Sprünge)|(?:Efforts)):\s*?(\d{1,2})/;

export async function analyzePDF(parcours: MinimalParcours): Promise<Parcours> {
  try {
    const pdf = await pdfjs.getDocument(parcours.link).promise;

    const page = await pdf.getPage(1);
    const content = await page.getTextContent();
    const str = content.items.reduce((prev, cur) => (prev += cur.str), "");

    let numberOfObstacles = +obstacleRegEx.exec(str)?.[1] ?? -1;
    let numberOfEfforts = +effortsRegEx.exec(str)?.[1] ?? -1;
    let height = parseFloat(
      heightRegEx.exec(str)?.[1]?.replace(",", ".") ?? ""
    );

    numberOfObstacles = changeIfNaNOrTooHigh(numberOfObstacles);
    numberOfEfforts = changeIfNaNOrTooHigh(numberOfEfforts);
    height = changeIfNaN(height);

    return {
      ...parcours,
      numberOfObstacles,
      numberOfEfforts,
      height,
    };
  } catch (e) {
    console.error(`Error with parcours ${parcours.link}`);
    console.error(e);

    return {
      ...parcours,
      numberOfEfforts: -1,
      numberOfObstacles: -1,
      height: -1,
    };
  }
}

function changeIfNaN(num: number): number {
  return Number.isNaN(num) ? -1 : num;
}

function changeIfNaNOrTooHigh(num: number): number {
  num = changeIfNaN(num);
  return num >= 30 ? Math.floor(num / 10) : num;
}
