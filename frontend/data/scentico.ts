export interface ScenticoProduct {
  id: string
  mood: string
  name: string
  price: string
  top: string
  heart: string
  base: string
  effect: string
  gradient: string
  bottle: string
  cap: string
}

export const scenticoProducts: readonly ScenticoProduct[] = [
  { id: 'amber-noir', mood: 'Evening', name: 'Amber Noir', price: '$128', top: 'black pepper, bergamot', heart: 'amber, leather', base: 'dark musk', effect: 'Bold confidence after dark.', gradient: 'linear-gradient(160deg, #7a4a2b, #2b1710)', bottle: '#F0C39A', cap: '#2A1810' },
  { id: 'cafe-bloom', mood: 'Signature', name: 'Café Bloom', price: '$142', top: 'coffee blossom, cardamom', heart: 'tonka bean, jasmine', base: 'vanilla', effect: 'Awake, warm, unmistakably you.', gradient: 'linear-gradient(160deg, #c99a5f, #5c3826)', bottle: '#2A1810', cap: '#5C3826' },
  { id: 'velvet-musk', mood: 'Everyday', name: 'Velvet Musk', price: '$118', top: 'pink pepper, mandarin', heart: 'iris, rose', base: 'white musk', effect: 'Soft power, close to skin.', gradient: 'linear-gradient(160deg, #f0c39a, #c97a47)', bottle: '#FBF2E6', cap: '#C97A47' },
  { id: 'golden-oud', mood: 'Limited', name: 'Golden Oud', price: '$168', top: 'saffron, orange blossom', heart: 'oud, rose', base: 'sandalwood', effect: 'Opulence that lingers for hours.', gradient: 'linear-gradient(160deg, #b8863b, #3d2416)', bottle: '#B8863B', cap: '#2A1810' },
  { id: 'peach-nectar', mood: 'Daytime', name: 'Peach Nectar', price: '$112', top: 'peach, bergamot', heart: 'peony, neroli', base: 'soft musk', effect: 'Sunlit, playful, effortless.', gradient: 'linear-gradient(160deg, #f6d5b3, #e39b6b)', bottle: '#FBF2E6', cap: '#E39B6B' },
  { id: 'smoked-vanilla', mood: 'Cozy', name: 'Smoked Vanilla', price: '$134', top: 'cinnamon, clove', heart: 'vanilla, tobacco flower', base: 'dry woods', effect: 'Cozy intensity, like firelight.', gradient: 'linear-gradient(160deg, #e8cba7, #7a4a2b)', bottle: '#E8CBA7', cap: '#5C3826' },
] as const

/** Keeps keyed product rendering safe when the collection changes. */
export function hasUniqueProductIds(products: readonly Pick<ScenticoProduct, 'id'>[]): boolean {
  return new Set(products.map(product => product.id)).size === products.length
}
