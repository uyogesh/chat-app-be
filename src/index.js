// const mongoose = require('mongoose');
// const { GraphQLServer, PubSub } = require('graphql-yoga')
// const typeDefs = require('./garphql/schema')
// const resolvers = require('./garphql/resolver')
// const app = require('./app');
// const config = require('./config/config');
// const logger = require('./config/logger');

// let server;
// // Setup the Graphql Server
// const pubsub = new PubSub()
// const graphql_server = new GraphQLServer({ typeDefs, resolvers, context: { pubsub } })

// mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
//   logger.info('Connected to MongoDB');
//   server = app.listen(config.port, () => {
//     logger.info(`Listening to port ${config.port}`);
//   });
// });
// mongoose.connection.once("open", () => {
//   console.log("Starting GraphQl Server")
//   graphql_server.start({port: 3030, cors: false}, () => {
//     console.log("GraphQl server running on port 3080")
//   })
// })

// const exitHandler = () => {
//   if (server) {
//     server.close(() => {
//       logger.info('Server closed');
//       process.exit(1);
//     });
//   } else {
//     process.exit(1);
//   }
// };

// const unexpectedErrorHandler = (error) => {
//   logger.error(error);
//   exitHandler();
// };

// process.on('uncaughtException', unexpectedErrorHandler);
// process.on('unhandledRejection', unexpectedErrorHandler);

// process.on('SIGTERM', () => {
//   logger.info('SIGTERM received');
//   if (server) {
//     server.close();
//   }
// });

const { PubSub, GraphQLServer } = require("graphql-yoga");
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolver');
const config = require('./config/config');
const logger = require('./config/logger');
dotenv.config();

// mongoose.connect(DB_URL, {
//   useNewUrlParser: true,
//   useFindAndModify: false,
//   useCreateIndex: true
// });
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');
  server = app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
  });
});
const pubsub = new PubSub();
const server = new GraphQLServer({ typeDefs, resolvers, context: { pubsub } });
mongoose.connection.once("open", () =>
  server.start(() => console.log("We make magic over at localhost:4000"))
);
