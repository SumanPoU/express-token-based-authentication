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
      SESSION_NOT_FOUND: 'Session not found or already logged out',
      LOGOUT_FROM_ALL_DEVICES_SUCCESS: 'Successfully logged out from all devices.',
    },
  },
  middleware: {
    AUTHORIZATION_HEADER_MISSING: 'Authorization header missing or malformed',
    INVALID_OR_EXPIRED_TOKEN: 'Invalid or expired token',
  },
};

export default message;
