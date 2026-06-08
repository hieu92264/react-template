import type React from 'react'

type BlankLayoutProps = {
  children: React.ReactNode
}

export const BlankLayout: React.FC<BlankLayoutProps> = ({ children }) => {
  return <main className="min-h-screen">{children}</main>
}
