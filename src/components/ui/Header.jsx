import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import logo from "../../Images/Logo.svg"
const Header = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const handleLogout = () => {
    // Logout logic here
    console.log('Logging out...');
    setUserMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-surface border-b border-border z-200 header-height">
      <div className="flex items-center justify-between h-full px-6">
        {/* Logo Section */}
        <div className="flex items-center space-x-3">
          <Link to="/dashboard" className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-150">
            {/* <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
              >
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div> */}
            <img src={logo} alt="Rotary Gulmohar"  width={200}  />
            <div className="hidden sm:block">
              <h1 className="text-xl font-heading font-semibold text-text-primary">
                Rotary Gulmohar
              </h1>
              <p className="text-xs font-caption text-text-secondary -mt-1">
                Dashboard
              </p>
            </div>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            iconName="Menu"
            iconSize={20}
            onClick={() => {
              // Mobile menu toggle logic
              const event = new CustomEvent('toggleMobileMenu');
              window.dispatchEvent(event);
            }}
            className="text-text-secondary hover:text-text-primary"
          />
        </div>

        {/* Desktop User Section */}
        <div className="hidden lg:flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              iconName="Bell"
              iconSize={20}
              className="text-text-secondary hover:text-text-primary relative"
            />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-medium">3</span>
            </span>
          </div>

          {/* Search */}
          <Button
            variant="ghost"
            size="sm"
            iconName="Search"
            iconSize={20}
            className="text-text-secondary hover:text-text-primary"
          />

          {/* User Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleUserMenu}
              className="flex items-center space-x-2 text-text-secondary hover:text-text-primary px-3 py-2"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="white" />
              </div>
              <div className="text-left hidden xl:block">
                <p className="text-sm font-medium text-text-primary">Admin User</p>
                <p className="text-xs text-text-secondary">Club President</p>
              </div>
              <Icon 
                name="ChevronDown" 
                size={16} 
                className={`transition-transform duration-150 ${userMenuOpen ? 'rotate-180' : ''}`}
              />
            </Button>

            {/* User Dropdown */}
            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-surface border border-border rounded-lg shadow-xl z-300 animate-fade-in">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                      <Icon name="User" size={20} color="white" />
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">Admin User</p>
                      <p className="text-sm text-text-secondary">Club President</p>
                      <p className="text-xs text-text-muted">admin@rotarygulmohar.org</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="User"
                    iconPosition="left"
                    className="w-full justify-start text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
                  >
                    Profile Settings
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Settings"
                    iconPosition="left"
                    className="w-full justify-start text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
                  >
                    Account Settings
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="HelpCircle"
                    iconPosition="left"
                    className="w-full justify-start text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
                  >
                    Help & Support
                  </Button>
                  <div className="border-t border-border my-2"></div>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="LogOut"
                    iconPosition="left"
                    onClick={handleLogout}
                    className="w-full justify-start text-error hover:text-error hover:bg-error-50"
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile User Section */}
        <div className="lg:hidden flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            iconName="Bell"
            iconSize={20}
            className="text-text-secondary hover:text-text-primary relative"
          />
          <span className="absolute top-2 right-12 w-2 h-2 bg-error rounded-full"></span>
          
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
            <Icon name="User" size={16} color="white" />
          </div>
        </div>
      </div>

      {/* Click outside to close user menu */}
      {userMenuOpen && (
        <div
          className="fixed inset-0 z-100"
          onClick={() => setUserMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;