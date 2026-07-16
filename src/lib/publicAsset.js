// Resolve a public/-directory asset against the deploy base. BASE_URL is
// '/' on standalone builds and '/kaiser-natron/' on the ENERGEIA umbrella
// build — root-absolute strings like '/products/x.webp' would escape the
// mount there, so every public asset reference goes through this helper.
export function publicAsset(path) {
  return import.meta.env.BASE_URL + String(path).replace(/^\//, '')
}
