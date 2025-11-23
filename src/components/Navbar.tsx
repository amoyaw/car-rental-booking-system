'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Car, ShoppingCart, User, Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { LoginModal } from '@/components/LoginModal';

export function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold">
              <Car className="w-6 h-6" />
              <span>LuxeDrive</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/vehicles" className="text-sm font-medium hover:text-primary transition-colors">
                Vehicles
              </Link>
              {user?.role === 'admin' && (
                <Link href="/admin" className="text-sm font-medium hover:text-primary transition-colors">
                  Admin
                </Link>
              )}
              {user && (
                <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                  Dashboard
                </Link>
              )}
            </div>

            <div className="hidden md:flex items-center gap-4">
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                      {cart.length}
                    </span>
                  )}
                </Button>
              </Link>

              {user ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{user.name}</span>
                  <Button variant="outline" size="sm" onClick={logout}>
                    Logout
                  </Button>
                </div>
              ) : (
                <Button size="sm" onClick={() => setShowLoginModal(true)}>
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="flex flex-col gap-4">
                <Link href="/" className="text-sm font-medium">Home</Link>
                <Link href="/vehicles" className="text-sm font-medium">Vehicles</Link>
                {user?.role === 'admin' && (
                  <Link href="/admin" className="text-sm font-medium">Admin</Link>
                )}
                {user && (
                  <Link href="/dashboard" className="text-sm font-medium">Dashboard</Link>
                )}
                <Link href="/cart" className="text-sm font-medium flex items-center gap-2">
                  Cart {cart.length > 0 && `(${cart.length})`}
                </Link>
                {user ? (
                  <>
                    <span className="text-sm">Logged in as {user.name}</span>
                    <Button variant="outline" size="sm" onClick={logout}>
                      Logout
                    </Button>
                  </>
                ) : (
                  <Button size="sm" onClick={() => setShowLoginModal(true)}>
                    Login
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <LoginModal open={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  );
}
