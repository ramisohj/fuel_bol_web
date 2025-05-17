export const API_ENDPOINTS = {
  FUEL_STATIONS: {
    GET_BY_REGION_FUEL_TYPE: (regionId: number, fuelType: number) => `https://fuelbol-production.up.railway.app/fuel-levels/geo/${regionId}/${fuelType}`,
  },
  FUEL_BOL_PY: {
    GET_TIME_SERIES: (fuelStationId: number, fuelType: number) => `https://fuel-bol-py.onrender.com/api/stats-image/time-series?station_id=${fuelStationId}&fuel_type=${fuelType}`,
    GET_STATISTICAL_GRAPHS: (fuelStationId: number, fuelType: number) => `https://fuel-bol-py.onrender.com/api/stats-image/statistical-graphs?station_id=${fuelStationId}&fuel_type=${fuelType}`,
    GET_STATISTICAL_DATA: (fuelStationId: number, fuelType: number) => `https://fuel-bol-py.onrender.com/api/stats-image/statistical-data?station_id=${fuelStationId}&fuel_type=${fuelType}`,
    GET_MACHINE_LEARNING_MODELS: (fuelStationId: number, fuelType: number) => `https://fuel-bol-py.onrender.com/api/stats-image/machine-learning-models?station_id=${fuelStationId}&fuel_type=${fuelType}`
  },
  ANH: {
    GET_FUEL_STATION_DATA: (fuelStationId: number, fuelType: number) => `https://vsr11vpr08m22gb.anh.gob.bo:9443/WSMobile/v1/EstacionesSaldo/F761D63AC28406573E20A24CB1DB2EC6/${fuelStationId}/${fuelType}`
  }
} as const;

export const REGIONS = {
  CHUQUISACA: {
    code: 1,
    name: 'Chuquisaca'
  },
  LA_PAZ: {
    code: 2,
    name: 'La Paz'
  },
  COCHABAMBA: {
    code: 3,
    name: 'Cochabamba'
  },
  ORURO: {
    code: 4,
    name: 'Oruro'
  },
  POTOSI: {
    code: 5,
    name: 'Potosi'
  },
  TARIJA: {
    code: 6,
    name: 'Tarija'
  },
  SANTA_CRUZ: {
    code: 7,
    name:'Santa Cruz'
  },
  BENI: {
    code: 8,
    name: 'Beni'
  },
  PANDO: {
    code: 9,
    name: 'Pando'
  }
} as const;

export const FUEL_TYPES = {
  GASOLINE: {
    code: 0,
    name: 'GASOLINE',
    nameText: 'Gasoline',
    nameCode: 'gasoline'
  },
  DIESEL: {
    code: 1,
    name: 'DIESEL',
    nameText: 'Diesel',
    nameCode: 'diesel'
  },
  PREMIUM_GASOLINE: {
    code: 2,
    name: 'PREMIUM GASOLINE',
    nameText: 'Premium Gasoline',
    nameCode: 'premium_gasoline'
  },
  ULS_DIESEL: {
    code: 3,
    name: 'DIESEL ULS',
    nameText: 'ULS Diesel',
    nameCode: 'uls_diesel'
  }
} as const;

export const REGION_LIST = {
  COCHABAMBA: 'COCHABAMBA',
  LA_PAZ: 'LA_PAZ',
  ORURO: 'ORURO',
  POTOSI: 'POTOSI',
  SANTA_CRUZ: 'SANTA_CRUZ',
  TARIJA: 'TARIJA',
  CHUQUISACA: 'CHUQUISACA',
  BENI: 'BENI',
  PANDO: 'PANDO'
} as const;

export const FUEL_TYPE_LIST = {
  GASOLINE: 'GASOLINE',
  DIESEL: 'DIESEL',
  PREMIUM_GASOLINE: 'PREMIUM_GASOLINE',
  ULS_DIESEL: 'ULS_DIESEL'
} as const;