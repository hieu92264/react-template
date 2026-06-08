# Huong dan tu dung React tu template Vue hien tai

Tai lieu nay danh cho viec tu viet lai template Vue hien tai sang React tu dau den cuoi. Noi dung bam theo cac phan dang co trong repo:

- Axios config: `src/configs/axios.config.ts`
- Service unwrap response: `src/services/http.service.ts`
- Type response: `ApiResponse<TMetadata>`, `PaginatedResponse<T>`
- Base layout: sidebar, header, tab bar
- Table: TanStack Table
- Tabs: tab dieu huong trong layout va tabs ben trong page

Muc tieu khong phai copy tung dong Vue sang React, ma la giu lai kien truc va chuyen sang React dung cach.

---

## 1. Stack React nen dung

Neu tao project React moi, dung stack nay de gan nhat voi template Vue:

| Vue template hien tai | React tuong ung      |
| --------------------- | -------------------- |
| Vue 3                 | React + TypeScript   |
| Vite                  | Vite                 |
| Vue Router            | React Router DOM     |
| Pinia                 | Zustand              |
| TanStack Vue Query    | TanStack React Query |
| TanStack Vue Table    | TanStack React Table |
| Axios                 | Axios                |
| lucide-vue-next       | lucide-react         |
| Tailwind CSS          | Tailwind CSS         |

Lenh tao project:

```sh
npm create vite@latest react-admin -- --template react-ts
cd react-admin
npm install
```

Cai dependencies chinh:

```sh
npm install axios react-router-dom zustand @tanstack/react-query @tanstack/react-table @tanstack/react-virtual lucide-react clsx tailwind-merge
```

Neu dung Tailwind CSS voi Vite:

```sh
npm install tailwindcss @tailwindcss/vite
```

Tao file `.env` o root project React:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

---

## 2. Cau truc thu muc nen tao

Tao cau truc React nhu sau:

```txt
src/
  App.tsx
  main.tsx
  style.css

  configs/
    axios.config.ts
    query-client.config.ts

  services/
    http.service.ts

  types/
    api.type.ts
    base.type.ts
    pagination.type.ts

  stores/
    app.store.ts
    auth.store.ts
    sidebar.store.ts
    tabs.store.ts

  router/
    routes.tsx
    AppRouter.tsx
    RouteGuard.tsx

  components/
    layouts/
      BaseLayout.tsx
      BlankLayout.tsx
      partials/
        HeaderSection.tsx
        SidebarSection.tsx
        TabBar.tsx
        sidebar-data.tsx

    tables/
      DataTable.tsx
      DataTableToolbar.tsx
      DataTablePagination.tsx

    ui/
      button.tsx
      input.tsx
      table.tsx
      tabs.tsx

  modules/
    auth/
      api/auth.api.ts
      types/auth.type.ts
      pages/LoginPage.tsx

    dashboard/
      pages/DashboardPage.tsx

    iam/
      users/
        api/user.api.ts
        components/user-columns.tsx
        pages/UserListPage.tsx
```

Nguyen tac:

- `configs/`: cau hinh axios, react-query.
- `services/`: lop goi HTTP dung chung.
- `types/`: type dung chung cho API/backend.
- `stores/`: state global UI/auth/tab/sidebar.
- `modules/`: moi tinh nang la mot module rieng.
- `components/layouts/`: layout khung app.
- `components/tables/`: DataTable dung chung.
- `components/ui/`: component nho nhu button, input, table, tabs.

---

## 3. Alias `@`

De import giong Vue template, cau hinh alias `@`.

`vite.config.ts`:

```ts
import path from 'node:path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

Trong `tsconfig.app.json`, them:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

---

## 4. Type response API

Trong Vue template, response backend co dang:

```ts
type ApiResponse<TMetadata = unknown> = {
  message: string
  status_code: number
  metadata?: TMetadata
  path: string
  timestamp: string
  debug?: ApiDebug
  stack?: string
}
```

Khi sang React, nen khai bao explicit trong file type rieng thay vi global type.

Tao `src/types/api.type.ts`:

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

Tao `src/types/pagination.type.ts`:

```ts
export interface PaginationMeta {
  current_page: number
  per_page: number
  total: number
  last_page: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}
```

Tao `src/types/base.type.ts`:

```ts
export interface BaseEntity {
  id: number
  is_active: boolean
  created_at: string | null
  user_name_created: number | null
  updated_at: string | null
  user_name_updated: number | null
}
```

Diem quan trong:

- `ApiResponse<TMetadata>` la toan bo response backend.
- `TMetadata` la type cua field `metadata`, khong phai type cua ca response.
- Neu endpoint tra ve user trong `metadata`, goi `httpService.get<User>('/auth/me')`.
- Neu endpoint tra ve danh sach phan trang trong `metadata`, goi `httpService.get<PaginatedResponse<User>>('/users')`.
- Neu endpoint khong tra `metadata`, dung `void`: `httpService.post<void>('/auth/logout')`.

---

## 5. Auth type

Tao `src/modules/auth/types/auth.type.ts`:

```ts
import type { BaseEntity } from '@/types/base.type'

export interface User extends BaseEntity {
  username: string
  email: string
  password?: string
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

---

## 6. Store bang Zustand

Trong Vue dang dung Pinia. Sang React nen dung Zustand vi gon va co `getState()` de axios interceptor doc token ben ngoai component.

### 6.1 Auth store

Tao `src/stores/auth.store.ts`:

```ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthPayload, User } from '@/modules/auth/types/auth.type'

type AuthState = {
  accessToken: string | null
  user: User | null
  setSession: (payload: AuthPayload) => void
  clearSession: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      setSession: (payload) => {
        set({
          accessToken: payload.access_token,
          user: payload.user,
        })
      },
      clearSession: () => {
        set({
          accessToken: null,
          user: null,
        })
      },
    }),
    {
      name: 'auth-store',
    },
  ),
)
```

### 6.2 App store

Tao `src/stores/app.store.ts`:

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
  lang: 'en',
  isPageLoading: false,
  setLang: (lang) => set({ lang }),
  startPageLoading: () => set({ isPageLoading: true }),
  finishPageLoading: () => set({ isPageLoading: false }),
}))
```

### 6.3 Sidebar store

Tao `src/stores/sidebar.store.ts`:

```ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
      name: 'sidebar-store',
    },
  ),
)
```

### 6.4 Tabs store

Tao `src/stores/tabs.store.ts`:

```ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface TabItem {
  key: string
  title: string
  path: string
  name?: string
  affix?: boolean
  closable?: boolean
}

type TabsState = {
  tabs: TabItem[]
  activeKey: string
  openTab: (tab: Omit<TabItem, 'closable'>) => void
  closeTab: (key: string) => void
  closeOtherTabs: (key: string) => void
  closeAllTabs: () => void
  setActiveTab: (key: string) => void
  updateTabTitle: (key: string, title: string) => void
}

export const useTabsStore = create<TabsState>()(
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
          const index = state.tabs.findIndex((tab) => tab.key === key)
          if (index === -1) return state

          const target = state.tabs[index]
          if (target?.affix) return state

          const nextTabs = state.tabs.filter((tab) => tab.key !== key)
          let nextActiveKey = state.activeKey

          if (state.activeKey === key) {
            const neighbor = state.tabs[index + 1] ?? state.tabs[index - 1]
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
          const nextTabs = state.tabs.filter(
            (tab) => tab.key === key || tab.affix,
          )
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
          const affixed = state.tabs.filter((tab) => tab.affix)
          return {
            tabs: affixed,
            activeKey: affixed[0]?.key ?? '',
          }
        })
      },

      setActiveTab: (key) => set({ activeKey: key }),

      updateTabTitle: (key, title) => {
        set((state) => ({
          tabs: state.tabs.map((tab) =>
            tab.key === key ? { ...tab, title } : tab,
          ),
        }))
      },
    }),
    {
      name: 'tabs-store',
    },
  ),
)
```

---

## 7. Axios config

Trong Vue template:

- `apiClient` la axios instance.
- Request interceptor gan `Accept`, `Content-Type`, `X-Locale`, `Authorization`.
- Response interceptor bat loi `401`, goi refresh token mot lan, sau do retry request cu.

Sang React, khong duoc dung React hook trong axios interceptor. Dung `useAuthStore.getState()` va `useAppStore.getState()`.

Tao `src/configs/axios.config.ts`:

```ts
import axios, {
  AxiosError,
  AxiosHeaders,
  type InternalAxiosRequestConfig,
} from 'axios'
import type { ApiResponse } from '@/types/api.type'
import type { AuthPayload } from '@/modules/auth/types/auth.type'
import { useAppStore } from '@/stores/app.store'
import { useAuthStore } from '@/stores/auth.store'

export const AUTH_URL = {
  LOGIN: '/auth/login',
  REFRESH: '/auth/refresh',
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
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
        originalRequest.url?.includes(AUTH_URL.LOGIN) ||
        originalRequest.url?.includes(AUTH_URL.REFRESH)

      if (shouldSkipRefresh) {
        return Promise.reject(error)
      }

      originalRequest._retry = true

      refreshTokenPromise ??= apiClient
        .post<ApiResponse<AuthPayload>>(AUTH_URL.REFRESH)
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

Ghi nho:

- `refreshTokenPromise` ngan viec 5 request cung bi `401` thi goi refresh 5 lan.
- `_retry` ngan vong lap vo han.
- Bo qua `/auth/login` va `/auth/refresh`, vi login/refresh fail thi khong nen refresh tiep.

---

## 8. HTTP service unwrap `metadata`

Tao `src/services/http.service.ts`:

```ts
import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import { apiClient } from '@/configs/axios.config'
import type { ApiResponse } from '@/types/api.type'

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

  async postApiResponse<TMetadata, TBody = RequestBody>(
    url: string,
    body?: TBody,
    config?: AxiosRequestConfig,
  ) {
    const response = await apiClient.post<ApiResponse<TMetadata>>(
      url,
      body,
      config,
    )
    return response.data
  },
}
```

Cach dung:

```ts
const user = await httpService.get<User>('/auth/me')
```

`user` luc nay la `metadata`, khong phai full response.

Neu can lay ca `message`, `status_code`:

```ts
const response = await httpService.getApiResponse<User>('/auth/me')

console.log(response.message)
console.log(response.status_code)
console.log(response.metadata)
```

---

## 9. Auth API service

Tao `src/modules/auth/api/auth.api.ts`:

```ts
import { httpService } from '@/services/http.service'
import type {
  AuthPayload,
  LoginRequest,
  RegisterRequest,
  User,
} from '@/modules/auth/types/auth.type'

export const AUTH_URL = {
  LOGIN: '/auth/login',
  ME: '/auth/me',
  REFRESH: '/auth/refresh',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
}

export const AuthService = {
  login(data: LoginRequest) {
    return httpService.post<AuthPayload, LoginRequest>(AUTH_URL.LOGIN, data)
  },

  me() {
    return httpService.get<User>(AUTH_URL.ME)
  },

  refreshToken() {
    return httpService.post<AuthPayload>(AUTH_URL.REFRESH)
  },

  register(data: RegisterRequest) {
    return httpService.post<
      Omit<User, 'user_name_created' | 'user_name_updated'>,
      RegisterRequest
    >(AUTH_URL.REGISTER, data)
  },

  logout() {
    return httpService.post<void>(AUTH_URL.LOGOUT)
  },
}
```

---

## 10. React Query config

Tao `src/configs/query-client.config.ts`:

```ts
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10_000,
      refetchOnWindowFocus: false,
    },
  },
})
```

Tao `src/main.tsx`:

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { setupAxiosInterceptors } from '@/configs/axios.config'
import { queryClient } from '@/configs/query-client.config'
import App from './App'
import './style.css'

setupAxiosInterceptors()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
```

Tao `src/App.tsx`:

```tsx
import { AppRouter } from '@/router/AppRouter'

export default function App() {
  return <AppRouter />
}
```

---

## 11. Router va route meta trong React

Vue Router co `route.meta`. React Router khong co `meta` theo cach tuong tu, nen tu tao route config.

Tao `src/router/routes.tsx`:

```tsx
import type { ReactNode } from 'react'
import DashboardPage from '@/modules/dashboard/pages/DashboardPage'
import LoginPage from '@/modules/auth/pages/LoginPage'
import UserListPage from '@/modules/iam/users/pages/UserListPage'

export type LayoutName = 'base' | 'blank'

export type RouteMeta = {
  layout?: LayoutName
  title?: string
  affix?: boolean
  guestOnly?: boolean
  bypassAuth?: boolean
}

export type AppRoute = {
  path: string
  name: string
  element: ReactNode
  meta: RouteMeta
}

export const appRoutes: AppRoute[] = [
  {
    path: '/login',
    name: 'login',
    element: <LoginPage />,
    meta: {
      layout: 'blank',
      title: 'Login',
      guestOnly: true,
    },
  },
  {
    path: '/',
    name: 'dashboard',
    element: <DashboardPage />,
    meta: {
      layout: 'base',
      title: 'Dashboard',
      affix: true,
    },
  },
  {
    path: '/users',
    name: 'users',
    element: <UserListPage />,
    meta: {
      layout: 'base',
      title: 'Users',
    },
  },
]
```

Tao `src/router/RouteGuard.tsx`:

```tsx
import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import type { AppRoute } from '@/router/routes'
import { useAuthStore } from '@/stores/auth.store'

type RouteGuardProps = {
  route: AppRoute
  children: ReactNode
}

export function RouteGuard({ route, children }: RouteGuardProps) {
  const location = useLocation()
  const accessToken = useAuthStore((state) => state.accessToken)
  const isAuthenticated = Boolean(accessToken)

  if (route.meta.guestOnly && isAuthenticated) {
    return <Navigate to="/" replace />
  }

  if (!route.meta.guestOnly && !route.meta.bypassAuth && !isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}
```

Tao `src/router/AppRouter.tsx`:

```tsx
import { useEffect, type ComponentType, type ReactNode } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import BaseLayout from '@/components/layouts/BaseLayout'
import BlankLayout from '@/components/layouts/BlankLayout'
import { useAppStore } from '@/stores/app.store'
import { appRoutes, type AppRoute, type RouteMeta } from './routes'
import { RouteGuard } from './RouteGuard'

type LayoutProps = {
  children: ReactNode
  routeMeta?: RouteMeta
}

const layouts: Record<string, ComponentType<LayoutProps>> = {
  base: BaseLayout,
  blank: BlankLayout,
}

function PageLoadingWatcher() {
  const location = useLocation()
  const startPageLoading = useAppStore((state) => state.startPageLoading)
  const finishPageLoading = useAppStore((state) => state.finishPageLoading)

  useEffect(() => {
    startPageLoading()
    const timer = window.setTimeout(() => {
      finishPageLoading()
    }, 250)

    return () => {
      window.clearTimeout(timer)
    }
  }, [location.pathname, location.search, startPageLoading, finishPageLoading])

  return null
}

function PageProgress() {
  const isPageLoading = useAppStore((state) => state.isPageLoading)

  if (!isPageLoading) return null

  return (
    <div className="fixed inset-x-0 top-0 z-[100] h-0.5 overflow-hidden">
      <div className="h-full w-full origin-left animate-[page-progress_1.1s_ease-in-out_infinite] bg-primary" />
    </div>
  )
}

function RouteElement({ route }: { route: AppRoute }) {
  const layoutName = route.meta.layout ?? 'blank'
  const Layout = layouts[layoutName] ?? BlankLayout

  return (
    <RouteGuard route={route}>
      <Layout routeMeta={route.meta}>{route.element}</Layout>
    </RouteGuard>
  )
}

export function AppRouter() {
  return (
    <>
      <PageLoadingWatcher />
      <PageProgress />
      <Routes>
        {appRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<RouteElement route={route} />}
          />
        ))}
        <Route path="*" element={<div className="p-6">404 Not Found</div>} />
      </Routes>
    </>
  )
}
```

Them animation vao `src/style.css`:

```css
@keyframes page-progress {
  0% {
    transform: translateX(-100%) scaleX(0.35);
  }
  55% {
    transform: translateX(15%) scaleX(0.65);
  }
  100% {
    transform: translateX(100%) scaleX(0.35);
  }
}
```

---

## 12. Base layout, sidebar, header, tab bar

Layout trong Vue hien tai co cau truc:

```txt
BaseLayout
  SidebarSection
  main-area
    HeaderSection
    TabBar
    page-content
      current page
```

React cung lam y nhu vay.

### 12.1 Blank layout

Tao `src/components/layouts/BlankLayout.tsx`:

```tsx
import type { ReactNode } from 'react'

type BlankLayoutProps = {
  children: ReactNode
}

export default function BlankLayout({ children }: BlankLayoutProps) {
  return <>{children}</>
}
```

### 12.2 Base layout

Tao `src/components/layouts/BaseLayout.tsx`:

```tsx
import { useEffect, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import type { RouteMeta } from '@/router/routes'
import { useAppStore } from '@/stores/app.store'
import { useSidebarStore } from '@/stores/sidebar.store'
import { useTabsStore } from '@/stores/tabs.store'
import HeaderSection from './partials/HeaderSection'
import SidebarSection from './partials/SidebarSection'
import TabBar from './partials/TabBar'

type BaseLayoutProps = {
  children: ReactNode
  routeMeta?: RouteMeta
}

export default function BaseLayout({ children, routeMeta }: BaseLayoutProps) {
  const location = useLocation()
  const isCollapsed = useSidebarStore((state) => state.isCollapsed)
  const isPageLoading = useAppStore((state) => state.isPageLoading)
  const openTab = useTabsStore((state) => state.openTab)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    const path = `${location.pathname}${location.search}`

    openTab({
      key: path,
      title: routeMeta?.title ?? 'Page',
      path,
      affix: routeMeta?.affix,
    })
  }, [
    location.pathname,
    location.search,
    routeMeta?.title,
    routeMeta?.affix,
    openTab,
  ])

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {isMobileOpen ? (
        <button
          type="button"
          aria-label="Close sidebar backdrop"
          className="fixed inset-0 z-40 bg-black/45 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      ) : null}

      <div
        className={[
          'fixed inset-y-0 left-0 z-50 transition-[width] duration-300 md:static md:z-auto',
          isCollapsed ? 'w-[58px]' : 'w-[220px]',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        ].join(' ')}
      >
        <SidebarSection />
      </div>

      <div className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
        <HeaderSection onOpenMobileSidebar={() => setIsMobileOpen(true)} />
        <TabBar />

        <main className="relative min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-background p-5 md:p-6">
          {isPageLoading ? (
            <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background/70 backdrop-blur">
              <div className="rounded-lg border bg-card px-6 py-4 text-sm text-muted-foreground shadow">
                Loading...
              </div>
            </div>
          ) : null}

          {children}
        </main>
      </div>
    </div>
  )
}
```

### 12.3 Sidebar data

Tao `src/components/layouts/partials/sidebar-data.tsx`:

```tsx
import type { LucideIcon } from 'lucide-react'
import {
  BarChart3,
  Building2,
  FileText,
  FolderKanban,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Users,
} from 'lucide-react'

export interface SidebarItem {
  key: string
  title: string
  path?: string
  icon?: LucideIcon
  children?: SidebarItem[]
  badge?: string | number
  affix?: boolean
}

export interface SidebarGroup {
  groupKey: string
  groupLabel?: string
  items: SidebarItem[]
}

export const sidebarData: SidebarGroup[] = [
  {
    groupKey: 'main',
    items: [
      {
        key: 'dashboard',
        title: 'Dashboard',
        path: '/',
        icon: LayoutDashboard,
        affix: true,
      },
    ],
  },
  {
    groupKey: 'management',
    groupLabel: 'Management',
    items: [
      {
        key: 'users',
        title: 'Users',
        path: '/users',
        icon: Users,
      },
      {
        key: 'organizations',
        title: 'Organizations',
        path: '/organizations',
        icon: Building2,
        children: [
          {
            key: 'org-list',
            title: 'List',
            path: '/organizations',
          },
          {
            key: 'org-settings',
            title: 'Settings',
            path: '/organizations/settings',
          },
        ],
      },
    ],
  },
  {
    groupKey: 'system',
    groupLabel: 'System',
    items: [
      {
        key: 'analytics',
        title: 'Analytics',
        path: '/analytics',
        icon: BarChart3,
      },
      {
        key: 'documents',
        title: 'Documents',
        path: '/documents',
        icon: FileText,
      },
      {
        key: 'projects',
        title: 'Projects',
        path: '/projects',
        icon: FolderKanban,
      },
      {
        key: 'settings',
        title: 'Settings',
        path: '/settings',
        icon: Settings,
        children: [
          {
            key: 'settings-general',
            title: 'General',
            path: '/settings/general',
          },
          {
            key: 'settings-security',
            title: 'Security',
            path: '/settings/security',
            icon: ShieldCheck,
          },
        ],
      },
    ],
  },
]
```

### 12.4 Sidebar component

Tao `src/components/layouts/partials/SidebarSection.tsx`:

```tsx
import { useMemo, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSidebarStore } from '@/stores/sidebar.store'
import { useTabsStore } from '@/stores/tabs.store'
import { sidebarData, type SidebarItem } from './sidebar-data'

export default function SidebarSection() {
  const location = useLocation()
  const navigate = useNavigate()
  const isCollapsed = useSidebarStore((state) => state.isCollapsed)
  const openTab = useTabsStore((state) => state.openTab)
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set())

  const activeParentKeys = useMemo(() => {
    const keys = new Set<string>()

    for (const group of sidebarData) {
      for (const item of group.items) {
        if (item.children?.some((child) => child.path === location.pathname)) {
          keys.add(item.key)
        }
      }
    }

    return keys
  }, [location.pathname])

  const isExpanded = (key: string) =>
    expandedKeys.has(key) || activeParentKeys.has(key)

  const toggleExpand = (key: string) => {
    setExpandedKeys((current) => {
      const next = new Set(current)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  const isActive = (path?: string) =>
    Boolean(path && location.pathname === path)

  const isParentActive = (item: SidebarItem) => {
    return item.children?.some((child) => isActive(child.path)) ?? false
  }

  const handleClick = (item: SidebarItem) => {
    if (item.children?.length) {
      if (!isCollapsed) toggleExpand(item.key)
      return
    }

    if (!item.path) return

    openTab({
      key: item.path,
      title: item.title,
      path: item.path,
      affix: item.affix,
    })

    navigate(item.path)
  }

  const renderItem = (item: SidebarItem, isChild = false) => {
    const Icon = item.icon
    const active = isChild
      ? isActive(item.path)
      : isActive(item.path) || isParentActive(item)

    return (
      <button
        key={item.key}
        type="button"
        title={isCollapsed ? item.title : undefined}
        className={[
          'mx-2 flex h-10 w-[calc(100%-16px)] items-center gap-2 rounded-md px-3 text-left text-sm transition',
          active
            ? 'bg-primary/15 text-primary'
            : 'text-muted-foreground hover:bg-accent hover:text-foreground',
          isCollapsed && !isChild ? 'mx-auto w-10 justify-center px-0' : '',
          isChild ? 'h-9 pl-9 text-[13px]' : '',
        ].join(' ')}
        onClick={() => handleClick(item)}
      >
        {Icon ? (
          <Icon size={18} className="shrink-0" />
        ) : isChild ? (
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
        ) : null}

        {!isCollapsed ? (
          <>
            <span className="min-w-0 flex-1 truncate">{item.title}</span>
            {item.badge ? (
              <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                {item.badge}
              </span>
            ) : null}
            {item.children?.length ? (
              <ChevronRight
                size={14}
                className={[
                  'transition-transform',
                  isExpanded(item.key) ? 'rotate-90' : '',
                ].join(' ')}
              />
            ) : null}
          </>
        ) : null}
      </button>
    )
  }

  return (
    <aside className="flex h-full flex-col overflow-hidden border-r bg-sidebar text-sidebar-foreground">
      <div className="flex h-12 shrink-0 items-center border-b px-3 font-semibold">
        {isCollapsed ? 'A' : 'Admin'}
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto py-2">
        {sidebarData.map((group) => (
          <div key={group.groupKey}>
            {group.groupLabel && !isCollapsed ? (
              <div className="px-4 pb-1 pt-3 text-[10px] font-semibold uppercase text-muted-foreground">
                {group.groupLabel}
              </div>
            ) : null}

            {group.items.map((item) => (
              <div key={item.key}>
                {renderItem(item)}
                {item.children?.length &&
                isExpanded(item.key) &&
                !isCollapsed ? (
                  <div className="py-1">
                    {item.children.map((child) => renderItem(child, true))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        ))}
      </nav>

      <div className="border-t p-3 text-xs text-muted-foreground">
        {isCollapsed ? 'v1' : 'Version 1.0.0'}
      </div>
    </aside>
  )
}
```

### 12.5 Header

Tao `src/components/layouts/partials/HeaderSection.tsx`:

```tsx
import {
  Bell,
  Maximize,
  Menu,
  PanelLeft,
  RefreshCcw,
  Search,
} from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { appRoutes } from '@/router/routes'
import { useAppStore } from '@/stores/app.store'
import { useSidebarStore } from '@/stores/sidebar.store'

type HeaderSectionProps = {
  onOpenMobileSidebar: () => void
}

export default function HeaderSection({
  onOpenMobileSidebar,
}: HeaderSectionProps) {
  const location = useLocation()
  const toggleSidebar = useSidebarStore((state) => state.toggle)
  const startPageLoading = useAppStore((state) => state.startPageLoading)
  const finishPageLoading = useAppStore((state) => state.finishPageLoading)

  const currentRoute = appRoutes.find(
    (route) => route.path === location.pathname,
  )
  const title = currentRoute?.meta.title ?? 'Page'

  const reloadPage = () => {
    startPageLoading()
    window.setTimeout(() => {
      finishPageLoading()
    }, 800)
  }

  return (
    <header className="flex h-12 shrink-0 items-center justify-between gap-3 border-b bg-card px-4">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground md:hidden"
          onClick={onOpenMobileSidebar}
          aria-label="Open sidebar"
        >
          <Menu size={17} />
        </button>

        <button
          type="button"
          className="hidden h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground md:flex"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <PanelLeft size={17} />
        </button>

        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
          onClick={reloadPage}
          aria-label="Reload page"
        >
          <RefreshCcw size={15} />
        </button>

        <div className="h-4 w-px bg-border" />
        <div className="truncate text-sm font-medium">{title}</div>
      </div>

      <div className="hidden h-8 min-w-[180px] items-center gap-2 rounded-md border bg-muted px-2 md:flex">
        <Search size={14} className="text-muted-foreground" />
        <input
          className="min-w-0 flex-1 bg-transparent text-xs outline-none"
          placeholder="Search..."
        />
      </div>

      <button
        type="button"
        className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
        aria-label="Fullscreen"
      >
        <Maximize size={16} />
      </button>

      <button
        type="button"
        className="relative flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
        aria-label="Notifications"
      >
        <Bell size={16} />
        <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-destructive" />
      </button>
    </header>
  )
}
```

### 12.6 TabBar dieu huong theo route

TabBar nay giong tab bar trong layout Vue: moi route duoc mo thanh mot tab.

Tao `src/components/layouts/partials/TabBar.tsx`:

```tsx
import { Pin, X } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTabsStore, type TabItem } from '@/stores/tabs.store'

export default function TabBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const tabs = useTabsStore((state) => state.tabs)
  const activeKey = useTabsStore((state) => state.activeKey)
  const setActiveTab = useTabsStore((state) => state.setActiveTab)
  const closeTab = useTabsStore((state) => state.closeTab)
  const closeOtherTabs = useTabsStore((state) => state.closeOtherTabs)
  const closeAllTabs = useTabsStore((state) => state.closeAllTabs)

  const navigateToTab = (tab: TabItem) => {
    setActiveTab(tab.key)
    navigate(tab.path)
  }

  const closeAndNavigate = (key: string) => {
    closeTab(key)

    const state = useTabsStore.getState()
    const activeTab = state.tabs.find((tab) => tab.key === state.activeKey)

    if (activeTab && activeTab.path !== location.pathname) {
      navigate(activeTab.path)
    }
  }

  const closeOthersAndNavigate = (key: string) => {
    closeOtherTabs(key)
    const tab = useTabsStore.getState().tabs.find((item) => item.key === key)
    if (tab) navigate(tab.path)
  }

  const closeAllAndNavigate = () => {
    closeAllTabs()
    const first = useTabsStore.getState().tabs[0]
    if (first) navigate(first.path)
  }

  return (
    <div className="h-[38px] shrink-0 overflow-hidden border-b bg-card">
      <div className="flex h-full items-center gap-1 overflow-x-auto px-2 [scrollbar-width:none]">
        {tabs.map((tab) => {
          const active = tab.key === activeKey

          return (
            <div
              key={tab.key}
              className={[
                'group flex h-7 shrink-0 items-center gap-1.5 rounded-md border px-2 text-xs font-medium transition',
                active
                  ? 'border-primary/30 bg-primary/10 text-primary'
                  : 'border-transparent text-muted-foreground hover:bg-accent hover:text-foreground',
              ].join(' ')}
              onClick={() => navigateToTab(tab)}
              onContextMenu={(event) => {
                event.preventDefault()
                closeOthersAndNavigate(tab.key)
              }}
            >
              {active ? (
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              ) : null}
              <span className="max-w-[120px] truncate">{tab.title}</span>
              {tab.affix ? <Pin size={10} /> : null}

              {!tab.affix ? (
                <button
                  type="button"
                  className="flex h-4 w-4 items-center justify-center rounded opacity-60 hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                  onClick={(event) => {
                    event.stopPropagation()
                    closeAndNavigate(tab.key)
                  }}
                  aria-label={`Close ${tab.title}`}
                >
                  <X size={11} />
                </button>
              ) : null}
            </div>
          )
        })}

        {tabs.length > 1 ? (
          <button
            type="button"
            className="ml-auto shrink-0 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
            onClick={closeAllAndNavigate}
          >
            Close all
          </button>
        ) : null}
      </div>
    </div>
  )
}
```

Ghi chu:

- Trong Vue, tab mo bang `watch(route.fullPath)`.
- Trong React, tab mo bang `useEffect` trong `BaseLayout`.
- Key cua tab nen la `pathname + search`, vi `/users?page=1` va `/users?page=2` co the can phan biet tuy nhu cau.

---

## 13. UI utility co ban

Tao `src/lib/utils.ts`:

```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

Tao `src/components/ui/button.tsx`:

```tsx
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'icon'
}

export function Button({
  className,
  variant = 'default',
  size = 'md',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition disabled:pointer-events-none disabled:opacity-50',
        variant === 'default' &&
          'bg-primary text-primary-foreground hover:bg-primary/90',
        variant === 'outline' &&
          'border bg-background hover:bg-accent hover:text-accent-foreground',
        variant === 'ghost' && 'hover:bg-accent hover:text-accent-foreground',
        variant === 'destructive' &&
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        size === 'sm' && 'h-8 px-3 text-xs',
        size === 'md' && 'h-9 px-4',
        size === 'icon' && 'h-8 w-8',
        className,
      )}
      {...props}
    />
  )
}
```

Tao `src/components/ui/input.tsx`:

```tsx
import type { InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type InputProps = InputHTMLAttributes<HTMLInputElement>

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'flex h-9 w-full rounded-md border bg-background px-3 py-1 text-sm outline-none transition placeholder:text-muted-foreground focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}
```

Tao `src/components/ui/table.tsx`:

```tsx
import type {
  HTMLAttributes,
  TableHTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from 'react'
import { cn } from '@/lib/utils'

export function Table({
  className,
  ...props
}: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-auto">
      <table
        className={cn('w-full caption-bottom text-sm', className)}
        {...props}
      />
    </div>
  )
}

export function TableHeader({
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn('[&_tr]:border-b', className)} {...props} />
}

export function TableBody({
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={cn('[&_tr:last-child]:border-0', className)} {...props} />
  )
}

export function TableRow({
  className,
  ...props
}: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn('border-b transition-colors hover:bg-muted/50', className)}
      {...props}
    />
  )
}

export function TableHead({
  className,
  ...props
}: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        'h-10 px-3 text-left align-middle font-medium text-muted-foreground',
        className,
      )}
      {...props}
    />
  )
}

export function TableCell({
  className,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn('px-3 py-2 align-middle', className)} {...props} />
}
```

---

## 14. Xay dung DataTable bang TanStack React Table

Ban dau nen lam DataTable ban on dinh truoc:

- render header/cell
- sort
- global search
- pagination
- row selection
- loading/empty state

Sau khi chay tot moi them column resize, pinning, virtual scroll.

### 14.1 DataTable component

Tao `src/components/tables/DataTable.tsx`:

```tsx
import { useMemo, useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import DataTableToolbar from './DataTableToolbar'
import DataTablePagination from './DataTablePagination'

export type ToolbarOptions = {
  enabled?: boolean
  search?: boolean
  createLabel?: string
  refresh?: boolean
  export?: boolean
  onCreate?: () => void
  onRefresh?: () => void
  onExport?: () => void
}

export type PaginationOptions = {
  enabled?: boolean
  pageSize?: number
  pageSizeOptions?: number[]
}

export type SelectionOptions<TData> = {
  enabled?: boolean
  selectable?: (row: TData) => boolean
}

export type DataTableProps<TData, TValue> = {
  data: TData[]
  columns: ColumnDef<TData, TValue>[]
  rowKey?: string | ((row: TData) => string)
  loading?: boolean
  emptyText?: string
  toolbar?: ToolbarOptions
  pagination?: PaginationOptions
  selection?: SelectionOptions<TData>
  onRowClick?: (row: TData) => void
  onSelectionChange?: (selection: RowSelectionState) => void
  onPaginationChange?: (pagination: PaginationState) => void
}

function resolveRowId<TData>(
  row: TData,
  rowKey: DataTableProps<TData, unknown>['rowKey'],
) {
  if (typeof rowKey === 'function') return rowKey(row)
  if (typeof rowKey === 'string')
    return String((row as Record<string, unknown>)[rowKey])
  return undefined
}

export default function DataTable<TData, TValue>({
  data,
  columns,
  rowKey,
  loading = false,
  emptyText = 'No results.',
  toolbar,
  pagination: paginationOptions,
  selection,
  onRowClick,
  onSelectionChange,
  onPaginationChange,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [globalFilter, setGlobalFilter] = useState('')
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: paginationOptions?.pageSize ?? 10,
  })

  const selectionColumn = useMemo<ColumnDef<TData, TValue>>(
    () => ({
      id: 'select',
      size: 48,
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={(event) =>
            table.toggleAllPageRowsSelected(event.target.checked)
          }
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onChange={(event) => row.toggleSelected(event.target.checked)}
          onClick={(event) => event.stopPropagation()}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    }),
    [],
  )

  const mergedColumns = useMemo(() => {
    if (!selection?.enabled) return columns
    return [selectionColumn, ...columns]
  }, [columns, selection?.enabled, selectionColumn])

  const table = useReactTable({
    data,
    columns: mergedColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: (updaterOrValue) => {
      setRowSelection((current) => {
        const next =
          typeof updaterOrValue === 'function'
            ? updaterOrValue(current)
            : updaterOrValue
        onSelectionChange?.(next)
        return next
      })
    },
    onPaginationChange: (updaterOrValue) => {
      setPagination((current) => {
        const next =
          typeof updaterOrValue === 'function'
            ? updaterOrValue(current)
            : updaterOrValue
        onPaginationChange?.(next)
        return next
      })
    },
    enableRowSelection: (row) => {
      if (!selection?.enabled) return false
      return selection.selectable?.(row.original) ?? true
    },
    getRowId: rowKey ? (row) => resolveRowId(row, rowKey) ?? '' : undefined,
  })

  const leafColumnCount = table.getAllLeafColumns().length

  return (
    <div className="space-y-4">
      {toolbar?.enabled !== false ? (
        <DataTableToolbar table={table} options={toolbar} />
      ) : null}

      <div className="rounded-md border bg-background">
        <Table>
          <TableHeader className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={row.getIsSelected() ? 'bg-muted/70' : ''}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={leafColumnCount}
                  className="h-24 text-center text-muted-foreground"
                >
                  {loading ? 'Loading...' : emptyText}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {paginationOptions?.enabled !== false ? (
        <DataTablePagination
          table={table}
          pageSizeOptions={paginationOptions?.pageSizeOptions}
        />
      ) : null}
    </div>
  )
}
```

### 14.2 Toolbar

Tao `src/components/tables/DataTableToolbar.tsx`:

```tsx
import type { Table } from '@tanstack/react-table'
import { Download, Plus, RefreshCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { ToolbarOptions } from './DataTable'

type DataTableToolbarProps<TData> = {
  table: Table<TData>
  options?: ToolbarOptions
}

export default function DataTableToolbar<TData>({
  table,
  options,
}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {options?.search !== false ? (
          <Input
            placeholder="Search all columns..."
            value={(table.getState().globalFilter as string) ?? ''}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            className="h-8 w-[180px] lg:w-[260px]"
          />
        ) : null}
      </div>

      <div className="flex items-center gap-2">
        {options?.refresh ? (
          <Button variant="outline" size="sm" onClick={options.onRefresh}>
            <RefreshCcw size={14} />
            Refresh
          </Button>
        ) : null}

        {options?.export ? (
          <Button variant="outline" size="sm" onClick={options.onExport}>
            <Download size={14} />
            Export
          </Button>
        ) : null}

        {options?.createLabel ? (
          <Button size="sm" onClick={options.onCreate}>
            <Plus size={14} />
            {options.createLabel}
          </Button>
        ) : null}
      </div>
    </div>
  )
}
```

### 14.3 Pagination

Tao `src/components/tables/DataTablePagination.tsx`:

```tsx
import type { Table } from '@tanstack/react-table'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

type DataTablePaginationProps<TData> = {
  table: Table<TData>
  pageSizeOptions?: number[]
}

export default function DataTablePagination<TData>({
  table,
  pageSizeOptions = [10, 20, 30, 40, 50],
}: DataTablePaginationProps<TData>) {
  return (
    <div className="flex flex-col gap-3 px-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{' '}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Rows per page</span>
          <select
            className="h-8 rounded-md border bg-background px-2 text-sm"
            value={table.getState().pagination.pageSize}
            onChange={(event) => table.setPageSize(Number(event.target.value))}
          >
            {pageSizeOptions.map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>

        <div className="w-[110px] text-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.setPageIndex(0)}
          >
            <ChevronsLeft size={15} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            <ChevronLeft size={15} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            <ChevronRight size={15} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            disabled={!table.getCanNextPage()}
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          >
            <ChevronsRight size={15} />
          </Button>
        </div>
      </div>
    </div>
  )
}
```

---

## 15. Tao columns cho table

Vi du tao user table.

Tao `src/modules/iam/users/components/user-columns.tsx`:

```tsx
import type { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

export type UserRow = {
  id: string
  name: string
  email: string
  role: 'admin' | 'user' | 'editor'
  status: 'active' | 'inactive' | 'banned'
  team: string
  createdAt: string
}

const statusClass: Record<UserRow['status'], string> = {
  active: 'border-primary/30 bg-primary text-primary-foreground',
  inactive: 'border-border bg-secondary text-secondary-foreground',
  banned: 'border-destructive/30 bg-destructive text-destructive-foreground',
}

export const userColumns: ColumnDef<UserRow>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Name
        <ArrowUpDown size={14} />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue('name')}</span>
    ),
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => {
      const role = row.getValue<UserRow['role']>('role')
      return <span className="text-xs font-semibold uppercase">{role}</span>
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue<UserRow['status']>('status')

      return (
        <span
          className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold uppercase ${statusClass[status]}`}
        >
          {status}
        </span>
      )
    },
  },
  {
    accessorKey: 'team',
    header: 'Team',
  },
  {
    accessorKey: 'createdAt',
    header: 'Joined Date',
  },
]
```

---

## 16. Goi API cho page users

Tao `src/modules/iam/users/api/user.api.ts`:

```ts
import { httpService } from '@/services/http.service'
import type { PaginatedResponse } from '@/types/pagination.type'
import type { UserRow } from '../components/user-columns'

export const UserService = {
  list() {
    return httpService.get<PaginatedResponse<UserRow>>('/users')
  },
}
```

Neu backend cua ban chua co endpoint `/users`, tam thoi mock data de test table.

Tao `src/modules/iam/users/pages/UserListPage.tsx`:

```tsx
import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import DataTable from '@/components/tables/DataTable'
import { UserService } from '../api/user.api'
import { userColumns, type UserRow } from '../components/user-columns'

const mockUsers: UserRow[] = Array.from({ length: 50 }, (_, index) => ({
  id: `USR-${String(index + 1).padStart(4, '0')}`,
  name: `User ${index + 1}`,
  email: `user${index + 1}@example.com`,
  role: index % 3 === 0 ? 'admin' : index % 3 === 1 ? 'editor' : 'user',
  status: index % 3 === 0 ? 'active' : index % 3 === 1 ? 'inactive' : 'banned',
  team: ['Platform', 'Design', 'Sales'][index % 3] ?? 'Platform',
  createdAt: new Date().toISOString().slice(0, 10),
}))

export default function UserListPage() {
  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: UserService.list,
    enabled: false,
  })

  const data = useMemo(() => {
    return usersQuery.data?.data ?? mockUsers
  }, [usersQuery.data])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Users Management</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage users, roles, teams, and account status.
        </p>
      </div>

      <DataTable
        data={data}
        columns={userColumns}
        rowKey="id"
        loading={usersQuery.isLoading}
        selection={{ enabled: true }}
        toolbar={{
          createLabel: 'Add User',
          refresh: true,
          export: true,
          onCreate: () => console.log('Create user'),
          onRefresh: () => usersQuery.refetch(),
          onExport: () => console.log('Export users'),
        }}
        pagination={{
          pageSize: 20,
          pageSizeOptions: [10, 20, 30, 50],
        }}
        onRowClick={(row) => console.log('Open row', row)}
      />
    </div>
  )
}
```

Khi backend da san sang, doi:

```ts
enabled: false
```

thanh:

```ts
enabled: true
```

---

## 17. Table server-side pagination

Neu backend tra du lieu phan trang, flow se khac:

1. Luu `page`, `pageSize`, `search` trong state cua page.
2. Truyen params len API.
3. DataTable chi render data server tra ve.
4. Khi user doi page, update state page, React Query tu fetch lai.

Vi du API:

```ts
type UserListParams = {
  page: number
  per_page: number
  search?: string
}

export const UserService = {
  list(params: UserListParams) {
    return httpService.get<PaginatedResponse<UserRow>>('/users', {
      params,
    })
  },
}
```

Trong page:

```tsx
const [page, setPage] = useState(1)
const [pageSize, setPageSize] = useState(20)

const usersQuery = useQuery({
  queryKey: ['users', page, pageSize],
  queryFn: () => UserService.list({ page, per_page: pageSize }),
})

<DataTable
  data={usersQuery.data?.data ?? []}
  columns={userColumns}
  pagination={{ pageSize }}
  onPaginationChange={(pagination) => {
    setPage(pagination.pageIndex + 1)
    setPageSize(pagination.pageSize)
  }}
/>
```

Can nang cap DataTable de ho tro manual mode neu muon server-side chuan hon:

- Them prop `manualMode?: boolean`
- Truyen vao `useReactTable`: `manualPagination`, `manualSorting`, `manualFiltering`
- Truyen `pageCount` tu backend vao table

---

## 18. Tao tabs ben trong page

Co 2 loai tab:

- `TabBar` cua layout: tab dieu huong theo route, nhu `/users`, `/settings`.
- `Tabs` trong page: tab noi dung, vi du "Profile", "Security", "Activity".

Phan nay la tabs trong page.

Tao `src/components/ui/tabs.tsx`:

```tsx
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type TabItem = {
  value: string
  label: string
  content: ReactNode
  disabled?: boolean
}

type TabsProps = {
  value: string
  items: TabItem[]
  onValueChange: (value: string) => void
}

export function Tabs({ value, items, onValueChange }: TabsProps) {
  const activeItem = items.find((item) => item.value === value) ?? items[0]

  return (
    <div className="space-y-4">
      <div
        className="inline-flex h-9 items-center rounded-md bg-muted p-1"
        role="tablist"
      >
        {items.map((item) => (
          <button
            key={item.value}
            type="button"
            role="tab"
            disabled={item.disabled}
            aria-selected={value === item.value}
            className={cn(
              'inline-flex h-7 items-center justify-center rounded px-3 text-sm font-medium transition disabled:pointer-events-none disabled:opacity-50',
              value === item.value
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
            onClick={() => onValueChange(item.value)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div role="tabpanel">{activeItem?.content}</div>
    </div>
  )
}
```

Cach dung trong page:

```tsx
import { useState } from 'react'
import { Tabs } from '@/components/ui/tabs'

export default function UserDetailPage() {
  const [tab, setTab] = useState('profile')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">User Detail</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View and update user information.
        </p>
      </div>

      <Tabs
        value={tab}
        onValueChange={setTab}
        items={[
          {
            value: 'profile',
            label: 'Profile',
            content: (
              <div className="rounded-md border p-4">Profile form here</div>
            ),
          },
          {
            value: 'security',
            label: 'Security',
            content: (
              <div className="rounded-md border p-4">
                Password and permissions here
              </div>
            ),
          },
          {
            value: 'activity',
            label: 'Activity',
            content: (
              <div className="rounded-md border p-4">Login history here</div>
            ),
          },
        ]}
      />
    </div>
  )
}
```

---

## 19. Cach tao mot module moi tu A den Z

Vi du tao module `reports`.

### Buoc 1: Tao page

Tao `src/modules/reports/pages/ReportsPage.tsx`:

```tsx
export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View system reports and analytics.
        </p>
      </div>

      <div className="rounded-md border bg-card p-4">Reports content</div>
    </div>
  )
}
```

### Buoc 2: Them route

Mo `src/router/routes.tsx`, import page:

```tsx
import ReportsPage from '@/modules/reports/pages/ReportsPage'
```

Them vao `appRoutes`:

```tsx
{
  path: '/reports',
  name: 'reports',
  element: <ReportsPage />,
  meta: {
    layout: 'base',
    title: 'Reports',
  },
}
```

### Buoc 3: Them sidebar

Mo `src/components/layouts/partials/sidebar-data.tsx`, import icon:

```tsx
import { BarChart3 } from 'lucide-react'
```

Them item:

```tsx
{
  key: 'reports',
  title: 'Reports',
  path: '/reports',
  icon: BarChart3,
}
```

### Buoc 4: Neu can goi API

Tao `src/modules/reports/api/report.api.ts`:

```ts
import { httpService } from '@/services/http.service'

export type ReportSummary = {
  total_users: number
  total_orders: number
}

export const ReportService = {
  summary() {
    return httpService.get<ReportSummary>('/reports/summary')
  },
}
```

Trong page:

```tsx
import { useQuery } from '@tanstack/react-query'
import { ReportService } from '../api/report.api'

export default function ReportsPage() {
  const summaryQuery = useQuery({
    queryKey: ['reports', 'summary'],
    queryFn: ReportService.summary,
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reports</h1>

      <div className="rounded-md border p-4">
        {summaryQuery.isLoading
          ? 'Loading...'
          : JSON.stringify(summaryQuery.data)}
      </div>
    </div>
  )
}
```

---

## 20. CSS variables toi thieu

Neu chua co design system, them tam vao `src/style.css`:

```css
@import 'tailwindcss';

:root {
  --background: #ffffff;
  --foreground: #0f172a;
  --card: #ffffff;
  --muted: #f1f5f9;
  --muted-foreground: #64748b;
  --border: #e2e8f0;
  --accent: #f1f5f9;
  --primary: #0f766e;
  --primary-foreground: #ffffff;
  --secondary: #f1f5f9;
  --secondary-foreground: #0f172a;
  --destructive: #dc2626;
  --destructive-foreground: #ffffff;
  --ring: #14b8a6;
  --sidebar: #ffffff;
  --sidebar-foreground: #0f172a;
}

.dark {
  --background: #020617;
  --foreground: #e5e7eb;
  --card: #0f172a;
  --muted: #1e293b;
  --muted-foreground: #94a3b8;
  --border: #1e293b;
  --accent: #1e293b;
  --primary: #14b8a6;
  --primary-foreground: #042f2e;
  --secondary: #1e293b;
  --secondary-foreground: #e5e7eb;
  --destructive: #ef4444;
  --destructive-foreground: #ffffff;
  --ring: #2dd4bf;
  --sidebar: #0f172a;
  --sidebar-foreground: #e5e7eb;
}

body {
  margin: 0;
  background: var(--background);
  color: var(--foreground);
}
```

Neu Tailwind khong nhan class nhu `bg-background`, can khai bao theme token theo cach Tailwind ban dang dung. Cach don gian de hoc truoc la dung class mau truc tiep nhu `bg-white`, `text-slate-900`, sau do moi chuyen sang token.

---

## 21. Checklist chuyen tu Vue sang React

Lam theo thu tu nay se de debug nhat:

1. Tao Vite React project.
2. Cai axios, react-router-dom, zustand, react-query, react-table, lucide-react.
3. Cau hinh alias `@`.
4. Tao `ApiResponse`, `PaginatedResponse`, `BaseEntity`.
5. Tao Zustand stores: auth, app, sidebar, tabs.
6. Tao axios config va `setupAxiosInterceptors()`.
7. Tao `httpService`.
8. Tao `AuthService`.
9. Tao `queryClient` va boc app bang `QueryClientProvider`.
10. Tao route config co `meta`.
11. Tao `RouteGuard`.
12. Tao `BaseLayout`, `BlankLayout`.
13. Tao `SidebarSection`, `HeaderSection`, `TabBar`.
14. Tao page dashboard de test layout.
15. Tao DataTable co search, sort, pagination.
16. Tao columns va page users.
17. Tao tabs trong page neu can.
18. Sau khi ban basic chay tot, moi them column pinning, resize, virtual scroll.

---

## 22. Loi thuong gap

### Goi hook React trong axios interceptor

Sai:

```ts
const accessToken = useAuthStore((state) => state.accessToken)
```

Dung:

```ts
const accessToken = useAuthStore.getState().accessToken
```

Ly do: interceptor nam ngoai component React, khong duoc goi hook.

### Nham type response

Sai:

```ts
httpService.get<ApiResponse<User>>('/auth/me')
```

Dung:

```ts
httpService.get<User>('/auth/me')
```

Ly do: `httpService.get<T>()` da unwrap `metadata`, nen `T` la type cua `metadata`.

### Tab khong hien title

Kiem tra route co `meta.title` chua:

```tsx
meta: {
  layout: 'base',
  title: 'Users',
}
```

### Sidebar click nhung page khong doi

Kiem tra 2 noi:

- `sidebar-data.tsx` co `path: '/users'`
- `routes.tsx` co route `path: '/users'`

Hai path phai trung nhau.

### Table khong sort duoc

Kiem tra column co dung accessor:

```tsx
{
  accessorKey: 'name',
  header: 'Name',
}
```

`accessorKey` phai trung key trong data:

```ts
type UserRow = {
  name: string
}
```

---

## 23. Ban nen copy logic nao tu Vue template

Nen giu:

- Shape cua `ApiResponse<TMetadata>`.
- `httpService` unwrap `metadata`.
- Interceptor refresh token co `_retry` va `refreshTokenPromise`.
- Module-based folder structure.
- Route meta: `layout`, `title`, `affix`, `guestOnly`, `bypassAuth`.
- Sidebar config bang data.
- Tab store persist vao localStorage.
- DataTable tach `columns`, `toolbar`, `pagination`.

Khong nen copy may moc:

- Vue `watch`, `computed`, `ref`: sang React thay bang `useEffect`, `useMemo`, `useState`.
- Pinia actions: sang Zustand actions.
- Vue slots: sang React props/render props/children.
- `h()` render function trong columns: sang JSX.

---

## 24. Thu tu test sau khi lam xong

Chay:

```sh
npm run dev
```

Test thu cong theo thu tu:

1. Vao `/login`, khong bi redirect lung tung.
2. Set tam token trong auth store hoac login that.
3. Vao `/`, thay BaseLayout co sidebar/header/tab.
4. Click sidebar `/users`, tab `Users` duoc mo.
5. Dong tab users, app quay ve tab con lai.
6. Refresh browser, tabs/sidebar collapsed van duoc persist.
7. Goi API `/auth/me`, request co header `Authorization`.
8. Khi access token het han, request 401 goi `/auth/refresh`.
9. Table users search/sort/pagination duoc.
10. Tabs trong page doi noi dung duoc.

Khi da qua 10 buoc nay, bo khung React da tuong duong template Vue hien tai.
