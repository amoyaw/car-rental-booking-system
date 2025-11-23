'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Lock, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });

  const [billingData, setBillingData] = useState({
    address: '',
    city: '',
    zipCode: '',
    country: '',
  });

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to complete checkout');
      router.push('/');
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
      
      // Save booking to localStorage
      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      const newBookings = cart.map(item => ({
        id: Math.random().toString(36).substr(2, 9),
        userId: user.id,
        vehicle: item.vehicle,
        startDate: item.startDate,
        endDate: item.endDate,
        totalPrice: item.vehicle.price * item.days * 1.15,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      }));
      
      localStorage.setItem('bookings', JSON.stringify([...bookings, ...newBookings]));
      
      setTimeout(() => {
        clearCart();
        router.push('/dashboard');
      }, 3000);
    }, 2000);
  };

  if (cart.length === 0 && !isComplete) {
    router.push('/cart');
    return null;
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 px-4">
          <div className="container mx-auto">
            <Card className="max-w-md mx-auto text-center p-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
              <p className="text-muted-foreground mb-4">
                Your booking has been confirmed. Redirecting to dashboard...
              </p>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-8">Checkout</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePayment} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={paymentData.cardNumber}
                        onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cardName">Cardholder Name</Label>
                      <Input
                        id="cardName"
                        placeholder="John Doe"
                        value={paymentData.cardName}
                        onChange={(e) => setPaymentData({ ...paymentData, cardName: e.target.value })}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input
                          id="expiry"
                          placeholder="MM/YY"
                          value={paymentData.expiry}
                          onChange={(e) => setPaymentData({ ...paymentData, expiry: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          type="password"
                          maxLength={3}
                          value={paymentData.cvv}
                          onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Billing Address */}
              <Card>
                <CardHeader>
                  <CardTitle>Billing Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      placeholder="123 Main St"
                      value={billingData.address}
                      onChange={(e) => setBillingData({ ...billingData, address: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        placeholder="New York"
                        value={billingData.city}
                        onChange={(e) => setBillingData({ ...billingData, city: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        placeholder="10001"
                        value={billingData.zipCode}
                        onChange={(e) => setBillingData({ ...billingData, zipCode: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      placeholder="United States"
                      value={billingData.country}
                      onChange={(e) => setBillingData({ ...billingData, country: e.target.value })}
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cart.map((item, index) => (
                    <div key={`${item.vehicle.id}-${index}`} className="pb-3 border-b">
                      <p className="font-medium">{item.vehicle.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.days} days × ${item.vehicle.price}
                      </p>
                      <p className="text-sm font-medium">
                        ${(item.vehicle.price * item.days).toFixed(2)}
                      </p>
                    </div>
                  ))}

                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${getCartTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Service Fee</span>
                      <span>${(getCartTotal() * 0.05).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax (10%)</span>
                      <span>${(getCartTotal() * 0.1).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-semibold">Total</span>
                      <span className="text-2xl font-bold">
                        ${(getCartTotal() * 1.15).toFixed(2)}
                      </span>
                    </div>

                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={handlePayment}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>Processing...</>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          Complete Payment
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground mt-3">
                      <Lock className="w-3 h-3 inline mr-1" />
                      Secure payment processing
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
