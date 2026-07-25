export interface User {
  id: number
  email: string
  first_name: string
  last_name: string
}

export interface UserResponse {
  user: User
}

export interface GoogleCredentialResponse {
  credential: string
}
