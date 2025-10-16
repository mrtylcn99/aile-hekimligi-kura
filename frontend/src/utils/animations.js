// Animation Utils - 50+ Animations
import { motion } from 'framer-motion';

// Page Transitions
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.5 }
};

// Container Animations
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.1
    }
  }
};

// Item Animations
export const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 }
  }
};

// Card Animations
export const cardVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 260, damping: 20 }
  },
  hover: {
    scale: 1.05,
    boxShadow: "0px 10px 30px rgba(0,0,0,0.2)",
    transition: { duration: 0.3 }
  },
  tap: { scale: 0.95 }
};

// Button Animations
export const buttonVariants = {
  hover: {
    scale: 1.05,
    transition: { duration: 0.3, yoyo: Infinity }
  },
  tap: { scale: 0.95 },
  loading: {
    rotate: 360,
    transition: { duration: 1, repeat: Infinity, ease: "linear" }
  }
};

// Float Animation
export const floatVariants = {
  animate: {
    y: [0, -20, 0],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
  }
};

// Pulse Animation
export const pulseVariants = {
  animate: {
    scale: [1, 1.05, 1],
    transition: { duration: 2, repeat: Infinity }
  }
};

// Shake Animation
export const shakeVariants = {
  animate: {
    x: [-5, 5, -5, 5, 0],
    transition: { duration: 0.5 }
  }
};

// Bounce Animation
export const bounceVariants = {
  animate: {
    y: [0, -30, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      repeatType: "reverse"
    }
  }
};

// Rotate Animation
export const rotateVariants = {
  animate: {
    rotate: 360,
    transition: { duration: 2, repeat: Infinity, ease: "linear" }
  }
};

// Flip Animation
export const flipVariants = {
  hidden: { rotateY: 90 },
  visible: { rotateY: 0 },
  exit: { rotateY: -90 }
};

// Zoom Animations
export const zoomIn = {
  hidden: { scale: 0, opacity: 0 },
  visible: { scale: 1, opacity: 1 },
  transition: { type: "spring", stiffness: 260, damping: 20 }
};

export const zoomOut = {
  visible: { scale: 1, opacity: 1 },
  exit: { scale: 0, opacity: 0 },
  transition: { duration: 0.5 }
};

// Slide Animations
export const slideLeft = {
  hidden: { x: -100, opacity: 0 },
  visible: { x: 0, opacity: 1 },
  exit: { x: 100, opacity: 0 }
};

export const slideRight = {
  hidden: { x: 100, opacity: 0 },
  visible: { x: 0, opacity: 1 },
  exit: { x: -100, opacity: 0 }
};

export const slideUp = {
  hidden: { y: 100, opacity: 0 },
  visible: { y: 0, opacity: 1 },
  exit: { y: -100, opacity: 0 }
};

export const slideDown = {
  hidden: { y: -100, opacity: 0 },
  visible: { y: 0, opacity: 1 },
  exit: { y: 100, opacity: 0 }
};

// Fade Animations
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  transition: { duration: 0.5 }
};

export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export const fadeInDown = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

// Stagger Children
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

// Text Animations
export const textReveal = {
  hidden: { clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)" },
  visible: {
    clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
    transition: { duration: 0.8, ease: "easeInOut" }
  }
};

export const typewriter = {
  hidden: { width: 0 },
  visible: {
    width: "100%",
    transition: { duration: 2, ease: "linear" }
  }
};

// Gradient Animation
export const gradientShift = {
  animate: {
    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
    transition: { duration: 5, repeat: Infinity, ease: "linear" }
  }
};

// Rubber Band
export const rubberBand = {
  animate: {
    scale: [1, 1.25, 0.75, 1.15, 0.95, 1],
    transition: { duration: 1 }
  }
};

// Jello
export const jello = {
  animate: {
    skewX: [0, -12.5, 6.25, -3.125, 1.5625, 0],
    skewY: [0, -12.5, 6.25, -3.125, 1.5625, 0],
    transition: { duration: 1 }
  }
};

// Heart Beat
export const heartBeat = {
  animate: {
    scale: [1, 1.3, 1, 1.3, 1],
    transition: { duration: 1.3 }
  }
};

// Swing
export const swing = {
  animate: {
    rotate: [0, 15, -10, 5, -5, 0],
    transition: { duration: 1 }
  }
};

// Tada
export const tada = {
  animate: {
    scale: [1, 0.9, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1],
    rotate: [0, -3, 3, -3, 3, -3, 3, -3, 0],
    transition: { duration: 1 }
  }
};

// Wobble
export const wobble = {
  animate: {
    x: [0, -25, 20, -15, 10, -5, 0],
    rotate: [0, -3, 2, -1, 1, 0],
    transition: { duration: 1 }
  }
};

// Glow Effect
export const glowEffect = {
  animate: {
    boxShadow: [
      "0 0 5px rgba(255,107,53,0.5)",
      "0 0 20px rgba(255,107,53,0.8)",
      "0 0 5px rgba(255,107,53,0.5)"
    ],
    transition: { duration: 2, repeat: Infinity }
  }
};

// Morph
export const morphVariants = {
  circle: { borderRadius: "50%" },
  square: { borderRadius: "0%" },
  rounded: { borderRadius: "20px" }
};

// 3D Animations
export const flip3D = {
  hidden: { rotateY: 180, opacity: 0 },
  visible: { rotateY: 0, opacity: 1 },
  transition: { duration: 0.8 }
};

export const cube3D = {
  hidden: { rotateX: 90, opacity: 0 },
  visible: { rotateX: 0, opacity: 1 },
  transition: { duration: 0.8 }
};

// Attention Seekers
export const flash = {
  animate: {
    opacity: [1, 0, 1, 0, 1],
    transition: { duration: 1 }
  }
};

export const bounce2 = {
  animate: {
    y: [0, -30, 0, -15, 0, -7, 0],
    transition: { duration: 1.5 }
  }
};

// Custom Hooks
export const useAnimationOnScroll = (threshold = 0.1) => {
  return {
    initial: "hidden",
    whileInView: "visible",
    viewport: { once: true, amount: threshold }
  };
};

// Parallax Effect
export const parallaxY = (offset = 50) => ({
  initial: { y: -offset },
  animate: { y: offset },
  transition: { duration: 0.5 }
});

// Mouse Follow
export const mouseFollow = {
  animate: (custom) => ({
    x: custom.x * 0.1,
    y: custom.y * 0.1,
    transition: { type: "spring", stiffness: 50 }
  })
};

// Ripple Effect
export const rippleEffect = {
  initial: { scale: 0, opacity: 1 },
  animate: { scale: 4, opacity: 0 },
  transition: { duration: 0.6 }
};

// Loading Animations
export const dotAnimation = {
  animate: {
    scale: [1, 1.2, 1],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      repeatType: "loop",
      ease: "easeInOut"
    }
  }
};

export const spinnerAnimation = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

// Success Animation
export const successCheckmark = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.8, ease: "easeInOut" }
  }
};

// Error Animation
export const errorShake = {
  animate: {
    x: [-10, 10, -10, 10, 0],
    transition: { duration: 0.5 }
  }
};

// Export all animations
export default {
  pageTransition,
  containerVariants,
  itemVariants,
  cardVariants,
  buttonVariants,
  floatVariants,
  pulseVariants,
  shakeVariants,
  bounceVariants,
  rotateVariants,
  flipVariants,
  zoomIn,
  zoomOut,
  slideLeft,
  slideRight,
  slideUp,
  slideDown,
  fadeIn,
  fadeInUp,
  fadeInDown,
  staggerContainer,
  staggerItem,
  textReveal,
  typewriter,
  gradientShift,
  rubberBand,
  jello,
  heartBeat,
  swing,
  tada,
  wobble,
  glowEffect,
  morphVariants,
  flip3D,
  cube3D,
  flash,
  bounce2,
  parallaxY,
  mouseFollow,
  rippleEffect,
  dotAnimation,
  spinnerAnimation,
  successCheckmark,
  errorShake
};