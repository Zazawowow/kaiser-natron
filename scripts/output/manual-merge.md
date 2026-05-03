# Manual merge — copy these into the right files

## src/api/products.js — properties

- `kaiser-natron-pulver-50-g-beutel` → `properties: ["glutenfrei", "laktosefrei", "vegan", "neutralisiert-saeuren", "enthaertet", "mild-alkalisch"]`
- `kaiser-natron-pulver-250-g-grosspackung` → `properties: ["glutenfrei", "laktosefrei", "vegan", "neutralisiert-saeuren", "enthaertet", "mild-alkalisch"]`
- `kaiser-natron-pulver-3490-g-eimer` → `properties: ["glutenfrei", "laktosefrei", "vegan", "neutralisiert-saeuren", "enthaertet", "mild-alkalisch"]`
- `kaiser-natron-tabletten-100-g-dose` → `properties: ["glutenfrei", "laktosefrei", "vegan", "fuer-kueche-und-haushalt"]`
- `kaiser-natron-bad-500-g` → `properties: ["mit-apfelsinenduft", "ohne-konservierungsstoffe", "ohne-mineraloel", "frei-von-tierischen-substanzen"]`
- `kaiser-natron-fussbad-500-g` → `properties: ["mit-latschenkieferduft", "wohltuend-erfrischend", "ohne-konservierungsstoffe", "ohne-mineraloel", "frei-von-tierischen-substanzen"]`
- `kaiser-natron-daunenwasch-250-ml` → `properties: ["mit-lanolin", "frei-von-mikroplastik"]`
- `kaiser-natron-spuelmittel-500-ml` → `properties: ["mit-pampelmusenduft", "hautvertraeglich", "frei-von-mikroplastik"]`
- `kaiser-natron-allzweck-reiniger-750-ml` → `properties: ["hygienische-sauberkeit", "fuer-boeden-und-oberflaechen", "mit-pampelmusenduft", "vegan", "ohne-konservierungsstoffe", "frei-von-mikroplastik"]`
- `kaiser-natron-allzweck-spray-500-ml` → `properties: ["nachhaltige-tenside", "ohne-konservierungsstoffe", "mit-natuerlicher-seife", "frei-von-mikroplastik"]`

## src/i18n/messages.js — DE block
```js
  'product.prop.enthaertet': 'Enthärtet',
  'product.prop.frei-von-mikroplastik': 'Frei von Mikroplastik',
  'product.prop.frei-von-tierischen-substanzen': 'Frei von tierischen Substanzen',
  'product.prop.fuer-boeden-und-oberflaechen': 'Für Böden und Oberflächen',
  'product.prop.fuer-kueche-und-haushalt': 'Für Küche und Haushalt',
  'product.prop.glutenfrei': 'Glutenfrei',
  'product.prop.hautvertraeglich': 'Hautverträglich – dermatologisch bestätigt',
  'product.prop.hygienische-sauberkeit': 'Hygienische Sauberkeit',
  'product.prop.laktosefrei': 'Laktosefrei',
  'product.prop.mild-alkalisch': 'Mild-alkalisch',
  'product.prop.mit-pampelmusenduft': 'Mit Pampelmusenduft',
  'product.prop.mit-latschenkieferduft': 'Mit dem Duft der Latschenkiefer',
  'product.prop.mit-apfelsinenduft': 'Mit entspannendem Apfelsinenduft',
  'product.prop.mit-natuerlicher-seife': 'Mit natürlicher Seife',
  'product.prop.mit-lanolin': 'Mit pflegendem Lanolin',
  'product.prop.nachhaltige-tenside': 'Nachhaltig durch Tenside nachwachsenden Ursprungs',
  'product.prop.neutralisiert-saeuren': 'Neutralisiert Säuren',
  'product.prop.ohne-konservierungsstoffe': 'Ohne Konservierungsstoffe',
  'product.prop.ohne-mineraloel': 'Ohne Mineralöl',
  'product.prop.vegan': 'Vegan',
  'product.prop.wohltuend-erfrischend': 'Wohltuend und erfrischend',
  'product.prop.made-in-austria': 'In Österreich abgefüllt',
  'product.prop.bio': 'Bio',
```

## src/i18n/messages.js — EN block
```js
  'product.prop.enthaertet': 'Softens water',
  'product.prop.frei-von-mikroplastik': 'Microplastic-free',
  'product.prop.frei-von-tierischen-substanzen': 'No animal substances',
  'product.prop.fuer-boeden-und-oberflaechen': 'For floors & surfaces',
  'product.prop.fuer-kueche-und-haushalt': 'For kitchen & home',
  'product.prop.glutenfrei': 'Gluten-free',
  'product.prop.hautvertraeglich': 'Skin-friendly — dermatologically tested',
  'product.prop.hygienische-sauberkeit': 'Hygienic clean',
  'product.prop.laktosefrei': 'Lactose-free',
  'product.prop.mild-alkalisch': 'Mildly alkaline',
  'product.prop.mit-pampelmusenduft': 'Pomelo scent',
  'product.prop.mit-latschenkieferduft': 'Mountain pine scent',
  'product.prop.mit-apfelsinenduft': 'Sweet orange scent',
  'product.prop.mit-natuerlicher-seife': 'With natural soap',
  'product.prop.mit-lanolin': 'With nourishing lanolin',
  'product.prop.nachhaltige-tenside': 'Sustainable plant-based surfactants',
  'product.prop.neutralisiert-saeuren': 'Neutralises acids',
  'product.prop.ohne-konservierungsstoffe': 'Preservative-free',
  'product.prop.ohne-mineraloel': 'Mineral-oil-free',
  'product.prop.vegan': 'Vegan',
  'product.prop.wohltuend-erfrischend': 'Soothing & refreshing',
  'product.prop.made-in-austria': 'Bottled in Austria',
  'product.prop.bio': 'Organic',
```
