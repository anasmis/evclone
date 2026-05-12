import { useState } from 'react'

// Numbered vertical step list with click-to-open active state.
// `items`: [{ title, body }]. Used in installation/process sections.
export default function StepsList({ items, defaultActive = 0 }) {
  const [active, setActive] = useState(defaultActive)
  return (
    <div className="oip_steps rounded-2xl bg-white">
      {items.map((step, idx) => (
        <div key={idx} className={`oip_step flex relative gap-4${idx === active ? ' active' : ''}`}>
          <div className="step-number">{idx + 1}</div>
          <div className="step-content">
            <h6 className="cursor-pointer" onClick={() => setActive(idx)}>
              {step.title}
              <div className="md:hidden accordion-arrow top-0 w-[24px] h-[24px] flex items-center justify-center cursor-pointer absolute right-0 mt-2">
                <i className={`arrow-down fa-solid fa-angle-${idx === active ? 'up' : 'down'} text-base`} />
              </div>
            </h6>
            <div className="step_content_dec" style={{ display: idx === active ? 'block' : undefined }}>
              {typeof step.body === 'string' ? <p>{step.body}</p> : step.body}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
