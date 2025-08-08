import User from "../models/User"

export const getPostOwner = async (creatorId, getDatas) => {
      try {
            const projection = Object.fromEntries(getDatas.map(field => [field, 1]));

            const user = await User.findById(creatorId, { ...projection })
            return user
      } catch (error) {
            console.log("getPostOwner error" + error)
            return null
      }
}