const types = `
type Query {
  users(id: String): [User]
  messages(msgInput: MessageInput!): [Message]
}
type User {
  id: String!
  name: String!
  email: String!
  role: String!
  created_at: String!
}

type Message {
  id: String!
  body: String!
  sender: String
  receiver: String
  created_at: String!
}
input MessageInput {
  sender: String!
  receiver: String!
}

type Mutation {
  createUser(userData: UserDataInput!): CreateUserResponse!
  loginUser(loginData: LoginDataInput!): LoginUserResponse
  sendMessage(msgData: MessageDataInput!): MessageResponse!

}

input MessageDataInput {
  message: String!
  sender: String!
  receiver: String!
}

input UserDataInput {
  email: String!
  password: String!
  name: String!
}
input LoginDataInput {
  email: String!
  password: String!
}
type CreateUserResponse {
  user: User
  tokens: Token
}
type LoginUserResponse {
  user: User
  tokens: Token
}

type Token {
  access: AccessToken!
  refresh: AccessToken!
}

type AccessToken {
  token: String!
  expires: String!
}

type MessageResponse {
  status: String!
}

type Subscription {
  newMessage(targetId: String!): Message
  typing(targetId: String!): String
}

`
module.exports = types
