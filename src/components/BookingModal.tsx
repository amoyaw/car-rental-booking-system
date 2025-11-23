'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Vehicle } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Calendar } from 'lucide-react';

interface BookingModalProps {
  vehicle: Vehicle;
  open: boolean;
  onClose: () => void;
}

export function BookingModal({ vehicle, open, onClose }: BookingModalProps) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please login to book a vehicle');
      return;
    }

    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      toast.error('End date must be after start date');
      return;
    }

    addToCart(vehicle, startDate, endDate);
    toast.success('Vehicle added to cart!');
    onClose();
    setStartDate('');
    setEndDate('');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Book {vehicle.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Daily Rate</p>
            <p className="text-2xl font-bold">${vehicle.price}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="start-date">
              <Calendar className="w-4 h-4 inline mr-2" />
              Start Date
            </Label>
            <Input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="end-date">
              <Calendar className="w-4 h-4 inline mr-2" />
              End Date
            </Label>
            <Input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || new Date().toISOString().split('T')[0]}
            />
          </div>

          {startDate && endDate && (
            <div className="p-4 bg-primary/10 rounded-lg">
              <p className="text-sm">Rental Duration</p>
              <p className="text-lg font-semibold">
                {Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))} days
              </p>
              <p className="text-sm mt-2">Total Price</p>
              <p className="text-2xl font-bold">
                ${(Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) * vehicle.price).toFixed(2)}
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleAddToCart} className="flex-1">
              Add to Cart
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
