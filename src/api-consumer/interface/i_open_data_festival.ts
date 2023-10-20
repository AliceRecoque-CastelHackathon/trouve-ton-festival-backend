/**
 * interface modélisant la partie results de I_open_data_festival_response
    notez que dans l'interface TOUTES les données peuvent être nulle
    comme dans le réalité
    il faudras faire les controle ailleurs
 */
export interface I_open_data_festival {

    nom_du_festival: null | string,
    envergure_territoriale: null | string,
    region_principale_de_deroulement: null | string,
    departement_principal_de_deroulement: null | string,
    commune_principale_de_deroulement: null | string,
    code_postal_de_la_commune_principale_de_deroulement: null | string,
    code_insee_commune: null | string,
    code_insee_epci_collage_en_valeur: null | string,
    libelle_epci_collage_en_valeur: null | string,
    numero_de_voie: null | string | number,
    type_de_voie_rue_avenue_boulevard_etc: null | string,
    nom_de_la_voie: null | string,
    adresse_postale: null | string,
    complement_d_adresse_facultatif: null | string,
    site_internet_du_festival: null | string,
    adresse_e_mail: null | string,
    decennie_de_creation_du_festival: null | string,
    annee_de_creation_du_festival: null | string,
    discipline_dominante: string,
    sous_categorie_spectacle_vivant: null | string,
    sous_categorie_musique: null | string,
    sous_categorie_musique_cnm: null | string,
    sous_categorie_cinema_et_audiovisuel: null | string,
    sous_categorie_arts_visuels_et_arts_numeriques: null | string,
    sous_categorie_livre_et_litterature: null | string,
    periode_principale_de_deroulement_du_festival: null | string,
    identifiant_agence_a: null | string,
    identifiant: string,
    geocodage_xy: {
        lon: number,
        lat: number
    }

    identifiant_cnm: null | string,

}
