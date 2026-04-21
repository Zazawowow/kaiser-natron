// Icon registry — 24x24 viewBox, stroke-based, rendered by Icon.vue via currentColor.
// Add entries here to expose them as <Icon name="..." />.

export const icons = {
  // Commerce
  cart: {
    path: '<path d="M6 7h12l-1.2 10.3a2 2 0 0 1-2 1.7H9.2a2 2 0 0 1-2-1.7L6 7Z" /><path d="M9 10V6a3 3 0 1 1 6 0v4" />',
    label: 'Warenkorb',
  },
  bag: {
    path: '<path d="M5 7h14v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7Z" /><path d="M9 7V5a3 3 0 1 1 6 0v2" />',
    label: 'Tasche',
  },
  heart: {
    path: '<path d="M12 20s-7-4.35-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.65-7 10-7 10Z" />',
    label: 'Favorit',
  },
  user: {
    path: '<circle cx="12" cy="8" r="3.5" /><path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" />',
    label: 'Konto',
  },
  search: {
    path: '<circle cx="11" cy="11" r="6.5" /><path d="m20 20-3.5-3.5" />',
    label: 'Suche',
  },

  // Navigation
  menu: { path: '<path d="M5 7h14M5 12h14M5 17h14" />', label: 'Menü' },
  close: { path: '<path d="M6 6l12 12M18 6L6 18" />', label: 'Schließen' },
  'chevron-left': { path: '<path d="M14 6l-6 6 6 6" />', label: 'Zurück' },
  'chevron-right': { path: '<path d="M10 6l6 6-6 6" />', label: 'Weiter' },
  'chevron-down': { path: '<path d="M6 10l6 6 6-6" />', label: 'Öffnen' },
  'chevron-up': { path: '<path d="M6 14l6-6 6 6" />', label: 'Schließen' },
  'arrow-right': { path: '<path d="M5 12h14M13 6l6 6-6 6" />', label: 'Pfeil rechts' },
  'arrow-left': { path: '<path d="M19 12H5M11 6l-6 6 6 6" />', label: 'Pfeil links' },

  // Actions
  plus: { path: '<path d="M12 5v14M5 12h14" />', label: 'Hinzufügen' },
  minus: { path: '<path d="M5 12h14" />', label: 'Entfernen' },
  check: { path: '<path d="m5 12 5 5L20 7" />', label: 'Bestätigt' },

  // Contact
  mail: {
    path: '<rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" />',
    label: 'E-Mail',
  },
  phone: {
    path: '<path d="M21 16.5v3a2 2 0 0 1-2.2 2 19 19 0 0 1-8.3-3 19 19 0 0 1-6-6A19 19 0 0 1 1.5 4.2 2 2 0 0 1 3.5 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2L7.3 9.6a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2Z" />',
    label: 'Telefon',
  },
  'map-pin': {
    path: '<path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" />',
    label: 'Standort',
  },
  'external-link': {
    path: '<path d="M14 5h5v5" /><path d="M19 5l-9 9" /><path d="M19 14v5H5V5h5" />',
    label: 'Externer Link',
  },

  // Feedback
  info: {
    path: '<circle cx="12" cy="12" r="9" /><path d="M12 11v5" /><circle cx="12" cy="8" r="0.6" fill="currentColor" stroke="none" />',
    label: 'Info',
  },
  star: {
    path: '<path d="m12 3 2.7 5.7 6.3.9-4.6 4.4 1.1 6.2L12 17.3 6.5 20.2l1.1-6.2L3 9.6l6.3-.9Z" />',
    label: 'Stern',
  },

  // Devices
  mobile: {
    path: '<rect x="7" y="3" width="10" height="18" rx="2" /><path d="M11 18h2" />',
    label: 'Mobile',
  },
  tablet: {
    path: '<rect x="4" y="3" width="16" height="18" rx="2" /><path d="M11 18h2" />',
    label: 'Tablet',
  },
  desktop: {
    path: '<rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" />',
    label: 'Desktop',
  },
}

export const iconNames = Object.keys(icons)
