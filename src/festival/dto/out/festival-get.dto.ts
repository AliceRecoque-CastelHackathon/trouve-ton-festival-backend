import { I_open_data_festival } from "src/api-consumer/interface/i_open_data_festival";

interface IFestivalGetDto {
  id: number;
  idCategory: number;
  idSubCategory: number[];
  region: string;
  department: string;
  zipcode: number;
  address: string;
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
  idSubCategory: number[];
  region: string;
  department: string;
  zipcode: number;
  address: string;
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
      this.address = data['address'];
      this.website = data['website'];
      this.email = data['email'];
      this.creationDate = data['creationDate'];
      this.geoPosX = data['geoPosX'];
      this.geoPosY = data['geoPosY'];
      this.externalId = data['externalId'];
    }
  }

  inifFromOpenData(data?:I_open_data_festival ){
    if (data) {
      // this.idCategory = data.,
      // this.idSubCategory = data
      // this.region = data
      // this.department = data
      // this.zipcode = data
      // this.adress = data
      // this.website = data
      // this.email = data
      // this.creationDate = data
      // this.geoPosX = data
      // this.geoPosY = data
      // this.externalId = data
    }
  }
}