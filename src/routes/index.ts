import { Router } from "express";
import routerCategories from "./categories.router";
import routerFoods from "./food.router";
import routerUser from "./user.routers";

const router = Router();

// route user
router.use(routerCategories);
router.use(routerFoods);
router.use(routerUser);

// route product ex
// router.use(routerUser);

export default router;
