import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { CartContext } from '../../context/CartContext'

const CartPage = () => {
  const navigate = useNavigate()
  const { cart, loading, error, updateCart } = useContext(CartContext)

  const handleQuantityChange = async (itemId, newQuantity) => {
    try {
      await fetch(`/api/cart/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: newQuantity }),
      })
      await updateCart()
    } catch (err) {
      console.error('Failed to update quantity:', err)
    }
  }

  const handleRemoveItem = async (itemId) => {
    try {
      await fetch(`/api/cart/${itemId}`, {
        method: 'DELETE',
      })
      await updateCart()
    } catch (err) {
      console.error('Failed to remove item:', err)
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

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  const subtotal = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0)
  const tax = subtotal * 0.17 // 17% tax
  const total = subtotal + tax

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md">
            {cart.items.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row items-center gap-4 p-4 border-b last:border-b-0">
                {/* Product Image */}
                <div className="w-24 h-24">
                  <img
                    src={item.imageUrl || '/placeholder.png'}
                    alt={item.name}
                    className="w-full h-full object-cover rounded"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold mb-1">{item.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                  <div className="text-blue-600 font-semibold">${item.price.toFixed(2)}</div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  <select
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                    className="p-2 border rounded w-20"
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (17%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 font-bold">
                <div className="flex justify-between">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700"
            >
              Proceed to Checkout
            </button>

            <button
              onClick={() => navigate('/products')}
              className="w-full mt-4 text-blue-600 hover:text-blue-700"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
