import { HttpService } from '@nestjs/axios';
import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { join } from 'path';
import { I_open_data_festival_response } from './interface/i_open_data_festival_response';
import { FestivalService } from '../festival/festival.service';

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
   * ils ne les retourne que par un maximul de 100 à chaque fois
   * le paramètre offset permet de définir le point de départ de la liste
   * @param offset point de départ de la liste
   * @returns
   */
  async getFestivals(offset: number = 0) {
    let url = `${this.baseUrl}?limit=${this.fetch_size}&offset=${offset}`;
    let festivals_counts: number = 0;

    do {
      try {
        const response = await this.httpService.axiosRef.get<I_open_data_festival_response>(url);
        festivals_counts = response.data.total_count;
        this.festivalService.populateFestivals(response.data);
        offset += this.fetch_size;
        url = `${this.baseUrl}?limit=${this.fetch_size}&offset=${offset}`;
      } catch (error) {
        throw new BadRequestException(` external url ${url} le serveur de l'api externe n'as pas donnée de réponse \n` + error);
      }
    } while (offset < festivals_counts - this.fetch_size);

    console.info(`imports terminés.`)

  }
}
