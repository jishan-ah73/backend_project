import { Router } from "express";
import { CurrentPasswordChange, getCurrentUser, loginUsers, logoutUser, refreshAccesToken, registerUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router()

/**
 * @swagger
 * /users/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a new user
 *     description: Create a new user account with avatar and cover image upload support
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - fullName
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               fullName:
 *                 type: string
 *                 example: John Doe
 *               password:
 *                 type: string
 *                 format: password
 *                 example: SecurePass123
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Avatar image file (jpg, png, gif, webp)
 *               coverImage:
 *                 type: string
 *                 format: binary
 *                 description: Cover image file (jpg, png, gif, webp)
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input or user already exists
 *       500:
 *         description: Server error
 */
router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)

/**
 * @swagger
 * /users/loginUser:
 *   post:
 *     tags:
 *       - Auth
 *     summary: User login
 *     description: Authenticate user with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: SecurePass123
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.route("/loginUser").post(loginUsers)

/**
 * @swagger
 * /users/logoutUser:
 *   post:
 *     tags:
 *       - Auth
 *     summary: User logout
 *     description: Logout user and invalidate refresh token
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       500:
 *         description: Server error
 */
router.route("/logoutUser").post(verifyJWT, logoutUser)

/**
 * @swagger
 * /users/refresh-token:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Refresh access token
 *     description: Generate new access token using refresh token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       400:
 *         description: Invalid refresh token
 *       401:
 *         description: Unauthorized - token expired
 *       500:
 *         description: Server error
 */
router.route('/refresh-token').post(refreshAccesToken)

/**
 * @swagger
 * /users/change-password:
 *   post:
 *     tags:
 *       - User
 *     summary: Change password
 *     description: Change user password (requires current password verification)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 format: password
 *                 example: OldPassword123
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: NewPassword123
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 example: NewPassword123
 *     responses:
 *       200:
 *         description: Password changed successfully
 */
router.route("/change-password").post(verifyJWT, CurrentPasswordChange)

/**
 * @swagger
 * /users/Current-user:
 *   get:
 *     tags:
 *       - User
 *     summary: Get current user
 *     description: Retrieve current authenticated user information
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       500:
 *         description: Server error
 */
router.route("/Current-user").get(verifyJWT, getCurrentUser)

/**
 * @swagger
 * /users/update-account:
 *   patch:
 *     tags:
 *       - User
 *     summary: Update account details
 *     description: Update user account information (fullName, email)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: John Doe Updated
 *               email:
 *                 type: string
 *                 format: email
 *                 example: newemail@example.com
 *     responses:
 *       200:
 *         description: Account updated successfully
 *       400:
 *         description: Validation error or email already exists
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       500:
 *         description: Server error
 */
router.route("/update-account").patch(verifyJWT, updateAccountDetails)

/**
 * @swagger
 * /users/update-avatar:
 *   patch:
 *     tags:
 *       - User
 *     summary: Update user avatar
 *     description: Upload and update user avatar image
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - avatar
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Avatar image file (jpg, png, gif, webp) - Max 10MB
 *     responses:
 *       200:
 *         description: Avatar updated successfully
 *       400:
 *         description: No file provided or invalid file
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       500:
 *         description: Server error or file upload failed
 */
router.route("/update-avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)

/**
 * @swagger
 * /users/update-coverImage:
 *   patch:
 *     tags:
 *       - User
 *     summary: Update user cover image
 *     description: Upload and update user cover image
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - coverImage
 *             properties:
 *               coverImage:
 *                 type: string
 *                 format: binary
 *                 description: Cover image file (jpg, png, gif, webp) - Max 10MB
 *     responses:
 *       200:
 *         description: Cover image updated successfully
 *       400:
 *         description: No file provided or invalid file
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       500:
 *         description: Server error or file upload failed
 */
router.route("/update-coverImage").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: "JWT Bearer token for authentication (Authorization: Bearer <token>)"
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: User unique identifier
 *         username:
 *           type: string
 *           example: johndoe
 *         email:
 *           type: string
 *           format: email
 *           example: john@example.com
 *         fullName:
 *           type: string
 *           example: John Doe
 *         avatar:
 *           type: string
 *           format: uri
 *           description: Cloudinary URL of user avatar
 *         coverImage:
 *           type: string
 *           format: uri
 *           description: Cloudinary URL of user cover image
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         statusCode:
 *           type: integer
 *         data:
 *           type: null
 *         message:
 *           type: string
 *         success:
 *           type: boolean
 *           example: false
 */

export default router;
