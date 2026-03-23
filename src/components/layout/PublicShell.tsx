import type { PropsWithChildren } from 'react';
import { Container } from '@/components/ui/Container';

export function PublicShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100">
      <Container>
        <div className="py-6 pb-24 sm:py-12 sm:pb-12">{children}</div>
      </Container>
    </div>
  );
}
