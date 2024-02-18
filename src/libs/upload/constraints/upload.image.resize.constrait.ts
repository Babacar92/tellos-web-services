import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { TranslationService } from "src/libs/translation/service/translation.service";
import { ImageResizePropertiesTypes, UPLOAD_IMAGE_SIZE_MAX, UPLOAD_IMAGE_SIZE_MIN } from "../dto/interfaces/upload.image.inerfaces";

@ValidatorConstraint({
    name: 'UploadImageResizeConstraint',
    async: true
})
@Injectable()
export class UploadImageResizeConstraint implements ValidatorConstraintInterface {

    public constructor(
        private readonly _translationService: TranslationService,
    ) { }

    public async validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            resolve(!this._isErrorResizeConfig(validationArguments));
        });
    }

    public defaultMessage?(validationArguments?: ValidationArguments): string {
        if (this._isJsonError(validationArguments)) {
            return this._translationService.trans('Your resize JSON value is not valid').getValue();
        } else if (this._isErrorResizeType(validationArguments)) {
            return this._translationService.trans('One or more resize type are not valid').getValue();
        } else if (!validationArguments.value.thumbnail) {
            return this._translationService.trans('The thumbnail type is require for resize').getValue();
        } else if (this._isErrorResizeConfig(validationArguments)) {
            return this._translationService.trans('Error on your config type').getValue();
        }
        return this._translationService.trans('Error on resize parameters').getValue();
    }

    private _isJsonError(validationArguments?: ValidationArguments): boolean {
        return validationArguments?.value === 'Error JSON';
    }

    private _isErrorResizeType(validationArguments?: ValidationArguments): boolean {
        if (!this._isJsonError(validationArguments)) {
            const types = Object.keys(validationArguments.value);
            for (let i in types) {
                const type = types[i];
                if (!type.match(/^[a-z]+[a-z0-9\_\-]+[a-z]+$/)) {
                    return true;
                }
            }
            return false;
        }
        return true;
    }

    private _isErrorResizeConfig(validationArguments?: ValidationArguments): boolean {
        if (!this._isErrorResizeType(validationArguments)) {
            const value = validationArguments.value;
            if (!value.thumbnail) return true;
            for (let type in value) {
                const config: ImageResizePropertiesTypes = value[type];

                if (typeof config.width !== 'number' || config.width > UPLOAD_IMAGE_SIZE_MAX || config.width < UPLOAD_IMAGE_SIZE_MIN) {
                    return true;
                } else if (typeof config.height === 'number' && (config.height > UPLOAD_IMAGE_SIZE_MAX || config.height < UPLOAD_IMAGE_SIZE_MIN)) {
                    return true;
                } else if (config.aspectRation !== undefined && typeof config.aspectRation !== 'boolean') {
                    return true;
                }
            }
            return false;
        }
        return true;
    }

}