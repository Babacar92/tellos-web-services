import { dateToTimestamp } from "../../../../utils/utils";
import { TranslationInterface, TranslationTextInterface } from "../interfaces/defaut.interface";
import { TranslationTextType } from "./translation.text.type";

/**
 * Class of Lang
 */
export class TranslationType implements TranslationInterface {

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
   texts: TranslationTextType[];

   /**
    * Created Date of Text
    */
   createdAt: Date;

   /**
    * Updated Date of Text
    */
   updatedAt: Date;

   /**
    * Add new text
    * @param text 
    * @returns 
    */
   public addText(text: TranslationTextInterface): boolean {
      if (!this.texts) this.texts = [];
      const found = this.texts.find(_text => _text.key === text.key);
      if (!found) {
         this.texts.push(TranslationTextType.build(text));

         return true;
      }
      return false;
   }

   /**
    * Return Last Text
    * @returns 
    */
   public getLast(): TranslationTextType {
      return this.texts[(this.texts?.length || 1) - 1];
   }

   /**
    * Return Data Json
    * @returns 
    */
   public toJson(): string {
      const data: TranslationInterface = {
         code: this.code,
         title: this.title,
         domain: this.domain,
         createdAt: dateToTimestamp(this.createdAt),
         updatedAt: dateToTimestamp(this.updatedAt),
         texts: this.texts?.map(text => text.toData()),
      };

      return JSON.stringify(data);
   }


   /**
    * Return new instance
    */
   public static build(data: TranslationInterface): TranslationType {
      const newInstance = new TranslationType();
      Object.assign(newInstance, data);
      newInstance.code = newInstance.code.toUpperCase();
      return newInstance;
   }

   public static buidFromData(data?: string): TranslationInterface {
      if (!data) return;

      const parsed: TranslationInterface = JSON.parse(data);

      const instance = TranslationType.build({
         code: parsed.code,
         title: parsed.title,
         domain: parsed.domain,
         createdAt: new Date(parsed.createdAt),
         updatedAt: new Date(parsed.updatedAt),
      });

      instance.texts = parsed.texts?.map(text => TranslationTextType.build({
         lang: instance,
         key: text.key,
         value: text.value,
         createdAt: new Date(text.createdAt),
         updatedAt: new Date(text.updatedAt),
      }));

      return instance;
   }

}
