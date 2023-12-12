interface KWargs {
  domain?: Array<[string, string, string | boolean | number]>
  fields: Array<string>
  offset?: number
  limit: number
  order?: string
  delimeter?: string
}

export interface SearchParams {
  kwargs: KWargs
}

export interface PageInfo<Model> {
  total: number
  size: number
  records: Model[]
}

export interface CategoryInfo {
  id: string
  name: string
}

interface AuthorInfo {
  id: number
  name: string
  user_follow: boolean
  avatar_256: string
  certified: boolean
  url: string
}

export interface HomeData {
  msg_count: number
  banners: []
}
