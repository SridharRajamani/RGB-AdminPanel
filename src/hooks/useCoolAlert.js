import { useCallback } from 'react';
import { useCoolAlertContext } from '../components/ui/CoolAlertProvider';

const useCoolAlert = () => {
  const { showAlert, closeAlert } = useCoolAlertContext();

  const closeAllAlerts = useCallback(() => {
    // This would need to be implemented in the context if needed
    console.log('closeAllAlerts not implemented yet');
  }, []);

  // Predefined alert types for easy use
  const success = useCallback((title, message, options = {}) => {
    return showAlert({
      type: 'success',
      title,
      message,
      animation: 'bounce',
      sound: true,
      ...options
    });
  }, [showAlert]);

  const error = useCallback((title, message, options = {}) => {
    return showAlert({
      type: 'error',
      title,
      message,
      animation: 'shake',
      sound: true,
      ...options
    });
  }, [showAlert]);

  const warning = useCallback((title, message, options = {}) => {
    return showAlert({
      type: 'warning',
      title,
      message,
      animation: 'slide',
      sound: true,
      ...options
    });
  }, [showAlert]);

  const info = useCallback((title, message, options = {}) => {
    return showAlert({
      type: 'info',
      title,
      message,
      animation: 'fade',
      sound: false,
      ...options
    });
  }, [showAlert]);

  const confirm = useCallback((title, message, options = {}) => {
    return new Promise((resolve) => {
      showAlert({
        type: 'info',
        title,
        message,
        showCancel: true,
        animation: 'zoom',
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false),
        ...options
      });
    });
  }, [showAlert]);

  // Special effects
  const celebration = useCallback((title, message, options = {}) => {
    return showAlert({
      type: 'success',
      title,
      message,
      animation: 'flip',
      gradient: true,
      sound: true,
      autoClose: true,
      autoCloseDelay: 4000,
      ...options
    });
  }, [showAlert]);

  const urgent = useCallback((title, message, options = {}) => {
    return showAlert({
      type: 'error',
      title,
      message,
      animation: 'shake',
      gradient: true,
      sound: true,
      size: 'large',
      ...options
    });
  }, [showAlert]);

  const notification = useCallback((title, message, options = {}) => {
    return showAlert({
      type: 'info',
      title,
      message,
      animation: 'slide',
      autoClose: true,
      autoCloseDelay: 3000,
      size: 'small',
      ...options
    });
  }, [showAlert]);

  return {
    showAlert,
    closeAlert,
    closeAllAlerts,
    // Predefined types
    success,
    error,
    warning,
    info,
    confirm,
    // Special effects
    celebration,
    urgent,
    notification
  };
};

export default useCoolAlert;
