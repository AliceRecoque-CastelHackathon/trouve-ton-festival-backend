import { HttpService } from '@nestjs/axios';
import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { join } from 'path';
import { I_open_data_festival_response } from './interface/i_open_data_festival_response';
import { FestivalService } from '../festival/festival.service';
import { info, log } from 'console';
import { AxiosError } from 'axios';
import { stringify } from 'querystring';
import { json } from 'node:stream/consumers';

@Injectable()
export class ApiConsumerService {
  private baseUrl: string = process.env.EXTERNAL_API_BASE_URL ?? "";
  private responseType: string = "response_type=json";
  private fetch_size: number = 100;

  constructor(private readonly httpService: HttpService, private readonly festivalService: FestivalService) {
  }

  async getUsers(usersNumber: number): Promise<any> {
    const response = await this.httpService.axiosRef.get(join(this.baseUrl, "users", `?${this.responseType}&number=${usersNumber}`));
    return response.data;
  }
  /**
   * retourne un json de festival
   * ils ne les retourne que par un maximun de 100 à chaque fois
   * le paramètre offset permet de définir le point de départ de la liste
   * @param offset point de départ de la liste
   * @returns
   */
  async getFestivals(offset: number = 0, firstcall: boolean = true) {
    let import_complete = false;
    //on met à jour l'url
    let url = `${this.baseUrl}?limit=${this.fetch_size}&offset=${offset}`;
    // on recupére le jeu de données
    this.httpService.axiosRef.get<I_open_data_festival_response>(url)
      // en réussite
      .then(response => {
        this.festivalService.populateFestivals(response.data, offset);
        // mis a jour de l'offest
        offset += response.data.results.length;
        // si l'on est pas au terme du jeu de  données 
        if (offset <= response.data.total_count - response.data.results.length) {
          // la fonction s'appelle à nouveau
          this.getFestivals(offset);
        }
        else {
          log(`import complete`)
        }

      })
      // en echec
      .catch((error: AxiosError) => {
        throw new BadRequestException(`${url}\nle serveur de l'api externe n'as pas donnée de réponse
        \t${error.name}\t${error.message}
        ${JSON.stringify(error.response?.data)}
        `);

      })
      ;
  }
}
