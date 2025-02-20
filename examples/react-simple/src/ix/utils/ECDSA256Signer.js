import {ec as EC} from "elliptic"
import {SHA3} from "sha3"
import {bytes, bytesToBuffer} from "@onflow/bytes"

const signatureLength = 64
const ec = new EC("p256")

export const signTransactionPayload = (pk, payload) => {
  const sha3 = new SHA3(256)
  sha3.update(payload)
  const hash = bytes(Uint8Array.from(sha3.digest()), 32)
  return signHash(hexToPrivateKey(pk), hash)
}

export const signHash = (keyPair, hash) => {
  const sig = keyPair.sign(bytesToBuffer(hash))
  const n = signatureLength / 2
  const r = sig.r.toArrayLike(Buffer, "be", n)
  const s = sig.s.toArrayLike(Buffer, "be", n)
  return Buffer.concat([r, s])
}

export const hexToPrivateKey = hex => {
  const buf = Buffer.from(hex, "hex")
  const keyPair = ec.keyFromPrivate(buf)
  return keyPair
}
