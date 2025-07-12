export const CLOTHING_CATEGORIES = [
  { value: 'tops', label: 'Tops' },
  { value: 'bottoms', label: 'Bottoms' },
  { value: 'outerwear', label: 'Outerwear' },
  { value: 'shoes', label: 'Shoes' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'dresses', label: 'Dresses' },
  { value: 'activewear', label: 'Activewear' },
];

export const CLOTHING_TYPES = {
  tops: ['shirt', 'blouse', 'sweater', 't-shirt', 'tank-top'],
  bottoms: ['jeans', 'pants', 'shorts', 'skirt', 'leggings'],
  outerwear: ['jacket', 'coat', 'blazer', 'cardigan', 'hoodie'],
  shoes: ['sneakers', 'boots', 'heels', 'flats', 'sandals'],
  accessories: ['bag', 'jewelry', 'hat', 'scarf', 'belt'],
  dresses: ['casual-dress', 'formal-dress', 'maxi-dress', 'mini-dress'],
  activewear: ['sports-bra', 'leggings', 'shorts', 'tank-top', 'hoodie'],
};

export const CLOTHING_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38', '40', '42'];

export const CLOTHING_CONDITIONS = [
  { value: 'excellent', label: 'Excellent', description: 'Like new, no visible wear' },
  { value: 'good', label: 'Good', description: 'Minor signs of wear' },
  { value: 'fair', label: 'Fair', description: 'Noticeable wear, still good quality' },
  { value: 'worn', label: 'Worn', description: 'Significant wear, functional' },
];

export const COLORS = [
  'Black', 'White', 'Gray', 'Navy', 'Blue', 'Red', 'Pink', 'Purple',
  'Green', 'Yellow', 'Orange', 'Brown', 'Beige', 'Cream', 'Multi-color'
];

export const POPULAR_BRANDS = [
  'Nike', 'Adidas', 'Zara', 'H&M', 'Uniqlo', 'Gap', 'Levi\'s', 'Forever 21',
  'Urban Outfitters', 'American Eagle', 'Hollister', 'Abercrombie & Fitch',
  'Victoria\'s Secret', 'Old Navy', 'Target', 'Other'
];

export const POINT_VALUES = {
  excellent: 100,
  good: 75,
  fair: 50,
  worn: 25,
};