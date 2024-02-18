import { dateToTimestamp } from "../../../../utils/utils";
import { TranslationTextInterface } from "../interfaces/defaut.interface";
import { TranslationType } from "./translation.type";

/**
 * Class of Lang Text
 */
export class TranslationTextType implements TranslationTextInterface {


   /**
    * Lang of Text
    */
   lang: TranslationType;

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
   createdAt: Date;

   /**
    * Updated Date of Text
    */
   updatedAt: Date;

   /**
    * Parameters of text
    */
   parameters?: { [name: string]: string; } = {};

   public clone(): TranslationTextType {
      return TranslationTextType.build({
         lang: this?.lang,
         key: this?.key,
         value: this?.value,
         createdAt: this?.createdAt,
         updatedAt: this?.updatedAt,
      });
   }

   public addParameters(parameters: { [name: string]: string; }): TranslationTextType {
      if(parameters) Object.assign(this.parameters, parameters);
      return this;
   }

   public getRaw(): string {
      return this.value;
   }

   public getValue(): string {
      if(this.value) {
         let value = `${this.value}`;
         if(this.parameters) {
            for(let _key in this.parameters) {
               const regex = new RegExp(`{${_key}}`, 'gi');
               value = value.replace(regex, this.parameters[_key]);
            }
         }
         return value;
      }
      return;
   }

   toString(): string {
      return this.getValue();
   }

   /**
    * Return Data
    */
   public toData(): TranslationTextInterface {
      const data: TranslationTextInterface = {
         lang: this.lang?.code,
         key: this.key,
         value: this.value,
         createdAt: dateToTimestamp(this.createdAt),
         updatedAt: dateToTimestamp(this.updatedAt),
      };

      return data;
   }

   /**
    * Return new instance
    */
   public static build(data: TranslationTextInterface): TranslationTextType {
      const newInstance = new TranslationTextType();
      Object.assign(newInstance, data);
      return newInstance;
   }

}
