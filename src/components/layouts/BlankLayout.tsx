import type React from 'react'
import { AuthLayout } from '@/components/layouts/AuthLayout'

type BlankLayoutProps = {
  children: React.ReactNode
}

export const BlankLayout: React.FC<BlankLayoutProps> = ({ children }) => {
  return <AuthLayout>{children}</AuthLayout>
}
