import { enumToArray } from "../utils/utils";
import { ValueOf } from "./default.types";

/**
 * Roles Users
 */
export const ROLES_NAMES = {
    // Dev
    DEV: "ROLE_DEV",
    // Super Admin
    SUPER_ADMIN: "ROLE_SUPER_ADMIN",
    // Admin
    ADMIN: "ROLE_ADMIN",
    // User SOGECA
    USER_SOGECA: "ROLE_USER_SOGECA",
    // User SOGECA THERM
    USER_SOGECA_THERM: "ROLE_USER_SOGECA_THERM",
    // User SMTPF
    USER_SMTPF: "ROLE_USER_SMTPF",
    // User SMARTFIB
    USER_SMARTFIB: "ROLE_USER_SMARTFIB",
    // User Sablière
    USER_SABLIERE: "ROLE_USER_SABLIERE",
    // User CGR
    USER_CGR: "ROLE_USER_CGR",
    // ComEx
    COMEX: "ROLE_COMEX",
    // Gestion
    MANAGEMENT: "ROLE_MANAGEMENT",
    // RH
    RH: "ROLE_RH",
    // Achat
    PURCHASE: "ROLE_PURCHASE",
    // Administratif
    ADMINISTRATIVE: "ROLE_ADMINISTRATIVE",
    // Parc matériel
    MATERIAL_PARK: "ROLE_MATERIAL_PARK",
    // Mécanique
    MECHANICS: "ROLE_MECHANICS",
    // QSE
    QSE: "ROLE_QSE",
    // Commerce
    TRADE: "ROLE_TRADE",
    // Chiffrage
    COSTING: "ROLE_COSTING",
    // Ingénierie
    ENGINEERING: "ROLE_ENGINEERING",
    // Juridique
    JURIDICAL: "ROLE_JURIDICAL",
    // Comm
    COMMUNICATION: "ROLE_COMMUNICATION",
    // Finance
    FINANCE: "ROLE_FINANCE",
    // Sablière
    SABLIERE: "ROLE_SABLIERE",
    // CGR
    CGR: "ROLE_CGR",
    // Chantier
    SITE: "ROLE_SITE",
} as const;

/**
 * Type of ROLES
 */
export type ROLES_TYPES = ValueOf<typeof ROLES_NAMES>;

/**
 * List of group name
 */
export const ROLES_LIST: ROLES_TYPES[] = enumToArray(ROLES_NAMES);