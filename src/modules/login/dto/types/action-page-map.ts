import { ACTION_LOG_TYPES } from "src/modules/action-log/dto/types/actions.types.enum";

export const actionPageMap = new Map<string, (root: any) => any>([
    [ACTION_LOG_TYPES.LOGIN_CREATE, (data: any) => `/logs/show/${data.id}`],
    [ACTION_LOG_TYPES.LOGIN_UPDATE, (data: any) => `/logs/show/${data.id}`],
    [ACTION_LOG_TYPES.LOGIN_DELETE, (data: any) => `/logs/show/${data.id}`],
    [ACTION_LOG_TYPES.LOGIN_SOFT_DELETE, (data: any) => `/logs/show/${data.id}`],
    [ACTION_LOG_TYPES.EMPLOYEE_CREATE, (data: any) => `Créer employé`],
    // [ACTION_LOG_TYPES.EMPLOYEE_LOGIN, (data: any) => `/sign-in/${data.id}`],
    [ACTION_LOG_TYPES.LOGIN_LOGIN, (data: any) => `Authentification`],
    [ACTION_LOG_TYPES.ENTITY_CREATE, (data: any) => `Créer entité`],
    [ACTION_LOG_TYPES.ENTITY_READ, (data: any) => `Afficher entité`],
    [ACTION_LOG_TYPES.ENTITY_UPDATE, (data: any) => `Modifier entité`],
    [ACTION_LOG_TYPES.ENTITY_DELETE, (data: any) => `Supprimer entité`],
    [ACTION_LOG_TYPES.ENTITY_SOFT_DELETE, (data: any) => `Supprimer entité`],
    [ACTION_LOG_TYPES.EMPLOYEE_UPDATE, (data: any) => `Modifier employé`],
    [ACTION_LOG_TYPES.EMPLOYEE_DELETE, (data: any) => `Supprimer employé`],
    [ACTION_LOG_TYPES.EMPLOYEE_SOFT_DELETE, (data: any) => `Supprimer employé`],

    [ACTION_LOG_TYPES.QUICK_ACCESS_CREATE, (data: any) => `/logs/show/${data.id}`],
    [ACTION_LOG_TYPES.QUICK_ACCESS_UPDATE, (data: any) => `/logs/show/${data.id}`],
    [ACTION_LOG_TYPES.QUICK_ACCESS_DELETE, (data: any) => `/logs/show/${data.id}`],
    [ACTION_LOG_TYPES.QUICK_ACCESS_SOFT_DELETE, (data: any) => `/logs/show/${data.id}`],

    [ACTION_LOG_TYPES.DEPARTMENT_SOFT_DELETE, (data: any) => `Supprimer département`], //// to be check...
    [ACTION_LOG_TYPES.DEPARTMENT_CREATE, (data: any) => `Créer département`], //// to be check...
    [ACTION_LOG_TYPES.DEPARTMENT_UPDATE, (data: any) => `Modifier département`], //// to be check...

    [ACTION_LOG_TYPES.QUALIFICATION_NAME_CREATE, (data: any) => `Créer nom-qualification`], //// to be check...
    [ACTION_LOG_TYPES.QUALIFICATION_NAME_UPDATE, (data: any) => `Modidier nom-qualification`], //// to be check...
    [ACTION_LOG_TYPES.QUALIFICATION_NAME_DELETE, (data: any) => `Supprimer nom-qualification`], //// to be check...
    [ACTION_LOG_TYPES.QUALIFICATION_NAME_READ, (data: any) => `Afficher nom-qualification`], //// to be check...
    [ACTION_LOG_TYPES.QUALIFICATION_NAME_SOFT_DELETE, (data: any) => `Supprimer nom-qualification`], //// to be check...

    [ACTION_LOG_TYPES.QUALIFICATION_CREATE, (data: any) => `Créer qualification`], //// to be check...
    [ACTION_LOG_TYPES.QUALIFICATION_UPDATE, (data: any) => `Modidier qualification`], //// to be check...
    [ACTION_LOG_TYPES.QUALIFICATION_DELETE, (data: any) => `Supprimer qualification`], //// to be check...
    [ACTION_LOG_TYPES.QUALIFICATION_READ, (data: any) => `Afficher qualification`], //// to be check...
    [ACTION_LOG_TYPES.QUALIFICATION_SOFT_DELETE, (data: any) => `Supprimer qualification`], //// to be check...

    [ACTION_LOG_TYPES.QUALIFICATION_TYPE_CREATE, (data: any) => `Créer type-qualification`], //// to be check...
    [ACTION_LOG_TYPES.QUALIFICATION_TYPE_UPDATE, (data: any) => `Modidier type-qualification`], //// to be check...
    [ACTION_LOG_TYPES.QUALIFICATION_TYPE_DELETE, (data: any) => `Supprimer type-qualification`], //// to be check...
    [ACTION_LOG_TYPES.QUALIFICATION_TYPE_READ, (data: any) => `Afficher type-qualification`], //// to be check...
    [ACTION_LOG_TYPES.QUALIFICATION_TYPE_SOFT_DELETE, (data: any) => `Supprimer type-qualification`], //// to be check...

    [ACTION_LOG_TYPES.ROLE_CREATE, (data: any) => `Créer role`],
    [ACTION_LOG_TYPES.ROLE_UPDATE, (data: any) => `Modidier role`],
    [ACTION_LOG_TYPES.ROLE_DELETE, (data: any) => `Supprimer role`], //to be checked
    [ACTION_LOG_TYPES.ROLE_READ, (data: any) => `Afficher role`],//to be checked
    [ACTION_LOG_TYPES.ROLE_SOFT_DELETE, (data: any) => `Supprimer role`],//to be checked

    [ACTION_LOG_TYPES.DOCUMENT_CATEGORY_CREATE, (data: any) => `Créer catégorie-document`],//to be checked
    [ACTION_LOG_TYPES.DOCUMENT_CATEGORY_UPDATE, (data: any) => `Modifier catégorie-document`],//to be checked
    [ACTION_LOG_TYPES.DOCUMENT_CATEGORY_DELETE, (data: any) => `Supprimer catégorie-document`],//to be checked
    [ACTION_LOG_TYPES.DOCUMENT_CATEGORY_READ, (data: any) => `Afficher catégorie-document`],//to be checked
    [ACTION_LOG_TYPES.DOCUMENT_CATEGORY_SOFT_DELETE, (data: any) => `Afficher catégorie-document`],//to be checked

    [ACTION_LOG_TYPES.DOCUMENT_TYPE_CREATE, (data: any) => `Créer type-document`],//to be checked
    [ACTION_LOG_TYPES.DOCUMENT_TYPE_UPDATE, (data: any) => `Modidier type-document`],//to be checked
    [ACTION_LOG_TYPES.DOCUMENT_TYPE_DELETE, (data: any) => `Supprimer type-document`],//to be checked
    [ACTION_LOG_TYPES.DOCUMENT_TYPE_READ, (data: any) => `Afficher type-document`],//to be checked
    [ACTION_LOG_TYPES.DOCUMENT_TYPE_SOFT_DELETE, (data: any) => `Supprimer type-document`],//to be checked

    [ACTION_LOG_TYPES.PARAGRAPH_FRAME_CREATE, (data: any) => `Créer trame-contrat`],//to be checked
    [ACTION_LOG_TYPES.PARAGRAPH_FRAME_UPDATE, (data: any) => `Modidier trame-contrat`],//to be checked
    [ACTION_LOG_TYPES.PARAGRAPH_FRAME_DELETE, (data: any) => `Supprimer trame-contrat`],//to be checked
    [ACTION_LOG_TYPES.PARAGRAPH_FRAME_READ, (data: any) => `Afficher trame-contrat`],//to be checked
    [ACTION_LOG_TYPES.PARAGRAPH_FRAME_SOFT_DELETE, (data: any) => `Supprimer trame-contrat`],//to be checked

    [ACTION_LOG_TYPES.CAREER_PATH_CREATE, (data: any) => `Créer parcours-pro`],//to be checked
    [ACTION_LOG_TYPES.CAREER_PATH_UPDATE, (data: any) => `Modifier parcours-pro`],//to be checked
    [ACTION_LOG_TYPES.CAREER_PATH_DELETE, (data: any) => `Supprimer parcours-pro`],//to be checked
    [ACTION_LOG_TYPES.CAREER_PATH_READ, (data: any) => `Afficher parcours-pro`],//to be checked
    [ACTION_LOG_TYPES.CAREER_PATH_SOFT_DELETE, (data: any) => `Supprimer parcours-pro`],//to be checked

    [ACTION_LOG_TYPES.EMPLOYEE_DOCUMENT_CREATE, (data: any) => `Créer document-employé`],//to be checked
    [ACTION_LOG_TYPES.EMPLOYEE_DOCUMENT_UPDATE, (data: any) => `Modifier document-employé`],//to be checked
    [ACTION_LOG_TYPES.EMPLOYEE_DOCUMENT_DELETE, (data: any) => `Supprimer document-employé`],//to be checked
    [ACTION_LOG_TYPES.EMPLOYEE_DOCUMENT_READ, (data: any) => `Afficher document-employé`],//to be checked
    [ACTION_LOG_TYPES.EMPLOYEE_DOCUMENT_SOFT_DELETE, (data: any) => `Supprimer document-employé`],//to be checked

    [ACTION_LOG_TYPES.LEAVE_CREATE, (data: any) => `/employees/detail`],//to be checked
    [ACTION_LOG_TYPES.LEAVE_UPDATE, (data: any) => `/employees/detail/${data.id}`],//to be checked
    [ACTION_LOG_TYPES.LEAVE_DELETE, (data: any) => `/employees`],//to be checked
    [ACTION_LOG_TYPES.LEAVE_READ, (data: any) => `/employees`],//to be checked
    [ACTION_LOG_TYPES.LEAVE_SOFT_DELETE, (data: any) => `/employees`],//to be checked
]);