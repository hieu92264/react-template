# Blueprint port tinh túy từ Vue template sang React template hiện tại

Tài liệu này dùng để **tự dựng lại bằng tay** các phần hay từ template Vue cũ sang project React hiện tại. Nó không phải README giới thiệu project cho người dùng cuối.

Mục tiêu:

- Giữ lại các ý tưởng tốt từ Vue template: API response chuẩn, HTTP service unwrap `metadata`, auth/session, refresh token, layout admin, sidebar, tab điều hướng, table dùng TanStack, cấu trúc feature rõ ràng.
- Sửa các chỗ sai lệch với project React hiện tại.
- Viết lại bằng React đúng cách, không bê nguyên tư duy Vue sang.

## 1. Stack đúng của project hiện tại

Project này hiện là React template, đang dùng:

| Nhóm | Công nghệ hiện tại |
| --- | --- |
| Framework | React 19 + TypeScript |
| Build tool | Vite 8 |
| Package manager nên dùng | Bun, vì repo có `bun.lock` |
| Router | TanStack Router file-based routing |
| Server state | TanStack React Query |
| Styling | Tailwind CSS v4 |
| UI base | shadcn style `base-nova` + Base UI primitive |
| Icon | `lucide-react` |
| Form/schema | Zod đã cài sẵn, form library chưa có |
| Client state | Zustand đã cài sẵn |

Những điểm tài liệu cũ cần sửa:

- Không dùng `react-router-dom`; project đang dùng `@tanstack/react-router`.
- Không dùng cấu trúc `src/modules`; project đang đi theo hướng `src/features`, `src/shared`, `src/app`.
- Không dùng `src/configs` và `src/services` rời rạc; nên gom phần API dùng chung vào `src/shared/api`.
- Không dùng `src/style.css`; project dùng `src/styles/global.css`.
- Không ghi như thể `axios` và `@tanstack/react-table` đã có sẵn. Hiện tại chúng **chưa có trong `package.json`**, chỉ cài thêm khi thật sự port API layer/table từ Vue template.

## 2. Những tinh túy nên giữ từ Vue template

Nên giữ:

- Chuẩn response backend dạng `ApiResponse<TMetadata>`.
- HTTP service chỉ trả về `metadata` để code ở feature gọn hơn.
- Interceptor tự gắn token, locale và refresh token khi gặp `401`.
- Store auth tách riêng, có persist session.
- Store app/sidebar/tab để quản lý trạng thái UI admin.
- Sidebar render từ config data, không hard-code trực tiếp trong component.
- Route layout tách `BlankLayout` và `BaseLayout`.
- Tab điều hướng theo route, có persist.
- DataTable tách core table, toolbar, pagination, columns.
- Mỗi nghiệp vụ nằm trong một feature riêng.

Không nên copy máy móc:

- Vue `ref`, `computed`, `watch` -> sang React dùng `useState`, `useMemo`, `useEffect`.
- Pinia store -> sang Zustand store.
- Vue Router `meta` -> sang TanStack Router dùng pathless route, `beforeLoad`, route context hoặc navigation config riêng.
- Vue slots -> sang React dùng `children`, props hoặc render function.
- `h()` trong column render -> sang JSX.

## 3. Cấu trúc thư mục đích nên dựng

Project hiện tại đã có một phần cấu trúc. Khi port tiếp, nên đi theo hướng này:

```txt
src/
  app/
    query-client.ts
    router.tsx
    providers.tsx

  routes/
    __root.tsx
    index.tsx
    (auth)/
      _blank/
        route.tsx
        login.tsx
        register.tsx
        forgot-password.tsx
    _app/
      route.tsx
      dashboard.tsx
      users.tsx

  components/
    layouts/
      BaseLayout.tsx
      BlankLayout.tsx
      partials/
        HeaderSection.tsx
        SidebarSection.tsx
        TabBar.tsx
    tables/
      DataTable.tsx
      DataTableToolbar.tsx
      DataTablePagination.tsx
    ui/
      button.tsx
      input.tsx
      table.tsx
      dropdown-menu.tsx

  features/
    auth/
      api/
        auth.api.ts
      components/
        login-form.tsx
        register-form.tsx
      hooks/
        use-login.ts
        use-logout.ts
        use-me.ts
      schemas/
        login.schema.ts
        register.schema.ts
      stores/
        auth.store.ts
      types/
        auth.type.ts

    users/
      api/
        users.api.ts
      components/
        user-columns.tsx
        users-table.tsx
      pages/
        UsersPage.tsx
      types/
        user.type.ts

    errors/
      ErrorPage.tsx
      ForbiddenPage.tsx
      MaintenancePage.tsx
      NotFoundPage.tsx
      ServerErrorPage.tsx

  shared/
    api/
      api-response.type.ts
      axios.ts
      http.service.ts
    config/
      env.ts
      navigation.ts
    constants/
      storage-key.ts
    hooks/
      use-debounce.ts
      use-navigation.ts
    stores/
      app.store.ts
      sidebar.store.ts
      tab.store.ts
    types/
      common.type.ts
      pagination.type.ts

  lib/
    format.ts
    utils.ts

  styles/
    global.css
```

Nguyên tắc:

- `src/app`: cấu hình app-level như router, query client, providers.
- `src/routes`: khai báo route theo TanStack Router file-based routing.
- `src/features`: logic nghiệp vụ theo từng feature.
- `src/shared`: code dùng chung giữa nhiều feature.
- `src/components/ui`: UI primitive tái sử dụng, không chứa business logic.
- `src/components/layouts`: khung layout.
- `src/components/tables`: table dùng chung.
- `src/lib`: utility nhỏ, không phụ thuộc domain.

## 4. Package cần bổ sung khi port đủ tính năng

Project hiện tại đã có Zustand, Zod, React Query, TanStack Router, Tailwind, shadcn/Base UI.

Nếu muốn port API layer giống Vue template:

```sh
bun add axios
```

Nếu muốn port DataTable giống Vue template:

```sh
bun add @tanstack/react-table @tanstack/react-virtual
```

Nếu làm form auth nghiêm túc:

```sh
bun add react-hook-form @hookform/resolvers
```

Nếu cần thêm component shadcn:

```sh
bunx shadcn@latest add input table dropdown-menu checkbox select
```

Chỉ cài khi bắt đầu dựng phần tương ứng, tránh cài trước rồi bỏ không.

## 5. Alias `@`

Project hiện đã cấu hình alias `@` trong `vite.config.ts` và `tsconfig`.

Import nên viết:

```ts
import { cn } from '@/lib/utils'
import { queryClient } from '@/app/query-client'
import { useAuthStore } from '@/features/auth/stores/auth.store'
```

Không nên dùng import tương đối quá sâu như:

```ts
import { cn } from '../../../lib/utils'
```

## 6. Env config

File `.env.development` hiện đã tồn tại nhưng đang rỗng. Khi bắt đầu gọi backend, thêm:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

Tạo `src/shared/config/env.ts`:

```ts
import { z } from 'zod'

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url(),
})

export const env = envSchema.parse(import.meta.env)
```

Lý do:

- Chỉ đọc env ở một nơi.
- Sai env thì fail sớm.
- Các file API không phải tự xử lý `undefined`.

Nếu backend chưa sẵn sàng, có thể để tạm:

```ts
export const env = {
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL ?? '',
}
```

Nhưng khi làm thật nên quay lại dùng Zod.

## 7. Type response API

Giữ tinh túy từ Vue template: backend trả response bọc ngoài, data thật nằm trong `metadata`.

Tạo `src/shared/api/api-response.type.ts`:

```ts
export type ApiDebug = {
  exception: string
  message: string
  file: string
  line: number
  trace: unknown[]
}

export type ApiResponse<TMetadata = unknown> = {
  message: string
  status_code: number
  metadata?: TMetadata
  path: string
  timestamp: string
  debug?: ApiDebug
  stack?: string
}
```

Tạo `src/shared/types/pagination.type.ts`:

```ts
export type PaginationMeta = {
  current_page: number
  per_page: number
  total: number
  last_page: number
}

export type PaginatedResponse<T> = {
  data: T[]
  meta: PaginationMeta
}
```

Tạo `src/shared/types/common.type.ts`:

```ts
export type BaseEntity = {
  id: number
  is_active: boolean
  created_at: string | null
  user_name_created: number | null
  updated_at: string | null
  user_name_updated: number | null
}
```

Quy ước quan trọng:

- `ApiResponse<T>` là full response backend.
- `T` là type của `metadata`, không phải type của cả response.
- Nếu endpoint trả user trong `metadata`, gọi `httpService.get<User>('/auth/me')`.
- Nếu endpoint trả danh sách phân trang, gọi `httpService.get<PaginatedResponse<User>>('/users')`.

## 8. Storage keys

Tạo `src/shared/constants/storage-key.ts`:

```ts
export const STORAGE_KEYS = {
  AUTH: 'react-template:auth',
  APP: 'react-template:app',
  SIDEBAR: 'react-template:sidebar',
  TABS: 'react-template:tabs',
} as const
```

Dùng constants để tránh mỗi store tự đặt một key khác nhau.

## 9. Auth types

Tạo `src/features/auth/types/auth.type.ts`:

```ts
import type { BaseEntity } from '@/shared/types/common.type'

export type User = BaseEntity & {
  username: string
  email: string
  role: string
}

export type AuthPayload = {
  access_token: string
  token_type: string
  expires_in: number
  user: User
}

export type LoginRequest = {
  username: string
  password: string
}

export type RegisterRequest = {
  username: string
  email: string
  password: string
}
```

Nếu backend dùng `email` để login thay vì `username`, sửa `LoginRequest` theo backend thật. Không tự ép frontend theo template cũ nếu API mới khác.

## 10. Zustand stores

### 10.1 Auth store

Tạo `src/features/auth/stores/auth.store.ts`:

```ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { STORAGE_KEYS } from '@/shared/constants/storage-key'
import type { AuthPayload, User } from '@/features/auth/types/auth.type'

type AuthState = {
  accessToken: string | null
  user: User | null
  isAuthenticated: boolean
  setSession: (payload: AuthPayload) => void
  clearSession: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      isAuthenticated: false,

      setSession: (payload) => {
        set({
          accessToken: payload.access_token,
          user: payload.user,
          isAuthenticated: true,
        })
      },

      clearSession: () => {
        set({
          accessToken: null,
          user: null,
          isAuthenticated: false,
        })
      },
    }),
    {
      name: STORAGE_KEYS.AUTH,
    },
  ),
)
```

Điểm quan trọng: interceptor, loader hoặc `beforeLoad` có thể dùng `useAuthStore.getState()` vì chúng nằm ngoài React component.

### 10.2 App store

Tạo `src/shared/stores/app.store.ts`:

```ts
import { create } from 'zustand'

type AppState = {
  lang: string
  isPageLoading: boolean
  setLang: (lang: string) => void
  startPageLoading: () => void
  finishPageLoading: () => void
}

export const useAppStore = create<AppState>((set) => ({
  lang: 'vi',
  isPageLoading: false,
  setLang: (lang) => set({ lang }),
  startPageLoading: () => set({ isPageLoading: true }),
  finishPageLoading: () => set({ isPageLoading: false }),
}))
```

### 10.3 Sidebar store

Tạo `src/shared/stores/sidebar.store.ts`:

```ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { STORAGE_KEYS } from '@/shared/constants/storage-key'

type SidebarState = {
  isCollapsed: boolean
  toggle: () => void
  setCollapsed: (collapsed: boolean) => void
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isCollapsed: false,
      toggle: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
      setCollapsed: (collapsed) => set({ isCollapsed: collapsed }),
    }),
    {
      name: STORAGE_KEYS.SIDEBAR,
    },
  ),
)
```

### 10.4 Tab store

Tạo hoặc cập nhật `src/shared/stores/tab.store.ts`:

```ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { STORAGE_KEYS } from '@/shared/constants/storage-key'

export type AppTab = {
  key: string
  title: string
  to: string
  affix?: boolean
  closable?: boolean
}

type TabState = {
  tabs: AppTab[]
  activeKey: string
  openTab: (tab: Omit<AppTab, 'closable'>) => void
  closeTab: (key: string) => void
  closeOtherTabs: (key: string) => void
  closeAllTabs: () => void
  setActiveTab: (key: string) => void
}

export const useTabStore = create<TabState>()(
  persist(
    (set) => ({
      tabs: [],
      activeKey: '',

      openTab: (tab) => {
        set((state) => {
          const exists = state.tabs.some((item) => item.key === tab.key)

          return {
            tabs: exists
              ? state.tabs
              : [
                  ...state.tabs,
                  {
                    ...tab,
                    closable: !tab.affix,
                  },
                ],
            activeKey: tab.key,
          }
        })
      },

      closeTab: (key) => {
        set((state) => {
          const targetIndex = state.tabs.findIndex((tab) => tab.key === key)

          if (targetIndex === -1) return state

          const target = state.tabs[targetIndex]

          if (target?.affix) return state

          const nextTabs = state.tabs.filter((tab) => tab.key !== key)
          let nextActiveKey = state.activeKey

          if (state.activeKey === key) {
            const neighbor = state.tabs[targetIndex + 1] ?? state.tabs[targetIndex - 1]
            nextActiveKey = neighbor?.key ?? nextTabs[0]?.key ?? ''
          }

          return {
            tabs: nextTabs,
            activeKey: nextActiveKey,
          }
        })
      },

      closeOtherTabs: (key) => {
        set((state) => {
          const nextTabs = state.tabs.filter((tab) => tab.key === key || tab.affix)

          return {
            tabs: nextTabs,
            activeKey: nextTabs.some((tab) => tab.key === key)
              ? key
              : (nextTabs[0]?.key ?? ''),
          }
        })
      },

      closeAllTabs: () => {
        set((state) => {
          const affixedTabs = state.tabs.filter((tab) => tab.affix)

          return {
            tabs: affixedTabs,
            activeKey: affixedTabs[0]?.key ?? '',
          }
        })
      },

      setActiveTab: (key) => set({ activeKey: key }),
    }),
    {
      name: STORAGE_KEYS.TABS,
    },
  ),
)
```

## 11. Axios client

Phần này là bước bổ sung để port API layer từ Vue template. Trước khi tạo file này, cài:

```sh
bun add axios
```

Tạo `src/shared/api/axios.ts`:

```ts
import axios, {
  AxiosError,
  AxiosHeaders,
  type InternalAxiosRequestConfig,
} from 'axios'
import { useAuthStore } from '@/features/auth/stores/auth.store'
import type { AuthPayload } from '@/features/auth/types/auth.type'
import { env } from '@/shared/config/env'
import type { ApiResponse } from '@/shared/api/api-response.type'
import { useAppStore } from '@/shared/stores/app.store'

export const AUTH_ENDPOINT = {
  LOGIN: '/auth/login',
  REFRESH: '/auth/refresh',
  LOGOUT: '/auth/logout',
} as const

export const apiClient = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  timeout: 15_000,
  headers: {
    Accept: 'application/json',
  },
})

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean
}

let installed = false
let refreshTokenPromise: Promise<AuthPayload | undefined> | null = null

export function setupAxiosInterceptors() {
  if (installed) return

  installed = true

  apiClient.interceptors.request.use((config) => {
    const { accessToken } = useAuthStore.getState()
    const { lang } = useAppStore.getState()
    const headers = AxiosHeaders.from(config.headers)

    headers.set('Accept', 'application/json')
    headers.set('X-Locale', lang)

    if (config.data) {
      headers.set('Content-Type', 'application/json')
    }

    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`)
    } else {
      headers.delete('Authorization')
    }

    config.headers = headers

    return config
  })

  apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ApiResponse>) => {
      const originalRequest = error.config as RetryableRequestConfig | undefined

      const shouldSkipRefresh =
        error.response?.status !== 401 ||
        !originalRequest ||
        originalRequest._retry ||
        originalRequest.url?.includes(AUTH_ENDPOINT.LOGIN) ||
        originalRequest.url?.includes(AUTH_ENDPOINT.REFRESH)

      if (shouldSkipRefresh) {
        return Promise.reject(error)
      }

      originalRequest._retry = true

      refreshTokenPromise ??= apiClient
        .post<ApiResponse<AuthPayload>>(AUTH_ENDPOINT.REFRESH)
        .then((response) => {
          const payload = response.data.metadata

          if (payload) {
            useAuthStore.getState().setSession(payload)
          }

          return payload
        })
        .catch(() => {
          useAuthStore.getState().clearSession()
          return undefined
        })
        .finally(() => {
          refreshTokenPromise = null
        })

      const payload = await refreshTokenPromise

      if (!payload?.access_token) {
        return Promise.reject(error)
      }

      const headers = AxiosHeaders.from(originalRequest.headers)
      headers.set('Authorization', `Bearer ${payload.access_token}`)
      originalRequest.headers = headers

      return apiClient(originalRequest)
    },
  )
}
```

Gọi setup trong `src/main.tsx` trước khi render:

```tsx
import { setupAxiosInterceptors } from '@/shared/api/axios'

setupAxiosInterceptors()
```

Không gọi Zustand hook dạng `useAuthStore(...)` trong interceptor. Dùng `useAuthStore.getState()`.

## 12. HTTP service unwrap `metadata`

Tạo `src/shared/api/http.service.ts`:

```ts
import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import { apiClient } from '@/shared/api/axios'
import type { ApiResponse } from '@/shared/api/api-response.type'

type RequestBody = unknown

async function unwrapMetadata<TMetadata>(
  request: Promise<AxiosResponse<ApiResponse<TMetadata>>>,
): Promise<TMetadata> {
  const response = await request
  return response.data.metadata as TMetadata
}

export const httpService = {
  get<TMetadata>(url: string, config?: AxiosRequestConfig) {
    return unwrapMetadata<TMetadata>(
      apiClient.get<ApiResponse<TMetadata>>(url, config),
    )
  },

  post<TMetadata, TBody = RequestBody>(
    url: string,
    body?: TBody,
    config?: AxiosRequestConfig,
  ) {
    return unwrapMetadata<TMetadata>(
      apiClient.post<ApiResponse<TMetadata>>(url, body, config),
    )
  },

  put<TMetadata, TBody = RequestBody>(
    url: string,
    body?: TBody,
    config?: AxiosRequestConfig,
  ) {
    return unwrapMetadata<TMetadata>(
      apiClient.put<ApiResponse<TMetadata>>(url, body, config),
    )
  },

  patch<TMetadata, TBody = RequestBody>(
    url: string,
    body?: TBody,
    config?: AxiosRequestConfig,
  ) {
    return unwrapMetadata<TMetadata>(
      apiClient.patch<ApiResponse<TMetadata>>(url, body, config),
    )
  },

  delete<TMetadata>(url: string, config?: AxiosRequestConfig) {
    return unwrapMetadata<TMetadata>(
      apiClient.delete<ApiResponse<TMetadata>>(url, config),
    )
  },

  async getApiResponse<TMetadata>(url: string, config?: AxiosRequestConfig) {
    const response = await apiClient.get<ApiResponse<TMetadata>>(url, config)
    return response.data
  },
}
```

Cách dùng đúng:

```ts
const user = await httpService.get<User>('/auth/me')
```

Cách dùng sai:

```ts
const user = await httpService.get<ApiResponse<User>>('/auth/me')
```

Vì `httpService.get<T>()` đã unwrap `metadata`, nên `T` là type của `metadata`.

## 13. Auth API

Tạo `src/features/auth/api/auth.api.ts`:

```ts
import { httpService } from '@/shared/api/http.service'
import type {
  AuthPayload,
  LoginRequest,
  RegisterRequest,
  User,
} from '@/features/auth/types/auth.type'

export const AUTH_API = {
  LOGIN: '/auth/login',
  ME: '/auth/me',
  REFRESH: '/auth/refresh',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
} as const

export const AuthService = {
  login(data: LoginRequest) {
    return httpService.post<AuthPayload, LoginRequest>(AUTH_API.LOGIN, data)
  },

  me() {
    return httpService.get<User>(AUTH_API.ME)
  },

  refreshToken() {
    return httpService.post<AuthPayload>(AUTH_API.REFRESH)
  },

  register(data: RegisterRequest) {
    return httpService.post<User, RegisterRequest>(AUTH_API.REGISTER, data)
  },

  logout() {
    return httpService.post<void>(AUTH_API.LOGOUT)
  },
}
```

## 14. Auth schema và hook

Tạo `src/features/auth/schemas/login.schema.ts`:

```ts
import { z } from 'zod'

export const loginSchema = z.object({
  username: z.string().min(1, 'Vui lòng nhập tên đăng nhập'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
})

export type LoginFormValues = z.infer<typeof loginSchema>
```

Tạo `src/features/auth/hooks/use-login.ts`:

```ts
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { AuthService } from '@/features/auth/api/auth.api'
import { useAuthStore } from '@/features/auth/stores/auth.store'
import type { LoginRequest } from '@/features/auth/types/auth.type'

export function useLogin() {
  const navigate = useNavigate()
  const setSession = useAuthStore((state) => state.setSession)

  return useMutation({
    mutationFn: (data: LoginRequest) => AuthService.login(data),
    onSuccess: (payload) => {
      setSession(payload)
      void navigate({ to: '/' })
    },
  })
}
```

Khi làm `LoginForm`, form submit chỉ gọi `loginMutation.mutate(values)`. Không gọi API trực tiếp trong component nếu đã có hook.

## 15. Query client

Project đã có `src/app/query-client.ts`.

Cấu hình hiện tại hợp lý cho template admin:

- Query cache ngắn.
- Không refetch khi focus lại tab.
- Mutation không retry.

Khi có auth logout, nên clear cache:

```ts
import { queryClient } from '@/app/query-client'

queryClient.clear()
```

Hoặc chỉ xóa nhóm query liên quan:

```ts
queryClient.removeQueries({ queryKey: ['me'] })
```

## 16. TanStack Router thay cho Vue Router meta

Vue template có thể dùng `route.meta`. Sang project này, nên dùng 3 lớp:

1. **Pathless layout route** để quyết định layout.
2. **`beforeLoad`** để guard auth/guest.
3. **Navigation config riêng** để render sidebar/tab title/icon.

### 16.1 Blank layout cho auth

Project hiện đã có:

```txt
src/routes/(auth)/_blank/route.tsx
src/routes/(auth)/_blank/login.tsx
src/routes/(auth)/_blank/register.tsx
src/routes/(auth)/_blank/forgot-password.tsx
```

`(auth)` là route group, không xuất hiện trong URL.

`_blank` là pathless layout route, dùng để bọc page bằng `BlankLayout`.

### 16.2 App layout cho khu vực sau đăng nhập

Tạo `src/routes/_app/route.tsx`:

```tsx
import { BaseLayout } from '@/components/layouts/BaseLayout'
import { useAuthStore } from '@/features/auth/stores/auth.store'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_app')({
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState()

    if (!isAuthenticated) {
      throw redirect({ to: '/login' })
    }
  },
  component: () => (
    <BaseLayout>
      <Outlet />
    </BaseLayout>
  ),
})
```

Tạo page dashboard:

```tsx
// src/routes/_app/dashboard.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  return <div>Dashboard</div>
}
```

URL thực tế sẽ là `/dashboard`, vì `_app` là pathless route.

### 16.3 Loader dùng React Query

Router context đã có `queryClient` trong `src/app/router.tsx`. Khi cần preload data:

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { UserService } from '@/features/users/api/users.api'

export const Route = createFileRoute('/_app/users')({
  loader: ({ context }) => {
    return context.queryClient.ensureQueryData({
      queryKey: ['users'],
      queryFn: () => UserService.list(),
    })
  },
  component: UsersPage,
})

function UsersPage() {
  return <div>Users</div>
}
```

Không sửa tay `src/routeTree.gen.ts`. File này do TanStack Router generate.

## 17. Navigation config

Thay vì cố nhét mọi thứ vào route meta, tạo config riêng.

Tạo `src/shared/config/navigation.ts`:

```tsx
import type { LucideIcon } from 'lucide-react'
import { LayoutDashboard, Users } from 'lucide-react'

export type NavigationItem = {
  key: string
  title: string
  to: string
  icon: LucideIcon
  affix?: boolean
}

export const navigationItems: NavigationItem[] = [
  {
    key: 'dashboard',
    title: 'Dashboard',
    to: '/dashboard',
    icon: LayoutDashboard,
    affix: true,
  },
  {
    key: 'users',
    title: 'Users',
    to: '/users',
    icon: Users,
  },
]
```

Sidebar, breadcrumb và tab bar có thể dùng chung config này.

## 18. Layout admin

`BaseLayout.tsx` hiện mới là stub. Khi dựng lại, nên tách thành partials:

```txt
src/components/layouts/
  BaseLayout.tsx
  BlankLayout.tsx
  partials/
    HeaderSection.tsx
    SidebarSection.tsx
    TabBar.tsx
```

`BaseLayout.tsx` nên chỉ giữ khung:

```tsx
import type { ReactNode } from 'react'
import { HeaderSection } from '@/components/layouts/partials/HeaderSection'
import { SidebarSection } from '@/components/layouts/partials/SidebarSection'
import { TabBar } from '@/components/layouts/partials/TabBar'
import { useSidebarStore } from '@/shared/stores/sidebar.store'
import { cn } from '@/lib/utils'

type BaseLayoutProps = {
  children: ReactNode
}

export function BaseLayout({ children }: BaseLayoutProps) {
  const isCollapsed = useSidebarStore((state) => state.isCollapsed)

  return (
    <div className="min-h-screen bg-background">
      <SidebarSection />

      <div
        className={cn(
          'min-h-screen transition-[padding]',
          isCollapsed ? 'pl-16' : 'pl-64',
        )}
      >
        <HeaderSection />
        <TabBar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
```

Các phần click navigation, mở tab, đóng tab nên nằm trong `SidebarSection` và `TabBar`, không nhồi hết vào layout.

## 19. Sidebar

`SidebarSection` nên render từ `navigationItems`.

Ví dụ:

```tsx
import { Link, useLocation } from '@tanstack/react-router'
import { navigationItems } from '@/shared/config/navigation'
import { useTabStore } from '@/shared/stores/tab.store'
import { cn } from '@/lib/utils'

export function SidebarSection() {
  const location = useLocation()
  const openTab = useTabStore((state) => state.openTab)

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r bg-sidebar">
      <div className="h-16 border-b px-4 flex items-center font-semibold">
        React Template
      </div>

      <nav className="p-2">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const active = location.pathname === item.to

          return (
            <Link
              key={item.key}
              to={item.to}
              className={cn(
                'flex h-9 items-center gap-2 rounded-md px-3 text-sm',
                active
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent',
              )}
              onClick={() => {
                openTab({
                  key: item.key,
                  title: item.title,
                  to: item.to,
                  affix: item.affix,
                })
              }}
            >
              <Icon className="size-4" />
              <span>{item.title}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
```

Nếu muốn type-safe tuyệt đối với TanStack Router, có thể siết type `to` sau. Giai đoạn đầu nên ưu tiên dựng flow chạy ổn trước.

## 20. TabBar điều hướng theo route

Ý tưởng giữ từ Vue template: mỗi route mở thành một tab, refresh browser vẫn còn tab.

Tạo `src/components/layouts/partials/TabBar.tsx`:

```tsx
import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import { X } from 'lucide-react'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { navigationItems } from '@/shared/config/navigation'
import { useTabStore } from '@/shared/stores/tab.store'
import { cn } from '@/lib/utils'

export function TabBar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { tabs, activeKey, openTab, closeTab, setActiveTab } = useTabStore()

  useEffect(() => {
    const currentItem = navigationItems.find((item) => item.to === location.pathname)

    if (!currentItem) return

    openTab({
      key: currentItem.key,
      title: currentItem.title,
      to: currentItem.to,
      affix: currentItem.affix,
    })
  }, [location.pathname, openTab])

  useEffect(() => {
    const currentItem = navigationItems.find((item) => item.to === location.pathname)

    if (currentItem) {
      setActiveTab(currentItem.key)
    }
  }, [location.pathname, setActiveTab])

  if (tabs.length === 0) return null

  return (
    <div className="flex h-10 items-center gap-1 border-b bg-background px-2">
      {tabs.map((tab) => {
        const active = activeKey === tab.key

        return (
          <div
            key={tab.key}
            className={cn(
              'group flex h-8 items-center gap-1 rounded-md border px-2 text-sm',
              active ? 'bg-muted text-foreground' : 'text-muted-foreground',
            )}
          >
            <Link to={tab.to} className="max-w-40 truncate">
              {tab.title}
            </Link>

            {tab.closable ? (
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() => {
                  closeTab(tab.key)

                  const nextActive = useTabStore.getState().activeKey
                  const nextTab = useTabStore
                    .getState()
                    .tabs.find((item) => item.key === nextActive)

                  if (nextTab && nextTab.to !== location.pathname) {
                    void navigate({ to: nextTab.to })
                  }
                }}
              >
                <X className="size-3" />
              </Button>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
```

Đây là bản khởi đầu. Sau khi chạy ổn mới thêm menu chuột phải: đóng tab khác, đóng tất cả, reload tab.

## 21. Header

`HeaderSection` nên giữ ít chức năng nhưng đúng vai trò:

- Toggle sidebar.
- Hiển thị title/breadcrumb nếu cần.
- Nút đổi theme/ngôn ngữ nếu có.
- User menu/logout.

Không nên để header biết quá nhiều logic của feature.

## 22. DataTable

DataTable là phần đáng giữ từ Vue template, nhưng project hiện chưa cài TanStack Table.

Cài khi bắt đầu làm:

```sh
bun add @tanstack/react-table @tanstack/react-virtual
bunx shadcn@latest add table input checkbox dropdown-menu select
```

Cấu trúc nên tạo:

```txt
src/components/tables/
  DataTable.tsx
  DataTableToolbar.tsx
  DataTablePagination.tsx
```

API component nên hướng tới:

```tsx
<DataTable
  data={users}
  columns={userColumns}
  rowKey="id"
  loading={usersQuery.isLoading}
  toolbar={{
    search: true,
    refresh: true,
    createLabel: 'Thêm người dùng',
    onRefresh: () => usersQuery.refetch(),
    onCreate: () => console.log('create'),
  }}
  pagination={{
    pageSize: 20,
    pageSizeOptions: [10, 20, 50],
  }}
/>
```

Nguyên tắc:

- Column definition nằm trong feature, ví dụ `src/features/users/components/user-columns.tsx`.
- Table core dùng chung nằm trong `src/components/tables`.
- Server-side pagination không nên nhét cứng vào DataTable ngay từ đầu. Làm client-side trước, sau đó thêm `manualPagination`, `pageCount`, `onPaginationChange`.

## 23. Users feature mẫu

Tạo `src/features/users/types/user.type.ts`:

```ts
import type { BaseEntity } from '@/shared/types/common.type'

export type User = BaseEntity & {
  username: string
  email: string
  role: string
}
```

Tạo `src/features/users/api/users.api.ts`:

```ts
import { httpService } from '@/shared/api/http.service'
import type { PaginatedResponse } from '@/shared/types/pagination.type'
import type { User } from '@/features/users/types/user.type'

type UserListParams = {
  page?: number
  per_page?: number
  search?: string
}

export const UserService = {
  list(params?: UserListParams) {
    return httpService.get<PaginatedResponse<User>>('/users', {
      params,
    })
  },
}
```

Tạo route:

```tsx
// src/routes/_app/users.tsx
import { createFileRoute } from '@tanstack/react-router'
import { UsersPage } from '@/features/users/pages/UsersPage'

export const Route = createFileRoute('/_app/users')({
  component: UsersPage,
})
```

Tạo page:

```tsx
// src/features/users/pages/UsersPage.tsx
import { useQuery } from '@tanstack/react-query'
import { UserService } from '@/features/users/api/users.api'

export function UsersPage() {
  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: () => UserService.list(),
  })

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Người dùng</h1>
        <p className="text-sm text-muted-foreground">
          Quản lý tài khoản, vai trò và trạng thái người dùng.
        </p>
      </div>

      <pre className="rounded-md border bg-muted p-4 text-sm">
        {JSON.stringify(usersQuery.data, null, 2)}
      </pre>
    </div>
  )
}
```

Sau khi API chạy ổn mới thay `<pre>` bằng `DataTable`.

## 24. UI conventions

Project đang có `Button` theo shadcn/Base UI. Khi thêm UI mới:

- Dùng `components/ui` cho primitive.
- Dùng `features/<feature>/components` cho component có business context.
- Dùng `lucide-react` cho icon trong button/menu.
- Dùng `cn()` từ `src/lib/utils.ts` khi merge class.
- Ưu tiên token hiện có: `bg-background`, `text-foreground`, `border-border`, `bg-muted`, `text-muted-foreground`.
- Không tạo một hệ màu mới rời khỏi `src/styles/global.css` nếu không cần.

## 25. Thứ tự dựng lại khuyến nghị

Đi theo thứ tự này để dễ debug:

1. Cập nhật `.env.development` và `src/shared/config/env.ts`.
2. Tạo `ApiResponse`, `PaginatedResponse`, `BaseEntity`.
3. Tạo `STORAGE_KEYS`.
4. Tạo auth types.
5. Tạo auth store bằng Zustand persist.
6. Cài axios nếu muốn port API layer.
7. Tạo `apiClient`, interceptor và `setupAxiosInterceptors`.
8. Tạo `httpService` unwrap `metadata`.
9. Tạo `AuthService`.
10. Tạo login schema và `useLogin`.
11. Hoàn thiện `LoginForm`.
12. Tạo `_app` pathless route dùng `BaseLayout`.
13. Tạo `navigationItems`.
14. Tạo sidebar store.
15. Hoàn thiện `BaseLayout`, `SidebarSection`, `HeaderSection`.
16. Tạo tab store và `TabBar`.
17. Tạo dashboard route/page.
18. Tạo users feature đơn giản với React Query.
19. Cài TanStack Table khi cần.
20. Tạo DataTable client-side.
21. Nâng cấp DataTable sang server-side pagination nếu backend cần.

## 26. Lỗi dễ gặp

### Dùng nhầm React Router

Sai với project này:

```ts
import { useNavigate } from 'react-router-dom'
```

Đúng:

```ts
import { useNavigate } from '@tanstack/react-router'
```

### Sửa tay route tree

Sai:

```txt
Sửa src/routeTree.gen.ts
```

Đúng:

```txt
Sửa file trong src/routes, để TanStack Router generate lại.
```

### Gọi hook trong axios interceptor

Sai:

```ts
const accessToken = useAuthStore((state) => state.accessToken)
```

Đúng:

```ts
const accessToken = useAuthStore.getState().accessToken
```

### Nhầm type response

Sai:

```ts
httpService.get<ApiResponse<User>>('/auth/me')
```

Đúng:

```ts
httpService.get<User>('/auth/me')
```

### Ghi tài liệu như thể package đã cài

Nếu dùng `axios`, `@tanstack/react-table`, `react-hook-form`, phải cài trước và ghi rõ trong tài liệu. Đừng để README nói dùng một package mà `package.json` chưa có.

## 27. Checklist kiểm tra sau mỗi phần

Sau khi dựng từng nhóm, chạy:

```sh
bun run lint
bun run build
```

Kiểm tra thủ công:

1. `/login` render bằng `BlankLayout`.
2. Login thành công lưu session vào Zustand persist.
3. Không đăng nhập thì route trong `_app` redirect về `/login`.
4. Đăng nhập rồi vào `/dashboard` thấy `BaseLayout`.
5. Sidebar click đổi route.
6. Click sidebar mở tab.
7. Refresh browser vẫn giữ tab/sidebar state nếu đã persist.
8. Request API có `Authorization` và `X-Locale`.
9. Gặp `401` chỉ gọi refresh token một lần cho nhiều request đồng thời.
10. `httpService.get<T>()` trả về `metadata`, không trả full response.

## 28. Ghi nhớ chính

Tài liệu này là bản đồ để bạn tự dựng lại các cấu trúc từ Vue template bằng tay trong React template hiện tại.

Hướng đúng của repo này là:

- TanStack Router thay cho Vue Router.
- Zustand thay cho Pinia.
- React Query thay cho TanStack Vue Query.
- Feature-based structure thay cho `modules`.
- `src/shared/api` thay cho `src/configs` + `src/services`.
- Tailwind v4 + shadcn/Base UI thay cho cách setup Tailwind cũ.

Khi port, ưu tiên dựng ít nhưng đúng flow trước. Sau khi auth, route, layout và API service chạy ổn, mới mở rộng table, tab nâng cao, permission và các feature nghiệp vụ.
