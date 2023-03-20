export interface Tournament {
  name: string;
  organizer: string;
  location: string;
  link: string;
}

export interface Parcours extends MinimalParcours {
  numberOfObstacles: number;
  numberOfEfforts: number;
  height: number;
}

export interface MinimalParcours {
  name: string;
  link: string;
  date: Date;
}
