const Input = ({ className = "", ...props }) => {
  return (
    <input
      className={`w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 outline-none ${className}`}
      {...props}
    />
  );
};

export default Input;