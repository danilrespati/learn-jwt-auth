import "dotenv/config";
import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolvers } from "./UserResolvers";
import { AppDataSource } from "./data-source";

AppDataSource.initialize()
  .then(async () => {
    const app = express();
    app.get("/", (_req, res) => res.send("hello"));

    app.post("/refresh_token", (req) => {
      console.log(req.headers);
    });

    const apolloServer = new ApolloServer({
      schema: await buildSchema({
        resolvers: [UserResolvers],
      }),
      context: ({ req, res }) => ({ req, res }),
    });

    apolloServer.applyMiddleware({ app });

    app.listen(4000, () => {
      console.log("express server started");
    });
  })
  .catch((error) => console.log(error));

// AppDataSource.initialize().then(async () => {

//     console.log("Inserting a new user into the database...")
//     const user = new User()
//     user.firstName = "Timber"
//     user.lastName = "Saw"
//     user.age = 25
//     await AppDataSource.manager.save(user)
//     console.log("Saved a new user with id: " + user.id)

//     console.log("Loading users from the database...")
//     const users = await AppDataSource.manager.find(User)
//     console.log("Loaded users: ", users)

//     console.log("Here you can setup and run express / fastify / any other framework.")

// }).catch(error => console.log(error))
