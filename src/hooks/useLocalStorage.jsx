import { useState } from 'react';

export default function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = localStorage.getItem(key);
            console.log("useLocalStorage.jsx: item: ", item)
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.log(error);
            return initialValue;
        }
    });

    const setValue = (value) => {
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        }catch (error) {
            console.log(error);
        }
        setStoredValue(value);
    };

    return [storedValue, setValue];        
}