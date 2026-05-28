import { useState, useEffect } from "react";

function useLocalStorage(key, initialValue) {

  // INITIAL VALUE
  const [storedValue, setStoredValue] =
    useState(() => {

      const savedData =
        localStorage.getItem(key);

      if (savedData) {
        return JSON.parse(savedData);
      }

      return initialValue;
    });


  // SAVE TO LOCALSTORAGE
  useEffect(() => {

    localStorage.setItem(
      key,
      JSON.stringify(storedValue)
    );

  }, [key, storedValue]);


  return [
    storedValue,
    setStoredValue
  ];
}

export default useLocalStorage;