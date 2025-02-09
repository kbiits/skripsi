import cors from "cors";
import morgan from 'morgan';
import express from "express";
import { expressjwt, UnauthorizedError } from "express-jwt";
import paginate from "express-paginate";
import { FieldValidationError, validationResult } from "express-validator";
import env from "../../env.js";
import addMessageToChat, {
  addMessageToChatSchema,
} from "./chats/add_message_to_chat.js";
import getChats from "./chats/get_chats.js";
import getMessagesByChat, {
  getMessagesByChatSchema,
} from "./chats/get_messages_by_chat.js";
import getLoggedInUser from "./users/get_logged_in_user.js";
import getUserById, { getUserByIdSchema } from "./users/get_user_by_id.js";
import login, { loginSchema } from "./users/login.js";
import signUp, { signUpSchema } from "./users/sign_up.js";
import { Prisma } from "@prisma/client";
import db from "../../db/index.js";
import addChat, { addChatSchema } from "./chats/add_chat.js";
import getUsersExcludeMe from "./users/get_users_exclude_me.js";
import getChatById from "./chats/get_chat_by_id.js";
import seenMessage, { seenMessageSchema } from "./chats/seen_message.js";

// @ts-ignore:next-line
BigInt.prototype.toJSON = function () {
  return this.toString();
};

const initRoutes = async (app: express.Application) => {
  app.set("trust proxy", 1);
  app.use(morgan('tiny'));
  app.use(cors());
  app.use(
    express.urlencoded({
      extended: true,
    })
  );
  app.use(express.json());

  // Express api route declaration ends here
  app.post("/api/sign-up", ...validate["signUp"], asyncHandler(signUp));
  app.post("/api/login", ...validate["login"], asyncHandler(login));

  const protectedRoutes = express.Router();
  app.use(protectedRoutes);

  protectedRoutes.use(
    asyncHandler(expressjwt({ secret: env.JWT_SECRET, algorithms: ["HS256"] }))
  );

  protectedRoutes.get("/api/users", asyncHandler(getUsersExcludeMe));
  protectedRoutes.get("/api/user", asyncHandler(getLoggedInUser));
  protectedRoutes.get(
    "/api/user/:id",
    ...validate["getUserById"],
    asyncHandler(getUserById)
  );

  // @ts-ignore:next-line
  protectedRoutes.get(
    "/api/chats",
    paginate.middleware(20, 100),
    asyncHandler(getChats)
  );
  protectedRoutes.post(
    "/api/chats",
    ...validate["addChat"],
    asyncHandler(addChat)
  );

  protectedRoutes.get(
    "/api/chats/:chat_id",
    validate["getChatById"],
    asyncHandler(getChatById)
  );

  // @ts-ignore:next-line
  protectedRoutes.get(
    "/api/chats/:chat_id/messages",
    paginate.middleware(20, 100),
    ...validate["getMessagesByChat"],
    asyncHandler(getMessagesByChat)
  );
  protectedRoutes.post(
    "/api/chats/:chat_id/messages",
    ...validate["addMessageToChat"],
    asyncHandler(addMessageToChat)
  );
  protectedRoutes.post(
    "/api/chats/:chat_id/messages/:message_id/seen",
    ...validate["seenMessage"],
    asyncHandler(seenMessage)
  );

  // error handling
  app.use((err: any, _req: any, res: any, _next: any) => {
    if (err instanceof UnauthorizedError) {
      return res.status(401).json({
        message: err.message,
      });
    }

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        return res.status(404).json({
          message: err.message,
        });
      }
    }

    console.log(err);
    res.status(500).json(err);
  });
};

const validationErrorMiddleware: express.RequestHandler = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    next();
  } else {
    const errors = result.array();
    const first = errors[0];
    res.status(400).json({
      message: `${first.msg} ${(first as FieldValidationError).path}`,
      errors,
    });
  }
};

const asyncHandler: (fn: any) => express.RequestHandler =
  (fn) => (req, res, next) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
  };

const validateHasAccessToChat: express.RequestHandler = async (
  req: any,
  res,
  next
) => {
  const user_id = BigInt(req.auth.user_id);
  const chat_id = BigInt(req.params.chat_id);
  const chat = await db.chatMember.findFirst({
    where: {
      user_id,
      chat_id,
    },
  });

  if (!chat) {
    return res.status(403).json({
      message: "you have no access to this chat",
    });
  }

  return next();
};

const validate = {
  signUp: [signUpSchema, validationErrorMiddleware],
  login: [loginSchema, validationErrorMiddleware],
  getUserById: [getUserByIdSchema, validationErrorMiddleware],
  getMessagesByChat: [
    validateHasAccessToChat,
    getMessagesByChatSchema,
    validationErrorMiddleware,
  ],
  getChatById: [validateHasAccessToChat, validationErrorMiddleware],
  addMessageToChat: [
    validateHasAccessToChat,
    addMessageToChatSchema,
    validationErrorMiddleware,
  ],
  addChat: [addChatSchema, validationErrorMiddleware],
  seenMessage: [
    validateHasAccessToChat,
    seenMessageSchema,
    validationErrorMiddleware,
  ],
};

export default initRoutes;
