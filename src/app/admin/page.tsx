'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Car, Users, Calendar, Trash2, Edit, Plus, DollarSign } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Vehicle, Booking } from '@/types';
import { vehicles as initialVehicles } from '@/lib/data';
import { toast } from 'sonner';

export default function AdminPage() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [showEditVehicle, setShowEditVehicle] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const [vehicleForm, setVehicleForm] = useState({
    name: '',
    brand: '',
    type: '',
    price: '',
    image: '',
    seats: '',
    transmission: 'Automatic',
    fuel: 'Petrol',
    year: new Date().getFullYear().toString(),
  });

  useEffect(() => {
    if (!user || !isAdmin) {
      router.push('/');
      return;
    }

    const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    setBookings(allBookings);
  }, [user, isAdmin, router]);

  if (!user || !isAdmin) return null;

  const resetForm = () => {
    setVehicleForm({
      name: '',
      brand: '',
      type: '',
      price: '',
      image: '',
      seats: '',
      transmission: 'Automatic',
      fuel: 'Petrol',
      year: new Date().getFullYear().toString(),
    });
  };

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    const newVehicle: Vehicle = {
      id: Math.random().toString(36).substr(2, 9),
      name: vehicleForm.name,
      brand: vehicleForm.brand,
      type: vehicleForm.type,
      price: parseFloat(vehicleForm.price),
      image: vehicleForm.image || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80',
      seats: parseInt(vehicleForm.seats),
      transmission: vehicleForm.transmission,
      fuel: vehicleForm.fuel,
      year: parseInt(vehicleForm.year),
      available: true,
    };

    setVehicles([...vehicles, newVehicle]);
    toast.success('Vehicle added successfully!');
    setShowAddVehicle(false);
    resetForm();
  };

  const handleEditVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicle) return;

    const updatedVehicles = vehicles.map(v =>
      v.id === selectedVehicle.id
        ? {
            ...v,
            name: vehicleForm.name,
            brand: vehicleForm.brand,
            type: vehicleForm.type,
            price: parseFloat(vehicleForm.price),
            image: vehicleForm.image,
            seats: parseInt(vehicleForm.seats),
            transmission: vehicleForm.transmission,
            fuel: vehicleForm.fuel,
            year: parseInt(vehicleForm.year),
          }
        : v
    );

    setVehicles(updatedVehicles);
    toast.success('Vehicle updated');
    setShowEditVehicle(false);
    setSelectedVehicle(null);
    resetForm();
  };

  const handleDeleteVehicle = (id: string) => {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      setVehicles(vehicles.filter(v => v.id !== id));
      toast.success('Vehicle deleted');
    }
  };

  const openEditModal = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setVehicleForm({
      name: vehicle.name,
      brand: vehicle.brand,
      type: vehicle.type,
      price: vehicle.price.toString(),
      image: vehicle.image,
      seats: vehicle.seats.toString(),
      transmission: vehicle.transmission,
      fuel: vehicle.fuel,
      year: vehicle.year.toString(),
    });
    setShowEditVehicle(true);
  };

  const updateBookingStatus = (bookingId: string, newStatus: 'confirmed' | 'active' | 'completed' | 'cancelled') => {
    const updatedBookings = bookings.map(b =>
      b.id === bookingId ? { ...b, status: newStatus } : b
    );
    setBookings(updatedBookings);
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
    toast.success('Booking status updated');
  };

  const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);
  const activeBookings = bookings.filter(b => b.status === 'active' || b.status === 'confirmed').length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage vehicles, bookings, and users</p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Car className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Vehicles</p>
                    <p className="text-2xl font-bold">{vehicles.length}</p>
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
                    <p className="text-sm text-muted-foreground">Active Bookings</p>
                    <p className="text-2xl font-bold">{activeBookings}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold">${totalRevenue.toFixed(0)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Bookings</p>
                    <p className="text-2xl font-bold">{bookings.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="vehicles" className="space-y-6">
            <TabsList>
              <TabsTrigger value="vehicles">Vehicle Management</TabsTrigger>
              <TabsTrigger value="bookings">Booking Management</TabsTrigger>
              <TabsTrigger value="users">User Management</TabsTrigger>
            </TabsList>

            {/* Vehicle Management */}
            <TabsContent value="vehicles" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Vehicles</h2>
                <Button onClick={() => setShowAddVehicle(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Vehicle
                </Button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicles.map((vehicle) => (
                  <Card key={vehicle.id}>
                    <div className="relative h-48 w-full">
                      <Image
                        src={vehicle.image}
                        alt={vehicle.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{vehicle.name}</h3>
                          <p className="text-sm text-muted-foreground">{vehicle.brand}</p>
                        </div>
                        <Badge>{vehicle.type}</Badge>
                      </div>
                      <p className="text-xl font-bold mb-3">${vehicle.price}/day</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => openEditModal(vehicle)}>
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteVehicle(vehicle.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Booking Management */}
            <TabsContent value="bookings" className="space-y-4">
              <h2 className="text-2xl font-semibold mb-4">Bookings</h2>
              
              {bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.map((booking) => (
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
                                <p className="text-sm text-muted-foreground">Booking ID: {booking.id}</p>
                              </div>
                              <Badge>{booking.status}</Badge>
                            </div>

                            <div className="grid md:grid-cols-3 gap-4 mb-4">
                              <div className="text-sm">
                                <p className="text-muted-foreground">Customer ID</p>
                                <p className="font-medium">{booking.userId}</p>
                              </div>
                              <div className="text-sm">
                                <p className="text-muted-foreground">Rental Period</p>
                                <p className="font-medium">
                                  {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="text-sm">
                                <p className="text-muted-foreground">Total Price</p>
                                <p className="font-bold text-lg">${booking.totalPrice.toFixed(2)}</p>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <Button 
                                size="sm" 
                                variant={booking.status === 'confirmed' ? 'default' : 'outline'}
                                onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                              >
                                Confirm
                              </Button>
                              <Button 
                                size="sm" 
                                variant={booking.status === 'active' ? 'default' : 'outline'}
                                onClick={() => updateBookingStatus(booking.id, 'active')}
                              >
                                Activate
                              </Button>
                              <Button 
                                size="sm" 
                                variant={booking.status === 'completed' ? 'default' : 'outline'}
                                onClick={() => updateBookingStatus(booking.id, 'completed')}
                              >
                                Complete
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No bookings yet</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* User Management */}
            <TabsContent value="users" className="space-y-4">
              <h2 className="text-2xl font-semibold mb-4">Users</h2>
              
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">{user.name}</p>
                          <p classname="font-semibold">{user.phone.number}</p>
                        </div>
                      </div>
                      <Badge>Admin</Badge>
                    </div>

                    <div className="text-center py-8 text-muted-foreground">
                      <p>User management features coming soon</p>
                      <p className="text-sm mt-2">View and manage all registered users</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Add Vehicle Modal */}
      <Dialog open={showAddVehicle} onOpenChange={setShowAddVehicle}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Vehicle</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddVehicle} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Vehicle Name</Label>
                <Input
                  id="name"
                  value={vehicleForm.name}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  value={vehicleForm.brand}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, brand: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <select
                  id="type"
                  value={vehicleForm.type}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, type: e.target.value })}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md"
                  required
                >
                  <option value="">Select type</option>
                  <option value="Sedan">Sedan</option>
                  <option value ="Truck">Truck</option>
                  <option value="SUV">SUV</option>
                  <option value="Sports">Sports</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price per Day ($)</Label>
                <Input
                  id="price"
                  type="number"
                  value={vehicleForm.price}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, price: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seats">Seats</Label>
                <Input
                  id="seats"
                  type="number"
                  value={vehicleForm.seats}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, seats: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={vehicleForm.year}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, year: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="transmission">Transmission</Label>
                <select
                  id="transmission"
                  value={vehicleForm.transmission}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, transmission: e.target.value })}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md"
                >
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fuel">Fuel Type</Label>
                <select
                  id="fuel"
                  value={vehicleForm.fuel}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, fuel: e.target.value })}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md"
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image</Label>
              <Input
                id="image"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={vehicleForm.image}
                onChange={(e) => setVehicleForm({ ...vehicleForm, image: e.target.value })}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setShowAddVehicle(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Vehicle</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Vehicle Modal */}
      <Dialog open={showEditVehicle} onOpenChange={setShowEditVehicle}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Vehicle</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditVehicle} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Vehicle Name</Label>
                <Input
                  id="edit-name"
                  value={vehicleForm.name}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-brand">Brand</Label>
                <Input
                  id="edit-brand"
                  value={vehicleForm.brand}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, brand: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-type">Type</Label>
                <select
                  id="edit-type"
                  value={vehicleForm.type}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, type: e.target.value })}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md"
                  required
                >
                  <option value="Sedan">Sedan</option>
                  <option value = "Truck">Truck</option>
                  <option value="SUV">SUV</option>
                  <option value="Sports">Sports</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-price">Price per Day ($)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={vehicleForm.price}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, price: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-seats">Seats</Label>
                <Input
                  id="edit-seats"
                  type="number"
                  value={vehicleForm.seats}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, seats: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-year">Year</Label>
                <Input
                  id="edit-year"
                  type="number"
                  value={vehicleForm.year}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, year: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-transmission">Transmission</Label>
                <select
                  id="edit-transmission"
                  value={vehicleForm.transmission}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, transmission: e.target.value })}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md"
                >
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-fuel">Fuel Type</Label>
                <select
                  id="edit-fuel"
                  value={vehicleForm.fuel}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, fuel: e.target.value })}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md"
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value= "Electric">Electric</option>                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-image">Image</Label>
              <Input
                id="edit-image"
                type="url"
                value={vehicleForm.image}
                onChange={(e) => setVehicleForm({ ...vehicleForm, image: e.target.value })}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setShowEditVehicle(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
