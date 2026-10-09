"use client";

import Link from "next/link";
import { useRef, useState } from "react";

const TABS = [
  {
    label: "ASK",
    title: "Intelligent Forms",
    text: "Build forms that adapt to every respondent and then analyze your data for rich insights.",
    video: "/videos/intelligent-forms.mp4",
  },
  {
    label: "ACT",
    title: "Growth Flow",
    text: "Convert and keep customers with automated AI segmentation and follow-ups.",
    video: "/videos/growth-flow.mp4",
    isNew: true,
  },
  {
    label: "LEARN",
    title: "Research Flow",
    text: "Make confident business decisions fast with AI-moderated studies and automated reports.",
    video: "/videos/research-flow.mp4",
    isNew: true,
  },
];

export function Hero() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);

  const select = (index: number) => {
    setActive(index);
    setProgress(0);
    const video = videos.current[index];
    if (video) {
      video.currentTime = 0;
      void video.play();
    }
  };

  return (
    <section className="bg-ink pt-8 text-ink-25">
      <div className="container-site flex flex-col gap-12">
        <div className="flex flex-col items-center gap-5 text-center">
          <p className="eyebrow text-purple-400">AI forms &amp; automation</p>
          <h1 className="heading-display">
            Your favorite forms.
            <br />
            Now with AI automation.
          </h1>
          <p className="body-md max-w-[52rem]">
            Combine AI forms and automated workflows to drive revenue growth. Run in-depth research and manage the
            entire customer lifecycle. All in Typeform.
          </p>
          <Link href="/forms" className="btn btn-light mt-1">
            Get started—it’s free
          </Link>
        </div>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {TABS.map((tab, index) => {
              const isActive = index === active;
              return (
                <button
                  key={tab.title}
                  type="button"
                  onClick={() => select(index)}
                  className="group relative rounded-[calc(0.75rem+0.5px)] p-px text-left transition-all duration-300"
                  style={{
                    backgroundImage: isActive
                      ? "linear-gradient(110deg,#e47cff,#fffeff 50%,#e47cff)"
                      : "linear-gradient(135deg,#ffffff73,#2a222c00 50%,#ffffff73)",
                    boxShadow: isActive ? "0 0 30px #b96dd533" : undefined,
                  }}
                >
                  <div className="flex h-full flex-col gap-4 rounded-sm bg-ink p-6 shadow-[inset_-10px_-10px_20px_-10px_#ad9eb112,inset_10px_10px_20px_-9px_#251c27] transition-colors duration-300 group-hover:bg-[#2f2531]">
                    <div className="text-base">{tab.label}</div>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-2xl leading-[1.15]">
                        {tab.title}
                        {tab.isNew && (
                          <span className="tag-new">
                            <span>New</span>
                          </span>
                        )}
                      </div>
                      <p className="hidden text-base md:block">{tab.text}</p>
                    </div>
                    <div className={`mt-auto h-1 w-full overflow-hidden rounded-full bg-ink-900 ${isActive ? "" : "invisible"}`}>
                      <div
                        className="h-full w-full origin-left rounded-full bg-purple-500"
                        style={{ transform: `scaleX(${progress})` }}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="relative aspect-[2/1] w-full overflow-hidden rounded-md">
            {TABS.map((tab, index) => (
              <video
                key={tab.video}
                ref={(element) => {
                  videos.current[index] = element;
                }}
                src={tab.video}
                muted
                playsInline
                preload="auto"
                autoPlay={index === 0}
                onTimeUpdate={(event) => {
                  if (index !== active) return;
                  const video = event.currentTarget;
                  setProgress(video.duration ? video.currentTime / video.duration : 0);
                }}
                onEnded={() => select((index + 1) % TABS.length)}
                className={`absolute inset-0 h-full w-full object-fill transition-opacity duration-500 ${index === active ? "opacity-100" : "opacity-0"}`}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="bg-ink-25">
        <img src="/images/transition.png" alt="" className="block w-full" />
      </div>
    </section>
  );
}
