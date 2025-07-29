import React from 'react';
import { NavLink } from 'react-router-dom';
import { X, Car, Users, Wrench, Package, FileText, BarChart3, Settings, Home, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '@/lib/utils';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { user } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home, roles: ['admin', 'cashier', 'mechanic'] },
    { name: 'Customers', href: '/customers', icon: Users, roles: ['admin', 'cashier'] },
    { name: 'Vehicles', href: '/vehicles', icon: Car, roles: ['admin', 'cashier', 'mechanic'] },
    { name: 'Transactions', href: '/transactions', icon: CreditCard, roles: ['admin', 'cashier'] },
    { name: 'Repairs', href: '/repairs', icon: Wrench, roles: ['admin', 'cashier', 'mechanic'] },
    { name: 'Spare Parts', href: '/spare-parts', icon: Package, roles: ['admin', 'cashier', 'mechanic'] },
    { name: 'Reports', href: '/reports', icon: BarChart3, roles: ['admin', 'cashier'] },
    { name: 'Users', href: '/users', icon: Settings, roles: ['admin'] },
  ];

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(user?.role || '')
  );

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <Car className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-lg font-semibold text-gray-900">AutoDealer</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {filteredNavigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  )
                }
              >
                <item.icon
                  className="mr-3 h-5 w-5 flex-shrink-0"
                  aria-hidden="true"
                />
                {item.name}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
}
