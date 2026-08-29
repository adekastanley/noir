import type { CheckoutPayload } from '../../types';

export interface PromoValidationResult {
  valid: boolean;
  code: string;
  discountPercentage: number;
  message: string;
}

const PROMO_CODES: Record<string, number> = {
  NOIR10: 10,
  ATELIERVIP: 15,
  SILENT20: 20,
  IDIBIA: 25,
};

export const cartApi = {
  /**
   * Validate a promotional voucher code
   */
  async validatePromoCode(code: string): Promise<PromoValidationResult> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const normalized = code.trim().toUpperCase();
    
    if (PROMO_CODES[normalized]) {
      return {
        valid: true,
        code: normalized,
        discountPercentage: PROMO_CODES[normalized],
        message: `${PROMO_CODES[normalized]}% Atelier Privilege discount applied.`,
      };
    }

    return {
      valid: false,
      code: normalized,
      discountPercentage: 0,
      message: 'Invalid or expired promotional code.',
    };
  },

  /**
   * Submit client order checkout payload
   */
  async submitOrder(_payload: CheckoutPayload): Promise<{ success: boolean; orderId: string; estimatedDelivery: string }> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    return {
      success: true,
      orderId: `NOIR-ORD-${randomNum}`,
      estimatedDelivery: '3-4 Business Days via DHL Express Carbon Neutral',
    };
  }
};
