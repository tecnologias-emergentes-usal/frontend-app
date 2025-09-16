import { motion } from 'framer-motion';
import logoImage from '../assets/logo.png';
import Image from "next/image"; 

const rectangleVariants = {
  initial: { x: "0%" },
  animate: { x: "100%" },
};

export const LoadingScreen = () => {
  return (
    <motion.div
      className="fixed top-0 left-0 w-full h-full z-50"
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-full h-1/5 bg-primary/70 flex items-center justify-center`}
          initial="initial"
          animate="animate"
          custom={i}
          variants={rectangleVariants}
          transition={{
            delay: 0.1 * i,
            duration: 0.5,
            ease: "easeInOut",
          }}
          style={{ top: `${i * 20}%` }}
          
        >
          {i === 2 && (
            <Image
              src={logoImage}
              alt="USAL Alert Logo"
              className="h-32 w-32 object-contain"
            />
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}; 