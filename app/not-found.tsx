"use client";
import { Button } from "@/components/ui/button";
import { Player } from "@lottiefiles/react-lottie-player";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // This ensures we only run this code client-side
  }, []);

  const handleBackHome = () => {
    if (isClient) {
      window.location.href = "/";
    }
  };
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
       <div>
        <Player
          autoplay
          loop
          className="not-found"
          src='/lottie/notFoundPage.json'
        />
      </div>
      <div className='p-6 rounded-lg flex justify-center items-center text-center'>
        <Button
          className='mt-4 ml-2'
          onClick={handleBackHome}
        >
          Back Home
        </Button>
      </div>
     
    </div>
  );
}
