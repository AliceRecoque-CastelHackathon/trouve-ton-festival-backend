import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { FestivalEntity } from 'src/festival/entities/festival.entity';

@Injectable()
export class ApiConsumerService {
  private baseUrl: string = process.env.EXTERNAL_API_BASE_URL ?? "";
  private responseType: string = "response_type=json";
  private fetch_size = 100;

  constructor(private readonly httpService: HttpService) {
  }

  async getUsers(usersNumber: number): Promise<any> {
    const response = await this.httpService.axiosRef.get(join(this.baseUrl, "users", `?${this.responseType}&number=${usersNumber}`));
    return response.data;
  }
  /**
   * retourne un json de festival
   * ils ne les retourne que par un maximul de 100 à chaque fois
   * le paramètre offset permet de définir le point de départ de la liste 
   * @param offset point de départ de la liste 
   * @returns 
   */
  async getFestivals(offset: number = 0):Promise<any>{
     return (await this.httpService.axiosRef.get(`this.baseUrl?limit=${this.fetch_size}&offset=${offset}`)).data;
  }
}
