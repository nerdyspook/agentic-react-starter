import { Link, useParams } from 'react-router'
import { Button, PageState, Price } from '../../components/common'
import { useProduct } from './hooks'
import { useCart } from '../cart/useCart'
import { ProductGallery } from './ProductGallery'

export function ProductDetailsPage() {
  const { slug = '' } = useParams()
  const { state, retry } = useProduct(slug)
  const cart = useCart()
  const product = state.status === 'success' ? state.data : null
  const quantity =
    cart.state.lines.find((line) => line.productId === product?.id)?.quantity ??
    0
  return (
    <>
      <Link
        to="/products"
        className="mb-8 inline-block underline underline-offset-4"
      >
        Back to products
      </Link>
      <h1 className="mb-8 text-4xl font-semibold tracking-tight">
        {state.status === 'success' && state.data
          ? state.data.name
          : 'Product details'}
      </h1>
      {state.status === 'loading' && (
        <PageState title="Loading product">Getting the details…</PageState>
      )}
      {state.status === 'error' && (
        <PageState title="Product couldn't be loaded" error onRetry={retry}>
          Please try again.
        </PageState>
      )}
      {state.status === 'success' &&
        (state.data ? (
          <div className="grid grid-cols-2 items-start gap-12">
            <ProductGallery
              key={state.data.id}
              images={state.data.images}
              name={state.data.name}
            />
            <div className="rounded-xl border border-stone-200 bg-white p-8">
              <p className="mb-4 text-sm uppercase tracking-widest text-stone-500">
                {state.data.category}
              </p>
              <p className="mb-6 text-2xl font-medium">
                <Price minor={state.data.priceMinor} />
              </p>
              <p className="leading-relaxed text-stone-600">
                {state.data.description || 'Description unavailable.'}
              </p>
              <div className="mt-8">
                <Button
                  onClick={() => {
                    if (product)
                      cart.dispatch({
                        type: 'add',
                        product: { ...product, image: product.images[0] ?? '' },
                      })
                  }}
                >
                  Add to cart
                </Button>
                <p role="status" className="mt-4 font-medium">
                  Quantity in cart: {quantity}
                </p>
                {cart.state.error && (
                  <p role="alert" className="mt-3 text-red-800">
                    {cart.state.error}
                  </p>
                )}
                <Link
                  to="/cart"
                  className="mt-4 inline-block underline underline-offset-4"
                >
                  View cart
                </Link>
                <p className="mt-5 text-sm text-stone-500">
                  Demo cart resets when you reload the page.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <PageState title="Product not found">
            This product isn't in our collection.{' '}
            <Link to="/products" className="underline">
              Browse products
            </Link>
            .
          </PageState>
        ))}
    </>
  )
}
