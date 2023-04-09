import { Coordinates } from "./coordinates.model";

export interface Cell {
    coordinates: Coordinates;
    symbol: 'x' | 'o' | undefined; // "x" or "o" or undefined
    isPartOfLineOfSameSymbol: boolean;
}