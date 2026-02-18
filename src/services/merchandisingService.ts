import { supabase } from '../lib/supabase';

export interface MerchandiseProduct {
  id: string;
  creator_id: string;
  name: string;
  description: string | null;
  category: string;
  images: string[];
  base_price: number;
  currency: string;
  cost_price: number | null;
  sizes: string[] | null;
  colors: string[] | null;
  stock_quantity: number;
  low_stock_threshold: number;
  total_sales: number;
  total_revenue: number;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface MerchandiseOrder {
  id: string;
  customer_id: string | null;
  creator_id: string;
  order_number: string;
  status: string;
  subtotal: number;
  shipping_cost: number;
  tax_amount: number;
  total_amount: number;
  currency: string;
  shipping_name: string;
  shipping_email: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string | null;
  shipping_postal_code: string;
  shipping_country: string;
  tracking_number: string | null;
  stripe_payment_intent_id: string | null;
  created_at: string;
  paid_at: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
}

export interface MerchandiseOrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_image: string | null;
  variant_size: string | null;
  variant_color: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

export const merchandisingService = {
  async getCreatorProducts(creatorId: string): Promise<MerchandiseProduct[]> {
    const { data, error } = await supabase
      .from('merchandise_products')
      .select('*')
      .eq('creator_id', creatorId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }

    return data as MerchandiseProduct[];
  },

  async getActiveProducts(creatorId: string): Promise<MerchandiseProduct[]> {
    const { data, error } = await supabase
      .from('merchandise_products')
      .select('*')
      .eq('creator_id', creatorId)
      .eq('is_active', true)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching active products:', error);
      return [];
    }

    return data as MerchandiseProduct[];
  },

  async createProduct(productData: Partial<MerchandiseProduct>): Promise<MerchandiseProduct | null> {
    const { data, error } = await supabase
      .from('merchandise_products')
      .insert([productData])
      .select()
      .single();

    if (error) {
      console.error('Error creating product:', error);
      return null;
    }

    return data as MerchandiseProduct;
  },

  async updateProduct(
    productId: string,
    updates: Partial<MerchandiseProduct>
  ): Promise<MerchandiseProduct | null> {
    const { data, error } = await supabase
      .from('merchandise_products')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', productId)
      .select()
      .single();

    if (error) {
      console.error('Error updating product:', error);
      return null;
    }

    return data as MerchandiseProduct;
  },

  async deleteProduct(productId: string): Promise<boolean> {
    const { error } = await supabase
      .from('merchandise_products')
      .delete()
      .eq('id', productId);

    if (error) {
      console.error('Error deleting product:', error);
      return false;
    }

    return true;
  },

  async getCreatorOrders(creatorId: string): Promise<MerchandiseOrder[]> {
    const { data, error } = await supabase
      .from('merchandise_orders')
      .select('*')
      .eq('creator_id', creatorId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return [];
    }

    return data as MerchandiseOrder[];
  },

  async getOrderDetails(orderId: string): Promise<{
    order: MerchandiseOrder | null;
    items: MerchandiseOrderItem[];
  }> {
    const { data: order, error: orderError } = await supabase
      .from('merchandise_orders')
      .select('*')
      .eq('id', orderId)
      .single();

    const { data: items, error: itemsError } = await supabase
      .from('merchandise_order_items')
      .select('*')
      .eq('order_id', orderId);

    if (orderError || itemsError) {
      console.error('Error fetching order details:', orderError || itemsError);
      return { order: null, items: [] };
    }

    return {
      order: order as MerchandiseOrder,
      items: (items || []) as MerchandiseOrderItem[],
    };
  },

  async createOrder(orderData: {
    customer_id: string;
    creator_id: string;
    items: Array<{
      product_id: string;
      variant_size?: string;
      variant_color?: string;
      quantity: number;
      unit_price: number;
    }>;
    shipping: {
      name: string;
      email: string;
      address: string;
      city: string;
      state?: string;
      postal_code: string;
      country: string;
    };
  }): Promise<MerchandiseOrder | null> {
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const subtotal = orderData.items.reduce(
      (sum, item) => sum + item.unit_price * item.quantity,
      0
    );
    const shippingCost = 0;
    const taxAmount = 0;
    const totalAmount = subtotal + shippingCost + taxAmount;

    const { data: order, error: orderError } = await supabase
      .from('merchandise_orders')
      .insert([
        {
          customer_id: orderData.customer_id,
          creator_id: orderData.creator_id,
          order_number: orderNumber,
          subtotal,
          shipping_cost: shippingCost,
          tax_amount: taxAmount,
          total_amount: totalAmount,
          shipping_name: orderData.shipping.name,
          shipping_email: orderData.shipping.email,
          shipping_address: orderData.shipping.address,
          shipping_city: orderData.shipping.city,
          shipping_state: orderData.shipping.state,
          shipping_postal_code: orderData.shipping.postal_code,
          shipping_country: orderData.shipping.country,
        },
      ])
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      return null;
    }

    for (const item of orderData.items) {
      const { data: product } = await supabase
        .from('merchandise_products')
        .select('name, images')
        .eq('id', item.product_id)
        .single();

      await supabase.from('merchandise_order_items').insert([
        {
          order_id: order.id,
          product_id: item.product_id,
          product_name: product?.name || 'Product',
          product_image: product?.images?.[0] || null,
          variant_size: item.variant_size || null,
          variant_color: item.variant_color || null,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.unit_price * item.quantity,
        },
      ]);
    }

    return order as MerchandiseOrder;
  },

  async updateOrderStatus(
    orderId: string,
    status: string,
    trackingNumber?: string
  ): Promise<MerchandiseOrder | null> {
    const updates: any = { status };

    if (status === 'paid') updates.paid_at = new Date().toISOString();
    if (status === 'shipped') {
      updates.shipped_at = new Date().toISOString();
      if (trackingNumber) updates.tracking_number = trackingNumber;
    }
    if (status === 'delivered') updates.delivered_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('merchandise_orders')
      .update(updates)
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      console.error('Error updating order status:', error);
      return null;
    }

    return data as MerchandiseOrder;
  },

  async getMerchandiseStats(creatorId: string) {
    const { data: products } = await supabase
      .from('merchandise_products')
      .select('*')
      .eq('creator_id', creatorId);

    const { data: orders } = await supabase
      .from('merchandise_orders')
      .select('*')
      .eq('creator_id', creatorId)
      .eq('status', 'paid');

    if (!products || !orders) {
      return {
        totalProducts: 0,
        activeProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        lowStockProducts: [],
      };
    }

    const totalProducts = products.length;
    const activeProducts = products.filter((p) => p.is_active).length;
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const lowStockProducts = products.filter(
      (p) => p.stock_quantity <= p.low_stock_threshold && p.is_active
    );

    return {
      totalProducts,
      activeProducts,
      totalOrders,
      totalRevenue,
      averageOrderValue,
      lowStockProducts,
    };
  },
};
