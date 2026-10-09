import Link from "next/link";

export function Cta() {
  return (
    <section className="relative overflow-hidden bg-ink text-ink-25">
      <div className="absolute inset-x-0 top-0 aspect-video bg-[radial-gradient(circle_farthest-side_at_50%_0,#753a88,#753a8800_33%)]">
        <video
          src="/videos/star-bg.mp4"
          poster="/images/star-bg-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(#2a222c00_36%,#2a222c)]" />
      </div>
      <div className="container-site relative z-10 flex flex-col items-center gap-5 py-[7.5rem] text-center">
        <h2 className="heading-display">
          AI forms and automation.
          <br />
          All in Typeform.
        </h2>
        <Link href="/forms" className="btn btn-light mt-1">
          Get started—it’s free
        </Link>
      </div>
    </section>
  );
}
