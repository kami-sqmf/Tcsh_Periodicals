import Link from "next/link";
import { IconType } from "react-icons";
import { RiArrowRightSLine } from "react-icons/ri";

export const Breadcrumb = ({ args }: { args: Breadcrumb[] }) => {
    return (
        <div className='mt-4 flex flex-row items-center text-main space-x-2 w-full overflow-hidden'>
            {args.map((arg, key) => (
                <div key={key} className="flex flex-row items-center space-x-2">
                    <RiArrowRightSLine className='h-4 w-4 md:h-5 md:w-5' />
                    <Link href={arg.href}>
                        <div className={`flex flex-row items-center space-x-2  ${key == args.length - 1 ? "" : "cursor-pointer" }`}>
                            <arg.icon className='h-5 w-5 md:h-6 md:w-6' />
                            <span className={`text-base md:text-lg font-medium w-max ${key == args.length - 1 ? "" : "hover:text-main2" }`}>{arg.title}</span>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    )
}

export type Breadcrumb = {
    title: string;
    href: string;
    icon: IconType;
}

{/* <RiGroup2Line className='h-5 w-5 md:h-6 md:w-6'/>
<span className='text-base md:text-lg font-medium'>團隊成員</span> */}