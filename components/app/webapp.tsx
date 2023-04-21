import { WebApp } from "@/types/custom";
import { LangCode } from "@/types/i18n";
import Link from "next/link";

const WebAppElement = ({ app, lang }: { app: WebApp; lang: LangCode }) => (
  <Link href={app.href}>
    <div className='group bg-background2 px-8 py-6 flex flex-col justify-center items-center cursor-pointer'>
      {app.nav && <div className='text-main group-hover:text-main2'>
        {app.nav.icon && <app.nav.icon className='group-hover:hidden w-16 h-16' />}
        {app.nav.iconHover && <app.nav.iconHover className='hidden group-hover:block w-16 h-16' />}
      </div>}
      <p className='pt-2 -pb-2 text-center text-lg text-main group-hover:text-main2 group-hover:font-medium'>{app.title(lang)}</p>
    </div>
  </Link>
)

export { WebAppElement };
