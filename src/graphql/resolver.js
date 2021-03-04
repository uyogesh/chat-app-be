const mongoose = require('mongoose')
const User = require('../models/user.model')
const { PubSub, withFilter } = require('graphql-yoga')
const { authService, userService, tokenService, emailService } = require('../services')
const Messages = require('../models/messages.model')

const resolvers = {
  Query: {
    users (root, args, context) {
      if (args.id) {
        return User.find({ _id: { $nin: [mongoose.Types.ObjectId(args.id)] } })
      }
      return User.find()
    },
    messages (root, args, context) {
      const { sender, receiver } = args?.msgInput
      const { Types } = mongoose
      const _messages = Messages.find({
        $or: [
          { $and: [{ receiver: Types.ObjectId(sender) }, { sender: Types.ObjectId(receiver) }] },
          { $and: [{ sender: Types.ObjectId(sender) }, { receiver: Types.ObjectId(receiver) }] }
        ]
      })
      return _messages
    }
  },
  Message: {
    sender: async () => {}
  },
  Mutation: {
    async createUser (_, args) {
      const { email, password, name } = args?.userData
      const user = await userService.createUser({ email, password, name })
      const tokens = await tokenService.generateAuthTokens(user)
      return { user, tokens }
    },
    async loginUser (_, args) {
      const { email, password } = args?.loginData
      const user = await authService.loginUserWithEmailAndPassword(email, password)
      const tokens = await tokenService.generateAuthTokens(user)
      console.log(user, args)
      return { user, tokens }
    },
    async sendMessage (_, args) {
      const { message, sender, receiver } = args?.msgData
      const msg = await Messages.create({ body: message, sender, receiver })
      pubSub.publish('newMessage', { msg, targetId: receiver })
      return { status: 'ok' }
    }
  },
  Subscription: {
    newMessage: {
      subscribe: withFilter(
        () => pubsub.asyncIterator('newMessage'),
        (payload, variables) => {
          return payload.targetId === variables.targetId
        }
      )
    }
  }
}
const pubSub = new PubSub()
module.exports = resolvers
