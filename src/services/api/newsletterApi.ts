export interface NewsletterResponse {
  success: boolean;
  message: string;
}

export const newsletterApi = {
  /**
   * Subscribe to Private Atelier Communications and VIP releases
   */
  async subscribe(email: string, _preference: string = 'all'): Promise<NewsletterResponse> {
    await new Promise((resolve) => setTimeout(resolve, 250));
    
    // Simple email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        message: 'Please enter a valid email address.',
      };
    }

    return {
      success: true,
      message: 'You have been registered for Noir Atelier Private Previews & Seasonal dispatches.',
    };
  }
};
