import express from 'express';
import session from 'express-session'
import cors from 'cors';
import connectMongo from "connect-mongo";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { ApolloServer } from 'apollo-server-express';
import contentRouter from './routes/content.js'
import { resolvers } from './types/resolvers.js'
import { typeDefs } from './types/typeDefs.js'
import notFoundMiddleware from './middlewares/notfound404.js';
import './db/index.js'
dotenv.config();

mongoose.connect(process.env.DB_PATH as string, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
})
  .then(() => {
    console.log("Mongoose connected to %s database", process.env.DB_PATH);
    app.listen(port, () => {
      console.log('Сервер запущен. Порт:', port);
    });
  })
  .catch((err) => {
    console.log("Database connection error", err.message);
  });

const app = express();

const MongoStore = connectMongo(session);
const sessionStore = new MongoStore({
  mongooseConnection: mongoose.createConnection(process.env.SESSION_DB_PATH as string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  }),
});
const corsOptions = {
  origin: '*',
  methods: "GET,HEAD,POST,PATCH,DELETE,OPTIONS",
  credentials: true,
  allowedHeaders: "Content-Type, Authorization, X-Requested-With",
}
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// UserSession
interface UserSession {
  userId: string,
  userName: string,
}
declare module 'express-session' {
  interface SessionData {
    user: UserSession;
  }
}

app.use(
  session({
    name: 'sid',
    secret: process.env.SESSION_SECRET as string,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      //process.env.NODE_ENV === 'production'
      secure: process.env.NODE_ENV === 'development',
      maxAge: 1000 * 60 * 60 * 24 * 365,
    },
  }),
);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  tracing: true,
  context: ({ req, res }) => {
    return {
      req, res
    };
  }
});
server.applyMiddleware({ app });

app.use('/content', contentRouter);

app.use(notFoundMiddleware);

const port = process.env.PORT as string ?? 3100;

