export default {
  message: {
    nav: {
      appTitle: 'APP Copier',
      home: 'Home',
      upload: 'Upload',
      login: 'Login',
      dashboard: 'Dashboard',
      products: 'Products',
      productDetail: 'Product Details'
    },
    hello: 'Hello',
    upload: {
      title: 'Video Upload',
      select: 'Select Video',
      tip: 'Click or tap to select a video',
      error: {
        tooLarge: 'File size cannot exceed 500MB',
        invalidType: 'Please select a video file',
        uploadFailed: 'Upload failed, please try again',
        ios: {
          tooLarge: 'File size cannot exceed 300MB on iOS devices',
          iosSizeLimit: 'iOS devices have a 300MB upload limit',
          uploadFailed: 'Upload failed on iOS. Please try using a smaller file or a different device',
          selection: 'Video selection failed on iOS. Please try again',
          format: 'This video format is not supported on iOS. Please try MP4 format',
          safari: 'Safari has limited video upload support. Try using a different browser'
        }
      },
      uploading: 'Uploading...',
      success: 'Upload successful',
      start: 'Start Upload',
      cancel: 'Cancel Upload'
    },
    auth: {
      login: 'Login',
      register: {
        title: 'Register',
        emailPlaceholder: 'Enter your email',
        codePlaceholder: 'Enter verification code',
        passwordPlaceholder: 'Enter password',
        confirmPasswordPlaceholder: 'Confirm password',
        sendCode: 'Send Code',
        codeSent: 'Code sent',
        submit: 'Register',
        loginLink: 'Have an account? Login',
        emailRequired: 'Email is required',
        allFieldsRequired: 'All fields are required',
        passwordMismatch: 'Passwords do not match',
        invalidCode: 'Invalid or expired code',
        sendCodeError: 'Failed to send code',
        success: 'Registration successful',
        error: 'Registration failed, please try again'
      },
      email: 'Email',
      password: 'Password',
      submit: 'Submit',
      forgotPassword: 'Forgot Password',
      noAccount: 'No account? Register',
      hasAccount: 'Have an account? Login',
      loginRequired: 'Please login to access this feature',
      errors: {
        'auth/invalid-email': 'Invalid email address',
        'auth/user-disabled': 'This account has been disabled',
        'auth/user-not-found': 'User not found',
        'auth/wrong-password': 'Incorrect password',
        'auth/email-already-in-use': 'Email already in use',
        'auth/operation-not-allowed': 'Operation not allowed',
        'auth/weak-password': 'Password is too weak',
        'auth/network-request-failed': 'Network request failed',
        'auth/too-many-requests': 'Too many requests, please try again later',
        'auth/requires-recent-login': 'Please login again'
      }
    },
    products: {
      title: 'Products',
      detail: 'Product Details',
      search: 'Search Products',
      noResults: 'No products found',
      price: 'Price',
      description: 'Description',
      category: 'Category',
      addToCart: 'Add to Cart'
    },
    common: {
      loading: 'Loading...',
      error: 'Error occurred',
      retry: 'Retry',
      switchLang: 'Switch Language',
      confirm: 'Confirm',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit'
    }
  }
}
