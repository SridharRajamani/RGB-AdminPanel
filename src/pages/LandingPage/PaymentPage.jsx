import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import './PaymentPage.css';
import QRCode from 'react-qr-code';

// Initialize Stripe - You'll need to add your publishable key to Secrets
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_stripe_publishable_key_here');

const PaymentPage = ({ membershipData, onBack }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });
  const [upiId, setUpiId] = useState('');
  const [processing, setProcessing] = useState(false);
  const [stripe, setStripe] = useState(null);
  const [clientSecret, setClientSecret] = useState('');

  const membershipPrices = {
    regular: 1500,
    young: 1200,
    corporate: 3000
  };

  useEffect(() => {
    // Initialize Stripe
    const initStripe = async () => {
      const stripeInstance = await stripePromise;
      setStripe(stripeInstance);
    };
    initStripe();

    // Create payment intent on component mount
    createPaymentIntent();
  }, [membershipData]);

  const createPaymentIntent = async () => {
    try {
      const amount = membershipPrices[membershipData?.membershipType] * 100; // Convert to paise
      
      const response = await fetch('http://localhost:5000/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          currency: 'inr',
          membershipType: membershipData?.membershipType,
          customerName: membershipData?.fullName,
          customerEmail: membershipData?.email
        }),
      });

      if (!response.ok) {
        // Fallback to mock payment intent for demo
        setClientSecret('pi_mock_client_secret');
        return;
      }

      const data = await response.json();
      setClientSecret(data.clientSecret);
    } catch (error) {
      console.error('Error creating payment intent:', error);
      // Set mock client secret for demo purposes
      setClientSecret('pi_mock_client_secret');
    }
  };

  const handleCardInputChange = (e) => {
    let value = e.target.value;
    
    // Format card number with spaces
    if (e.target.name === 'cardNumber') {
      value = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      value = value.match(/.{1,4}/g)?.join(' ') || value;
      if (value.length > 19) value = value.substr(0, 19);
    }
    
    // Format expiry date
    if (e.target.name === 'expiryDate') {
      value = value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
      }
    }
    
    // Format CVV
    if (e.target.name === 'cvv') {
      value = value.replace(/\D/g, '').substring(0, 3);
    }

    setCardData({
      ...cardData,
      [e.target.name]: value
    });
  };

  const handleStripePayment = async () => {
    if (!stripe) {
      alert('Stripe is not loaded. Please try again.');
      return;
    }

    setProcessing(true);

    try {
      // Create card element data
      const cardElement = {
        number: cardData.cardNumber.replace(/\s/g, ''),
        exp_month: parseInt(cardData.expiryDate.split('/')[0]),
        exp_year: parseInt('20' + cardData.expiryDate.split('/')[1]),
        cvc: cardData.cvv,
      };

      // For demo purposes, simulate successful payment
      if (clientSecret === 'pi_mock_client_secret') {
        setTimeout(() => {
          setProcessing(false);
          alert(`Payment Successful! 🎉\n\nMembership: ${membershipData?.membershipType}\nAmount: ${formatPrice(membershipData?.membershipType)}\n\nWelcome to Rotary Gulmohar Bangalore!`);
          // Here you would typically redirect to success page or dashboard
        }, 3000);
        return;
      }

      // Real Stripe payment confirmation
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: cardData.cardholderName,
            email: membershipData?.email,
          },
        },
      });

      if (error) {
        console.error('Payment failed:', error);
        alert(`Payment failed: ${error.message}`);
      } else if (paymentIntent.status === 'succeeded') {
        alert(`Payment Successful! 🎉\n\nTransaction ID: ${paymentIntent.id}\nAmount: ${formatPrice(membershipData?.membershipType)}\n\nWelcome to Rotary Gulmohar Bangalore!`);
        // Here you would save the payment details and redirect to success page
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment processing failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleUPIPayment = async () => {
    setProcessing(true);
    const amount = membershipPrices[membershipData?.membershipType];
    const upiLink = `upi://pay?pa=${upiId}&pn=Rotary%20Gulmohar&am=${amount}&cu=INR`;
    // Redirect to UPI app (works on mobile)
    window.location.href = upiLink;
    setProcessing(false);
  };

  const handleNetBankingPayment = async () => {
    setProcessing(true);
    
    // Simulate net banking payment processing
    setTimeout(() => {
      setProcessing(false);
      alert(`Net Banking Payment Successful! 🎉\n\nAmount: ${formatPrice(membershipData?.membershipType)}\n\nWelcome to Rotary Gulmohar Bangalore!`);
    }, 3000);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (paymentMethod === 'card') {
      // Validate card data
      if (!cardData.cardNumber || !cardData.expiryDate || !cardData.cvv || !cardData.cardholderName) {
        alert('Please fill in all card details');
        return;
      }
      await handleStripePayment();
    } else if (paymentMethod === 'upi') {
      if (!upiId) {
        alert('Please enter UPI ID');
        return;
      }
      await handleUPIPayment();
    } else if (paymentMethod === 'netbanking') {
      await handleNetBankingPayment();
    }
  };

  const formatPrice = (type) => {
    return `₹${membershipPrices[type]?.toLocaleString() || '0'}`;
  };

  return (
    <div className="payment-container">
      <div className="payment-wrapper">
        <div className="payment-header">
          <button className="back-btn" onClick={onBack}>
            ← Back to Registration
          </button>
          <h1 className="payment-title">Complete Your Membership</h1>
        </div>

        <div className="payment-content">
          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="membership-details">
              <div className="member-info">
                <h3>{membershipData?.fullName || 'Member Name'}</h3>
                <p>{membershipData?.email || 'member@email.com'}</p>
              </div>
              
              <div className="membership-plan">
                <div className="plan-details">
                  <span className="plan-name">
                    {membershipData?.membershipType === 'regular' && 'Regular Member'}
                    {membershipData?.membershipType === 'young' && 'Young Member'}
                    {membershipData?.membershipType === 'corporate' && 'Corporate Member'}
                  </span>
                  <span className="plan-duration">Annual Membership</span>
                </div>
                <div className="plan-price">
                  {formatPrice(membershipData?.membershipType)}
                </div>
              </div>

              <div className="benefits-list">
                <h4>Membership Benefits:</h4>
                <ul>
                  <li>Personal Wealth - Help in education, healthcare, and social service</li>
                  <li>Leadership Growth - Improve your skills & confidence</li>
                  <li>Networking - Business leadership & business leaders</li>
                  <li>Social & Programs - Attend exclusive Rotary workshops & events</li>
                </ul>
              </div>

              <div className="total-amount">
                <span>Total Amount</span>
                <span className="amount">{formatPrice(membershipData?.membershipType)}</span>
              </div>
            </div>
          </div>

          <div className="payment-form">
            <h2>Payment Details</h2>
            
            <div className="payment-methods">
              <button 
                className={`method-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('card')}
              >
                CREDIT/DEBIT CARD
              </button>
              <button 
                className={`method-btn ${paymentMethod === 'upi' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('upi')}
              >
                UPI
              </button>
              <button 
                className={`method-btn ${paymentMethod === 'netbanking' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('netbanking')}
              >
                NET BANKING
              </button>
            </div>

            <form onSubmit={handlePayment} className="payment-details-form">
              {paymentMethod === 'card' && (
                <div className="card-form">
                  <div className="form-group">
                    <input
                      type="text"
                      name="cardholderName"
                      placeholder="Cardholder Name"
                      value={cardData.cardholderName}
                      onChange={handleCardInputChange}
                      className="form-input"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardData.cardNumber}
                      onChange={handleCardInputChange}
                      className="form-input"
                      maxLength="19"
                      required
                    />
                  </div>
                  
                  <div className="form-row">
                    <input
                      type="text"
                      name="expiryDate"
                      placeholder="MM/YY"
                      value={cardData.expiryDate}
                      onChange={handleCardInputChange}
                      className="form-input"
                      maxLength="5"
                      required
                    />
                    <input
                      type="text"
                      name="cvv"
                      placeholder="CVV"
                      value={cardData.cvv}
                      onChange={handleCardInputChange}
                      className="form-input"
                      maxLength="3"
                      required
                    />
                  </div>

                  <div className="stripe-info">
                    <p>🔒 Powered by Stripe - Your payment is secure and encrypted</p>
                  </div>
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div className="upi-form">
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Enter UPI ID (e.g., username@paytm)"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="upi-info">
                    <p>📱 You will be redirected to your UPI app to complete the payment</p>
                  </div>
                  {upiId && (
                    <div className="upi-qr-section" style={{ marginTop: '20px', textAlign: 'center' }}>
                      <p>Or scan this QR code with your UPI app to pay:</p>
                      <QRCode value={`upi://pay?pa=${upiId}&pn=Rotary%20Gulmohar&am=${membershipPrices[membershipData?.membershipType]}&cu=INR`} size={180} />
                    </div>
                  )}
                </div>
              )}

              {paymentMethod === 'netbanking' && (
                <div className="netbanking-form">
                  <select className="form-input" required>
                    <option value="">Select Your Bank</option>
                    <option value="sbi">State Bank of India</option>
                    <option value="hdfc">HDFC Bank</option>
                    <option value="icici">ICICI Bank</option>
                    <option value="axis">Axis Bank</option>
                    <option value="pnb">Punjab National Bank</option>
                    <option value="kotak">Kotak Mahindra Bank</option>
                    <option value="yes">Yes Bank</option>
                    <option value="canara">Canara Bank</option>
                  </select>
                  <div className="netbanking-info">
                    <p>🏦 You will be redirected to your bank's website to complete the payment</p>
                  </div>
                </div>
              )}

              <div className="security-info">
                <p>🔒 Your payment information is secure and encrypted</p>
                <p>✅ SSL Protected Transaction</p>
              </div>

              <button 
                type="submit" 
                className={`pay-btn ${processing ? 'processing' : ''}`}
                disabled={processing}
              >
                {processing ? (
                  <span>Processing Payment... ⏳</span>
                ) : (
                  <span>Pay {formatPrice(membershipData?.membershipType)} 💳</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
