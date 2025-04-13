import React from "react"

type Props = {
  isLoading: boolean
  children: React.ReactNode
  className?: string
  type?: "button" | "submit" | "reset"
  onClick?: () => void
  disabled?: boolean
}

const LoadingButton = ({
  isLoading,
  children,
  className = "",
  type = "button",
  onClick,
  disabled = false,
}: Props) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded transition-colors bg-[#00B7A3] text-white ${
        isLoading ? "opacity-60 cursor-not-allowed" : "hover:bg-[#00998B]"
      } ${className}`}
      disabled={isLoading || disabled}
    >
      {isLoading && (
        <svg
          className="animate-spin h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  )
}

export default LoadingButton
