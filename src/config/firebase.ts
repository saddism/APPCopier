import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

// Firebase configuration interface
interface FirebaseConfig {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
}

// Placeholder configuration - will be replaced with actual values
const firebaseConfig: FirebaseConfig = {
  apiKey: 'PLACEHOLDER_API_KEY',
  authDomain: 'PLACEHOLDER_AUTH_DOMAIN',
  projectId: 'PLACEHOLDER_PROJECT_ID',
  storageBucket: 'PLACEHOLDER_STORAGE_BUCKET',
  messagingSenderId: 'PLACEHOLDER_MESSAGING_SENDER_ID',
  appId: 'PLACEHOLDER_APP_ID'
}

// Initialize Firebase app
const app = initializeApp(firebaseConfig)

// Initialize and export auth instance
export const auth = getAuth(app)

// Export app instance for other Firebase services
export default app
