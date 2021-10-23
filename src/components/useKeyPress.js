import { useState, useEffect } from "react";

export default function useKeyPress(targetKey) {
  const [keyPressed, setKeyPressed] = useState(false);
  function enterDownHandler({ key }) {
    if (key === targetKey) {
      setKeyPressed(true);
    }
  }
  const enterUpHandler = ({ key }) => {
    if (key === targetKey) {
      setKeyPressed(false);
    }
  };
  useEffect(() => {
    window.addEventListener("keydown", enterDownHandler);
    window.addEventListener("keyup", enterUpHandler);
    return () => {
      window.removeEventListener("keydown", enterDownHandler);
      window.removeEventListener("keyup", enterUpHandler);
    };
  }, []); 
  return keyPressed;
}