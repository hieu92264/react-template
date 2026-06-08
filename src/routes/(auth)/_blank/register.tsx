import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/_blank/register')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(auth)/_blank/register"!</div>
}
