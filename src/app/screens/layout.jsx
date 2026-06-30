export const viewport = {
  width: 440,
  initialScale: 1,
};

export default function ScreensLayout({ children }) {
  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-100 p-8">
      {children}
    </div>
  )
}
