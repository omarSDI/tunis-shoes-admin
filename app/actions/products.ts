'use server';

import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { verifyAdminSession } from '@/lib/admin/auth';
import { Product, CreateProductInput, UpdateProductInput, ApiResponse } from '@/lib/types';

export async function getProducts(category?: string): Promise<Product[]> {
  try {
    const supabase = createServerClient();
    const normalizedCategory =
      category?.toLowerCase().trim() === 'men'
        ? 'men'
        : category?.toLowerCase().trim() === 'women'
          ? 'women'
          : undefined;

    let query = supabase.from('products').select('*').order('created_at', { ascending: true });
    if (normalizedCategory) {
      query = query.eq('category', normalizedCategory);
    }

    const { data, error } = await query;

    if (error) {
      if (
        normalizedCategory &&
        /column .*category.* does not exist/i.test(error.message)
      ) {
        const fallback = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: true });
        if (fallback.error) throw fallback.error;
        return (
          fallback.data?.map((row: any) => ({
            id: String(row.id),
            title: String(row.title ?? ''),
            price: Number(row.price),
            description: row.description ?? null,
            image_url: row.image_url ?? null,
            sizes: row.sizes ?? null,
            color: row.color ?? null,
            category: row.category ?? null,
            created_at: row.created_at ?? undefined,
          })) ?? []
        );
      }
      console.error('Error fetching products:', error);
      throw error;
    }

    return (
      data?.map((row: any) => ({
        id: String(row.id),
        title: String(row.title ?? ''),
        price: Number(row.price),
        description: row.description ?? null,
        image_url: row.image_url ?? null,
        sizes: row.sizes ?? null,
        color: row.color ?? null,
        category: row.category ?? null,
        created_at: row.created_at ?? undefined,
      })) ?? []
    );
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching product:', error);
      return null;
    }

    if (!data) return null;

    return {
      id: String((data as any).id),
      title: String((data as any).title ?? ''),
      price: Number((data as any).price),
      description: (data as any).description ?? null,
      image_url: (data as any).image_url ?? null,
      sizes: (data as any).sizes ?? null,
      color: (data as any).color ?? null,
      category: (data as any).category ?? null,
      created_at: (data as any).created_at ?? undefined,
    };
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return null;
  }
}

export async function seedExampleProducts(): Promise<{
  ok: boolean;
  message: string;
}> {
  try {
    const supabase = createServerClient();

    const { count, error: countError } = await supabase
      .from('products')
      .select('id', { count: 'exact', head: true });

    if (countError) {
      return { ok: false, message: `Count failed: ${countError.message}` };
    }

    if (typeof count === 'number' && count > 0) {
      return { ok: true, message: `Already seeded (${count} products).` };
    }

    const seedRows = [
      {
        title: 'Nike Air Max (Red)',
        price: 549.0,
        description: 'Iconic cushioning and bold style.',
        image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
        sizes: [39, 40, 41, 42],
        color: 'Red/White',
        category: 'men',
      },
      {
        title: 'Adidas UltraBOOST',
        price: 599.0,
        description: 'Premium cushioned sneaker.',
        image_url: 'https://images.unsplash.com/photo-1519861297062-a1eec154f81a',
        sizes: [39, 40, 41, 42],
        color: 'White/Black',
        category: 'women',
      },
    ];

    const { error: insertError } = await supabase.from('products').insert(seedRows as any);

    if (insertError) {
      return { ok: false, message: `Insert failed: ${insertError.message}` };
    }

    revalidatePath('/');
    return { ok: true, message: 'Seeded products.' };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : 'Unknown error' };
  }
}

export async function createProduct(input: CreateProductInput): Promise<ApiResponse<Product>> {
  try {
    const session = await verifyAdminSession();
    if (!session) return { success: false, error: 'Unauthorized: Admin session required' };

    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('products')
      .insert({
        title: input.title,
        price: input.price,
        description: input.description,
        category: input.category.toLowerCase(),
        sizes: input.sizes,
        image_url: input.image_url,
        color: input.color || null,
        cost_price: input.cost_price || 0,
        compare_at_price: input.compare_at_price || 0,
        image_type: input.image_type || 'url',
      })
      .select()
      .single();

    if (error) return { success: false, error: error.message };

    revalidatePath('/admin/products');
    revalidatePath('/shop');
    revalidatePath('/');

    return { success: true, data: data as Product };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function updateProduct(input: UpdateProductInput): Promise<ApiResponse<Product>> {
  try {
    const session = await verifyAdminSession();
    if (!session) return { success: false, error: 'Unauthorized: Admin session required' };

    const supabase = createServerClient();
    const { id, ...updates } = input;

    const updateData: any = {};
    if (updates.title) updateData.title = updates.title;
    if (updates.price !== undefined) updateData.price = updates.price;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.category) updateData.category = updates.category.toLowerCase();
    if (updates.sizes) updateData.sizes = updates.sizes;
    if (updates.image_url !== undefined) updateData.image_url = updates.image_url;
    if (updates.color !== undefined) updateData.color = updates.color;
    if (updates.cost_price !== undefined) updateData.cost_price = updates.cost_price;
    if (updates.compare_at_price !== undefined) updateData.compare_at_price = updates.compare_at_price;
    if (updates.image_type !== undefined) updateData.image_type = updates.image_type;

    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) return { success: false, error: error.message };

    revalidatePath('/admin/products');
    revalidatePath('/shop');
    revalidatePath('/');

    return { success: true, data: data as Product };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function deleteProduct(id: string): Promise<ApiResponse> {
  try {
    const session = await verifyAdminSession();
    if (!session) return { success: false, error: 'Unauthorized: Admin session required' };

    const supabase = createServerClient();
    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) return { success: false, error: error.message };

    revalidatePath('/admin/products');
    revalidatePath('/shop');
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
