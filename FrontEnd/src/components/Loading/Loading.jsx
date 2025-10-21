import React from "react";
import "./Loading.scss";
import { motion } from "framer-motion";

const Loading = ({ message = "Đang tải dữ liệu..." }) => {
  return (
    <div className="loading-overlay">
      <motion.div
        className="loading-card"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          className="loading-spinner"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
        />

        <motion.div
          className="loading-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {message}
        </motion.div>

        <motion.div
          className="loading-bar"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{
            repeat: Infinity,
            repeatType: "mirror",
            duration: 1.6,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </div>
  );
};

export default Loading;
