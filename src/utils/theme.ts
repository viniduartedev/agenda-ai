import type { TenantTheme } from '@/types/domain';
import { createSoftColor, getReadableTextColor } from '@/utils/color';

export function applyTenantTheme(theme: TenantTheme) {
  const root = document.documentElement;
  root.style.setProperty('--tenant-primary', theme.primaryColor);
  root.style.setProperty('--tenant-primary-soft', createSoftColor(theme.primaryColor));
  root.style.setProperty('--tenant-text', getReadableTextColor(theme.primaryColor));
}
