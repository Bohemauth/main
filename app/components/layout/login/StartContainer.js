export default function StartContainer({ children }) {
  return (
    <div className="flex flex-col h-screen w-screen">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative">{children}</div>
      </div>
    </div>
  );
}
