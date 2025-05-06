import { FUEL_TYPES } from "./constants";

export function getFuelCodeByFuelName(name: string): number {
    const entry = Object.values(FUEL_TYPES).find(item => item.name === name);
    if (!entry) throw new Error(`Invalid fuel name: ${name}`);
    return entry.code;
}
