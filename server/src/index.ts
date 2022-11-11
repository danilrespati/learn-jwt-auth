import "dotenv/config";
import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolvers } from "./UserResolvers";
import { AppDataSource } from "./data-source";
import cookieParser from "cookie-parser";
import { verify } from "jsonwebtoken";
import { User } from "./entity/User";
import cors from "cors";
import { createAccessToken, createRefreshToken } from "./auth";
import { sendRefreshToken } from "./sendRefreshToken";

AppDataSource.initialize()
  .then(async () => {
    const app = express();
    app.use(
      cors({
        origin: "http://localhost:3000",
        credentials: true,
      })
    );
    app.use(cookieParser());
    app.get("/", (_req, res) => res.send("hello"));

    app.post("/refresh_token", async (req, res) => {
      const token = req.cookies.jid;
      if (!token) {
        return res.send({ ok: false, accessToken: "" });
      }

      let payload: any = null;
      try {
        payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
      } catch (error) {
        console.log(error);
        return res.send({ ok: false, accessToken: "" });
      }

      const user = await User.findOneBy({ id: payload.userId });

      if (!user) {
        return res.send({ ok: false, accessToken: "" });
      }

      if (user.tokenVersion !== payload.tokenVersion) {
        return res.send({ ok: false, accessToken: "" });
      }

      sendRefreshToken(res, createRefreshToken(user));

      return res.send({ ok: true, accessToken: createAccessToken(user) });
    });

    const apolloServer = new ApolloServer({
      schema: await buildSchema({
        resolvers: [UserResolvers],
      }),
      context: ({ req, res }) => ({ req, res }),
    });

    apolloServer.applyMiddleware({ app, cors: false });

    app.listen(4000, () => {
      console.log("express server started");
    });
  })
  .catch((error) => console.log(error));
