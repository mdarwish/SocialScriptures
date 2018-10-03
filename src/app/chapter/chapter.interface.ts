export interface Chapter {
    short: string;
    version: string;
    en_name: string;
    ar_en: string;
    ar_name: string;
    testament: string;
    t_order: number;
    q_order: number;
    r_order: number;
    place: string;
    synonyms: string;
    type: string;
}

export interface ChapterSource {
  source: Chapter;
}

