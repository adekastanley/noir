import { apiClient } from '../../api/client';

export interface PromoValidationResult {
  valid: boolean;
  code: string;
  discountPercentage: number;
  message: string;
}

export const cartApi = {
  /**
   * Validate a promotional voucher code
   */
  async validatePromoCode(code: string): Promise<PromoValidationResult> {
    try {
      const response = await apiClient.post('/coupons/validate', { code: code.trim().toUpperCase() });
      const data = response.data;
      if (data.success && data.data?.valid) {
        return {
          valid: true,
          code: data.data.code,
          discountPercentage: data.data.discount_percentage || 0,
          message: data.data.message || `Discount applied.`,
        };
      }
      return {
        valid: false,
        code: code.trim().toUpperCase(),
        discountPercentage: 0,
        message: data.data?.message || 'Invalid or expired promotional code.',
      };
    } catch {
      return {
        valid: false,
        code: code.trim().toUpperCase(),
        discountPercentage: 0,
        message: 'Unable to validate code. Please try again.',
      };
    }
  },

  /**
   * Get available payment gateways
   */
  async getGateways() {
    const response = await apiClient.get('/payments/gateways');
    return response.data;
  },

  /**
   * Initialize payment
   */
  async initializePayment(payload: any) {
    const response = await apiClient.post('/payments/initialize', payload);
    return response.data;
  },

  /**
   * Verify payment
   */
  async verifyPayment(order_id: string, reference: string) {
    const response = await apiClient.post('/payments/verify', { order_id, reference });
    return response.data;
  }
};
