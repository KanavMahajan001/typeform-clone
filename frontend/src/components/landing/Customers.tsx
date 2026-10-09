"use client";

import { useEffect, useState } from "react";

const ROWS = [
  ["calendly", "citizenm", "loccitane", "wetransfer", "slack"],
  ["webflow", "zapier", "barrys", "hubspot", "hermes"],
];

export function Customers() {
  const [row, setRow] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setRow((current) => (current + 1) % ROWS.length), 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-ink-25 pb-12 pt-20 text-ink">
      <div className="container-site flex flex-col items-center gap-8">
        <h2 className="heading-three max-w-[26.5em] text-center">
          Join 150,000+ businesses driving revenue with Typeform
        </h2>
        <div className="relative h-20 w-full max-w-[66rem]">
          {ROWS.map((logos, index) => (
            <div
              key={index}
              className={`absolute inset-0 grid grid-cols-3 gap-3 transition-opacity duration-700 sm:grid-cols-5 ${index === row ? "opacity-100" : "opacity-0"}`}
            >
              {logos.map((logo) => (
                <div key={logo} className="flex h-20 items-center justify-center rounded-media bg-white p-4">
                  <img src={`/logos/${logo}.svg`} alt={logo} className="max-h-[1.8875rem] w-full max-w-[85%] object-contain" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
