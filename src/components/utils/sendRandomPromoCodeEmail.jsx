import emailjs from '@emailjs/browser';

// Function to fetch and send random promo code
export const sendRandomPromoCodeEmail = async (recipientEmail) => {
  console.log('🎁 sendRandomPromoCodeEmail called with:', { recipientEmail });

  // Validate email
  if (!recipientEmail) {
    console.error('❌ Email is required');
    throw new Error('Email is required');
  }

  try {
    console.log('📡 Fetching promo codes from Firebase...');
    // Step 1: Fetch promo codes from Firebase
    const res = await fetch('https://ecommerce-input-default-rtdb.asia-southeast1.firebasedatabase.app/Promocodes.json');
    const data = await res.json();
    console.log('📦 Promo codes data:', data);

    // Step 2: Select a random promo
    const promoList = Array.isArray(data) ? data : Object.values(data);
    if (!promoList || promoList.length === 0) {
      console.error('❌ No promo codes available');
      throw new Error('No promo codes available');
    }

    const randomPromo = promoList[Math.floor(Math.random() * promoList.length)];
    console.log('🎯 Selected random promo:', randomPromo);

    // Step 3: Prepare template variables
    const templateParams = {
      email: recipientEmail,
      promo_code: randomPromo.code,
      promo_value: randomPromo.value
    };

    console.log('📋 Template parameters:', templateParams);

    // Step 4: Send email using EmailJS
    await emailjs.send('service_8ldh2ov', 'template_n709nif', templateParams, 'Oc1-p4Dt1Q2EsnfXg');
    console.log('Promo email sent successfully!');
  } catch (err) {
    console.error('❌ Error sending promo email:', err);
    console.error('❌ Error details:', {
      message: err.message,
      text: err.text,
      status: err.status
    });
    throw err;
  }
};

export default sendRandomPromoCodeEmail