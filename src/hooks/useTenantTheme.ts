import { useEffect } from 'react';
import type { TenantTheme } from '@/types/domain';
import { applyTenantTheme } from '@/utils/theme';

export function useTenantTheme(theme?: TenantTheme) {
  useEffect(() => {
    if (!theme) return;
    applyTenantTheme(theme);
  }, [theme]);
}
