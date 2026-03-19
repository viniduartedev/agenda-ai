import type { PropsWithChildren } from 'react';
import { Container } from '@/components/ui/Container';

export function PublicShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100">
      <Container>
        <div className="py-8 sm:py-12">{children}</div>
      </Container>
    </div>
  );
}
