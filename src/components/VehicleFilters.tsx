'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface VehicleFiltersProps {
  brands: string[];
  types: string[];
  selectedBrand: string;
  selectedType: string;
  onBrandChange: (brand: string) => void;
  onTypeChange: (type: string) => void;
}

export function VehicleFilters({
  brands,
  types,
  selectedBrand,
  selectedType,
  onBrandChange,
  onTypeChange,
}: VehicleFiltersProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3">Brand</h3>
        <div className="flex flex-wrap gap-2">
          {brands.map((brand) => (
            <Badge
              key={brand}
              variant={selectedBrand === brand ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => onBrandChange(brand)}
            >
              {brand}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Type</h3>
        <div className="flex flex-wrap gap-2">
          {types.map((type) => (
            <Badge
              key={type}
              variant={selectedType === type ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => onTypeChange(type)}
            >
              {type}
            </Badge>
          ))}
        </div>
      </div>

      {(selectedBrand !== 'All' || selectedType !== 'All') && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            onBrandChange('All');
            onTypeChange('All');
          }}
          className="w-full"
        >
          Clear Filters
        </Button>
      )}
    </div>
  );
}
