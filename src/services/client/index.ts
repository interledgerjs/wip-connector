import { PeerService, Peer } from '../peers'

export interface Client {
  send: (data: Buffer) => Promise<Buffer>
}

export async function sendToPeer (peer: Peer, data: Buffer): Promise<Buffer>
export async function sendToPeer (peerId: string, data: Buffer, peers: PeerService): Promise<Buffer>

export async function sendToPeer (peerOrPeerId: Peer | string, data: Buffer, peers?: PeerService): Promise<Buffer> {
  if (typeof peerOrPeerId === 'string' && !peers) throw new Error('PeerService required')
  const peer = (typeof peerOrPeerId === 'string') ? await peers!.getOrThrow(peerOrPeerId) : peerOrPeerId
  return (await peer.client).send(data)
}

export * from 'axios'
