

import LogoJPG from "@/public/logo/logo.jpg";
import Image from "next/image";
import Link from "next/link";

const LogoPNG = ({ className, ring = false }: { className: string; ring?: boolean }) => (
  <Link href={`/`} className={`relative ${className} overflow-hidden ${ring ? "ring-1 ring-main md:ring-0" : ""} cursor-pointer`}>
    <Image className="object-cover" src={LogoJPG} priority={true} fill={true} alt="慈中後生 Logo" sizes="(max-width: 1024px) 272px, (max-width: 768px) 188vw, 268vw" />
  </Link>
)

export default LogoPNG
