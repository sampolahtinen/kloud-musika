import { objectType, subscriptionField } from 'nexus'

const PostSubscriptionPayload = objectType({
  name: 'PostSubscriptionPayload',
  definition(t) {
    t.field('node', {
      type: 'Track',
      nullable: true,
    })
    t.list.string('updatedFields', { nullable: true })
  },
})

const messageSubscription = subscriptionField('post', {
  type: PostSubscriptionPayload,
  subscribe: (root, args, ctx) => {
    return ctx.prisma.$subscribe.track() as any
  },
  resolve: payload => {
    return payload
  },
})
