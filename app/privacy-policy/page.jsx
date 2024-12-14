import React from 'react';
import NavBar from "../Components/NavBar";
const page = () => {
  return (
    <>
        <NavBar/>

     <div className='absolute l-[50%] r-[50%]'>
        <div className="p-6 max-w-2xl mx-auto"> <br /><br /><br /><h1 className="text-3xl font-bold mb-4">Privacy Policy</h1> <p className="mb-4">Welcome to Porichoi!</p> <p className="mb-4"> At Porichoi, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines our practices regarding the collection, use, and protection of your personal data. </p> <h2 className="text-2xl font-semibold mb-2">1. Information We Collect</h2> <p className="mb-4"> We collect information that you provide directly to us, such as your name, email address, phone number, and profile picture. We also collect information automatically when you use our services, such as your IP address, browser type, and device information. </p> <h2 className="text-2xl font-semibold mb-2">2. How We Use Your Information</h2> <p className="mb-4"> We use your information to provide and improve our services, personalize your experience, communicate with you, and for security purposes. We may also use your information to send you promotional offers and updates about our services. </p> <h2 className="text-2xl font-semibold mb-2">3. Sharing Your Information</h2> <p className="mb-4"> We do not share your personal information with third parties except as described in this policy. We may share your information with our trusted service providers who assist us in operating our services, conducting our business, or serving our users. </p> <h2 className="text-2xl font-semibold mb-2">4. Your Choices</h2> <p className="mb-4"> You have the right to access, modify, and delete your personal information. You can also opt-out of receiving promotional communications from us. </p> <h2 className="text-2xl font-semibold mb-2">5. Security Measures</h2> <p className="mb-4"> We implement appropriate security measures to protect your personal information from unauthorized access, disclosure, or misuse. However, no method of transmission over the internet or electronic storage is 100% secure. </p> <h2 className="text-2xl font-semibold mb-2">6. Changes to This Policy</h2> <p className="mb-4"> We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on our website. </p> <h2 className="text-2xl font-semibold mb-2">7. Contact Us</h2> <p className="mb-4"> If you have any questions or concerns about this Privacy Policy, please contact us at [Your Contact Information]. </p> </div>
        </div> 
    </>
  );
}

export default page;
