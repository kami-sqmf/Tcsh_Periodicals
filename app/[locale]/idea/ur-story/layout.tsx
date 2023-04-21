import { PageWrapper } from "@/components/global/page-wrapper"
import { LangCode } from "@/types/i18n"

export default function IdeaLayout({ children, params }: {
  children: React.ReactNode,
  params: { locale: LangCode }
}) {
  return (
    <div className='min-h-screen overflow-hidden bg-background/90 py-4'>
      {children}
    </div>
  )
}