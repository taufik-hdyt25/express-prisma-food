import { Router } from "express";
import {
  deleteUser,
  getAllUsers,
  getUserById,
  postUser,
  updateUser,
} from "../controllers/user.controller";

const routerUser = Router();

routerUser.get("/users", getAllUsers);
routerUser.get("/user/:id", getUserById);
routerUser.post("/user", postUser);
routerUser.put("/user", updateUser);
routerUser.delete("/user/:id", deleteUser);

export default routerUser;
