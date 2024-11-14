
export default function IdeaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-screen overflow-hidden bg-background/90 py-4'>
      {children}
    </div>
  )
}