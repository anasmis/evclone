// Infinite horizontal scroll of brand logos using a CSS keyframe animation.
// Logos are duplicated so the loop has no visible seam.
// `direction` reverses the marquee for the second row.
export default function BrandsMarquee({ logos, direction = 'left', speed = 40 }) {
  const items = [...logos, ...logos] // duplicate for seamless loop

  return (
    <div className="brands-marquee relative overflow-hidden w-full">
      <div
        className="brands-marquee-track flex items-center gap-spacing-6xl"
        style={{
          animation: `brands-marquee-scroll ${speed}s linear infinite`,
          animationDirection: direction === 'right' ? 'reverse' : 'normal',
          width: 'max-content',
        }}
      >
        {items.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            aria-hidden="true"
            className="h-10 md:h-12 w-auto object-contain shrink-0 grayscale opacity-80 hover:opacity-100 hover:grayscale-0 transition"
            loading="lazy"
          />
        ))}
      </div>

      <style>{`
        @keyframes brands-marquee-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .brands-marquee:hover .brands-marquee-track { animation-play-state: paused; }
      `}</style>
    </div>
  )
}
