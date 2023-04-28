import Image from "next/image";

const EbookBookCover = ({ className = "", thumbnail, thumbnail_blur, title, size }: { className?: string; thumbnail: string; thumbnail_blur: string; title: string; size: "big" | "small"; }) => {
  return (<div className={`${className} book-container`}>
    <div className={`book relative w-auto ${size === "big" ? "h-[320px] before:h-[318px] after:h-[320px] book_animation" : "h-[220px] before:h-[218px] after:h-[220px] book-small-transform first:!shadow-none after:!shadow-none"} aspect-[14.8/21] after:w-auto after:aspect-[14.8/21] after:bg-main before:text-main`}>
      <Image priority={size === "big"} src={thumbnail}
        blurDataURL={thumbnail_blur} placeholder="blur" 
        fill={true} className='object-contain z-20 shadow-main2' alt={title} />
    </div>
  </div>)
}

export { EbookBookCover };
