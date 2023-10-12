interface IFestivalGetDto {
  id: number;
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
  externalId?: string | null;
}

export class FestivalGetDto {
  id: number;
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
  externalId?: string | null;

  constructor(data?: IFestivalGetDto) {
    if (data) {
      this.id = data['id'];
      this.idCategory = data['idCategory'];
      this.idSubCategory = data['idSubCategory'];
      this.region = data['region'];
      this.department = data['department'];
      this.zipcode = data['zipcode'];
      this.adress = data['adress'];
      this.website = data['website'];
      this.email = data['email'];
      this.creationDate = data['creationDate'];
      this.geoPosX = data['geoPosX'];
      this.geoPosY = data['geoPosY'];
      this.externalId = data['externalId'];
    }
  }
}
