export interface DataPoint {
  label: string; 
  value: number; 
  region?: string; 
  year?: number;
}

export const DataService = {
  generate(): DataPoint[] {
    const carBrands = ["Toyota", "Honda", "Ford", "BMW", "Tesla", "Hyundai", "Kia", "Mazda"];
    const regions = ["Asia", "Europe", "America", "Other"];
    const year = 2025;

    return carBrands.map((brand) => ({
      label: brand,
      value: Math.floor(Math.random() * 50000) + 10000,
      region: regions[Math.floor(Math.random() * regions.length)],
      year,
    }));
  },
};
