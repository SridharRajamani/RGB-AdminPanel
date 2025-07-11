import React from 'react';
import Icon from '../../../../components/AppIcon';

const CommunicationSidebar = ({ selectedCategory, onCategorySelect, categories }) => {
  return (
    <div className="bg-surface border border-border rounded-lg p-4 h-fit">
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="MessageSquare" size={20} className="text-primary" />
        <h3 className="text-lg font-heading font-semibold text-text-primary">
          Communication Types
        </h3>
      </div>
      
      <nav className="space-y-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategorySelect(category.id)}
            className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all duration-150 ${
              selectedCategory === category.id
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Icon 
                name={category.icon} 
                size={18} 
                className={selectedCategory === category.id ? 'text-primary-foreground' : 'text-text-muted'}
              />
              <span className="font-medium">{category.name}</span>
            </div>
            
            {category.unreadCount > 0 && (
              <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                selectedCategory === category.id
                  ? 'bg-primary-foreground text-primary'
                  : 'bg-error text-white'
              }`}>
                {category.unreadCount}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default CommunicationSidebar;