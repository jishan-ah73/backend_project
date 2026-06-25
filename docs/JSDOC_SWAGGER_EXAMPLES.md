/**
 * @swagger
 * /users/loginUser:
 *   post:
 *     tags:
 *       - Auth
 *     summary: User Login
 *     description: Authenticate user with email/username and password. Returns access and refresh tokens.
 *     operationId: loginUser
 *     requestBody:
 *       required: true
 *       description: User login credentials
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
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: SecurePassword123!
 *     responses:
 *       200:
 *         description: User successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     accessToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     refreshToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Invalid request or credentials
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /users/logoutUser:
 *   post:
 *     tags:
 *       - Auth
 *     summary: User Logout
 *     description: Logout user and invalidate refresh token. Requires JWT authentication.
 *     operationId: logoutUser
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 *                   example: "User logged out successfully"
 *                 success:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /users/refresh-token:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Refresh Access Token
 *     description: Generate a new access token using the refresh token
 *     operationId: refreshToken
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
 *         description: New access token generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *                 message:
 *                   type: string
 *                   example: "Token refreshed successfully"
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Invalid refresh token
 *       401:
 *         description: Unauthorized - token expired or invalid
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /users/current-user:
 *   get:
 *     tags:
 *       - User
 *     summary: Get Current User
 *     description: Retrieve current authenticated user information. Requires JWT authentication.
 *     operationId: getCurrentUser
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Current user information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *                 message:
 *                   type: string
 *                   example: "Current user fetched successfully"
 *                 success:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /users/change-password:
 *   post:
 *     tags:
 *       - User
 *     summary: Change User Password
 *     description: Change user password. Requires JWT authentication and old password verification.
 *     operationId: changePassword
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
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 format: password
 *                 example: OldPassword123!
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: NewPassword123!
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Bad request - invalid passwords
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /users/update-account:
 *   patch:
 *     tags:
 *       - User
 *     summary: Update User Account
 *     description: Update user profile information (fullName, email). Requires JWT authentication.
 *     operationId: updateAccount
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
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *     responses:
 *       200:
 *         description: Account updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *                 message:
 *                   type: string
 *                   example: "Account details updated successfully"
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /users/update-avatar:
 *   patch:
 *     tags:
 *       - User
 *     summary: Update User Avatar
 *     description: Upload and update user avatar image. Requires JWT authentication. Accepts multipart/form-data with file upload.
 *     operationId: updateAvatar
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
 *                 description: Avatar image file (JPG, PNG, GIF, WebP). Max size 10MB
 *     responses:
 *       200:
 *         description: Avatar updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                 message:
 *                   type: string
 *                   example: "Avatar image updated successfully"
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Bad request - invalid file
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /users/update-coverImage:
 *   patch:
 *     tags:
 *       - User
 *     summary: Update User Cover Image
 *     description: Upload and update user cover image. Requires JWT authentication. Accepts multipart/form-data with file upload.
 *     operationId: updateCoverImage
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
 *                 description: Cover image file (JPG, PNG, GIF, WebP). Max size 10MB
 *     responses:
 *       200:
 *         description: Cover image updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                 message:
 *                   type: string
 *                   example: "Cover image updated successfully"
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Bad request - invalid file
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
