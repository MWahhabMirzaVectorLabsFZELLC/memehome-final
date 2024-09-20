// src/components/TransitionComponent.jsx

import React from 'react';
import { motion } from 'framer-motion';

const TransitionComponent = ({ children, initialX = 100, exitX = -100, duration = 0.2 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: initialX }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: exitX }}
      transition={{ duration }}
    >
      {children}
    </motion.div>
  );
};

export default TransitionComponent;
