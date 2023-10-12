
export class FestivalCreateDto {
  idCategory: number;
  idSubCategory: number;
  region: string;
  department: string;
  zipcode: number;
  adress: string;
  website?: string | null;
  email: string;
  creationDate?: string | null;
  geoPosX?: number | null;
  geoPosY?: number | null;
}
