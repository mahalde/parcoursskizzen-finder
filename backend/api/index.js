const express = require("express");
const paginate = require("express-paginate");
const { Sequelize, DataTypes, Op } = require("sequelize");
const cors = require("cors");

const app = express();

app.use(
  cors({
    // origin: "https://skizzen.malte-thienel.de",
  })
);

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "database.db",
});

const Parcours = sequelize.define(
  "Parcours",
  {
    location: {
      type: DataTypes.TEXT,
    },
    tournamentName: {
      type: DataTypes.TEXT,
    },
    organizer: {
      type: DataTypes.TEXT,
    },
    competitionName: {
      type: DataTypes.TEXT,
    },
    date: {
      type: DataTypes.DATE,
    },
    link: {
      type: DataTypes.TEXT,
      primaryKey: true,
    },
    numberOfObstacles: {
      type: DataTypes.NUMBER,
    },
    numberOfEfforts: {
      type: DataTypes.NUMBER,
    },
    height: {
      type: DataTypes.NUMBER,
    },
  },
  {
    createdAt: false,
    updatedAt: false,
  }
);

app.use(paginate.middleware(25, 100));

app.get("/fields", async (req, res, next) => {
  const heights = await getDistinctValuesFromDB("height");
  const numberOfObstacles = await getDistinctValuesFromDB("numberOfObstacles");
  const numberOfEfforts = await getDistinctValuesFromDB("numberOfEfforts");

  res.send({ heights, numberOfObstacles, numberOfEfforts });
});

async function getDistinctValuesFromDB(colName) {
  const values = await Parcours.aggregate(colName, "DISTINCT", {
    plain: false,
  });
  return values
    .map((val) => val.DISTINCT)
    .filter((val) => val !== -1)
    .sort((a, b) => a - b);
}

app.get("/skizze", async (req, res, next) => {
  let {
    minHeight = Number.MIN_SAFE_INTEGER,
    maxHeight = Number.MAX_SAFE_INTEGER,
    minObstacles = Number.MIN_SAFE_INTEGER,
    maxObstacles = Number.MAX_SAFE_INTEGER,
    minEfforts = Number.MIN_SAFE_INTEGER,
    maxEfforts = Number.MAX_SAFE_INTEGER,
  } = req.query;

  const parcours = await Parcours.findAll({
    limit: req.query.limit,
    offset: req.skip,
    where: {
      height: {
        [Op.between]: [minHeight, maxHeight],
      },
      numberOfObstacles: {
        [Op.between]: [minObstacles, maxObstacles],
      },
      numberOfEfforts: {
        [Op.between]: [minEfforts, maxEfforts],
      },
    },
    order: sequelize.random(),
  });

  console.log(`Found ${parcours.length} rows`);
  res.send(parcours);
});

app.listen(4000, () => console.log("Server started on http://localhost:4000"));
