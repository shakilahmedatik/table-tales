import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import { User } from "../models/user.model.js";

export const inngest = new Inngest({
  id: "table-tales",
});

const syncUser = inngest.createFunction(
  { id: "sync-user" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    await connectDB();
    const { id, email_addresses, first_name, last_name, image_url } =
      event.data;
    const user = await User.create({
      name: first_name + " " + last_name || "User",
      email: email_addresses[0].email_address,
      clerkId: id,
      imageUrl: image_url,
      addresses: [],
      wishlist: [],
    });
    return user;
  }
);

const deleteUserFromDB = inngest.createFunction(
  { id: "delete-user-from-db" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    await connectDB();
    const { id } = event.data;
    const user = await User.findOneAndDelete({ clerkId: id });
    return user;
  }
);

export const functions = [syncUser, deleteUserFromDB];
