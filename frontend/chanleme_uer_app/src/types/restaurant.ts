export interface Restaurant {
  restaurant_id: number;
  restaurant_name: string;
  description: string;
  address: string;
  phone_number?: string;
  logo_url?: string;
  opening_hours?: string;
  is_active: boolean;
}

export interface MenuItem {
  item_id: number;
  restaurant_id: number;
  item_name: string;
  description?: string;
  price: number;
  category?: string;
  image_url?: string;
  is_available: boolean;
}

export interface RestaurantDetail extends Restaurant {
  menu_items: MenuItem[];
}

export interface SearchRestaurantDto {
  keyword?: string;
  category?: string;
  page?: number;
  pageSize?: number;
}