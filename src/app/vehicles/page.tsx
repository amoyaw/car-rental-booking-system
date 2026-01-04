'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { VehicleCard } from '@/components/VehicleCard';
import { VehicleFilters } from '@/components/VehicleFilters';
import { vehicles, brands, types } from '@/lib/data';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function VehiclesPage() {
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVehicles = vehicles.filter((vehicle) => {
    const brandMatch = selectedBrand === 'All' || vehicle.brand === selectedBrand;
    const typeMatch = selectedType === 'All' || vehicle.type === selectedType;
    const searchMatch = vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        vehicle.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return brandMatch && typeMatch && searchMatch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Our Vehicle Fleet</h1>
            <p className="text-muted-foreground">
              Browse our collection of rental vehicles
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">Search</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search vehicles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <VehicleFilters
                  brands={brands}
                  types={types}
                  selectedBrand={selectedBrand}
                  selectedType={selectedType}
                  onBrandChange={setSelectedBrand}
                  onTypeChange={setSelectedType}
                />
              </div>
            </div>

            {/* Vehicle Grid */}
            <div className="lg:col-span-3">
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredVehicles.length} vehicle{filteredVehicles.length !== 1 ? 's' : ''}
                </p>
              </div>

              {filteredVehicles.length > 0 ? (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredVehicles.map((vehicle) => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No vehicles found matching your criteria.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
