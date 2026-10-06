import { Link } from 'react-router'
import { Price, ProductImage } from '../../components/common'
import type { ProductSummary } from './products'

function ProductCard({ product }: { product: ProductSummary }) {
  return (
    <li className="overflow-hidden rounded-xl border border-stone-200 bg-white p-3">
      <Link
        to={`/products/${product.slug}`}
        className="block rounded-xl hover:text-emerald-700"
      >
        <ProductImage src={product.image} name={product.name} loading="lazy" />
        <h2 className="mt-4 text-lg font-medium">{product.name}</h2>
      </Link>
      <p className="mt-2 mb-2 text-stone-600">
        <Price minor={product.priceMinor} />
      </p>
    </li>
  )
}

export function ProductGrid({ products }: { products: ProductSummary[] }) {
  return (
    <ul aria-label="Products" className="grid grid-cols-3 gap-5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </ul>
  )
}
