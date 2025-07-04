import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import Icon from '../AppIcon';
import Button from './Button';

const CoolAlert = ({ 
  isOpen, 
  onClose, 
  type = 'success', 
  title, 
  message, 
  confirmText = 'OK', 
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  showCancel = false,
  autoClose = false,
  autoCloseDelay = 3000,
  animation = 'bounce',
  size = 'medium',
  icon,
  customIcon,
  gradient = false,
  sound = false
}) => {
  const { isDarkMode } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsClosing(false);
      
      // Play sound effect if enabled
      if (sound) {
        playNotificationSound(type);
      }
      
      // Auto close if enabled
      if (autoClose) {
        const timer = setTimeout(() => {
          handleClose();
        }, autoCloseDelay);
        
        return () => clearTimeout(timer);
      }
    }
  }, [isOpen, autoClose, autoCloseDelay, sound, type]);

  const playNotificationSound = (alertType) => {
    // Create audio context for sound effects
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Different frequencies for different alert types
    const frequencies = {
      success: [523, 659, 784], // C, E, G (major chord)
      error: [220, 277, 330],   // A, C#, E (minor chord)
      warning: [440, 554, 659], // A, C#, E
      info: [349, 440, 523]     // F, A, C
    };
    
    const freq = frequencies[alertType] || frequencies.info;
    
    oscillator.frequency.setValueAtTime(freq[0], audioContext.currentTime);
    oscillator.frequency.setValueAtTime(freq[1], audioContext.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(freq[2], audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose && onClose();
    }, 300);
  };

  const handleConfirm = () => {
    onConfirm && onConfirm();
    handleClose();
  };

  const handleCancel = () => {
    onCancel && onCancel();
    handleClose();
  };

  const getAlertStyles = () => {
    const baseStyles = {
      success: gradient 
        ? 'bg-gradient-to-br from-green-400 via-green-500 to-green-600 text-white border-green-300'
        : 'bg-green-50 border-green-200 text-green-800',
      error: gradient
        ? 'bg-gradient-to-br from-red-400 via-red-500 to-red-600 text-white border-red-300'
        : 'bg-red-50 border-red-200 text-red-800',
      warning: gradient
        ? 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 text-white border-yellow-300'
        : 'bg-yellow-50 border-yellow-200 text-yellow-800',
      info: gradient
        ? 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 text-white border-blue-300'
        : 'bg-blue-50 border-blue-200 text-blue-800'
    };

    if (isDarkMode) {
      return {
        success: gradient 
          ? 'bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white border-green-500'
          : 'bg-green-900/20 border-green-700 text-green-300',
        error: gradient
          ? 'bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white border-red-500'
          : 'bg-red-900/20 border-red-700 text-red-300',
        warning: gradient
          ? 'bg-gradient-to-br from-yellow-600 via-yellow-700 to-yellow-800 text-white border-yellow-500'
          : 'bg-yellow-900/20 border-yellow-700 text-yellow-300',
        info: gradient
          ? 'bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white border-blue-500'
          : 'bg-blue-900/20 border-blue-700 text-blue-300'
      };
    }

    return baseStyles;
  };

  const getIconName = () => {
    if (customIcon) return customIcon;
    if (icon) return icon;
    
    const icons = {
      success: 'CheckCircle',
      error: 'XCircle',
      warning: 'AlertTriangle',
      info: 'Info'
    };
    
    return icons[type] || 'Info';
  };

  const getAnimationClass = () => {
    const animations = {
      bounce: isClosing ? 'animate-bounce-out' : 'animate-bounce-in',
      slide: isClosing ? 'animate-slide-out' : 'animate-slide-in',
      fade: isClosing ? 'animate-fade-out' : 'animate-fade-in',
      zoom: isClosing ? 'animate-zoom-out' : 'animate-zoom-in',
      flip: isClosing ? 'animate-flip-out' : 'animate-flip-in',
      shake: isClosing ? 'animate-shake-out' : 'animate-shake-in'
    };
    
    return animations[animation] || animations.bounce;
  };

  const getSizeClass = () => {
    const sizes = {
      small: 'max-w-sm',
      medium: 'max-w-md',
      large: 'max-w-lg',
      xl: 'max-w-xl'
    };
    
    return sizes[size] || sizes.medium;
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop with blur effect */}
      <div 
        className={`absolute inset-0 backdrop-blur-sm transition-all duration-300 ${
          isDarkMode ? 'bg-black/60' : 'bg-black/40'
        }`}
        onClick={handleClose}
      />
      
      {/* Alert Container */}
      <div className={`
        relative ${getSizeClass()} w-full transform transition-all duration-300 
        ${getAnimationClass()}
      `}>
        {/* Glow effect */}
        <div className={`
          absolute -inset-1 rounded-2xl blur-xl opacity-30 
          ${type === 'success' ? 'bg-green-400' : ''}
          ${type === 'error' ? 'bg-red-400' : ''}
          ${type === 'warning' ? 'bg-yellow-400' : ''}
          ${type === 'info' ? 'bg-blue-400' : ''}
        `} />
        
        {/* Main Alert */}
        <div className={`
          relative rounded-2xl border-2 p-6 shadow-2xl backdrop-blur-sm
          ${getAlertStyles()[type]}
          ${gradient ? 'shadow-colored' : ''}
        `}>
          {/* Floating particles effect */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`
                  absolute w-2 h-2 rounded-full opacity-20 animate-float
                  ${type === 'success' ? 'bg-green-300' : ''}
                  ${type === 'error' ? 'bg-red-300' : ''}
                  ${type === 'warning' ? 'bg-yellow-300' : ''}
                  ${type === 'info' ? 'bg-blue-300' : ''}
                `}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: `${3 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
          
          {/* Header */}
          <div className="flex items-start space-x-4">
            {/* Icon with pulse effect */}
            <div className={`
              flex-shrink-0 p-2 rounded-full animate-pulse-slow
              ${gradient ? 'bg-white/20' : 'bg-current/10'}
            `}>
              <Icon 
                name={getIconName()} 
                size={32} 
                className={`
                  ${gradient ? 'text-white' : 'text-current'}
                  drop-shadow-lg
                `}
              />
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              {title && (
                <h3 className={`
                  text-xl font-bold mb-2 
                  ${gradient ? 'text-white drop-shadow-md' : 'text-current'}
                `}>
                  {title}
                </h3>
              )}
              
              {message && (
                <p className={`
                  text-sm leading-relaxed
                  ${gradient ? 'text-white/90' : 'text-current/80'}
                `}>
                  {message}
                </p>
              )}
            </div>
            
            {/* Close button */}
            <button
              onClick={handleClose}
              className={`
                flex-shrink-0 p-1 rounded-full transition-all duration-200
                hover:scale-110 hover:rotate-90
                ${gradient ? 'text-white/70 hover:text-white hover:bg-white/20' : 'text-current/50 hover:text-current hover:bg-current/10'}
              `}
            >
              <Icon name="X" size={20} />
            </button>
          </div>
          
          {/* Action Buttons */}
          {(onConfirm || showCancel) && (
            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-current/20">
              {showCancel && (
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className={`
                    transition-all duration-200 hover:scale-105
                    ${gradient ? 'border-white/30 text-white hover:bg-white/20' : ''}
                  `}
                >
                  {cancelText}
                </Button>
              )}
              
              {onConfirm && (
                <Button
                  onClick={handleConfirm}
                  className={`
                    transition-all duration-200 hover:scale-105 shadow-lg
                    ${gradient ? 'bg-white/20 hover:bg-white/30 text-white border-white/30' : ''}
                  `}
                >
                  {confirmText}
                </Button>
              )}
            </div>
          )}
          
          {/* Progress bar for auto-close */}
          {autoClose && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-current/20 rounded-b-2xl overflow-hidden">
              <div 
                className="h-full bg-current/50 animate-progress"
                style={{ animationDuration: `${autoCloseDelay}ms` }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoolAlert;
