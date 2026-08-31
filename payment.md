// Step 1: Discover available gateways
const gateways = await fetch('/wp-json/idibia/v1/payments/gateways').then(r => r.json());

// Step 2: Initialize payment
const payment = await fetch('/wp-json/idibia/v1/payments/initialize', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer idb_live_your_api_key'
  },
  body: JSON.stringify({
    gateway: 'paystack',
    billing: { first_name: 'John', email: 'john@example.com' },
    line_items: [{ product_id: 42, quantity: 1 }],
    return_url: 'https://mysite.com/thank-you'
  })
}).then(r => r.json());

// Step 3a: Redirect to payment page
if (payment.data.payment_url) {
  window.location.href = payment.data.payment_url;
}

// Step 3b: Or use inline popup (Paystack example)
PaystackPop.setup({
  key: gateways.data[0].public_key,
  email: 'john@example.com',
  amount: payment.data.total * 100,
  ref: payment.data.reference,
  onSuccess: async (response) => {
    // Step 4: Verify payment server-side
    const verification = await fetch('/wp-json/idibia/v1/payments/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer idb_live_your_api_key'
      },
      body: JSON.stringify({
        order_id: payment.data.order_id,
        reference: payment.data.reference
      })
    }).then(r => r.json());
  }
}).openIframe();