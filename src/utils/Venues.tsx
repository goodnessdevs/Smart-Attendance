export interface Venue {
  venueName: string;
  lat: number;
  long: number;
  radius: number;
}

export const venues: Venue[] = [
  {
    venueName: "JAO 3",
    lat: 7.233186114511671,
    long: 3.437106665320396,
    radius: 50,
  },
  {
    venueName: "Engineering Auditorium",
    lat: 7.230301401530782,
    long: 3.434183394764708,
    radius: 40,
  },
  {
    venueName: "MP 01",
    lat: 7.228478264627234,
    long: 3.435238674530148,
    radius: 70,
  },
];
