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

export function getNameCodeByFuelCode(code: number): string {
    const fuelType = Object.values(FUEL_TYPES).find((fuel) => fuel.code === code);
    if (!fuelType) throw new Error(`Invalid fuel name: ${code}`);
    return fuelType.nameCode;
}

export function getTodayDateRange(): { todayStartDate: string; todayEndDate: string } {
  const now = new Date();
  
  const startDate = new Date(now);
  startDate.setHours(0, 0, 0, 0);
  
  const endDate = new Date(now);
  endDate.setHours(23, 59, 59, 999);
  
  return {
    todayStartDate: formatDateForAPI(startDate),
    todayEndDate: formatDateForAPI(endDate),
  };
}

export function getLastSevenDaysRange(): { weekStartDate: string; weekEndDate: string } {
  const now = new Date();
  
  // Start date (6 days ago)
  const startDate = new Date(now);
  startDate.setDate(now.getDate() - 6);
  startDate.setHours(0, 0, 0, 0);
  
  // End date (today at 23:59:59)
  const endDate = new Date(now);
  endDate.setHours(23, 59, 59, 999);
  
  return {
    weekStartDate: formatDateForAPI(startDate),
    weekEndDate: formatDateForAPI(endDate),
  };
};

function formatDateForAPI(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // months are 0-indexed
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

