import { useEffect, useRef } from 'react'
import {
  BrowserRouter,
  Link,
  Navigate,
  NavLink,
  Outlet,
  Route,
  Routes,
  useLocation,
} from 'react-router'
import { PageState } from './components/common'
import { ProductListPage } from './features/products/ProductListPage'
import { ProductDetailsPage } from './features/products/ProductDetailsPage'
import { CartProvider } from './features/cart/CartProvider'
import { CartPage } from './features/cart/CartPage'
import { useCart } from './features/cart/useCart'

function StoreLayout() {
  const { count } = useCart()
  const { pathname } = useLocation()
  const main = useRef<HTMLElement>(null)
  useEffect(() => {
    main.current?.focus()
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:z-10 focus:bg-white focus:p-4"
      >
        Skip to content
      </a>
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex w-[1120px] items-center justify-between px-8 py-6">
          <Link
            to="/products"
            className="text-2xl font-semibold tracking-tight"
            aria-label="Everyday Store home"
          >
            everyday<span className="text-emerald-600">.</span>
          </Link>
          <nav
            aria-label="Main navigation"
            className="flex items-center gap-10 font-medium"
          >
            <NavLink
              to="/products"
              className={({ isActive }) =>
                isActive ? 'underline underline-offset-8' : 'hover:underline'
              }
            >
              Products
            </NavLink>
            <NavLink
              to="/cart"
              className="flex items-center gap-3 hover:underline"
            >
              Cart{' '}
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-sm text-emerald-950">
                {count}
              </span>
            </NavLink>
          </nav>
        </div>
      </header>
      <main
        id="main"
        ref={main}
        tabIndex={-1}
        className="mx-auto w-[1120px] flex-1 px-8 py-12 focus:outline-none"
      >
        <Outlet />
      </main>
      <footer className="mx-auto w-[1120px] px-8 py-8 text-sm text-stone-600">
        Everyday Store · Demo collection · Prices in USD
      </footer>
    </div>
  )
}

function NotFoundPage() {
  return (
    <>
      <h1 className="mb-8 text-4xl font-semibold">Page not found</h1>
      <PageState title="Let's get you back">
        <Link to="/products" className="underline underline-offset-4">
          Browse products
        </Link>
      </PageState>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route element={<StoreLayout />}>
            <Route index element={<Navigate to="/products" replace />} />
            <Route path="products" element={<ProductListPage />} />
            <Route path="products/:slug" element={<ProductDetailsPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </CartProvider>
    </BrowserRouter>
  )
}
