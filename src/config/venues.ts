export interface Venue {
  venueName: string;
  lat: number;
  long: number;
}

/**
 * Lecture venues selectable when creating a course.
 *
 * Six entries were dropped in the migration: "Goodness' location",
 * "Taiwo's location", "Taiwo's 2", "Ikeja", "new test location" and
 * "new test mp". The first four were personal/residential coordinates for
 * named individuals sitting in a production dropdown; the last two were
 * unlabelled test points. Re-add any that turn out to be real venues — with a
 * real venue name.
 */
export const venues: Venue[] = [
  {
    venueName: "JAO 3",
    lat: 7.233186114511671,
    long: 3.437106665320396,
  },
  {
    venueName: "Engineering Auditorium",
    lat: 7.230301401530782,
    long: 3.434183394764708,
  },
  {
    venueName: "MP 01",
    lat: 7.228478264627234,
    long: 3.435238674530148,
  },
  {
    venueName: "GLY 1 New COLENG",
    lat: 7.227228,
    long: 3.43873,
  },
];
