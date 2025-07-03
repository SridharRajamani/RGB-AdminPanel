import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Icon from '../AppIcon';
import Button from './Button';
import logo from "../../Images/New-RGB-Logo.png"
import AlertCenter from './AlertCenter';

const Header = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const searchInputRef = React.useRef(null);
  const navigate = useNavigate();
  const [recentSearches, setRecentSearches] = useState([]);
  const { user, logout, roles } = useAuth();

  const sections = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Members", path: "/member-management" },
    { label: "Add New Member", path: "/member-management" },
    { label: "Export Data", path: "/member-management" },
    { label: "Events", path: "/event-management" },
    { label: "Projects", path: "/project-management" },
    { label: "Finance", path: "/financial-reports" },
    { label: "Communications", path: "/communication-center" },
    { label: "General Messages", path: "/communication-center" },
  ];

  const members = [
    // Add member data here
  ];

  const events = [
    // Add event data here
  ];

  const projects = [
    // Add project data here
  ];

  // Grouped results
  const groupedResults = [
    { label: 'Sections', items: sections.filter(s => s.label.toLowerCase().includes(searchValue.toLowerCase())) },
    { label: 'Members', items: members.filter(m => m.name.toLowerCase().includes(searchValue.toLowerCase())).map(m => ({ label: m.name, path: `/member-management?search=${encodeURIComponent(m.name)}` })) },
    { label: 'Events', items: events.filter(e => e.title.toLowerCase().includes(searchValue.toLowerCase())).map(e => ({ label: e.title, path: `/event-management?search=${encodeURIComponent(e.title)}` })) },
    { label: 'Projects', items: projects.filter(p => p.name.toLowerCase().includes(searchValue.toLowerCase())).map(p => ({ label: p.name, path: `/project-management?search=${encodeURIComponent(p.name)}` })) },
  ];

  const handleSearchSelect = (section) => {
    setSearchOpen(false);
    setSearchValue("");
    setRecentSearches(prev => {
      const filtered = prev.filter(s => s.label !== section.label);
      return [section, ...filtered].slice(0, 5);
    });
    navigate(section.path);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter" && filteredSections.length > 0) {
      handleSearchSelect(filteredSections[0]);
    } else if (e.key === "Escape") {
      setSearchOpen(false);
    }
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-1" style={{ backgroundColor: '#0C0C46' }}>
      <div className="flex items-center justify-between h-full  min-h-[67px]">
        {/* Hamburger + Logo Section */}
        <div className="flex items-center space-x-3">
          {/* Hamburger always visible */}
          <div className=" ">
            <Button
              variant="ghost"
              size="sm"
              iconName="Menu"
              iconSize={25}
              onClick={() => {
                // Toggle both mobile and desktop sidebar
                const mobileEvent = new CustomEvent('toggleMobileMenu');
                window.dispatchEvent(mobileEvent);
                const desktopEvent = new CustomEvent('toggleSidebarCollapse');
                window.dispatchEvent(desktopEvent);
              }}
              className="text-white hover:text-white"
              iconColor="white"
            />
          </div>
          <Link to="/dashboard" className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-150">
            <img src={logo} alt="Rotary Gulmohar" width={240} />
          </Link>
        </div>

        {/* Desktop User Section */}
        <div className="hidden lg:flex items-center space-x-4">
          {/* Notifications */}
          {/* <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              iconName="Bell"
              iconSize={20}
              className="text-white hover:text-white relative"
            />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-medium">3</span>
            </span>
          </div> */}
 
          {/* Search */}
          <div className="relative">
            {!searchOpen && (
              <Button
                variant="ghost"
                size="sm"
                iconName="Search"
                iconSize={20}
                className="text-white hover:text-white"
                onClick={() => {
                  setSearchOpen(true);
                  setTimeout(() => searchInputRef.current && searchInputRef.current.focus(), 100);
                }}
              />
            )}
            {searchOpen && (
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search section..."
                  value={searchValue}
                  onChange={e => setSearchValue(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Escape') setSearchOpen(false);
                  }}
                  className="w-48 border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  style={{ position: 'relative', zIndex: 20 }}
                />
                <button
                  className="absolute top-1 right-1 text-gray-500 hover:text-gray-700"
                  onClick={() => { setSearchOpen(false); setSearchValue(""); }}
                  aria-label="Close search"
                  style={{ zIndex: 21 }}
                >
                  <Icon name="X" size={16} />
                </button>
                {searchValue && (
                  <ul className="absolute left-0 mt-1 w-64 bg-white rounded shadow-lg pl-0 list-none text-left z-30 max-h-80 overflow-y-auto">
                    {groupedResults.every(group => group.items.length === 0) && (
                      <li className="text-gray-400 px-2 py-1">No matches</li>
                    )}
                    {groupedResults.map(group => (
                      group.items.length > 0 && (
                        <React.Fragment key={group.label}>
                          <li className="px-2 pt-2 pb-1 text-gray-500" style={{ fontSize: '10px', fontWeight: 600 }}>{group.label}</li>
                          {group.items.map(item => (
                            <li
                              key={item.label + item.path}
                              className="px-2 py-1 cursor-pointer hover:bg-blue-100 rounded text-gray-800"
                              onClick={() => handleSearchSelect(item)}
                            >
                              {item.label}
                            </li>
                          ))}
                        </React.Fragment>
                      )
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
          <div> <AlertCenter /></div>

            {/* Help line, greeting, and date/time info */}
            <div className="flex flex-col items-end justify-center ml-8 text-white text-xs font-medium space-y-0">
                        <div style={{ fontSize: "5px", fontWeight: '300', }}>
                          Help line No: +91 8956231452 / +91 9856231452
                        </div>
                        <div className="flex items-center space-x-2" style={{  }}>
                          <span className="text-lg font-bold" style={{   fontWeight: '400' }}>
                            hello, {user?.fullName || 'Guest User'}
                          </span>
                          {/* <span className="w-8 h-8 bg-white text-[#252569] rounded-full flex items-center justify-center font-bold">US</span> */}
                        </div>
                        <div style={{ fontSize: "8px", fontWeight: '300' }}>
                          Date : {new Date().toLocaleDateString()} &nbsp; Time : {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                        </div>
           </div>

          {/* User Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleUserMenu}
              className="flex items-center  text-white hover:text-white px-3 py-1"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                {user ? (
                  <span className="text-white font-medium text-xs">
                    {user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </span>
                ) : (
                  <Icon name="User" size={16} color="white" />
                )}
              </div>
              <div className="text-left hidden xl:block">
                {/* <p className="text-sm font-medium text-white">Admin User</p>
                <p className="text-xs text-white">Club President</p> */}
              </div>
              <Icon 
                name="ChevronDown" 
                size={16} 
                className={`transition-transform duration-150 ${userMenuOpen ? 'rotate-180' : ''}`}
                color="white"
              />
            </Button>

            {/* User Dropdown */}
            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-surface border border-border rounded-lg shadow-xl z-300 animate-fade-in">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                      {user ? (
                        <span className="text-white font-bold text-lg">
                          {user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      ) : (
                        <Icon name="User" size={20} color="white" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-black">{user?.fullName || 'Guest User'}</p>
                      <p className="text-sm text-black">{roles[user?.role]?.name || user?.role || 'Guest'}</p>
                      <p className="text-xs text-black">{user?.email || 'admin@rotarygulmohar.org'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="User"
                    iconPosition="left"
                    onClick={() => {
                      setUserMenuOpen(false);
                      navigate('/profile');
                    }}
                    className="w-full justify-start text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
                  >
                    Profile Settings
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Settings"
                    iconPosition="left"
                    onClick={() => {
                      setUserMenuOpen(false);
                      navigate('/profile');
                    }}
                    className="w-full justify-start text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
                  >
                    Account Settings
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="HelpCircle"
                    iconPosition="left"
                    onClick={() => {
                      setUserMenuOpen(false);
                      navigate('/help-support');
                    }}
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
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                    }}
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
          
          {/* <span className="absolute top-2 right-12 w-2 h-2 bg-error rounded-full"></span> */}
          
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
            {user ? (
              <span className="text-white font-medium text-xs">
                {user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </span>
            ) : (
              <Icon name="User" size={16} color="white" />
            )}
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