import mongoose from 'mongoose'
import { Cart } from '../models/cart.model.js'
import { Product } from '../models/product.model.js'

export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ clerkId: req.user.clerkId }).populate(
      'items.product'
    )

    if (!cart) {
      const user = req.user

      cart = await Cart.create({
        user: user._id,
        clerkId: user.clerkId,
        items: [],
      })
      // Populate to match the format of fetched carts
      cart = await cart.populate('items.product')
    }

    res.status(200).json({ cart })
  } catch (error) {
    console.error('Error in getCart controller:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const addToCart = async (req, res) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  const { productId } = req.params

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    await session.abortTransaction()
    session.endSession()
    return res.status(400).json({ error: 'Invalid product ID' })
  }

  const { quantity } = req.body
  try {
    const qty = parseInt(quantity)

    // validate product exists and has stock, atomically decrement
    const product = await Product.findOneAndUpdate(
      { _id: productId, stock: { $gte: qty } },
      { $inc: { stock: -qty } },
      { session, new: true }
    )

    if (!product) {
      await session.abortTransaction()
      return res
        .status(400)
        .json({ error: 'Insufficient stock or product not found' })
    }

    let cart = await Cart.findOne({ clerkId: req.user.clerkId }).session(
      session
    )

    if (!cart) {
      const user = req.user
      cart = new Cart({
        user: user._id,
        clerkId: user.clerkId,
        items: [],
      })
    }

    // check if item already in the cart
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    )
    if (existingItem) {
      // increase quantity
      existingItem.quantity += qty
    } else {
      // add new item
      cart.items.push({ product: productId, quantity: qty })
    }

    await cart.save({ session })
    await session.commitTransaction()

    res.status(200).json({ message: 'Item added to cart', cart })
  } catch (error) {
    await session.abortTransaction()
    console.error('Error in addToCart controller:', error)
    res.status(500).json({ error: 'Internal server error' })
  } finally {
    session.endSession()
  }
}

export const updateCartItem = async (req, res) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const { productId } = req.params
    const { quantity } = req.body
    const newQty = parseInt(quantity)

    if (isNaN(newQty) || newQty < 1) {
      await session.abortTransaction()
      return res.status(400).json({ error: 'Quantity must be at least 1' })
    }

    const cart = await Cart.findOne({ clerkId: req.user.clerkId }).session(
      session
    )
    if (!cart) {
      await session.abortTransaction()
      return res.status(404).json({ error: 'Cart not found' })
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    )
    if (itemIndex === -1) {
      await session.abortTransaction()
      return res.status(404).json({ error: 'Item not found in cart' })
    }

    const oldQty = cart.items[itemIndex].quantity
    const diff = newQty - oldQty

    if (diff > 0) {
      // Need more stock
      const product = await Product.findOneAndUpdate(
        { _id: productId, stock: { $gte: diff } },
        { $inc: { stock: -diff } },
        { session, new: true }
      )
      if (!product) {
        await session.abortTransaction()
        return res.status(400).json({ error: 'Insufficient stock' })
      }
    } else if (diff < 0) {
      // Return stock
      await Product.findByIdAndUpdate(
        productId,
        { $inc: { stock: Math.abs(diff) } },
        { session }
      )
    }

    cart.items[itemIndex].quantity = newQty
    await cart.save({ session })
    await session.commitTransaction()

    res.status(200).json({ message: 'Cart updated successfully', cart })
  } catch (error) {
    await session.abortTransaction()
    console.error('Error in updateCartItem controller:', error)
    res.status(500).json({ error: 'Internal server error' })
  } finally {
    session.endSession()
  }
}

export const removeFromCart = async (req, res) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const { productId } = req.params

    const cart = await Cart.findOne({ clerkId: req.user.clerkId })
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' })
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    )
    await cart.save({ session })
    await session.commitTransaction()

    res.status(200).json({ message: 'Item removed from cart', cart })
  } catch (error) {
    await session.abortTransaction()
    console.error('Error in removeFromCart controller:', error)
    res.status(500).json({ error: 'Internal server error' })
  } finally {
    session.endSession()
  }
}

export const clearCart = async (req, res) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const cart = await Cart.findOne({ clerkId: req.user.clerkId }).session(
      session
    )

    if (!cart) {
      await session.abortTransaction()
      return res.status(404).json({ error: 'Cart not found' })
    }

    // Return stock for all items in the cart
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } },
        { session }
      )
    }

    cart.items = []
    await cart.save({ session })
    await session.commitTransaction()

    res.status(200).json({ message: 'Cart cleared', cart })
  } catch (error) {
    await session.abortTransaction()
    console.error('Error in clearCart controller:', error)
    res.status(500).json({ error: 'Internal server error' })
  } finally {
    session.endSession()
  }
}
