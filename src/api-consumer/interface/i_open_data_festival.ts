const { Interface } = require(readline)

export interface i_open_data_festival {

    nom_du_festival: string,
    envergure_territoriale: string,
    region_principale_de_deroulement: string,
    departement_principal_de_deroulement: string,
    commune_principale_de_deroulement: string,
    code_postal_de_la_commune_principale_de_deroulement: string,
    code_insee_commune: string,
    code_insee_epci_collage_en_valeur: string,
    libelle_epci_collage_en_valeur: string,
    numero_de_voie: string|null,
    type_de_voie_rue_avenue_boulevard_etc: string|null,
    nom_de_la_voie: string|null,
    adresse_postale: string|null,
    complement_d_adresse_facultatif: string|null,
    site_internet_du_festival: string|null,
    adresse_e_mail: string|null,
    decennie_de_creation_du_festival: string|null,
    annee_de_creation_du_festival: string|null,
    discipline_dominante: string|null,
    sous_categorie_spectacle_vivant: string | null,
    sous_categorie_musique: null | string,
    sous_categorie_musique_cnm: null | string,
    sous_categorie_cinema_et_audiovisuel: null | string,
    sous_categorie_arts_visuels_et_arts_numeriques: null | string,
    sous_categorie_livre_et_litterature: null | string,
    periode_principale_de_deroulement_du_festival: null | string,
    identifiant_agence_a: null | string,
    identifiant: string,
    geocodage_xy: null | {
        lon: number,
        lat: number
    }

    identifiant_cnm: null | string,

}
