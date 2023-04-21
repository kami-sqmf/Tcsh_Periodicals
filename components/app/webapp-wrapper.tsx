import { WebApp } from "@/types/custom";
import { LangCode } from "@/types/i18n";
import { WebAppElement } from './webapp';

const WebAppWrapper = ({ className, apps, lang }: { className?: string; apps: WebApp[]; lang: LangCode }) => {
  return (
    <div className={`${className} grid`}>
      {Object.values(apps).map((app, key) => (<WebAppElement key={key} app={app} lang={lang} />))}
    </div>
  )
}

export { WebAppWrapper };
