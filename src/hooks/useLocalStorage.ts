"use client";

import { useState, useEffect, useCallback } from 'react';

// A global flag to ensure we only try to access localStorage on the client side.
let isClient = false;
if (typeof window !== 'undefined') {
  isClient = true;
}

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (!isClient) {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      if (!isClient) {
        console.warn(`Tried to set localStorage key “${key}” from server-side.`);
        // Update state for SSR consistency, but don't persist
        setStoredValue(value instanceof Function ? value(storedValue) : value);
        return;
      }
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.warn(`Error setting localStorage key “${key}”:`, error);
      }
    },
    [key, storedValue]
  );
  
  // This effect ensures that the state is updated on the client
  // after initial hydration if the localStorage value differs from initialValue.
  useEffect(() => {
    if (isClient) {
      try {
        const item = window.localStorage.getItem(key);
        if (item) {
          setStoredValue(JSON.parse(item));
        }
      } catch (error) {
        console.warn(`Error syncing localStorage key “${key}”:`, error);
      }
    }
  }, [key]);


  return [storedValue, setValue];
}

export default useLocalStorage;
