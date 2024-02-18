/**
 * Collection of languages of translation
 */
export interface TranslationsFrontInterface {
    /**
     * Current lang
     */
    current: string;

    /**
     * Languages of Translation
     */
    languages: TranslationFrontInterface[];

    /**
     * Texts of lang
     */
    texts: TranslationTextFrontInterface[];
}

/**
 * The Translation for Front
 */
export interface TranslationFrontInterface {
    /**
     * Code of Lang
     */
    code: string;

    /**
     * Title of Lang
     */
    title: string;
}

/**
 * The Translation Text for front
 */
export interface TranslationTextFrontInterface {

    /**
     * Domain of Text
     */
    domain?: string;

    /**
     * Key of Text
     */
    key: string;

    /**
     * Trageted code lang and his value
     */
    [name: string]: string;
}