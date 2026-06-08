import { ErrorPage } from './ErrorPage'

export function MaintenancePage() {
  return (
    <ErrorPage
      code="503"
      title="Hệ thống đang bảo trì"
      description="Dịch vụ đang tạm thời bảo trì. Vui lòng thử lại sau."
    />
  )
}
