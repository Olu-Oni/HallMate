import React, { createContext, useContext, useState } from "react";

// Create the context
export const NotificationContext = createContext();

// Create the provider component
export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  // Function to show a notification
  const showNotification = (message, type = "info", duration = 3000) => {
    setNotification({ message, type });

    // Automatically hide the notification after the specified duration
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  return (
    <NotificationContext.Provider value={{ notification, setNotification, showNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

// Notification component
export const Notification = () => {
    const { notification } = useContext(NotificationContext);
  
    if (!notification) console.log('yYYYYYYYYYYYYYYYYYYY');
    if (!notification) return null;
  
    // Define styles based on the notification type
    const notificationStyles = {
      info: "text-blue-500 ",
      success: "text-green-500 ",
      warning: "text-yellow-600 ",
      error: "text-red-500 ",
    };
    if (notification)
    return (
        <div className="fixed w-full top-16">

      <div
        className={`mx-auto text-center w-fit p-4 px-6 outline outline-1 rounded-md primaryBg transition-transform translate-y-4 shadow-lg ${
          notificationStyles[notification.type]
        }`}
      >
        {notification.message}
      </div>
        </div>
    );
  };
