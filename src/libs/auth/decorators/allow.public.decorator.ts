import { SetMetadata } from "@nestjs/common";

/**
 * Allowed decorator key
 */
export const ALLOW_PUBLIC_KEY = 'IS_ALLOW_PUBLIC_KEY';

/**
 * Allowed decorator
 */
export const AllowPublic = () => SetMetadata(ALLOW_PUBLIC_KEY, true);
