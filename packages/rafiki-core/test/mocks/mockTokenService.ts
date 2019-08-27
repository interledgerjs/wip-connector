import { TokenService, TokenInfo } from '../../src/services/tokens'
import { uuid } from '../../src/lib/crypto'

export class MockTokenService implements TokenService {

  private _tokens = new Map<string, TokenInfo>()

  constructor(private _cb?: (token: string) => TokenInfo) {
  }

  public async introspect (token: string): Promise<TokenInfo> {
    return this._tokens.get(token) || { active: false }
  }
  public async lookup (tokenInfo: TokenInfo) {
    this._tokens.forEach((val, key) => {
      if(val.sub === tokenInfo.sub){
        return key
      }
    })
    return undefined
  }
  public async store (token: string, tokenInfo: TokenInfo) {
    this._tokens.set(token, tokenInfo)
  }
  public async delete (tokenOrtokenInfo: string | TokenInfo) {
    if(typeof tokenOrtokenInfo === 'string') {
      this._tokens.delete(tokenOrtokenInfo)
    } else {
      this._tokens.forEach((val, key) => {
        if(val.sub === tokenOrtokenInfo.sub){
          this._tokens.delete(key)
          return
        }
      })
    }
  }
  public async create (tokenInfo: TokenInfo) {
    const token = tokenInfo.jti || uuid()
    this._tokens.set(token, tokenInfo)
    return token
  }
}
