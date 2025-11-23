'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
  const { cart, removeFromCart, getCartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 px-4">
          <div className="container mx-auto">
            <div className="max-w-2xl mx-auto text-center py-16">
              <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">
                Start browsing our vehicles to add them to your cart
              </p>
              <Link href="/vehicles">
                <Button>Browse Vehicles</Button>
              </Link>
            </div>
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
          <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item, index) => (
                <Card key={`${item.vehicle.id}-${index}`}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="relative w-32 h-24 flex-shrink-0">
                        <Image
                          src={item.vehicle.image}
                          alt={item.vehicle.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">{item.vehicle.name}</h3>
                            <p className="text-sm text-muted-foreground">{item.vehicle.brand}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromCart(item.vehicle.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-muted-foreground">Start Date</p>
                            <p className="font-medium">{new Date(item.startDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">End Date</p>
                            <p className="font-medium">{new Date(item.endDate).toLocaleDateString()}</p>
                          </div>
                        </div>

                        <div className="mt-3 flex justify-between items-center">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              ${item.vehicle.price}/day × {item.days} days
                            </p>
                          </div>
                          <p className="text-xl font-bold">
                            ${(item.vehicle.price * item.days).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
                  
                  <div className="space-y-2 mb-4">
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

                  <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total</span>
                      <span className="text-2xl font-bold">
                        ${(getCartTotal() * 1.15).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <Link href="/checkout">
                    <Button className="w-full" size="lg">
                      Proceed to Checkout
                    </Button>
                  </Link>

                  <Link href="/vehicles">
                    <Button variant="outline" className="w-full mt-2">
                      Continue Shopping
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
