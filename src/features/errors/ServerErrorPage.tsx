import { ErrorPage } from './ErrorPage'

export function ServerErrorPage() {
  return (
    <ErrorPage
      code="500"
      title="Có lỗi xảy ra"
      description="Máy chủ gặp sự cố khi xử lý yêu cầu. Vui lòng thử lại."
    />
  )
}
