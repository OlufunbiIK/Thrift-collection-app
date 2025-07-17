// import React from "react";

// export default function Button({ children }) {
//   return (
//     <div className="mt-4 bg-black text-white py-1 px-4 rounded">{children}</div>
//   );
// }

export default function Button({
  children,
  variant = "primary",
  size = "md",
  onClick,
  type = "button",
  className = "",
}) {
  const baseClasses =
    "font-medium flex justify-center items-center rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary:
      "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 shadow-md hover:shadow-lg",
    secondary:
      "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500 shadow-md hover:shadow-lg",
    success:
      "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 shadow-md hover:shadow-lg",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}
