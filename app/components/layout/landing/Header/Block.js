import Image from "next/image";

export default function Block({
  title,
  description,
  decision,
  opacity,
  image,
  size = 200,
}) {
  return (
    <div
      className="flex flex-col w-[350px]"
      style={{
        opacity: opacity,
      }}
    >
      <div className="flex w-full gap-2 items-center">
        <div className="border border-[var(--foreground)] border-t border-b-0 border-r-0 rounded-tl-lg w-2 h-2"></div>
        <p className="text-xl mb-2">{title}</p>
        <div className="border border-[var(--foreground)] border-t border-b-0 border-l-0 flex-1 rounded-tr-lg w-20 h-2"></div>
      </div>
      <div className="flex flex-col w-full gap-2 border border-[var(--foreground)] text-sm p-3 px-4 pb-5 rounded-br-lg rounded-bl-lg -mt-3 border-t-0">
        {image && (
          <div className="flex justify-center mb-2">
            <Image src={image} alt={title} width={size} height={size} />
          </div>
        )}
        {description}
        <div className="text-[var(--background)] w-full text-xs flex justify-end items-center">
          <div className="p-1 font-bold rounded-md px-2 bg-[var(--foreground)] opacity-70">
            {decision}
          </div>
        </div>
      </div>
    </div>
  );
}
