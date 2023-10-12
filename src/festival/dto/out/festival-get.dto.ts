import { I_open_data_festival } from "src/api-consumer/interface/i_open_data_festival";
import { FestivalCategoryEntity } from "src/festival/entities/ref-festival-category.entity";
import { FestivalSubCategoryEntity } from "src/festival/entities/ref-festival-subcategory.entity";

interface IFestivalGetDto {
  id: number;
  category: FestivalCategoryEntity|null;
  subCategory: FestivalSubCategoryEntity[]|null;
  name: string;
  region: string;
  department: string;
  zipcode: number;
  address: string;
  website?: string | null;
  email: string;
  creationDate?: string | null;
  geoPosX: number;
  geoPosY: number;
  externalId?: string | null;

}

export class FestivalGetDto {
  id: number;
  category: FestivalCategoryEntity|null;
  subCategory: FestivalSubCategoryEntity[]|null;
  name: string;
  region: string;
  department: string;
  zipcode: number;
  address: string;
  website?: string | null;
  email: string;
  creationDate?: string | null;
  geoPosX: number;
  geoPosY: number;
  externalId?: string | null;

  constructor(data?: IFestivalGetDto) {
    if (data) {
      this.id = data.id;
      this.category = data.category
      this.subCategory = data.subCategory;
      this.name = data.name
      this.region = data.region;
      this.department = data.department;
      this.zipcode = data.zipcode;
      this.address = data.address;
      this.website = data.website;
      this.email = data.email;
      this.creationDate = data.creationDate;
      this.geoPosX = data.geoPosX;
      this.geoPosY = data.geoPosY;
      this.externalId = data.externalId;
    }
  }

  
}
