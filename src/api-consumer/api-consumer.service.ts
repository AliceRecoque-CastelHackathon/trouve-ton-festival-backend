import { HttpService } from '@nestjs/axios';
import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { join } from 'path';
import { I_open_data_festival_response } from './interface/i_open_data_festival_response';
import { throws } from 'assert';
import { json } from 'stream/consumers';
import { FestivalService } from '../festival/festival.service';
import { FestivalEntity } from '../festival/entities/festival.entity';

@Injectable()
export class ApiConsumerService {
  private baseUrl: string = process.env.EXTERNAL_API_BASE_URL ?? "";
  private responseType: string = "response_type=json";
  private fetch_size:number = 100;

  constructor(private readonly httpService: HttpService, private readonly festivalService: FestivalService) {
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
  async getFestivals(offset: number = 0){
    let festivals_counts:number = 0;

    do{
      try {
        const response = await this.httpService.axiosRef.get(`this.baseUrl?limit=${this.fetch_size}&offset=${offset}`);
        const responseObject: any = JSON.parse(response.data);
        if (festivals_counts== 0){
          festivals_counts = responseObject["total_count"];
        }
        this.festivalService.populateFestivals(responseObject);
        //@TODO appel de festival service pour lui passer la liste à enregistrer

      } catch (error) {
        throw new BadRequestException("le serveur de l'api externe n'as pas donnée de réponse");
      }


    }while (offset < festivals_counts- this.fetch_size);

  }
}
