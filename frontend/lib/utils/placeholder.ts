// Shared placeholder used when a product has no uploaded image.
// Avoids depending on a missing static asset (default-product.png).
const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><rect width='100%' height='100%' fill='#0f172a'/><text x='50%' y='52%' font-size='64' text-anchor='middle' dominant-baseline='central'>🐟</text></svg>`;

export const PRODUCT_PLACEHOLDER = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
