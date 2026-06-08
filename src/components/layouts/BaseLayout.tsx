import type React from 'react'

type BaseLayoutProps = {
  children: React.ReactNode
}

export const BaseLayout: React.FC<BaseLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen">
      <aside className="fixed left-0 top-0 h-screen w-64 border-r">
        Sidebar
      </aside>

      <div className="pl-64">
        <header className="h-16 border-b px-6 flex items-center">Header</header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
