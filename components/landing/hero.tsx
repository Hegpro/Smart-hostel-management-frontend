// import Link from "next/link"

// export default function Hero() {
//   return (
//     <section className="relative overflow-hidden">
//       <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10 -z-10" />

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
//         <div className="grid md:grid-cols-2 gap-12 items-center">
//           <div className="space-y-6">
//             <div className="space-y-4">
//               <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground text-balance">
//                 Smart Hostel Management & Food Surplus Distribution
//               </h1>
//               <p className="text-lg text-muted-foreground">
//                 Streamline hostel operations, reduce food waste, and connect with communities in need through our
//                 integrated platform.
//               </p>
//             </div>

//             <div className="flex gap-4 flex-wrap">
//               <Link
//                 href="/login"
//                 className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition shadow-lg hover:shadow-xl transform hover:scale-105"
//               >
//                 Login
//               </Link>
//               <Link
//                 href="/signup"
//                 className="px-6 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition"
//               >
//                 Sign Up
//               </Link>
//             </div>
//           </div>

//           <div className="relative h-96 hidden md:flex items-center justify-center">
//             <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-2xl blur-3xl opacity-20" />
//             <div className="relative w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl border border-primary/30 flex items-center justify-center">
//               <div className="text-center space-y-4">
//                 <div className="text-5xl">🏠</div>
//                 <p className="text-lg font-semibold text-foreground">Hostel Management</p>
//                 <p className="text-sm text-muted-foreground">& Food Surplus</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }
"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function Hero() {
  const images = [
    "/images/hostel1.jpeg",
    "/images/hostel2.jpeg",
    "/images/hostel3.jpeg",
  ];

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const next = () => setIndex((i) => (i + 1) % images.length);
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const goTo = (i: number) => setIndex(i % images.length);

  // Autoplay
  useEffect(() => {
    if (paused) return;

    intervalRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [paused, images.length]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 -z-10" />

      <div
        className="
          max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 
          py-24 sm:py-32 
          rounded-xl 
          bg-[url('/images/all.jpg')] 
          bg-cover bg-center bg-no-repeat
        "
      >
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* LEFT TEXT */}
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
              Smart Hostel Management & Food Surplus Distribution
            </h1>

            <p className="text-lg text-white/90">
              Streamline hostel operations, reduce food waste, and connect with
              communities in need through our integrated platform.
            </p>

            <div className="flex gap-4 flex-wrap">
              <Link
                href="/login"
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition shadow-lg"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="px-6 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition"
              >
                Sign Up
              </Link>
            </div>
          </div>

          {/* RIGHT SLIDER */}
          <div className="relative h-96 hidden md:flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-3xl blur-3xl opacity-50" />

            <div
              className="relative w-full h-full bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-4 overflow-hidden"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              <div className="w-full h-full relative rounded-2xl overflow-hidden">
                <Image
                  src={images[index]}
                  alt={`Slide ${index + 1}`}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  style={{ objectFit: "cover" }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
