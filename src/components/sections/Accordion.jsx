import { useState } from 'react'

// Generic accordion. `items`: [{ title, body }] — body can be string or JSX.
// `variant` switches the corner-radius theme:
//   - 'card' (default): rounded-2xl, h6 title — used in product/feature accordions
//   - 'faq': rounded-lg, bold span title — used in FAQ blocks
// `defaultOpen` index, -1 to start collapsed.
export default function Accordion({ items, variant = 'card', defaultOpen = 0 }) {
  const [openIndex, setOpenIndex] = useState(defaultOpen)
  const isFaq = variant === 'faq'
  const containerCls = isFaq ? 'bg-surface rounded-lg common_accordion' : 'bg-surface rounded-2xl common_accordion'

  return (
    <div className="accordion-wrapper grid gap-4">
      {items.map((item, idx) => {
        const open = idx === openIndex
        return (
          <div key={idx} className={`${containerCls}${open ? ' active' : ''}`}>
            <button
              type="button"
              onClick={() => setOpenIndex(open ? -1 : idx)}
              className="w-full flex p-spacing-3xl justify-between items-center text-left common_accordion_title cursor-pointer"
            >
              {isFaq ? (
                <span className="font-bold">{item.title}</span>
              ) : (
                <h6 className="m-0 pr-spacing-3xl">{item.title}</h6>
              )}
              <div className="accordion-arrow w-[24px] h-[24px] flex items-center justify-center cursor-pointer transition">
                <i className={`arrow-down fa-solid fa-angle-${open ? 'up' : 'down'} text-base`} />
              </div>
            </button>
            {open && (
              <div
                className={`common_accordion_dec item-listing px-spacing-3xl pb-spacing-3xl${
                  isFaq ? ' leading-relaxed text-justify' : ' leading-relaxed'
                }`}
              >
                {typeof item.body === 'string' ? <p>{item.body}</p> : item.body}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
