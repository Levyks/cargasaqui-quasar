import * as functions from "firebase-functions";
import { getAuth } from "firebase-admin/auth";
import { Timestamp } from "firebase-admin/firestore";

import "./app";

import { ensureAppChecked, ensureAuthenticated, ensureHasRoleInCompany, ensureIsMasterAdmin, getArguments, getCompanyOrThrowNotFound, getUserByEmailOrThrow } from "./util";
import { db } from "./db";
import { Cargo } from "./typings";

const auth = getAuth();

export const createUser = functions.region('southamerica-east1').https.onCall((data, context) => {

    //ensureAppChecked(context);

    const [name, email, password] = getArguments<[string, string, string]>(data, ['name', 'email', 'password']);

    return auth.createUser({
        email, password,
        displayName: name,
    }).catch(error => {
        if(error.code === 'auth/email-already-exists') {
            throw new functions.https.HttpsError('already-exists', 'User with this e-mail already exists');
        }
        throw error;
    });

});

export const getUserClaims = functions.region('southamerica-east1').https.onCall(async (data, context) => {

    ensureAppChecked(context);
    ensureIsMasterAdmin(context);

    const [ email ] = getArguments<[string]>(data, ['email']);

    const user = await getUserByEmailOrThrow(email, 'not-found', 'User not found');

    return user.customClaims;

});

export const setUserRoleInCompany = functions.region('southamerica-east1').https.onCall(async (data, context) => {

    ensureAppChecked(context);
    ensureAuthenticated(context);

    const [company_id, email, role] = 
        getArguments<[string, string, string]>(data, ['company_id', 'email', 'role']);

    const company = await getCompanyOrThrowNotFound(company_id);

    ensureHasRoleInCompany(context, company, ['admin'])

    const user = await getUserByEmailOrThrow(email, 'failed-precondition', 'User not registered');

    const claims = user.customClaims || {};
    claims.roles = claims.roles || {};

    claims.roles[company.id!] = role;

    const roles = company.roles || {};
    roles[user.email!] = role;

    await Promise.all([
        auth.setCustomUserClaims(user.uid, claims),
        db.companies.doc(company.id!).update({ roles })
    ]);

    return claims;

});

export const deleteUserRoleInCompany = functions.region('southamerica-east1').https.onCall(async (data, context) => {

    ensureAppChecked(context);
    ensureAuthenticated(context);

    const [company_id, email] =
        getArguments<[string, string]>(data, ['company_id', 'email']);

    const company = await getCompanyOrThrowNotFound(company_id);

    ensureHasRoleInCompany(context, company, ['admin'])

    const user = await getUserByEmailOrThrow(email, 'failed-precondition', 'User not registered');
     
    const claims = user.customClaims || {};
    claims.roles = claims.roles || {};
    delete claims.roles[company.id!];

    const roles = company.roles || {};
    delete roles[email];

    await Promise.all([
        auth.setCustomUserClaims(user.uid, claims),
        db.companies.doc(company.id!).update({ roles })
    ]);

    return claims;

});

export const storeStatusChange = functions.firestore
    .document('companies/{companyId}/cargoes/{cargoId}')
    .onUpdate(async (change, context) => {

        const before = change.before.data() as Cargo;
        const after = change.after.data()! as Cargo;

        if(before.status.id === after.status.id) return;

        const cargoPrivateSnap = await db.cargoPrivateFromRef(change.after.ref).doc("extra").get();

        const statusChanges = cargoPrivateSnap.data()!.statusChanges || [];

        statusChanges.push({
            old: before.status,
            new: after.status,
            timestamp: Timestamp.now()
        });

        await cargoPrivateSnap.ref.update({
            statusChanges
        });

    }
);