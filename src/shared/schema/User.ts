import { BaseFields } from './types'

export enum SubscriptionType {
  Legacy = 'legacy',
  Free = 'free',
  Premium = 'premium',
  Founder = 'lifetime',
}

export const PLAN_NAMES = {
  [SubscriptionType.Legacy]: 'idspispopd',
  [SubscriptionType.Free]: 'idclip',
  [SubscriptionType.Premium]: `idkfa`,
  [SubscriptionType.Founder]: `iddqd`,
}

export const PLAN_NICKS = {
  [SubscriptionType.Legacy]: 'legacy',
  [SubscriptionType.Free]: 'free',
  [SubscriptionType.Premium]: `premium`,
  [SubscriptionType.Founder]: `founder`,
}

export type UserFields = BaseFields & {
  email: string
  verified: boolean
  subscription: SubscriptionType
}
