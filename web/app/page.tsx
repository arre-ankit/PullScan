"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { CrouselCard } from "@/components/CrouselCard";
import { PricingDemo } from "@/components/Pricing";


export default function Home() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroll = scrollRef.current;
    if (!scroll) return;

    let animationFrameId: number;
    let position = 0;

    const animate = () => {
      // Reduced speed from 0.5 to 0.15 for slower scrolling
      position -= 0.02;
      if (position <= -50) position = 0;
      if (scroll) scroll.style.transform = `translateX(${position}%)`;
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <main>
      <section className="flex flex-col items-center justify-center h-[55vh] md:h-[65vh] overflow-hidden relative">
        <div className="flex flex-col items-center space-y-4 md:space-y-6 w-full px-6 md:px-0">
          <div className="max-w-6xl">
            <h1 className="text-3xl md:text-6xl font-semibold text-center">
              <div className="tracking-tight">
                <div className="block">
                  <div className="md:text-5xl leading-tight">
                    Know about a {" "}
                    <span className="bg-gradient-to-r from-orange-500 via-orange-300 to-orange-500 text-transparent bg-clip-text">
                      Codebase
                    </span>{" "}
                    with<br />
                    <span className="bg-gradient-to-r from-orange-500 via-orange-300 to-orange-500 text-transparent bg-clip-text">
                    Pull Request,Commit Summaries & Chat
                    </span>
                  </div>
                </div>
              </div>
            </h1>
          </div>
          
          <p className="max-w-2xl mx-auto text-sm font-light text-center md:text-lg w-[90%]">
          AI-Powered  {" "}
            <span className="bg-gradient-to-r from-orange-500 via-orange-300 to-orange-500 text-transparent bg-clip-text font-medium">
            PR & Commit Summaries {" "}
            </span>
            to Understand Any Codebase Instantly with {" "}
            <span className="bg-gradient-to-r from-orange-500 via-orange-300 to-orange-500 text-transparent bg-clip-text font-medium">
            RAG Chat for Smarter Answers.
            </span>
          </p>

          <a 
            href="/create" 
            rel="noopener noreferrer"
            className="w-[90%] max-w-md md:w-auto"
          >
            <Button 
              className="w-full md:w-auto px-6 py-3.5 text-base font-medium rounded-full bg-gradient-to-b from-[#7A1000] to-[#FE9D00] hover:from-[#a09292] hover:to-[#b3822e] shadow-[0px_0px_12px_#A92000] relative"
            >
              <div className="absolute inset-0">
                <div className="rounded-full absolute inset-0 border border-white/20 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
                <div className="rounded-full absolute inset-0 border border-white/40 [mask-image:linear-gradient(to_top,black,transparent)]" />
                <div className="absolute inset-0 shadow-[0_0_10px_rgba(169,32,0,0.7)_inset] rounded-full" />
              </div>
              <span className="relative">TRY NOW</span>
            </Button>
          </a>
        </div>
      </section>
  
      <section className="mt-4 md:flex md:mt-0 items-center hidden justify-center">
        <div className="w-[50%] md:w-[80%] items-center flex justify-center">
          <div className="flex flex-col items-center gap-3 md:gap-5 p-24 md:p-6 border rounded-xl border-white/20">
            <div className="flex flex-col gap-3 md:gap-5 md:flex-row">
              <div className="relative border rounded-xl border-white/20">
                <Image
                  src="/hero.png"
                  alt={`Marketing Image`}
                  className="flex md:py-10 md:px-10 overflow-hidden md:bg-gradient-to-b from-[#7A1000] to-[#FE9D00] md:rounded-lg md:[mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]"
                  width={200000000000}
                  height={20000000000}
                  />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-4 px-12 md:py-64 md:px-48 flex justify-center items-center">
        <CrouselCard />
      </section>

      <section className="py-4 px-12 md:py-1 md:px-48 flex justify-center items-center">
        <PricingDemo/>
      </section>
    </main>
  );
}