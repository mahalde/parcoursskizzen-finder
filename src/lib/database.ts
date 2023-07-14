import { DataTypes, type Model, Sequelize } from 'sequelize';

export const sequelize = new Sequelize({
	dialect: 'sqlite',
	storage: './database.db'
});

export const Parcours = sequelize.define(
	'parcours',
	{
		location: {
			type: DataTypes.TEXT
		},
		tournamentName: {
			type: DataTypes.TEXT
		},
		organizer: {
			type: DataTypes.TEXT
		},
		competitionName: {
			type: DataTypes.TEXT
		},
		date: {
			type: DataTypes.DATE
		},
		link: {
			type: DataTypes.TEXT,
			primaryKey: true
		},
		numberOfObstacles: {
			type: DataTypes.NUMBER
		},
		numberOfEfforts: {
			type: DataTypes.NUMBER
		},
		height: {
			type: DataTypes.NUMBER
		}
	},
	{
		createdAt: false,
		updatedAt: false
	}
);

export function getDistinctValuesFromDB(colName: string): Promise<number[]> {
	return Parcours.aggregate<any[], Model>(colName, 'DISTINCT', {
		plain: false
	}).then((values) =>
		values
			.map((val) => val.DISTINCT)
			.filter((val) => val !== -1)
			.sort((a, b) => a - b)
	);
}
