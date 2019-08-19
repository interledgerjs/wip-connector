
export type Relation = 'parent' | 'child' | 'peer' | 'local'

export type PeerRelation = 'parent' | 'peer' | 'child'

// TODO change url and auth token to say out outgoingUrl and outgoingAuthToken
export interface PeerInfo {
  id: string,
  url?: string,
  relation: PeerRelation,
  relationWeight?: number,
  authToken?: string
  isCcpSender?: boolean,
  isCcpReceiver?: boolean
  defaultAccountId?: string
  maxPacketAmount?: bigint
  rateLimitRefillPeriod?: number
  rateLimitRefillCount?: bigint
  rateLimitCapacity?: bigint
  minIncomingExpirationWindow?: number
  minOutgoingExpirationWindow?: number
  maxHoldWindow?: number
}

export enum RelationWeights {
  parent = 400,
  peer = 300,
  child = 200,
  local = 100
}
