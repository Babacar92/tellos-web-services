import { applyDecorators } from "@nestjs/common";
import { Transform } from "class-transformer";
import { IsOptional, Validate } from "class-validator";
import { UploadImageResizeConstraint } from "../../constraints/upload.image.resize.constrait";

/**
 * The decorator of Image resize
 * @returns 
 */
export const ImageResizeValidate = (): PropertyDecorator => {
    return applyDecorators(
        IsOptional(),
        Transform(({ value: resize }) => {
            if (resize) {
                try {
                    return JSON.parse(resize);
                } catch (e) {
                    return 'Error JSON';
                }
            }
            return;
        }),
        Validate(UploadImageResizeConstraint)
    );
};