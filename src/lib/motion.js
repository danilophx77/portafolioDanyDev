export const easeOut = [0.22, 1, 0.36, 1];

export const sectionViewport = {
  once: true,
  amount: 0.2,
};

export const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.16,
      delayChildren: 0.14,
    },
  },
};

export const compactStagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

export const fadeUp = {
  hidden: {
    opacity: 0,
    y: 72,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.95,
      ease: easeOut,
    },
  },
  exit: {
    opacity: 0,
    y: 40,
    transition: {
      duration: 0.35,
      ease: easeOut,
    },
  },
};

export const fadeScale = {
  hidden: {
    opacity: 0,
    y: 56,
    scale: 0.88,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.85,
      ease: easeOut,
    },
  },
  exit: {
    opacity: 0,
    y: 28,
    scale: 0.92,
    transition: {
      duration: 0.28,
      ease: easeOut,
    },
  },
};

export const hoverLift = {
  y: -14,
  scale: 1.03,
  transition: {
    type: "spring",
    stiffness: 230,
    damping: 18,
  },
};

export const tapShrink = {
  scale: 0.95,
};
