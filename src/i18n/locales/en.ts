export default {
  message: {
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
      register: 'Register',
      email: 'Email',
      password: 'Password',
      submit: 'Submit',
      forgotPassword: 'Forgot Password',
      noAccount: 'No account? Register',
      hasAccount: 'Have an account? Login'
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
