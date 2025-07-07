import emailjs from '@emailjs/browser';

// ✅ Generate a 6-digit numeric OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ✅ Format time as HH:MM AM/PM
const getExpiryTime = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 15); // Add 15 minutes
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
};

// ✅ Send OTP email
const sendOtpEmail = async (userEmail) => {
  const otp = generateOTP();
  const expiryTime = getExpiryTime();

  localStorage.setItem('reset_otp', otp);
  localStorage.setItem('reset_email', userEmail);

  const templateParams = {
    email: userEmail,
    passcode: otp,
    time: expiryTime,
  };

  try {
    const result = await emailjs.send(
      "service_im9p8fn",
      "template_vfuaon9",
      templateParams,
      "otFgHWvKrR6KihWOs"
    );
    console.log("✅ OTP email sent:", result.text);
    console.log("OTP was:", otp);
    return result;
  } catch (err) {
    console.error("❌ Failed to send OTP email:", err);
    throw err;
  }
};

export default sendOtpEmail;
