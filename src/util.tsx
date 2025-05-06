import { FUEL_TYPES } from "./constants";

export function getFuelCodeByFuelName(name: string): number {
    const fuelType = Object.values(FUEL_TYPES).find(item => item.name === name);
    if (!fuelType) throw new Error(`Invalid fuel name: ${name}`);
    return fuelType.code;
}

export function getNameTextByFuelCode(code: number): string {
    const fuelType = Object.values(FUEL_TYPES).find((fuel) => fuel.code === code);
    if (!fuelType) throw new Error(`Invalid fuel name: ${code}`);
    return fuelType.nameText;
  }