import { useState } from 'react'
import { ProductImage } from '../../components/common'

export function ProductGallery({
  images,
  name,
}: {
  images: string[]
  name: string
}) {
  const [selected, setSelected] = useState(0)
  return (
    <div>
      <ProductImage src={images[selected] ?? ''} name={name} />
      {images.length > 1 && (
        <div
          aria-label={`${name} images`}
          className="mt-4 flex flex-wrap gap-3"
        >
          {images.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              aria-label={`Show image ${index + 1} of ${name}`}
              aria-pressed={selected === index}
              onClick={() => setSelected(index)}
              className={`w-24 rounded-xl border-2 p-1 ${selected === index ? 'border-emerald-800' : 'border-transparent hover:border-stone-400'}`}
            >
              <ProductImage src={src} name={`${name}, image ${index + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
