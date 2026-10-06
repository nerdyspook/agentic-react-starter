import { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { Button, Price, ProductImage } from '../../components/common'
import { cartLineTotal } from './cart'
import { useCart } from './useCart'

export function CartPage() {
  const { state, dispatch, count, totalMinor } = useCart()
  const emptyHeading = useRef<HTMLHeadingElement>(null)
  const successHeading = useRef<HTMLHeadingElement>(null)
  const lineControls = useRef(new Map<string, HTMLButtonElement>())
  const pendingFocus = useRef<string | null>(null)

  useEffect(() => {
    const target = pendingFocus.current
    if (target === 'empty') emptyHeading.current?.focus()
    else if (target === 'success') successHeading.current?.focus()
    else if (target) lineControls.current.get(target)?.focus()
    pendingFocus.current = null
  }, [state.lines, state.checkout])

  // Receipt feedback belongs to this visit to the cart route.
  useEffect(() => () => dispatch({ type: 'dismiss-checkout' }), [dispatch])

  function remove(productId: string) {
    const index = state.lines.findIndex((line) => line.productId === productId)
    pendingFocus.current =
      state.lines[index + 1]?.productId ??
      state.lines[index - 1]?.productId ??
      'empty'
    dispatch({ type: 'remove', productId })
  }

  const controlClass =
    'rounded-lg border border-stone-300 bg-white px-4 py-2 font-medium hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-50'
  return (
    <>
      <h1 className="mb-3 text-4xl font-semibold">Your cart</h1>
      <p className="mb-8 text-stone-600">
        Demo cart · Saved during navigation; resets on reload.
      </p>
      {state.error && (
        <p role="alert" className="mb-6 rounded-lg bg-red-50 p-4 text-red-800">
          {state.error}
        </p>
      )}
      {state.checkout && (
        <section className="mb-8 rounded-xl border border-emerald-300 bg-emerald-50 p-8">
          <h2
            ref={successHeading}
            tabIndex={-1}
            className="text-2xl font-semibold"
          >
            Demo checkout successful
          </h2>
          <p role="status" className="my-4">
            Simulated total: <Price minor={state.checkout.totalMinor} />. No
            payment was collected.
          </p>
          <Button
            onClick={() => {
              pendingFocus.current = 'empty'
              dispatch({ type: 'dismiss-checkout' })
            }}
          >
            Dismiss success
          </Button>
        </section>
      )}
      <p role="status" className="mb-6 font-medium">
        {count} {count === 1 ? 'item' : 'items'} · Total{' '}
        <Price minor={totalMinor} />
      </p>
      {state.lines.length === 0 ? (
        <section className="rounded-xl border border-stone-200 bg-white p-8">
          <h2
            ref={emptyHeading}
            tabIndex={-1}
            className="mb-4 text-xl font-semibold"
          >
            Your cart is empty
          </h2>
          <Link to="/products" className="underline underline-offset-4">
            Explore the collection
          </Link>
        </section>
      ) : (
        <>
          <ul aria-label="Cart products" className="space-y-5">
            {state.lines.map((line) => (
              <li
                key={line.productId}
                className="flex items-center gap-6 rounded-xl border border-stone-200 bg-white p-6"
              >
                <Link
                  to={`/products/${line.slug}`}
                  className="w-32 shrink-0 rounded-xl"
                >
                  <ProductImage src={line.image} name={line.name} />
                </Link>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold">
                    <Link
                      to={`/products/${line.slug}`}
                      className="hover:underline"
                    >
                      {line.name}
                    </Link>
                  </h2>
                  <p className="mt-2 text-stone-600">
                    Unit price: <Price minor={line.unitPriceMinor} />
                  </p>
                  <div
                    role="group"
                    aria-label={`Quantity for ${line.name}`}
                    className="mt-4 flex items-center gap-3"
                  >
                    <button
                      type="button"
                      className={controlClass}
                      aria-label={`Decrease quantity of ${line.name}`}
                      disabled={line.quantity === 1}
                      onClick={() => {
                        if (line.quantity === 2)
                          pendingFocus.current = line.productId
                        dispatch({
                          type: 'decrease',
                          productId: line.productId,
                        })
                      }}
                    >
                      −
                    </button>
                    <span className="min-w-24 text-center tabular-nums">
                      Quantity: {line.quantity}
                    </span>
                    <button
                      type="button"
                      className={controlClass}
                      aria-label={`Increase quantity of ${line.name}`}
                      ref={(element) => {
                        if (element)
                          lineControls.current.set(line.productId, element)
                        else lineControls.current.delete(line.productId)
                      }}
                      onClick={() =>
                        dispatch({
                          type: 'increase',
                          productId: line.productId,
                        })
                      }
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className={controlClass}
                      aria-label={`Remove ${line.name}`}
                      onClick={() => remove(line.productId)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <p className="text-right font-medium">
                  Line total
                  <br />
                  <Price minor={cartLineTotal(line)} />
                </p>
              </li>
            ))}
          </ul>
          <section
            aria-label="Cart summary"
            className="mt-8 rounded-xl border border-stone-200 bg-white p-8"
          >
            <p className="mb-5 text-2xl font-semibold">
              Total: <Price minor={totalMinor} />
            </p>
            <div className="flex gap-4">
              <Button
                onClick={() => {
                  pendingFocus.current = 'empty'
                  dispatch({ type: 'clear' })
                }}
              >
                Clear cart
              </Button>
              <Button
                onClick={() => {
                  pendingFocus.current = 'success'
                  dispatch({ type: 'checkout' })
                }}
              >
                Demo checkout
              </Button>
            </div>
            <p className="mt-4 text-sm text-stone-500">
              Simulated checkout only. No payment details or payment requests.
            </p>
          </section>
        </>
      )}
    </>
  )
}
