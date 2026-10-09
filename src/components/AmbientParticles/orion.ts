/**
 * Orion, as the night sky draws it.
 *
 * Positions are the stars' real right ascension and declination, projected
 * flat (RA scaled by cos 5deg, the constellation's mean declination, so the
 * figure keeps its true proportions; east on the left, as a sky chart has it)
 * and normalised to 0–100 on each axis of the figure's own box. The box is
 * 0.683 as wide as it is tall: see ORION_ASPECT.
 *
 * `mag` is the visual magnitude. Lower is brighter, and the star's drawn size
 * comes from it, so Rigel and Betelgeuse lead and the shield is faint.
 */
export interface OrionStar {
  id: string;
  x: number;
  y: number;
  mag: number;
}

export const ORION_ASPECT = 0.683;

export const ORION_STARS: readonly OrionStar[] = [
  { id: 'betelgeuse', x: 20.3, y: 43.0, mag: 0.5 },
  { id: 'bellatrix', x: 57.0, y: 46.5, mag: 1.6 },
  { id: 'meissa', x: 44.8, y: 34.6, mag: 3.4 },
  { id: 'mintaka', x: 48.6, y: 68.7, mag: 2.2 },
  { id: 'alnilam', x: 43.5, y: 71.7, mag: 1.7 },
  { id: 'alnitak', x: 37.9, y: 74.2, mag: 1.8 },
  { id: 'saiph', x: 29.4, y: 100.0, mag: 2.1 },
  { id: 'rigel', x: 69.9, y: 95.1, mag: 0.1 },
  { id: 'nairsaif', x: 44.5, y: 87.4, mag: 2.8 },
  { id: 'sword', x: 44.6, y: 85.7, mag: 4.0 },
  { id: 'mu', x: 11.6, y: 35.5, mag: 4.1 },
  { id: 'nu', x: 5.2, y: 18.4, mag: 4.4 },
  { id: 'xi', x: 0.0, y: 20.3, mag: 4.5 },
  { id: 'chi1', x: 21.3, y: 0.0, mag: 4.4 },
  { id: 'chi2', x: 9.7, y: 0.5, mag: 4.6 },
  { id: 'pi1', x: 93.8, y: 33.8, mag: 4.6 },
  { id: 'pi2', x: 99.0, y: 38.0, mag: 4.4 },
  { id: 'pi3', x: 100.0, y: 44.5, mag: 3.2 },
  { id: 'pi4', x: 98.3, y: 49.0, mag: 3.7 },
  { id: 'pi5', x: 94.6, y: 59.6, mag: 3.7 },
  { id: 'pi6', x: 89.4, y: 62.0, mag: 4.5 },
];

