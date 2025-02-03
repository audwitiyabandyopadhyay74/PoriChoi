import React from "react";
import { motion, useScroll } from "motion/react";

const ScrollProgressbar = () => {
  const scrollYProgress = useScroll().scrollYProgress;

  return (
    <motion.div
      className="w-full lg:h-24 h-1  mt-[]  bg-[#ff5c00] transition-none"
      style={{ scaleX: scrollYProgress, position: "fixed" }}
    ></motion.div>
  );
};

export default ScrollProgressbar;
