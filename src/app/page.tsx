'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { VehicleCard } from '@/components/VehicleCard';
import { VehicleFilters } from '@/components/VehicleFilters';
import { vehicles, brands, types } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Search, Car, Shield, Clock, Award } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  const filteredVehicles = vehicles.filter((vehicle) => {
    const brandMatch = selectedBrand === 'All' || vehicle.brand === selectedBrand;
    const typeMatch = selectedType === 'All' || vehicle.type === selectedType;
    return brandMatch && typeMatch;
  }).slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10" />
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Premium Car Rental<br />Made Simple
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Experience luxury and comfort with our extensive fleet of premium vehicles. 
              Book your perfect ride today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/vehicles">
                <Button size="lg" className="w-full sm:w-auto">
                  <Search className="w-5 h-5 mr-2" />
                  Browse Vehicles
                </Button>
              </Link>
              <Link href="/vehicles">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">Wide Selection</h3>
              <p className="text-sm text-muted-foreground">
                Choose from our extensive fleet of luxury vehicles
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">Fully Insured</h3>
              <p className="text-sm text-muted-foreground">
                All vehicles come with comprehensive insurance
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">24/7 Support</h3>
              <p className="text-sm text-muted-foreground">
                Round-the-clock customer support for your convenience
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">Best Prices</h3>
              <p className="text-sm text-muted-foreground">
                Competitive rates with no hidden fees
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Vehicles Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Featured Vehicles
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our handpicked selection of premium vehicles, perfect for any occasion
            </p>
          </div>

          {/* Filters */}
          <div className="max-w-4xl mx-auto mb-8">
            <VehicleFilters
              brands={brands}
              types={types}
              selectedBrand={selectedBrand}
              selectedType={selectedType}
              onBrandChange={setSelectedBrand}
              onTypeChange={setSelectedType}
            />
          </div>

          {/* Vehicle Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>

          <div className="text-center">
            <Link href="/vehicles">
              <Button size="lg" variant="outline">
                View All Vehicles
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Car className="w-5 h-5" />
                LuxeDrive
              </h3>
              <p className="text-sm text-muted-foreground">
                Premium car rental service for the modern traveler.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/vehicles">Vehicles</Link></li>
                <li><Link href="/dashboard">Dashboard</Link></li>
                <li><Link href="/cart">Cart</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>FAQs</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
                <li>Cookie Policy</li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 LuxeDrive. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}