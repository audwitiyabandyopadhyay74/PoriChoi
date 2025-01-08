import React from 'react';
import Navbar from '../Components/NavBar'
import MoblieNav from '../Components/Moblie Nav';
const page = () => {
  return (
    <>
      <MoblieNav/>
      <Navbar/>
      <div className='absolute l-[50%] r-[50%]'>
        <div className="p-6 max-w-2xl mx-auto"> <br /><br /><br /><h1 className="text-3xl font-bold mb-4">Terms and Conditions</h1> <p className="mb-4">Welcome to Porichoi!</p> <p className="mb-4"> By using Porichoi, you agree to comply with and be bound by the following terms and conditions. Please review them carefully. If you do not agree to these terms, you should not use our platform. </p> <h2 className="text-2xl font-semibold mb-2">1. Use of Our Services</h2> <p className="mb-4"> You must be at least 13 years old to use Porichoi. You agree to use our services only for lawful purposes and in accordance with these terms. You are responsible for maintaining the confidentiality of your account and password. </p> <h2 className="text-2xl font-semibold mb-2">2. User Content</h2> <p className="mb-4"> You are responsible for the content you post on Porichoi. By posting content, you grant us a non-exclusive, royalty-free, worldwide license to use, reproduce, and distribute your content. You agree not to post any content that is illegal, offensive, or infringes on the rights of others. </p> <h2 className="text-2xl font-semibold mb-2">3. Privacy</h2> <p className="mb-4"> Your use of Porichoi is also governed by our Privacy Policy, which is incorporated into these terms by reference. Please review our Privacy Policy to understand our practices regarding your personal information. </p> <h2 className="text-2xl font-semibold mb-2">4. Intellectual Property</h2> <p className="mb-4"> All content and materials on Porichoi, including text, graphics, logos, and software, are the property of Porichoi or its licensors and are protected by intellectual property laws. You may not use, reproduce, or distribute any content from Porichoi without our permission. </p> <h2 className="text-2xl font-semibold mb-2">5. Termination</h2> <p className="mb-4"> We reserve the right to terminate or suspend your account at any time, without notice, for conduct that we believe violates these terms or is harmful to other users of Porichoi. </p> <h2 className="text-2xl font-semibold mb-2">6. Limitation of Liability</h2> <p className="mb-4"> Porichoi and its affiliates will not be liable for any damages arising from your use of our platform. This includes direct, indirect, incidental, punitive, and consequential damages. </p> <h2 className="text-2xl font-semibold mb-2">7. Changes to Terms</h2> <p className="mb-4"> We may update these terms from time to time. We will notify you of any significant changes by posting the new terms on our website. Your continued use of Porichoi after any changes constitutes your acceptance of the new terms. </p> <h2 className="text-2xl font-semibold mb-2">8. Contact Us</h2> <p className="mb-4"> If you have any questions about these Terms and Conditions, please contact us at [Your Contact Information]. </p> </div>
      </div>
    </>
  );
}

export default page;
