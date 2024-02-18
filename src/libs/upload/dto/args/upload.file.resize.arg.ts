import { ImageResizeValidate } from "../../decorators/validators/ImageResizeValidate";
import { ImageResizeInterface } from "../interfaces/upload.image.inerfaces";

/**
 * The controle of resize for upload image
 */
export class UploadImageControleResize {

    /**
     * The resize value
     */
    @ImageResizeValidate()
    resize?: ImageResizeInterface;
}
