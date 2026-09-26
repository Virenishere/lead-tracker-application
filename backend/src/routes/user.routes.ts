import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { authRateLimiter } from "../middlewares/rate-limit.middleware";
import {
    registerUserSchema,
    loginUserSchema,
    changePasswordSchema,
    updateProfileSchema,
} from "../validator/user.validator";

const router = Router();

// Public auth routes (rate-limited)
router.post(
    "/register",
    authRateLimiter,
    validate(registerUserSchema),
    AuthController.register
);

router.post(
    "/login",
    authRateLimiter,
    validate(loginUserSchema),
    AuthController.login
);

// Refresh access token via HttpOnly cookie
router.post(
    "/refresh",
    AuthController.refresh
);

// Logout (clears HttpOnly cookie)
router.post(
    "/logout",
    AuthController.logout
);

// Protected routes (requires Bearer JWT access token in memory)
router.get(
    "/me",
    authenticate,
    AuthController.getProfile
);

router.patch(
    "/me",
    authenticate,
    validate(updateProfileSchema),
    AuthController.updateProfile
);

router.patch(
    "/change-password",
    authenticate,
    validate(changePasswordSchema),
    AuthController.changePassword
);

export default router;