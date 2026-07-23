import { motion, useReducedMotion } from 'framer-motion'

const VARIANTS = {
  fadeUp: {
    hidden: { opacity: 0, y: 48 },
    visible: { opacity: 1, y: 0 },
  },
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slideLeft: {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
  },
  slideRight: {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
  },
}

export default function AnimatedSection({
  as = 'section',
  variant = 'fadeUp',
  delay = 0,
  duration = 1.6,
  amount = 0.15,
  once = true,
  children,
  ...rest
}) {
  const reduceMotion = useReducedMotion()
  const MotionTag = motion[as] || motion.section
  const selected = VARIANTS[variant] || VARIANTS.fadeUp

  const variants = reduceMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : selected

  return (
    <MotionTag
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={variants}
      transition={{
        duration: reduceMotion ? 0.2 : duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}
