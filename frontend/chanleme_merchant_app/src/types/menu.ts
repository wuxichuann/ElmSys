export interface MenuItem {
  id: number;
  restaurant_id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string | null;
  is_available: boolean; // 可售状态
  created_at: string;
  updated_at: string;
}

export interface CreateMenuItemDto {
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string; // 可选
}

export interface UpdateMenuItemDto {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  image_url?: string;
  is_available?: boolean;
}