import emailjs from '@emailjs/browser';

export const sendOrderEmail = async ({
  email,
  order_id,
  subtotal,
  shipping,
  tax,
  discount,
  total,
  promo_code,
  cartItems
}) => {
  console.log('📧 sendOrderEmail called with:', {
    email,
    order_id,
    subtotal,
    shipping,
    tax,
    discount,
    total,
    promo_code,
    cartItemsCount: cartItems?.length
  });

  // Validate required parameters
  if (!email) {
    console.error('❌ Email is required');
    throw new Error('Email is required');
  }

  if (!cartItems || cartItems.length === 0) {
    console.error('❌ Cart items are required');
    throw new Error('Cart items are required');
  }

  // Construct the `orders` array that matches your template
  const orders = cartItems.map(item => ({
    name: item.title || item.name || 'Product',
    units: item.quantity || 1,
    price: item.price?.toFixed(2) || '0.00',
    image_url: item.image || item.imageUrl || 'https://via.placeholder.com/64'
  }));

  console.log('📦 Orders array constructed:', orders);

  const templateParams = {
    email,
    order_id,
    subtotal: subtotal.toFixed(2),
    shipping: shipping.toFixed(2),
    tax: tax.toFixed(2),
    discount: discount.toFixed(2),
    total: total.toFixed(2),
    promo_code: promo_code || '',
    orders
  };

  console.log('📋 Template parameters:', templateParams);

  try {
    console.log('🚀 Sending email via EmailJS...');
    const result = await emailjs.send(
      'service_im9p8fn',
      'template_2re3d0z',
      templateParams,
      'otFgHWvKrR6KihWOs'
    );

    console.log('✅ Email sent successfully:', result);
    return result;
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    console.error('❌ Error details:', {
      message: error.message,
      text: error.text,
      status: error.status
    });
    throw error;
  }
};

export default sendOrderEmail;