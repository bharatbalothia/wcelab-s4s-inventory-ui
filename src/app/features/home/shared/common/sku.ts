import { Product } from './product';

export interface SKU extends Product {
  _id: string;
  unit_of_measure: string;
  category: string;
  image_url: string;
}
