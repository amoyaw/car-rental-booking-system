'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Car, Clock, MapPin, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Booking } from '@/types';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }

    const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const userBookings = allBookings.filter((b: Booking) => b.userId === user.id);
    setBookings(userBookings);
  }, [user, router]);

  if (!user) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'default';
      case 'active': return 'default';
      case 'completed': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  const activeBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'active');
  const pastBookings = bookings.filter(b => b.status === 'completed' || b.status === 'cancelled');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">My Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user.name}!</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Car className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Rentals</p>
                    <p className="text-2xl font-bold">{activeBookings.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Bookings</p>
                    <p className="text-2xl font-bold">{bookings.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Member Since</p>
                    <p className="text-lg font-bold">2024</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="active" className="space-y-6">
            <TabsList>
              <TabsTrigger value="active">Active Rentals</TabsTrigger>
              <TabsTrigger value="history">Rental History</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-4">
              {activeBookings.length > 0 ? (
                activeBookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="relative w-full md:w-48 h-32 flex-shrink-0">
                          <Image
                            src={booking.vehicle.image}
                            alt={booking.vehicle.name}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>

                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="text-xl font-semibold">{booking.vehicle.name}</h3>
                              <p className="text-sm text-muted-foreground">{booking.vehicle.brand}</p>
                            </div>
                            <Badge variant={getStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                          </div>

                          <div className="grid md:grid-cols-3 gap-4 mb-4">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <div>
                                <p className="text-muted-foreground">Start Date</p>
                                <p className="font-medium">{new Date(booking.startDate).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <div>
                                <p className="text-muted-foreground">End Date</p>
                                <p className="font-medium">{new Date(booking.endDate).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="w-4 h-4 text-muted-foreground" />
                              <div>
                                <p className="text-muted-foreground">Total Price</p>
                                <p className="font-bold text-lg">${booking.totalPrice.toFixed(2)}</p>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Link href={`/tracking/${booking.id}`}>
                              <Button size="sm">Track Order</Button>
                            </Link>
                            <Button size="sm" variant="outline">Contact Support</Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Car className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">No active rentals</p>
                    <Link href="/vehicles">
                      <Button>Browse Vehicles</Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              {pastBookings.length > 0 ? (
                pastBookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="relative w-full md:w-48 h-32 flex-shrink-0">
                          <Image
                            src={booking.vehicle.image}
                            alt={booking.vehicle.name}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>

                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="text-xl font-semibold">{booking.vehicle.name}</h3>
                              <p className="text-sm text-muted-foreground">{booking.vehicle.brand}</p>
                            </div>
                            <Badge variant={getStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                          </div>

                          <div className="grid md:grid-cols-3 gap-4">
                            <div className="text-sm">
                              <p className="text-muted-foreground">Rental Period</p>
                              <p className="font-medium">
                                {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-sm">
                              <p className="text-muted-foreground">Total Paid</p>
                              <p className="font-bold text-lg">${booking.totalPrice.toFixed(2)}</p>
                            </div>
                            <div className="text-sm">
                              <p className="text-muted-foreground">Booking Date</p>
                              <p className="font-medium">{new Date(booking.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No rental history</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
