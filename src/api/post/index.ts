/* eslint-disable no-unused-vars */
import type { PostInfo } from './model'
import request from '@/utils/request'

enum Path {
  blog_post = '/blog.post',
}
export default class PostApi {
  static getBlogPostDetail(id: string | number) {
    return request.get<PostInfo>(Path.blog_post + `/${id}`)
  }
  static newPost(data: PostInfo) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return request.postJ<Promise<any>>(Path.blog_post, data)
  }
  static comment(id: number, content: string) {
    const params = { args: [content] }
    return request.patch<Promise<boolean>>(Path.blog_post + `/${id}/call/new_comment`, params)
  }
}
