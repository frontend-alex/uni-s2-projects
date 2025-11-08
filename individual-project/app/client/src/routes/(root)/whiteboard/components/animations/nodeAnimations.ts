export const nodeAnimations = {
  fadeIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3 },
  },
  slideIn: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 },
  },
  bounce: {
    initial: { scale: 0 },
    animate: { scale: 1 },
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 30,
    },
  },
  rotate: {
    initial: { rotate: 0 },
    animate: { rotate: 360 },
    transition: { duration: 0.5 },
  },
};

export const edgeAnimations = {
  draw: {
    strokeDasharray: '1000',
    strokeDashoffset: '1000',
    animation: 'draw 2s ease-in-out forwards',
  },
  pulse: {
    animation: 'pulse 2s ease-in-out infinite',
  },
};

