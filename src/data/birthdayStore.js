import { pb } from '../lib/pb.js'
import { REVEAL_TIME } from './birthdayImages.js'

const COLLECTION = import.meta.env.VITE_PB_COLLECTION || 'wishes'

function mapWish(record) {
  return {
    id: record.id,
    message: record.message,
    name: record.name,
    isPublic: record.is_public,
    createdAt: record.created,
  }
}

export async function getWishes() {
  const isRevealed = new Date() >= REVEAL_TIME

  if (isRevealed) {
    // After reveal: all wishes with full content
    const records = await pb.collection(COLLECTION).getFullList({ sort: 'created' })
    return records.map(mapWish)
  }

  // Before reveal: fetch both, but strip content from private wishes
  const [publicRecords, privateRecords] = await Promise.all([
    pb.collection(COLLECTION).getFullList({
      sort: 'created',
      filter: 'is_public = true',
      requestKey: 'wishes-public'
    }),
    pb.collection(COLLECTION).getFullList({
      sort: 'created',
      filter: 'is_public = false',
      fields: 'id,is_public,created',
      requestKey: 'wishes-private'
    })
  ])

  const wishes = [
    ...publicRecords.map(mapWish),
    ...privateRecords.map(r => ({
      id: r.id,
      message: '',
      name: '',
      isPublic: false,
      createdAt: r.created
    }))
  ]

  wishes.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  return wishes
}

export async function addWish({ message, name, isPublic }) {
  const record = await pb.collection(COLLECTION).create({
    message,
    name: name || '匿名朋友',
    is_public: isPublic,
  })
  return mapWish(record)
}
