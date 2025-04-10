export default function Block({ title, description, icon }) {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col w-full gap-2 border border-[var(--foreground)] p-3 px-4 pb-5 r -mt-5 pt-5 rounded-lg text-xl">
        <div className="flex items-center gap-2 mb-5 bg-white text-black w-fit p-4 rounded-md">
          {icon}
        </div>
        <p className="text-2xl font-bold mb-2 xl:text-4xl">{title}</p>
        {description}
      </div>
    </div>
  );
}
