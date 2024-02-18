/**
 * Interface off Lang
 */
 export interface TranslationInterface {

    /**
     * Code of Lang
     */
    code: string;

    /**
     * Title of Lang
     */
    title: string;

    /**
     * Domain of Lang
     */
    domain: string;

    /**
     * Texts of Lang
     */
    texts?: TranslationTextInterface[];

    /**
     * Created Date of Text
     */
    createdAt: Date|string;

    /**
     * Updated Date of Text
     */
    updatedAt: Date|string;

    /**
     * Add new text
     */
    addText?: (text: TranslationTextInterface) => boolean;

    /**
     * Return Last Text
     */
    getLast?: () => TranslationTextInterface;

    /**
     * Method to return data to JSON
     */
    toJson?: () => string;
}

/**
 * Lang Text Interface
 */
export interface TranslationTextInterface {

    /**
     * Lang of Text
     */
    lang?: TranslationInterface|string;

    /**
     * Key of Text
     */
    key: string;

    /**
     * Value of Text
     */
    value: string;

    /**
     * Created Date of Text
     */
    createdAt?: Date|string;

    /**
     * Updated Date of Text
     */
    updatedAt?: Date|string;

    /**
     * Parameters of Texts
     */
    parameters?: { [name: string]: string };

    /**
     * Clone value
     */
    clone?: () => TranslationTextInterface;

    /**
     * Add parameter
     */
    addParameters?: (parameters?: { [name: string]: string }) => TranslationTextInterface;

    /**
     * Return parsed value
     */
    getValue?: () => string;

    /**
     * Return raw Value
     */
    getRaw?: () => string;

    /**
     * Return raw Value
     */
    toString?: () => string;

    /**
     * Method to return data to JSON
     */
    toData?: () => TranslationTextInterface;
}