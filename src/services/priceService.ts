export type ServiceType = 'cleaning' | 'pest';

export interface CleaningOptions {
  area: number;
  floors: number;
  bathrooms: number;
  kitchens: number;
}

export interface PestOptions {
  pestType: string;
  rooms: number;
  halls: number;
  bathrooms: number;
}

export const calculateCleaningPrice = (options: CleaningOptions): number => {
  const { area, floors, bathrooms, kitchens } = options;
  let price = 110;
  
  if (area > 200) {
    price += Math.ceil((area - 200) / 50) * 15;
  }
  
  price += (floors - 1) * 90;
  price += (bathrooms - 1) * 5;
  price += (kitchens - 1) * 10;
  
  return price;
};

export const calculatePestPrice = (options: PestOptions): number => {
  const { pestType, rooms, halls, bathrooms } = options;
  let price = 25;
  
  price += (rooms - 1) * 5;
  price += (halls - 1) * 5;
  price += (bathrooms - 1) * 3;
  
  if (pestType === 'termites') price += 15;
  if (pestType === 'rodents') price += 10;
  if (pestType === 'bedbugs') price += 20;
  
  return price;
};

export const calculatePrice = (type: ServiceType, options: any): number => {
  if (type === 'pest') {
    return calculatePestPrice(options as PestOptions);
  }
  return calculateCleaningPrice(options as CleaningOptions);
};
