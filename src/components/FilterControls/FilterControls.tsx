import { Select } from "antd";
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { FUEL_TYPES, REGIONS } from "../../constants";
import './FilterControls.css'


interface FilterControlsProps {
  isLoadingGeoJSON: boolean;
  onFilterChange: (filters: { region: number; fuelType: number }) => void;
}

const FilterControls = ({
  isLoadingGeoJSON: isSelectRegionDisabled,
  onFilterChange,
}: FilterControlsProps) => {
  
  const { t } = useTranslation();

  const [region, setRegion] = useState<number>(REGIONS.COCHABAMBA.code);
  const [fuelType, setFuelType] = useState<number>(FUEL_TYPES.GASOLINE.code);

  const handleRegionChange = (value: number) => {
    setRegion(value);
    onFilterChange({ region: value, fuelType });
  };

  const handleFuelTypeChange = (value: number) => {
    setFuelType(value);
    onFilterChange({ region, fuelType: value });
  };

  return (
    <div
      className="filter-controls"
      style={{ display: "flex", flexDirection: "column", gap: "10px", width: "150px" }}
    >
      <Select
        className="custom-select"
        value={region}
        disabled={isSelectRegionDisabled}
        loading={isSelectRegionDisabled}
        options={Object.entries(REGIONS).map(([_, value]) => ({
          value: value.code,
          label: value.name,
        }))}
        onChange={handleRegionChange}
      />
      <Select
        className="custom-select"
        value={fuelType}
        disabled={isSelectRegionDisabled}
        loading={isSelectRegionDisabled}
        options={Object.entries(FUEL_TYPES).map(([_, value]) => ({
          value: value.code,
          label: t(value.nameCode),
        }))}
        onChange={handleFuelTypeChange}
      />
    </div>
  );
};

export default FilterControls;
