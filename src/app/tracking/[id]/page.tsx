'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Clock, Car, MapPin } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { Booking } from '@/types';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';

export default function TrackingPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }

    const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const foundBooking = allBookings.find((b: Booking) => b.id === params.id);
    
    if (foundBooking) {
      setBooking(foundBooking);
    } else {
      router.push('/dashboard');
    }
  }, [params.id, user, router]);

  if (!booking) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 px-4">
          <div className="container mx-auto text-center">
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  const trackingSteps = [
    {
      title: 'Booking Confirmed',
      description: 'Your reservation has been confirmed',
      status: 'completed',
      icon: CheckCircle,
    },
    {
      title: 'Vehicle Preparation',
      description: 'Vehicle is being prepared for pickup',
      status: booking.status === 'confirmed' ? 'current' : 'completed',
      icon: Car,
    },
    {
      title: 'Ready for Pickup',
      description: 'Vehicle is ready at the pickup location',
      status: booking.status === 'active' ? 'current' : booking.status === 'completed' ? 'completed' : 'pending',
      icon: MapPin,
    },
    {
      title: 'Rental Complete',
      description: 'Vehicle has been returned',
      status: booking.status === 'completed' ? 'completed' : 'pending',
      icon: CheckCircle,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">Track Your Rental</h1>

          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="relative w-full md:w-64 h-40 flex-shrink-0">
                  <Image
                    src={booking.vehicle.image}
                    alt={booking.vehicle.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-semibold">{booking.vehicle.name}</h2>
                      <p className="text-muted-foreground">{booking.vehicle.brand}</p>
                    </div>
                    <Badge>
                      {booking.status}
                    </Badge>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Booking ID</p>
                      <p className="font-medium">{booking.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Price</p>
                      <p className="font-bold text-xl">${booking.totalPrice.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Pickup Date</p>
                      <p className="font-medium">{new Date(booking.startDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Return Date</p>
                      <p className="font-medium">{new Date(booking.endDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rental Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {trackingSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isCompleted = step.status === 'completed';
                  const isCurrent = step.status === 'current';
                  const isPending = step.status === 'pending';

                  return (
                    <div key={index} className="relative">
                      {index !== trackingSteps.length - 1 && (
                        <div
                          className={`absolute left-6 top-12 w-0.5 h-full -ml-px ${
                            isCompleted ? 'bg-primary' : 'bg-muted'
                          }`}
                        />
                      )}
                      
                      <div className="flex gap-4">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isCompleted
                              ? 'bg-primary text-primary-foreground'
                              : isCurrent
                              ? 'bg-primary/20 text-primary'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle className="w-6 h-6" />
                          ) : isCurrent ? (
                            <Clock className="w-6 h-6" />
                          ) : (
                            <Circle className="w-6 h-6" />
                          )}
                        </div>

                        <div className="flex-1 pb-8">
                          <h3 className={`font-semibold mb-1 ${isCurrent ? 'text-primary' : ''}`}>
                            {step.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {step.description}
                          </p>
                          {isCurrent && (
                            <Badge variant="outline" className="mt-2">
                              In Progress
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Pickup Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">The Garage Downtown Location</p>
                    <p className="text-sm text-muted-foreground">123 Main Street, New York, NY 10001</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Business Hours</p>
                    <p className="text-sm text-muted-foreground">Monday - Sunday: 8:00 AM - 8:00 PM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
