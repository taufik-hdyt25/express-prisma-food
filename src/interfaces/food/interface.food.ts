import { ICategory } from "../category/interface.category";

export interface IFood {
  id: number;
  categoryId: number;
  name: string;
  image: string;
  steps: string[];
  ingredients: string[];
  createdAt: Date;
  category: ICategory;
}

export interface ICreateFood {
  categoryId: number;
  name: string;
  image: string;
  steps: string[];
  ingredients: string[];
}

export interface IUpdateFood {
  id: number;
  categoryId: number;
  name: string;
  image: string;
  steps: string[];
  ingredients: string[];
}
