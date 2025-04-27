import { useState, useEffect } from "react";

function useScreenWidth() {
  const [screenWidth, setScreenWidth] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);

    // Set initial width
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return screenWidth;
}

export default useScreenWidth;
