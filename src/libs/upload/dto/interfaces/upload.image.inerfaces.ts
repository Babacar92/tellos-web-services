/**
 * The max size of an image on Width and Height
 */
export const UPLOAD_IMAGE_SIZE_MAX = 1280;

/**
 * The min size of an image on Width and Height
 */
export const UPLOAD_IMAGE_SIZE_MIN = 150;

/**
 * Default medium sizes
 */
export const UPLOAD_IMAGE_MEDIUM_SIZES: ImageResizePropertiesTypes = { width: 600, height: 600 };

/**
 * Default small sizes
 */
export const UPLOAD_IMAGE_SMALL_SIZES: ImageResizePropertiesTypes = { width: 200, height: 200 };

/**
 * Properties of resize type
 */
export interface ImageResizePropertiesTypes {
    /**
     * Width of Resize
     */
    width: number;

    /**
     * Height of resize
     */
    height?: number;

    /**
     * Define if ratio is save
     */
    aspectRation?: boolean;
}

/**
 * Interface for resizer
 */
export interface ImageResizeInterface {

    /** Thumbnail sizes */
    thumbnail: ImageResizePropertiesTypes;

    /** Medium sizes */
    medium?: ImageResizePropertiesTypes;

    /** Small sizes */
    small?: ImageResizePropertiesTypes;

    /** Other type of resize */
    [name: string]: ImageResizePropertiesTypes;
}