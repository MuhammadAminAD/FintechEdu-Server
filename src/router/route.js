import { Router } from "express";
import Register from "../controllers/auth/register.js";
import Login from "../controllers/auth/login.js";
import resetPassword from "../controllers/auth/resetPassword.js";
import { refreshAccessToken } from "../controllers/auth/refreshAccess.js";
import "../configs/google.js"
import passport from "passport";
import { authGoogle } from "../controllers/auth/GoogleAuth.js";
import multer from "multer";
import posts from "../controllers/post/index.js"
import { VerifyUser } from "../middlewares/verifyUser.js"
import VideoController from "../controllers/video/index.js"
const upload = multer({ dest: "uploads/" });
import Filters from "../controllers/filter/index.js"
import Profile from "../controllers/user/index.js"
const router = Router();
// registration
router.post("/auth/registration/request-code", (req, res) => Register.request(req, res));
router.post("/auth/registration/verify-code", (req, res) => Register.verify(req, res));
router.post("/auth/registration/create-user", (req, res) => Register.create(req, res));


// login
router.post("/auth/login", (req, res) => Login(req, res));


// resert password
router.post("/auth/reset-password/request-code", (req, res) => resetPassword.request(req, res));
router.post("/auth/reset-password/verify-code", (req, res) => resetPassword.verify(req, res));
router.post("/auth/reset-password/chenge-password", (req, res) => resetPassword.complete(req, res));

// token
router.get("/auth/refresh", (req, res) => refreshAccessToken(req, res));

// google
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get(
      "/auth/google/callback",
      passport.authenticate("google", {
            failureRedirect: "/",
            session: false,
      }),
      authGoogle
);

// filters
router.get("/filter/menus", (req, res) => Filters.Menus(req, res))
router.get("/filter/filter-menus", (req, res) => Filters.FilterMenus(req, res))

// posts
router.post("/posts", VerifyUser, upload.any(), async (req, res) => posts.createPost(req, res));
router.get("/posts/:id", upload.any(), async (req, res) => posts.getById(req, res));
router.get("/posts", upload.any(), async (req, res) => posts.getAll(req, res));


// video
router.get("/video/:id", (req, res) => VideoController.get(req, res))


// user
router.get(`/user/:id`, (req, res) => Profile.profile(req, res))
router.get(`/user`, VerifyUser, (req, res) => Profile.profile(req, res))
router.patch(`/user`, VerifyUser, upload.single("photo"), (req, res) => Profile.update(req, res))

export default router;