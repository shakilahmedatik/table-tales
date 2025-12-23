import { PencilIcon, Trash2Icon } from 'lucide-react'
import { getStockStatusBadge } from '../lib/utils'
const ProductCard = ({ product, handleEdit, deleteProductMutation }) => {
  const status = getStockStatusBadge(product.stock)
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex items-center gap-6">
          <div className="avatar">
            <div className="w-20 rounded-xl">
              <img
                src={product.images[0]}
                alt={product.name}
              />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="card-title">{product.name}</h3>
                <p className="text-base-content/70 text-sm">
                  {product.category}
                </p>
              </div>
              <div className={`badge ${status.class}`}>{status.text}</div>
            </div>
            <div className="flex items-center gap-6 mt-4">
              <div>
                <p className="text-xs text-base-content/70">Price</p>
                <p className="font-bold text-lg">${product.price}</p>
              </div>
              <div>
                <p className="text-xs text-base-content/70">Stock</p>
                <p className="font-bold text-lg">{product.stock} units</p>
              </div>
            </div>
          </div>

          <div className="card-actions">
            <button
              className="btn btn-square btn-ghost"
              onClick={() => handleEdit(product)}
            >
              <PencilIcon className="w-5 h-5" />
            </button>
            <button
              className="btn btn-square btn-ghost text-error"
              onClick={() => deleteProductMutation.mutate(product._id)}
            >
              {deleteProductMutation.isPending &&
              deleteProductMutation.variables === product._id ? (
                <span className="loading loading-spinner"></span>
              ) : (
                <Trash2Icon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
