import React, { useState } from 'react';
import JoinUs from './JoinUs';
import PaymentPage from './PaymentPage';

const JoinUsPaymentFlow = () => {
  const [currentPage, setCurrentPage] = useState('join');
  const [membershipData, setMembershipData] = useState(null);

  const handleProceedToPayment = (formData) => {
    setMembershipData(formData);
    setCurrentPage('payment');
  };

  const handleBackToJoin = () => {
    setCurrentPage('join');
  };

  return (
    <>
      {currentPage === 'join' && (
        <JoinUs onProceedToPayment={handleProceedToPayment} />
      )}
      {currentPage === 'payment' && (
        <PaymentPage
          membershipData={membershipData}
          onBack={handleBackToJoin}
        />
      )}
    </>
  );
};

export default JoinUsPaymentFlow; 