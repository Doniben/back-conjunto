import { Router } from "express";
const router = Router();

import * as booksCtrl from "../controllers/books.controller";
import { authJwt } from "../middlewares";

router.get("/", booksCtrl.getBooks);
router.post("/titulo", booksCtrl.getBookBytitle);

router.get("/:bookId", booksCtrl.getBookById);

router.post(
  "/",
  [authJwt.verifyToken, authJwt.isModerator],
  booksCtrl.createBook
);

router.put(
  "/:bookId",
  [authJwt.verifyToken, authJwt.isModerator],
  booksCtrl.updateBookById
);

router.delete(
  "/:bookId",
  [authJwt.verifyToken, authJwt.isAdmin],
  booksCtrl.deleteBookById
);

export default router;
