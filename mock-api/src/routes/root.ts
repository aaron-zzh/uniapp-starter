import { FastifyPluginAsync } from 'fastify'

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/api/v1', async function (request, reply) {
    return { root: true }
    // return reply.notFound()
  })
}

export default root
