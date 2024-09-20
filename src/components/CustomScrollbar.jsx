import React from "react";

const CustomScrollbar = ({ children }) => {
  return (
    <div
      style={{
        overflowY: 'auto',
        overflowX: 'hidden',
        height: '100%',
        margin: 0,
        padding: 0,
        /* Webkit scrollbar styles */
        scrollbarWidth: 'thin', /* For Firefox */
        scrollbarColor: '#1d4ed8 #0f172a' /* For Firefox */
      }}
    >
      <style>
        {`
          ::-webkit-scrollbar {
            width: 8px;
          }
          
          ::-webkit-scrollbar-thumb {
            background-color: #1d4ed8;
            border: 2px solid #1e40af;
            border-radius: 10px;
          }
          
          ::-webkit-scrollbar-track {
            background: #0f172a;
          }
        `}
      </style>
      {children}
    </div>
  );
};

export default CustomScrollbar;
