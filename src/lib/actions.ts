'use server';

import { getProducts, addProduct, updateProduct, deleteProduct, getProduct, uploadImage } from './google-sheets';
import { revalidatePath } from 'next/cache';

export async function uploadToDrive(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    const certId = formData.get('certId') as string;
    
    if (!file) throw new Error('No file provided');

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = buffer.toString('base64');
    
    const fileName = `${certId}_${file.name.replace(/\s+/g, '_')}`;
    
    const imageUrl = await uploadImage(fileName, base64Data, file.type);
    return imageUrl;
  } catch (error: any) {
    console.error('Google Drive Upload Error:', error);
    throw new Error(error.message || 'Failed to upload image to Google Drive');
  }
}

export async function getAllProductsAction() {
  try {
    return await getProducts();
  } catch (error) {
    console.error('Error getting all products:', error);
    return [];
  }
}

export async function getProductAction(certId: string) {
  try {
    return await getProduct(certId);
  } catch (error) {
    console.error(`Error getting product ${certId}:`, error);
    return null;
  }
}

export async function createProductAction(product: any) {
  try {
    const result = await addProduct(product);
    revalidatePath('/admin/products');
    revalidatePath('/verify');
    revalidatePath('/admin/dashboard');
    return result;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

export async function updateProductAction(certId: string, updates: any) {
  try {
    const result = await updateProduct({ ...updates, Certificate_ID: certId });
    revalidatePath('/admin/products');
    revalidatePath(`/admin/products/${certId}`);
    revalidatePath('/verify');
    revalidatePath('/admin/dashboard');
    return result;
  } catch (error) {
    console.error(`Error updating product ${certId}:`, error);
    throw error;
  }
}

export async function deleteProductAction(certId: string) {
  try {
    const result = await deleteProduct(certId);
    revalidatePath('/admin/products');
    revalidatePath(`/admin/products/${certId}`);
    revalidatePath('/verify');
    revalidatePath('/admin/dashboard');
    return result;
  } catch (error) {
    console.error(`Error deleting product ${certId}:`, error);
    throw error;
  }
}
