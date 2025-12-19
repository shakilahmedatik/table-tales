import { Inngest } from 'inngest'
import { User } from '../models/user.model.js'

export const inngest = new Inngest({
  id: 'table-tales',
})

const syncUser = inngest.createFunction(
  { id: 'sync-user' },
  { event: 'clerk/user.created' },
  async ({ event }) => {
    try {
      const { id, email_addresses, first_name, last_name, image_url } =
        event.data
      if (!email_addresses || email_addresses.length === 0) {
        throw new Error('User email is required')
      }

      const name = [first_name, last_name].filter(Boolean).join(' ') || 'User'
      const user = await User.create({
        name,
        email: email_addresses[0].email_address,
        clerkId: id,
        imageUrl: image_url || '',
        addresses: [],
        wishlist: [],
      })
      return user
    } catch (error) {
      // Handle duplicate key error (user already exists)
      if (error.code === 11000 || error.message.includes('duplicate')) {
        console.log(
          `User with clerkId ${event.data.id} already exists, fetching existing user`
        )
        const existingUser = await User.findOne({ clerkId: event.data.id })
        return existingUser
      }
      console.error('Error syncing user:', error)
      throw error // Re-throw to let Inngest handle retries
    }
  }
)

const deleteUserFromDB = inngest.createFunction(
  { id: 'delete-user-from-db' },
  { event: 'clerk/user.deleted' },
  async ({ event }) => {
    try {
      const { id } = event.data
      const user = await User.findOneAndDelete({ clerkId: id })
      if (!user) {
        console.warn(`User with clerkId ${id} not found for deletion`)
      }
      return user
    } catch (error) {
      console.error('Error deleting user:', error)
      throw error // Re-throw to let Inngest handle retries
    }
  }
)

export const functions = [syncUser, deleteUserFromDB]
