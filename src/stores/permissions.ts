import { defineStore } from 'pinia';
import { computed } from 'vue';
import { useAuthStore } from './auth';
import { useCompanyStore } from './company';

export const usePermissionsStore = defineStore('permissions', () => {
  const authStore = useAuthStore();
  const companyStore = useCompanyStore();

  const userIsMasterAdmin = computed(() => {
    console.log('recomputing userIsMasterAdmin');
    return !!authStore.token?.claims?.master_admin;
  });

  const userRoleInCompany = computed(() => {
    if (authStore.token && companyStore.company) {
      const roles = authStore.token.claims.roles as Record<string, string>;
      return roles[companyStore.company.id] || null;
    } else {
      return null;
    }
  });

  function hasPermission(permissions: string[]) {
    return computed(() => {
      if (userIsMasterAdmin.value) return true;
      if (!userRoleInCompany.value) return false;
      return permissions.includes(userRoleInCompany.value);
    });
  }

  return {
    userRoleInCompany,
    userIsMasterAdmin,
    hasPermission,
  };
});
