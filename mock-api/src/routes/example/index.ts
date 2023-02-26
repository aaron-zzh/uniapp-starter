import { FastifyPluginAsync } from 'fastify'

const example: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', async function (request, reply) {
    return { msg: 'this is an example', code: 200, data: { hello: 'world' } }
  })
}

export default example
