import User from "../models/User.js "

export const getPostOwner = async (creatorId, getDatas) => {
      try {
            const projection = Object.fromEntries(getDatas.map(field => [field, 1]));
            const user = await User.findOne({ _id: creatorId }, { ...projection }).lean()
            return user
      } catch (error) {
            console.log("getPostOwner error" + error)
            return null
      }
}