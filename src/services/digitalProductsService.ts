import { supabase } from '../lib/supabase';

export interface DigitalProduct {
  id: string;
  creator_id: string;
  product_type: string;
  title: string;
  description: string | null;
  long_description: string | null;
  cover_image_url: string | null;
  preview_video_url: string | null;
  price: number;
  currency: string;
  level: string | null;
  duration_hours: number | null;
  includes: any;
  download_files: any;
  total_sales: number;
  total_revenue: number;
  average_rating: number;
  total_reviews: number;
  is_published: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface DigitalProductModule {
  id: string;
  product_id: string;
  title: string;
  description: string | null;
  order_index: number;
  video_url: string | null;
  video_duration: number | null;
  content_html: string | null;
  attachments: any;
  is_published: boolean;
  created_at: string;
}

export interface DigitalProductPurchase {
  id: string;
  product_id: string;
  customer_id: string;
  purchase_price: number;
  currency: string;
  stripe_payment_intent_id: string | null;
  stripe_charge_id: string | null;
  access_granted_at: string;
  last_accessed_at: string | null;
  rating: number | null;
  review_text: string | null;
  reviewed_at: string | null;
  created_at: string;
}

export interface Service {
  id: string;
  creator_id: string;
  service_type: string;
  title: string;
  description: string | null;
  duration_minutes: number;
  price: number;
  currency: string;
  is_available: boolean;
  max_bookings_per_week: number | null;
  available_days: number[] | null;
  available_hours: any;
  timezone: string;
  requires_approval: boolean;
  buffer_time_minutes: number;
  advance_booking_days: number;
  booking_instructions: string | null;
  meeting_link_template: string | null;
  total_bookings: number;
  total_revenue: number;
  average_rating: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServiceBooking {
  id: string;
  service_id: string;
  customer_id: string;
  creator_id: string;
  booking_date: string;
  booking_time: string;
  duration_minutes: number;
  status: string;
  customer_name: string;
  customer_email: string;
  customer_notes: string | null;
  meeting_link: string | null;
  price: number;
  currency: string;
  stripe_payment_intent_id: string | null;
  rating: number | null;
  review_text: string | null;
  reviewed_at: string | null;
  created_at: string;
  confirmed_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
}

export const digitalProductsService = {
  async getCreatorProducts(creatorId: string): Promise<DigitalProduct[]> {
    const { data, error } = await supabase
      .from('digital_products')
      .select('*')
      .eq('creator_id', creatorId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching digital products:', error);
      return [];
    }

    return data as DigitalProduct[];
  },

  async getPublishedProducts(creatorId: string): Promise<DigitalProduct[]> {
    const { data, error } = await supabase
      .from('digital_products')
      .select('*')
      .eq('creator_id', creatorId)
      .eq('is_published', true)
      .order('created_at', { ascending: false});

    if (error) {
      console.error('Error fetching published products:', error);
      return [];
    }

    return data as DigitalProduct[];
  },

  async createProduct(productData: Partial<DigitalProduct>): Promise<DigitalProduct | null> {
    const { data, error } = await supabase
      .from('digital_products')
      .insert([productData])
      .select()
      .single();

    if (error) {
      console.error('Error creating product:', error);
      return null;
    }

    return data as DigitalProduct;
  },

  async updateProduct(
    productId: string,
    updates: Partial<DigitalProduct>
  ): Promise<DigitalProduct | null> {
    const { data, error } = await supabase
      .from('digital_products')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', productId)
      .select()
      .single();

    if (error) {
      console.error('Error updating product:', error);
      return null;
    }

    return data as DigitalProduct;
  },

  async deleteProduct(productId: string): Promise<boolean> {
    const { error } = await supabase
      .from('digital_products')
      .delete()
      .eq('id', productId);

    if (error) {
      console.error('Error deleting product:', error);
      return false;
    }

    return true;
  },

  async getProductModules(productId: string): Promise<DigitalProductModule[]> {
    const { data, error } = await supabase
      .from('digital_product_modules')
      .select('*')
      .eq('product_id', productId)
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching modules:', error);
      return [];
    }

    return data as DigitalProductModule[];
  },

  async createModule(
    moduleData: Partial<DigitalProductModule>
  ): Promise<DigitalProductModule | null> {
    const { data, error } = await supabase
      .from('digital_product_modules')
      .insert([moduleData])
      .select()
      .single();

    if (error) {
      console.error('Error creating module:', error);
      return null;
    }

    return data as DigitalProductModule;
  },

  async updateModule(
    moduleId: string,
    updates: Partial<DigitalProductModule>
  ): Promise<DigitalProductModule | null> {
    const { data, error } = await supabase
      .from('digital_product_modules')
      .update(updates)
      .eq('id', moduleId)
      .select()
      .single();

    if (error) {
      console.error('Error updating module:', error);
      return null;
    }

    return data as DigitalProductModule;
  },

  async deleteModule(moduleId: string): Promise<boolean> {
    const { error } = await supabase
      .from('digital_product_modules')
      .delete()
      .eq('id', moduleId);

    if (error) {
      console.error('Error deleting module:', error);
      return false;
    }

    return true;
  },

  async purchaseProduct(purchaseData: {
    product_id: string;
    customer_id: string;
    purchase_price: number;
  }): Promise<DigitalProductPurchase | null> {
    const { data, error } = await supabase
      .from('digital_product_purchases')
      .insert([purchaseData])
      .select()
      .single();

    if (error) {
      console.error('Error purchasing product:', error);
      return null;
    }

    return data as DigitalProductPurchase;
  },

  async getCustomerPurchases(customerId: string): Promise<DigitalProductPurchase[]> {
    const { data, error } = await supabase
      .from('digital_product_purchases')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching purchases:', error);
      return [];
    }

    return data as DigitalProductPurchase[];
  },

  async hasAccess(productId: string, customerId: string): Promise<boolean> {
    const { data } = await supabase
      .from('digital_product_purchases')
      .select('id')
      .eq('product_id', productId)
      .eq('customer_id', customerId)
      .single();

    return !!data;
  },

  async submitReview(
    purchaseId: string,
    rating: number,
    reviewText?: string
  ): Promise<boolean> {
    const { error } = await supabase
      .from('digital_product_purchases')
      .update({
        rating,
        review_text: reviewText || null,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', purchaseId);

    if (error) {
      console.error('Error submitting review:', error);
      return false;
    }

    const { data: purchase } = await supabase
      .from('digital_product_purchases')
      .select('product_id')
      .eq('id', purchaseId)
      .single();

    if (purchase) {
      const { data: allReviews } = await supabase
        .from('digital_product_purchases')
        .select('rating')
        .eq('product_id', purchase.product_id)
        .not('rating', 'is', null);

      if (allReviews && allReviews.length > 0) {
        const avgRating =
          allReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / allReviews.length;

        await supabase
          .from('digital_products')
          .update({
            average_rating: avgRating,
            total_reviews: allReviews.length,
          })
          .eq('id', purchase.product_id);
      }
    }

    return true;
  },

  async getCreatorServices(creatorId: string): Promise<Service[]> {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('creator_id', creatorId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching services:', error);
      return [];
    }

    return data as Service[];
  },

  async getActiveServices(creatorId: string): Promise<Service[]> {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('creator_id', creatorId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching active services:', error);
      return [];
    }

    return data as Service[];
  },

  async createService(serviceData: Partial<Service>): Promise<Service | null> {
    const { data, error } = await supabase
      .from('services')
      .insert([serviceData])
      .select()
      .single();

    if (error) {
      console.error('Error creating service:', error);
      return null;
    }

    return data as Service;
  },

  async updateService(
    serviceId: string,
    updates: Partial<Service>
  ): Promise<Service | null> {
    const { data, error } = await supabase
      .from('services')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', serviceId)
      .select()
      .single();

    if (error) {
      console.error('Error updating service:', error);
      return null;
    }

    return data as Service;
  },

  async deleteService(serviceId: string): Promise<boolean> {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', serviceId);

    if (error) {
      console.error('Error deleting service:', error);
      return false;
    }

    return true;
  },

  async createBooking(bookingData: Partial<ServiceBooking>): Promise<ServiceBooking | null> {
    const { data, error } = await supabase
      .from('service_bookings')
      .insert([bookingData])
      .select()
      .single();

    if (error) {
      console.error('Error creating booking:', error);
      return null;
    }

    return data as ServiceBooking;
  },

  async getCreatorBookings(creatorId: string): Promise<ServiceBooking[]> {
    const { data, error } = await supabase
      .from('service_bookings')
      .select('*')
      .eq('creator_id', creatorId)
      .order('booking_date', { ascending: true })
      .order('booking_time', { ascending: true });

    if (error) {
      console.error('Error fetching bookings:', error);
      return [];
    }

    return data as ServiceBooking[];
  },

  async getCustomerBookings(customerId: string): Promise<ServiceBooking[]> {
    const { data, error } = await supabase
      .from('service_bookings')
      .select('*')
      .eq('customer_id', customerId)
      .order('booking_date', { ascending: true });

    if (error) {
      console.error('Error fetching bookings:', error);
      return [];
    }

    return data as ServiceBooking[];
  },

  async updateBookingStatus(
    bookingId: string,
    status: string
  ): Promise<ServiceBooking | null> {
    const updates: any = { status };

    if (status === 'confirmed') updates.confirmed_at = new Date().toISOString();
    if (status === 'completed') updates.completed_at = new Date().toISOString();
    if (status === 'cancelled') updates.cancelled_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('service_bookings')
      .update(updates)
      .eq('id', bookingId)
      .select()
      .single();

    if (error) {
      console.error('Error updating booking status:', error);
      return null;
    }

    return data as ServiceBooking;
  },

  async submitBookingReview(
    bookingId: string,
    rating: number,
    reviewText?: string
  ): Promise<boolean> {
    const { error } = await supabase
      .from('service_bookings')
      .update({
        rating,
        review_text: reviewText || null,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', bookingId);

    if (error) {
      console.error('Error submitting booking review:', error);
      return false;
    }

    const { data: booking } = await supabase
      .from('service_bookings')
      .select('service_id')
      .eq('id', bookingId)
      .single();

    if (booking) {
      const { data: allReviews } = await supabase
        .from('service_bookings')
        .select('rating')
        .eq('service_id', booking.service_id)
        .not('rating', 'is', null);

      if (allReviews && allReviews.length > 0) {
        const avgRating =
          allReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / allReviews.length;

        await supabase
          .from('services')
          .update({ average_rating: avgRating })
          .eq('id', booking.service_id);
      }
    }

    return true;
  },

  async getDigitalProductStats(creatorId: string) {
    const { data: products } = await supabase
      .from('digital_products')
      .select('*')
      .eq('creator_id', creatorId);

    const { data: services } = await supabase
      .from('services')
      .select('*')
      .eq('creator_id', creatorId);

    if (!products || !services) {
      return {
        totalProducts: 0,
        totalServices: 0,
        totalProductSales: 0,
        totalServiceBookings: 0,
        totalRevenue: 0,
        averageProductRating: 0,
        averageServiceRating: 0,
      };
    }

    const totalProducts = products.length;
    const totalServices = services.length;
    const totalProductSales = products.reduce((sum, p) => sum + p.total_sales, 0);
    const totalServiceBookings = services.reduce((sum, s) => sum + s.total_bookings, 0);
    const totalRevenue =
      products.reduce((sum, p) => sum + p.total_revenue, 0) +
      services.reduce((sum, s) => sum + s.total_revenue, 0);

    const publishedProducts = products.filter((p) => p.is_published && p.total_reviews > 0);
    const averageProductRating =
      publishedProducts.length > 0
        ? publishedProducts.reduce((sum, p) => sum + p.average_rating, 0) /
          publishedProducts.length
        : 0;

    const activeServices = services.filter((s) => s.is_active && s.average_rating > 0);
    const averageServiceRating =
      activeServices.length > 0
        ? activeServices.reduce((sum, s) => sum + s.average_rating, 0) / activeServices.length
        : 0;

    return {
      totalProducts,
      totalServices,
      totalProductSales,
      totalServiceBookings,
      totalRevenue,
      averageProductRating,
      averageServiceRating,
    };
  },
};
