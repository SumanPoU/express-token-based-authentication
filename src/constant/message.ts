const message = {
  auth: {
    login: {
      LOGIN_SUCCESS: 'Login successful.',
      LOGIN_USER_NOT_FOUND: 'User not found.',
      LOGIN_INVALID_CREDENTIALS: 'Invalid credentials.',
      LOGIN_EMAIL_NOT_VERIFIED:
        'Email is not verified. Please verify your email before logging in.',
      PASSWORD_INVALID: 'Invalid password.',
      LOGIN_FAILURE: 'Login failed. Please try again later.',
      FIRST_LOGIN_PASSWORD_REQUIRED: 'First login detected. Please set a new password to continue.',
      FIRST_LOGIN_ALREADY_COMPLETED: 'First login already completed.',
      PASSWORD_SET_SUCCESS: 'Password set successfully.',
      PASSWORD_SET_FAILURE: 'Failed to set password. Please try again later.',
    },

    register: {
      REGISTER_SUCCESS: 'Registration successful.',
      REGISTER_FAILURE: 'Registration failed. Please try again later.',
      REGISTER_USER_EXISTS: 'User already exists.',
      REGISTER_INVALID_CREDENTIALS: 'Invalid credentials.',
      REGISTER_EMAIL_EXISTS: 'Email already exists.',
      REGISTER_EMAIL_NOT_VERIFIED:
        'Email is not verified. Please verify your email before registering.',
    },

    resetPassword: {
      RESET_PASSWORD_SUCCESS: 'Password reset successful.',
      RESET_PASSWORD_FAILURE: 'Password reset failed. Please try again later.',
      RESET_PASSWORD_INVALID_TOKEN: 'Invalid reset token.',
      RESET_PASSWORD_TOKEN_EXPIRED: 'Reset token has expired.',
      RESET_PASSWORD_USER_NOT_FOUND: 'User not found.',
      RESET_PASSWORD_EMAIL_NOT_VERIFIED:
        'Email is not verified. Please verify your email before resetting your password.',
    },

    changePassword: {
      CHANGE_PASSWORD_SUCCESS: 'Password change successful.',
      CHANGE_PASSWORD_FAILURE: 'Password change failed. Please try again later.',
      CHANGE_PASSWORD_INCORRECT_CURRENT: 'Current password is incorrect.',
    },

    verifyEmail: {
      VERIFY_EMAIL_SUCCESS: 'Email verified successfully.',
      VERIFY_EMAIL_FAILURE: 'Failed to verify email. Please try again later.',
      VERIFY_EMAIL_INVALID_TOKEN: 'Invalid verification token.',
      VERIFY_EMAIL_TOKEN_EXPIRED: 'Verification token has expired.',
      VERIFY_EMAIL_USER_NOT_FOUND: 'User not found.',
      VERIFY_EMAIL_EMAIL_NOT_VERIFIED:
        'Email is not verified. Please verify your email before logging in.',
    },

    email: {
      VERIFICATION_EMAIL_SENT: 'Verification email has been sent.',
      EMAIL_ALREADY_VERIFIED: 'Email is already verified.',
      EMAIL_SEND_FAILURE: 'Failed to send verification email.',
      EMAIL_NOT_FOUND: 'Email not found.',
      EMAIL_VERIFICATION_INVALID_TOKEN: 'Invalid verification token.',
      EMAIL_VERIFICATION_TOKEN_EXPIRED: 'Verification token has expired.',
      EMAIL_VERIFICATION_USER_NOT_FOUND: 'User not found.',
      EMAIL_VERIFICATION_EMAIL_NOT_VERIFIED:
        'Email is not verified. Please verify your email before logging in.',
      EMAIL_NOT_VERIFIED: 'Email is not verified. Please verify your email before logging in.',
      ENCRYPTION_EMAIL_REQUIRED: 'Encrypted email is required.',
      EMAIL_REQUIRED: 'Email is required.',
      FORGOT_PASSWORD_SUCCESS_MAIL_SENT: 'Password reset email has been sent.',
    },

    user: {
      USER_NOT_FOUND: 'User not found.',
      USER_DISABLED: 'User account is disabled.',
      USER_DELETED: 'User account is deleted.',
      USER_CREATE_SUCCESS: 'User created successfully.',
      USER_CREATE_FAILURE: 'Failed to create user. Please try again later.',
      USER_UPDATE_SUCCESS: 'User updated successfully.',
      USER_UPDATE_FAILURE: 'Failed to update user. Please try again later.',
      USER_DELETE_SUCCESS: 'User deleted successfully.',
      USER_DELETE_FAILURE: 'Failed to delete user. Please try again later.',
      USER_LIST_FAILURE: 'Failed to list users. Please try again later.',
      USER_RETRIEVE_SUCCESS: 'User retrieved successfully.',
      USER_RETRIEVE_FAILURE: 'Failed to retrieve user. Please try again later.',
      USER_SOFT_DELETE_SUCCESS: 'User soft deleted successfully.',
      USER_SOFT_DELETE_FAILURE: 'Failed to soft delete user. Please try again later.',
      USER_NOT_AUTHENTICATED: 'User not authenticated.',
    },

    password: {
      PASSWORD_REQUIRED: 'Password is required.',
    },

    role: {
      DEFAULT_ROLE_NOT_FOUND: 'Default role not found. Please contact support.',
    },

    token: {
      TOKEN_ALREADY_EXISTS: 'A valid token has already been sent. Please check your email.',
      TOKEN_COOLDOWN_ACTIVE: 'You recently requested a token. Please wait before requesting again.',
      TOKEN_INVALID_OR_EXPIRED: 'Invalid or expired token.',
      VERIFICATION_TOKEN_REQUIRED: 'Verification token is required.',
      VERIFICATION_TOKEN_INVALID: 'Invalid verification token.',
      TYPE_INVALID: 'Invalid type parameter.',
    },

    logout: {
      LOGOUT_SUCCESS: 'Successfully logged out.',
      LOGOUT_FAILURE: 'Failed to log out. Please try again later.',
      SESSION_NOT_FOUND: 'Session not found or already logged out.',
      LOGOUT_FROM_ALL_DEVICES_SUCCESS: 'Successfully logged out from all devices.',
    },
  },

  middleware: {
    AUTHORIZATION_HEADER_MISSING: 'Authorization header missing or malformed.',
    INVALID_OR_EXPIRED_TOKEN: 'Invalid or expired token.',
  },
  permission: {
    PERMISSION_NOT_FOUND: 'Permission not found.',
    PERISSION_NOT_AUTHENTICATED: 'You do not have permission to perform this action',
    PERMISSION_ALREADY_EXISTS: 'Permission already exists.',
    FAILED_TO_CHECK_PERMISSION: 'Failed to check permission. Please try again later.',
    PERMISSION_CREATE_FAILURE: 'Failed to create permission. Please try again later.',
    PERMISSION_UPDATE_FAILURE: 'Failed to update permission. Please try again later.',
    PERMISSION_DELETE_FAILURE: 'Failed to delete permission. Please try again later.',
    PERMISSION_LIST_FAILURE: 'Failed to list permissions. Please try again later.',
    CREATE_SUCCESS: 'Permission created successfully.',
    CREATE_FAILED: 'Failed to create permission. Please try again later.',
    UPDATE_SUCCESS: 'Permission updated successfully.',
    UPDATE_FAILED: 'Failed to update permission. Please try again later.',
    DELETE_SUCCESS: 'Permission deleted successfully.',
    DELETE_FAILED: 'Failed to delete permission. Please try again later.',
  },

  permissionGroup: {
    NOT_FOUND: 'Permission group not found.',
    ALREADY_EXISTS: 'Permission group already exists.',
    CREATE_SUCCESS: 'Permission group created successfully.',
    UPDATE_SUCCESS: 'Permission group updated successfully.',
    DELETE_SUCCESS: 'Permission group deleted successfully.',
    LIST_SUCCESS: 'Permission groups listed successfully.',
    CREATE_FAILED: 'Failed to create permission group. Please try again later.',
    UPDATE_FAILED: 'Failed to update permission group. Please try again later.',
    DELETE_FAILED: 'Failed to delete permission group. Please try again later.',
    LIST_FAILED: 'Failed to list permission groups. Please try again later.',
  },
};

export default message;
