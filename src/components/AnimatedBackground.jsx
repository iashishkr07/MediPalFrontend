import React from "react";
import { motion } from "framer-motion";

const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-black">
      <motion.div
        className="absolute top-[-50px] left-[-50px] w-[200px] h-[200px] bg-purple-500 rounded-full filter blur-3xl opacity-50"
        animate={{
          x: [0, 100, 0, -100, 0],
          y: [0, -50, 100, 50, 0],
          scale: [1, 1.2, 1, 0.8, 1],
        }}
        transition={{
          duration: 20,
          ease: "linear",
          repeat: Infinity,
        }}
      />
      <motion.div
        className="absolute bottom-[-50px] right-[-50px] w-[300px] h-[300px] bg-blue-500 rounded-full filter blur-3xl opacity-30"
        animate={{
          x: [0, -150, 0, 150, 0],
          y: [0, 50, -100, -50, 0],
          scale: [1, 0.9, 1, 1.1, 1],
        }}
        transition={{
          duration: 25,
          ease: "linear",
          repeat: Infinity,
          delay: 5,
        }}
      />
      <motion.div
        className="absolute top-[10%] right-[10%] w-[150px] h-[150px] bg-green-500 rounded-full filter blur-3xl opacity-40"
        animate={{
          x: [0, 50, -50, 0],
          y: [0, -80, 80, 0],
          rotate: [0, 90, -90, 0],
        }}
        transition={{
          duration: 30,
          ease: "linear",
          repeat: Infinity,
          delay: 10,
        }}
      />
    </div>
  );
};

export default AnimatedBackground;
