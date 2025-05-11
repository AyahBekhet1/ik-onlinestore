"use client";
import { Button } from "@/components/ui/button";
import { Player } from "@lottiefiles/react-lottie-player";

export default function NotFound() {
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
       <div>
        <Player
          autoplay
          loop
          className="not-found"
          src='/lottie/notFoundPage.json'
          // style={{ height: "450px", width: "450px" }}
        />
      </div>
      <div className='p-6 rounded-lg flex justify-center items-center text-center'>
        <Button
          className='mt-4 ml-2'
          onClick={() => (window.location.href = "/")}
        >
          Back Home
        </Button>
      </div>
     
    </div>
  );
}
