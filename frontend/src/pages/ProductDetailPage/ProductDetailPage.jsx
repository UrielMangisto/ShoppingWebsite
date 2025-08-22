import { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { productsService } from '../../services/productsService'
import { CartContext } from '../../context/CartContext'

const ProductDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { updateCart } = useContext(CartContext)
  
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [addingToCart, setAddingToCart] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const data = await productsService.getProduct(id)
        setProduct(data)
      } catch (err) {
        setError(err.message || 'Failed to fetch product details')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value)
    if (value > 0 && value <= (product?.stock || 1)) {
      setQuantity(value)
    }
  }

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true)
      await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: id,
          quantity,
        }),
      })
      await updateCart() // Update cart state
      navigate('/cart')
    } catch (err) {
      setError('Failed to add item to cart')
    } finally {
      setAddingToCart(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Product not found</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Product Image */}
          <div className="md:w-1/2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img
                src={product.imageUrl || '/placeholder.png'}
                alt={product.name}
                className="w-full h-[500px] object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="md:w-1/2">
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            
            {/* Price */}
            <div className="text-2xl font-bold text-blue-600 mb-4">
              ${product.price.toFixed(2)}
            </div>

            {/* Stock Status */}
            <div className="mb-4">
              {product.stock > 0 ? (
                <span className="text-green-600">
                  In Stock ({product.stock} available)
                </span>
              ) : (
                <span className="text-red-600">Out of Stock</span>
              )}
            </div>

            {/* Description */}
            <div className="prose max-w-none mb-6">
              <p className="text-gray-600">{product.description}</p>
            </div>

            {/* Categories */}
            {product.categories && product.categories.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900">Categories</h3>
                <div className="mt-2">
                  {product.categories.map((category) => (
                    <span
                      key={category.id}
                      className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                    >
                      {category.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-6">
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <select
                id="quantity"
                value={quantity}
                onChange={handleQuantityChange}
                className="mt-1 block w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                disabled={!product.stock}
              >
                {[...Array(Math.min(product.stock || 0, 10))].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={!product.stock || addingToCart}
              className={`w-full py-3 px-8 rounded-md text-white font-medium ${
                !product.stock
                  ? 'bg-gray-400 cursor-not-allowed'
                  : addingToCart
                  ? 'bg-blue-400 cursor-wait'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {!product.stock
                ? 'Out of Stock'
                : addingToCart
                ? 'Adding to Cart...'
                : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage
