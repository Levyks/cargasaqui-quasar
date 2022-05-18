import { getAuth, UserRecord } from "firebase-admin/auth";
import * as functions from "firebase-functions";
import { db } from "./db";
import { Company } from "./typings";

const auth = getAuth();

export function getArguments<T extends any[]>(data: any, keys: string[]): T {

    const args = [] as unknown as T;

    for (const key of keys) {
     
        const value = data[key];
        
        if (value === undefined) {
            throw new functions.https.HttpsError('invalid-argument', `Missing argument: ${key}`);
        }

        args.push(value);

    }

    return args;

}

export function getCompanyOrThrowNotFound(companyId: string): Promise<Company> {
    return db.companies.doc(companyId).get().then(doc => {
        if(doc.exists) return doc.data()!;
        throw new functions.https.HttpsError('not-found', 'Company not found');   
    });
}

export function getUserByEmailOrThrow(email: string, errorCode: functions.https.FunctionsErrorCode, errorMessage: string): Promise<UserRecord> {

    return auth.getUserByEmail(email).catch((error) => {
        if(error.code === 'auth/user-not-found') {
            throw new functions.https.HttpsError(errorCode, errorMessage);
        } 
        throw error;
    });

}

export function ensureAuthenticated(context: functions.https.CallableContext) {
    if(!context.auth) {
        throw new functions.https.HttpsError('permission-denied', 'User not authenticated');
    }
}

export function ensureAppChecked(context: functions.https.CallableContext) {
    if(!context.app) {
        throw new functions.https.HttpsError('failed-precondition', 'The function must be called from an App Check verified app.')    
    }
}

export function ensureIsMasterAdmin(context: functions.https.CallableContext) {
    ensureAuthenticated(context);

    const token = context.auth!.token || {};
    
    if(!token.master_admin) throw new functions.https.HttpsError('permission-denied', 'User not authorized');
}

export function ensureHasRoleInCompany(context: functions.https.CallableContext, company: Company, allowed_roles: string[]) {
    ensureAuthenticated(context);
    
    const token = context.auth!.token || {};
    
    if(token.master_admin) return;

    for (const role of allowed_roles) {
        if(token.roles?.[company.id!] === role) return;
    }

    throw new functions.https.HttpsError('permission-denied', 'User not authorized');
}