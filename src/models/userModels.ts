export class Credentials {
  username!: string
  password!: string
}

export class TokenPair {
  token!: string
  refreshToken!: string

  constructor(token: string, refreshToken: string) {
    this.token = token
    this.refreshToken = refreshToken
  }
}

export class ChangePassword {
  password!: string
  newPassword!: string
}