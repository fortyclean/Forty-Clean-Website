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

type PriceOptions = CleaningOptions | PestOptions;

const isPestOptions = (options: PriceOptions): options is PestOptions => {
  return 'pestType' in options;
};

export const calculateCleaningPrice = (options: CleaningOptions): number => {
  const { area, floors, bathrooms, kitchens } = options;
  const basePrice = Number(import.meta.env.VITE_CLEANING_BASE_PRICE) || 110;
  let price = basePrice;
  
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
  const basePrice = Number(import.meta.env.VITE_PEST_BASE_PRICE) || 25;
  let price = basePrice;
  
  price += (rooms - 1) * 5;
  price += (halls - 1) * 5;
  price += (bathrooms - 1) * 3;
  
  if (pestType === 'termites') price += 15;
  if (pestType === 'rodents') price += 10;
  if (pestType === 'bedbugs') price += 20;
  
  return price;
};

export const calculatePrice = (type: ServiceType, options: PriceOptions): number => {
  if (type === 'pest' && isPestOptions(options)) {
    return calculatePestPrice(options);
  }
  return calculateCleaningPrice(options as CleaningOptions);
};
