const EbookShelfHolder = ({ className = "" }: { className?: string; }) => (
  <div className={`relative preserve-3d cube shadow-[5px_28px_30px_-8px] shadow-main2 h-6 z-0 ${className}`}>
    <div className="absolute top w-full h-40 border-x-2 border-t-2 border-background/60 bg-background2"></div>
    <div className="absolute front w-full h-6 md:h-2 bg-background2/60 border-x-2 border-t-2 border-background/60"></div>
  </div>
)

export { EbookShelfHolder };
