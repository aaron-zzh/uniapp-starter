import type { AuthorInfo } from '@/api/common/model'

interface PostList {
  id: number
  name: string
  author_id: AuthorInfo
  view_count: number
  vote_count: number
  child_count: number
  image_url: string
  published_date: string
  brief: string
  pictures?: string
  content: string
  tag_ids: [{ name: string }]
}

export interface Comment {
  id: number
  content: string
  user_vote: number
  vote_count: number
  child_ids: Comment[]
  author_id?: AuthorInfo
  child_count: number
  create_date: string
  create_uid: { name: string; avatar_256: string }
}

export interface PostInfo {
  id: number
  name: string
  phone?: string
  brief: string
  content: string
  author_id: AuthorInfo
  create_uid?: { name: string; avatar_256: string }
  view_count: number
  vote_count: number
  child_count: number
  favourite_count: number
  user_favorite: boolean
  published_date: string
  user_vote: number
  create_date: string
  tag_ids: [{ name: string }]
  child_ids: Comment[]
  pictures?: string
  author_avatar: string
}
