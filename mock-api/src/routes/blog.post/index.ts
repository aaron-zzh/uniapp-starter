import { FastifyPluginAsync } from 'fastify'
import { listData } from './data'

const example: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', async function (request, reply) {
    return {
      code: 200,
      msg: 'success',
      data: {
        total: 2,
        size: 2,
        records: listData,
      },
    }
  })
  fastify.patch('/call/search_read_nested', async function (request, reply) {
    console.log(request.body)
    return {
      code: 200,
      msg: 'success',
      data: {
        total: 2,
        size: 2,
        records: listData,
      },
    }
  })
  interface PingParams {
    id: number
  }
  fastify.get<{
    Querystring: unknown
    Params: PingParams
    Headers: unknown
    Body: unknown
  }>('/:id', async function (request, reply) {
    console.log(request.params.id)
    const post = listData.find((item) => item.id == request.params.id)
    reply.code(200).send({ code: 200, data: post || listData[0] })
  })
}

export default example
