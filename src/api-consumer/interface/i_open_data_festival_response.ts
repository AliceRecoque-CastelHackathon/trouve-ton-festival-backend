import { I_open_data_festival } from "./i_open_data_festival";
/**
 interface modélisant les données fournie par l'API externe 
    https://www.data.gouv.fr/fr/datasets/liste-des-festivals-en-france/
    https://data.culture.gouv.fr/explore/dataset/festivals-global-festivals-_-pl/information/
    https://data.culture.gouv.fr/api/explore/v2.1/catalog/datasets/festivals-global-festivals-_-pl/records?limit=100&offset=var
 */
export interface I_open_data_festival_response {
    /** 
        le compte des données totales présentes en base de données
        ce n'est pas le compte de données dans le tableau results
    */
    total_count: number,
    /**
     * tableau des données 
     */
    results: I_open_data_festival[]
}