// NotificationService - Handles actual notification delivery
class NotificationService {
  constructor() {
    this.emailQueue = [];
    this.smsQueue = [];
    this.pushQueue = [];
    this.isProcessing = false;
  }

  // Email notification methods
  async sendEmail(to, subject, content, options = {}) {
    try {
      console.log('📧 Sending Email:', { to, subject, content, options });
      
      // In a real application, you would integrate with an email service like:
      // - SendGrid
      // - AWS SES
      // - Nodemailer
      // - Mailgun
      
      // Simulate email sending
      await this.simulateDelay(1000);
      
      const emailData = {
        id: this.generateId(),
        type: 'email',
        to,
        subject,
        content,
        status: 'sent',
        timestamp: new Date().toISOString(),
        ...options
      };

      // Add to email queue for tracking
      this.emailQueue.push(emailData);
      
      // Show browser notification if enabled
      if (options.showBrowserNotification !== false) {
        this.showBrowserNotification(`Email sent to ${to}`, subject);
      }
      
      return { success: true, data: emailData };
    } catch (error) {
      console.error('Email sending failed:', error);
      return { success: false, error: error.message };
    }
  }

  // SMS notification methods
  async sendSMS(to, message, options = {}) {
    try {
      console.log('📱 Sending SMS:', { to, message, options });
      
      // In a real application, you would integrate with an SMS service like:
      // - Twilio
      // - AWS SNS
      // - TextLocal
      // - MSG91
      
      // Simulate SMS sending
      await this.simulateDelay(800);
      
      const smsData = {
        id: this.generateId(),
        type: 'sms',
        to,
        message,
        status: 'sent',
        timestamp: new Date().toISOString(),
        ...options
      };

      // Add to SMS queue for tracking
      this.smsQueue.push(smsData);
      
      // Show browser notification if enabled
      if (options.showBrowserNotification !== false) {
        this.showBrowserNotification(`SMS sent to ${to}`, message);
      }
      
      return { success: true, data: smsData };
    } catch (error) {
      console.error('SMS sending failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Push notification methods
  async sendPushNotification(title, body, options = {}) {
    try {
      console.log('🔔 Sending Push Notification:', { title, body, options });
      
      // Check if browser supports notifications
      if (!('Notification' in window)) {
        throw new Error('This browser does not support notifications');
      }

      // Request permission if not granted
      if (Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          throw new Error('Notification permission denied');
        }
      }

      if (Notification.permission === 'granted') {
        const notification = new Notification(title, {
          body,
          icon: options.icon || '/favicon.ico',
          badge: options.badge || '/favicon.ico',
          tag: options.tag || 'dashboard-notification',
          requireInteraction: options.requireInteraction || false,
          silent: options.silent || false,
          ...options
        });

        // Handle notification click
        notification.onclick = () => {
          window.focus();
          if (options.onClick) {
            options.onClick();
          }
          notification.close();
        };

        // Auto close after specified time
        if (options.autoClose !== false) {
          setTimeout(() => {
            notification.close();
          }, options.duration || 5000);
        }

        const pushData = {
          id: this.generateId(),
          type: 'push',
          title,
          body,
          status: 'sent',
          timestamp: new Date().toISOString(),
          ...options
        };

        this.pushQueue.push(pushData);
        return { success: true, data: pushData };
      } else {
        throw new Error('Notification permission not granted');
      }
    } catch (error) {
      console.error('Push notification failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Browser notification (fallback)
  showBrowserNotification(title, body, options = {}) {
    if ('Notification' in window && Notification.permission === 'granted') {
      return this.sendPushNotification(title, body, {
        ...options,
        autoClose: true,
        duration: 3000
      });
    }
  }

  // Test notification methods
  async sendTestEmail(userEmail = 'admin@dashboard.org') {
    return await this.sendEmail(
      userEmail,
      'Test Email Notification',
      'This is a test email notification from your dashboard. If you received this, email notifications are working correctly!',
      { priority: 'normal', category: 'test' }
    );
  }

  async sendTestSMS(phoneNumber = '+91 9876543210') {
    return await this.sendSMS(
      phoneNumber,
      'Test SMS from Dashboard: SMS notifications are working correctly!',
      { priority: 'normal', category: 'test' }
    );
  }

  async sendTestPush() {
    return await this.sendPushNotification(
      'Test Push Notification',
      'This is a test push notification from your dashboard. Push notifications are working correctly!',
      { 
        icon: '/favicon.ico',
        category: 'test',
        requireInteraction: false
      }
    );
  }

  // Batch notification methods
  async sendBatchEmails(emails) {
    const results = [];
    for (const email of emails) {
      const result = await this.sendEmail(email.to, email.subject, email.content, email.options);
      results.push(result);
    }
    return results;
  }

  async sendBatchSMS(messages) {
    const results = [];
    for (const message of messages) {
      const result = await this.sendSMS(message.to, message.message, message.options);
      results.push(result);
    }
    return results;
  }

  // Queue management
  getEmailQueue() {
    return this.emailQueue;
  }

  getSMSQueue() {
    return this.smsQueue;
  }

  getPushQueue() {
    return this.pushQueue;
  }

  clearQueues() {
    this.emailQueue = [];
    this.smsQueue = [];
    this.pushQueue = [];
  }

  // Utility methods
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  async simulateDelay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Get notification statistics
  getStats() {
    return {
      emailsSent: this.emailQueue.length,
      smsSent: this.smsQueue.length,
      pushSent: this.pushQueue.length,
      totalSent: this.emailQueue.length + this.smsQueue.length + this.pushQueue.length
    };
  }

  // Format notification content based on type
  formatNotificationContent(type, data) {
    const templates = {
      newMember: {
        email: {
          subject: 'New Member Registration',
          content: `A new member ${data.name} has joined the organization. Welcome them to the community!`
        },
        sms: `New member alert: ${data.name} has joined the organization.`,
        push: {
          title: 'New Member',
          body: `${data.name} has joined the organization`
        }
      },
      eventReminder: {
        email: {
          subject: `Event Reminder: ${data.eventName}`,
          content: `Don't forget about the upcoming event "${data.eventName}" scheduled for ${data.date} at ${data.time}.`
        },
        sms: `Event reminder: ${data.eventName} on ${data.date} at ${data.time}`,
        push: {
          title: 'Event Reminder',
          body: `${data.eventName} - ${data.date} at ${data.time}`
        }
      },
      systemAlert: {
        email: {
          subject: 'System Alert',
          content: data.message
        },
        sms: `System Alert: ${data.message}`,
        push: {
          title: 'System Alert',
          body: data.message
        }
      }
    };

    return templates[type] || {
      email: { subject: 'Notification', content: data.message },
      sms: data.message,
      push: { title: 'Notification', body: data.message }
    };
  }
}

// Create singleton instance
const notificationService = new NotificationService();

export default notificationService;
