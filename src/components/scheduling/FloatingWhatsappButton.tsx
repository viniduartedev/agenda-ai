interface FloatingWhatsappButtonProps {
  href: string;
  label?: string;
}

export function FloatingWhatsappButton({
  href,
  label = 'Abrir conversa no WhatsApp',
}: FloatingWhatsappButtonProps) {
  if (!href) {
    return null;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      title={label}
      className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_18px_40px_rgba(37,211,102,0.38)] transition hover:scale-[1.03] hover:brightness-95 focus:outline-none focus:ring-4 focus:ring-[#25D366]/30 sm:h-14 sm:w-14"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7 fill-current">
        <path d="M19.05 4.91A9.82 9.82 0 0 0 12.03 2C6.58 2 2.15 6.42 2.15 11.88c0 1.75.46 3.45 1.34 4.94L2 22l5.33-1.4a9.9 9.9 0 0 0 4.7 1.2h.01c5.45 0 9.88-4.43 9.88-9.88a9.83 9.83 0 0 0-2.87-7.01Zm-7.02 15.2h-.01a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.16.83.84-3.08-.2-.32a8.15 8.15 0 0 1-1.25-4.34c0-4.51 3.67-8.18 8.19-8.18 2.19 0 4.24.85 5.79 2.4a8.13 8.13 0 0 1 2.39 5.78c0 4.52-3.67 8.19-8.11 8.19Zm4.49-6.14c-.25-.13-1.47-.73-1.7-.82-.23-.08-.39-.12-.56.13-.16.24-.64.81-.78.98-.14.16-.29.19-.54.06-.25-.13-1.04-.38-1.99-1.23a7.35 7.35 0 0 1-1.38-1.72c-.15-.25-.02-.39.11-.52.11-.11.25-.29.38-.44.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.77-1.84-.2-.48-.41-.41-.56-.42h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.23.9 2.43 1.03 2.6.12.16 1.75 2.67 4.25 3.75.59.26 1.06.41 1.42.52.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.17-.06-.1-.22-.17-.47-.3Z" />
      </svg>
    </a>
  );
}
