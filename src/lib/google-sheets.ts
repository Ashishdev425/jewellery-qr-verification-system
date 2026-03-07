export interface Product {
  Certificate_ID: string;
  Product_Name: string;
  Jewellery_Type: string;
  Metal_Type: string;
  Metal_Purity: string;
  Gross_Weight: number;
  Net_Weight: number;
  Diamond_Type: string;
  Diamond_Cut: string;
  Diamond_Carat: number;
  Color: string;
  Clarity: string;
  Setting_Type: string;
  Product_Image_URL: string;
  QR_Code_URL: string;
  Card_Front_URL: string;
  Card_Back_URL: string;
  Created_Date: string;
  Last_Updated: string;
  Status: 'Active' | 'Deleted' | 'Archived';
}

const SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || '';

export const googleSheets = {
  async getProducts(): Promise<Product[]> {
    if (!SCRIPT_URL || SCRIPT_URL.includes('REPLACE_WITH_YOUR_DEPLOYED_URL')) {
      console.warn('Google Script URL is not configured');
      return [];
    }
    
    try {
      const response = await fetch(`${SCRIPT_URL}?action=getProducts`);
      if (!response.ok) throw new Error('Failed to fetch products');
      return await response.json();
    } catch (error) {
      console.error('Error in getProducts:', error);
      return [];
    }
  },

  async getProduct(id: string): Promise<Product | null> {
    if (!SCRIPT_URL || SCRIPT_URL.includes('REPLACE_WITH_YOUR_DEPLOYED_URL')) return null;
    
    const wanted = String(id ?? "").trim();
    if (!wanted) return null;

    try {
      const response = await fetch(`${SCRIPT_URL}?action=getProduct&id=${encodeURIComponent(wanted)}`);
      if (response.ok) {
        const data = await response.json();
        if (!data.error) return data;
      }

      // Fallback: strict Apps Script match can fail due type/casing/format differences.
      const all = await googleSheets.getProducts();
      const wantedDigits = wanted.replace(/\D/g, "");
      const wantedLower = wanted.toLowerCase();
      return all.find((p) => {
        const cert = String(p.Certificate_ID ?? "").trim();
        if (!cert) return false;
        if (cert === wanted) return true;
        if (cert.toLowerCase() === wantedLower) return true;
        const certDigits = cert.replace(/\D/g, "");
        return Boolean(wantedDigits && certDigits && certDigits === wantedDigits);
      }) ?? null;
    } catch (error) {
      console.error('Error in getProduct:', error);
      return null;
    }
  },

  async addProduct(payload: Partial<Product>): Promise<{ success: boolean }> {
    if (!SCRIPT_URL || SCRIPT_URL.includes('REPLACE_WITH_YOUR_DEPLOYED_URL')) {
      throw new Error('Google Script URL is not configured. Please add your deployed Web App URL to .env');
    }

    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({
        action: 'addProduct',
        payload
      })
    });

    if (!response.ok) throw new Error('Failed to add product');
    return await response.json();
  },

  async updateProduct(payload: Partial<Product>): Promise<{ success: boolean }> {
    if (!SCRIPT_URL || SCRIPT_URL.includes('REPLACE_WITH_YOUR_DEPLOYED_URL')) {
      throw new Error('Google Script URL is not configured');
    }

    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({
        action: 'updateProduct',
        payload
      })
    });

    if (!response.ok) throw new Error('Failed to update product');
    return await response.json();
  },

  async deleteProduct(certificateId: string): Promise<{ success: boolean }> {
    if (!SCRIPT_URL || SCRIPT_URL.includes('REPLACE_WITH_YOUR_DEPLOYED_URL')) {
      throw new Error('Google Script URL is not configured');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify({
          action: 'deleteProduct',
          payload: { Certificate_ID: certificateId }
        }),
        signal: controller.signal
      });

      if (!response.ok) throw new Error('Failed to delete product');
      const data = await response.json();
      if (!data?.success) {
        // Backward compatibility for older deployed Apps Script versions.
        if (String(data?.error || '').toLowerCase() === 'invalid action') {
          const fallback = await googleSheets.updateProduct({
            Certificate_ID: certificateId,
            Status: 'Deleted'
          });
          if (!fallback?.success) throw new Error('Failed to delete product');
          return { success: true };
        }
        throw new Error(data?.error || 'Failed to delete product');
      }
      return data;
    } catch (error: any) {
      if (error?.name === 'AbortError') {
        throw new Error('Delete request timed out. Please try again.');
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  },

  async uploadImage(fileName: string, base64Data: string, contentType: string): Promise<string> {
    if (!SCRIPT_URL || SCRIPT_URL.includes('REPLACE_WITH_YOUR_DEPLOYED_URL')) {
      throw new Error('Google Script URL is not configured');
    }

    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({
        action: 'uploadImage',
        payload: { fileName, base64Data, contentType }
      })
    });

    if (!response.ok) throw new Error('Failed to upload image');
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data.url;
  }
};

export const getProducts = googleSheets.getProducts;
export const getProduct = googleSheets.getProduct;
export const addProduct = googleSheets.addProduct;
export const updateProduct = googleSheets.updateProduct;
export const deleteProduct = googleSheets.deleteProduct;
export const uploadImage = googleSheets.uploadImage;
export const getProductByCertId = googleSheets.getProduct;
