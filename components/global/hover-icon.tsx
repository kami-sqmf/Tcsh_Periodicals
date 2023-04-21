import { IconType } from "react-icons";

export const HoverICON = ({ Icon, IconHover, size, duration = "500", className, classNameICON }: { Icon: IconType; IconHover: IconType; size: number; duration?: "300" | "500"; className: string; classNameICON?: string }) => {
  return (
    <div className={`relative h-${size} w-${size} ${className}`}>
      <Icon className={`absolute h-${size} w-${size} ${classNameICON} opacity-100 group-hover:opacity-0 transition-all ${duration === "300" ? "duration-300" : "duration-500"}`} />
      <IconHover className={`absolute h-${size} w-${size} ${classNameICON} opacity-0 group-hover:opacity-100 transition-all ${duration === "300" ? "duration-300" : "duration-500"}`} />
    </div>
  )
}