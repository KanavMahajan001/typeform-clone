interface Feature {
  icon: string;
  title: string;
  text: string;
}

interface Props {
  eyebrow: string;
  title: string;
  text: string;
  cta: string;
  video: string;
  poster: string;
  features: Feature[];
  isNew?: boolean;
  dark?: boolean;
  mediaLeft?: boolean;
}

export function TextMedia({ eyebrow, title, text, cta, video, poster, features, isNew, dark, mediaLeft }: Props) {
  return (
    <section className={`py-[7.5rem] ${dark ? "bg-ink text-ink-25" : "bg-ink-25 text-ink"}`}>
      <div className="container-10 flex flex-col gap-12">
        <div className={`flex flex-col items-center justify-between gap-8 lg:flex-row ${mediaLeft ? "lg:flex-row-reverse" : ""}`}>
          <div className="flex w-full max-w-[29.69rem] flex-col gap-10 lg:w-2/5">
            <div className="flex flex-col gap-8">
              <div className="flex items-center gap-2">
                <p className={`eyebrow ${dark ? "text-purple-300" : "text-purple-600"}`}>{eyebrow}</p>
                {isNew && (
                  <span className="tag-new">
                    <span>New</span>
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-4">
                <h2 className="heading-three">{title}</h2>
                <p className="body-md">{text}</p>
              </div>
            </div>
            <div>
              <a href="#" className={`btn ${dark ? "btn-light" : "btn-dark"}`}>
                {cta}
              </a>
            </div>
          </div>
          <div className="relative w-full max-w-[42.31rem] overflow-hidden rounded-media lg:w-[57%]">
            <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover p-px" />
            <video src={video} autoPlay muted loop playsInline className="relative block aspect-[1920/1346] w-full object-cover" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="flex gap-4">
              <div className="icon-glow">
                <span>
                  <img src={`/icons/${feature.icon}.svg`} alt="" className="h-6 w-6" />
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-medium leading-[1.15]">{feature.title}</h3>
                <p className="text-base leading-[1.3]">{feature.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
