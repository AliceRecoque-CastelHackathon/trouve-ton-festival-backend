import { HttpService } from '@nestjs/axios';
import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { join } from 'path';
import { I_open_data_festival_response } from './interface/i_open_data_festival_response';
import { FestivalService } from '../festival/festival.service';

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

    const url = `${this.baseUrl}?limit=${this.fetch_size}&offset=${offset}`
    let responseObject: I_open_data_festival_response  ;
    do{
      try {
        const response = await this.httpService.axiosRef.get<I_open_data_festival_response>(url)
        .catch(error =>{
          throw new BadRequestException(` external url ${url} le serveur de l'api externe n'as pas donnée de réponse \n`+ error);
        })
        .then(response=>
        {
          try {
           responseObject = response.data;            
          } catch (error) {
            new HttpException(`l'objet n'a pas la bonne forme `,200);
          try {
            if (festivals_counts== 0){
             festivals_counts = responseObject.total_count;
            }            
          } catch (error) {
            new HttpException(`total_count n'était pas dans l'objet `,200 );
          }
          this.festivalService.populateFestivals(responseObject);
  
          }
        }
        )

      } catch (error) {
        throw new BadRequestException(`la totalité de la réquète à l'api externe à échoué. ${url} ` + error);
      }


    }while (offset < festivals_counts- this.fetch_size);

    console.info(`imports terminés.`)

  }
}
