'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Vehicle } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Gauge, Fuel, Calendar } from 'lucide-react';
import { BookingModal } from '@/components/BookingModal';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const [showBookingModal, setShowBookingModal] = useState(false);

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative h-48 w-full">
          <Image
            src={vehicle.image}
            alt={vehicle.name}
            fill
            className="object-cover"
          />
          {!vehicle.available && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive">Unavailable</Badge>
            </div>
          )}
        </div>
        
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-lg">{vehicle.name}</h3>
              <p className="text-sm text-muted-foreground">{vehicle.brand}</p>
            </div>
            <Badge variant="outline">{vehicle.type}</Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-2 my-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{vehicle.seats} Seats</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Gauge className="w-4 h-4" />
              <span>{vehicle.transmission}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Fuel className="w-4 h-4" />
              <span>{vehicle.fuel}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{vehicle.year}</span>
            </div>
          </div>
          
          <div className="flex items-end justify-between mt-4">
            <div>
              <p className="text-2xl font-bold">${vehicle.price}</p>
              <p className="text-xs text-muted-foreground">per day</p>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0">
          <Button 
            className="w-full" 
            disabled={!vehicle.available}
            onClick={() => setShowBookingModal(true)}
          >
            Book Now
          </Button>
        </CardFooter>
      </Card>

      <BookingModal
        vehicle={vehicle}
        open={showBookingModal}
        onClose={() => setShowBookingModal(false)}
      />
    </>
  );
}
