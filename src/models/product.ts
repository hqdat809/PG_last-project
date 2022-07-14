export interface IGetProduct {
  amount: string;
  arrivalDate: string;
  category: string;
  condition: null;
  created: string;
  description: string;
  enabled: string;
  id: string;
  name: string;
  participateSale: string;
  price: string;
  sku: string;
  vendor: string;
  vendorID: string;
  weight: string;
}

export interface IFilterProduct {
  availability: string;
  category: string;
  count: number;
  order_by: string;
  page: number;
  search: string;
  search_type: string;
  sort: string;
  stock_status: string;
  vendor: string;
}

export interface IVendorList {
  companyName: string;
  id: string;
  login: string;
  name: string;
}

export interface IBranch {
  id: string;
  name: string;
}

export interface ICreateProduct {
  vendor_id: string;
  name: string;
  brand_id: string;
  condition_id: string;
  categories: number[];
  description: string;
  enabled: number;
  memberships: any[];
  shipping_to_zones: ShippingToZone[];
  tax_exempt: number;
  price: string;
  sale_price_type: string;
  arrival_date: Date;
  inventory_tracking: number;
  quantity: string;
  sku: string;
  participate_sale: number;
  sale_price: string;
  og_tags_type: string;
  og_tags: string;
  meta_desc_type: string;
  meta_description: string;
  meta_keywords: string;
  product_page_title: string;
  facebook_marketing_enabled: number;
  google_feed_enabled: number;
  imagesOrder: string[];
  deleted_images: any[];
}

export interface ShippingToZone {
  id: number;
  price: string;
}

export interface IProductDetail {
  id: string;
  vendor_id: string;
  name: string;
  sku: string;
  sort_description: string;
  description: string;
  enabled: string;
  quantity: string;
  price: string;
  participate_sale: string;
  sale_price: string;
  tax_exempt: string;
  arrival_date: string;
  facebook_marketing_enabled: string;
  google_feed_enabled: string;
  og_tags_type: string;
  meta_desc_type: string;
  meta_keywords: string;
  meta_description: string;
  product_page_title: string;
  code: string;
  weight: string;
  inventory_tracking: string;
  og_tags: string;
  sale_price_type: string;
  cleanURL: string;
  brand_id: string;
  condition_id: string;
  shipping: Shipping[];
  categories: any[];
  images: Image[];
  memberships: any[];
}

export interface Image {
  id: string;
  file: string;
  thumbs: string[];
}

export interface Shipping {
  id: string;
  zone_name: string;
  price: string;
}
