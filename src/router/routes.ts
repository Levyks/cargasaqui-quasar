import { RouteRecordRaw } from 'vue-router';
import { CustomRouteRecordDict } from 'typings/router';

function formatRoutesToChildren(
  routesDict: CustomRouteRecordDict
): RouteRecordRaw[] {
  return Object.entries(routesDict).map(([key, route]) => {
    route.name = key;
    return route;
  });
}

export const routes = {
  home: {
    path: '/',
    redirect: '/companies',
  },
  companies: {
    path: '/companies',
    component: () => import('pages/CompaniesPage.vue'),
  },
  company: {
    path: '/companies/:companyId',
    component: () => import('pages/CompanyPage.vue'),
    getPath: (companyId: string) => `/companies/${companyId}`,
  },
  login: {
    path: '/login',
    component: () => import('pages/LoginPage.vue'),
  },
  profile: {
    path: '/profile',
    component: () => import('pages/ProfilePage.vue'),
  },
};

export default [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: formatRoutesToChildren(routes),
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
] as RouteRecordRaw[];
