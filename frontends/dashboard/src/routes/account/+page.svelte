<script>
  import idclip from '$assets/idclip.png?as=run'
  import iddqd from '$assets/iddqd.jpg?as=run'
  import idkfaAnnual from '$assets/idkfa-annual.png?as=run'
  import idkfaSpecial from '$assets/idkfa-special-edition.png?as=run'
  import idkfa from '$assets/idkfa.png?as=run'
  import AuthStateGuard from '$components/helpers/AuthStateGuard.svelte'
  import { PLAN_NAMES, PLAN_NICKS, SubscriptionType } from '$shared'
  import { DISCORD_URL } from '$src/env'
  import { userSubscriptionType } from '$util/stores'
  import Img from '@zerodevx/svelte-img'
</script>

<AuthStateGuard>
  <h2>My Account</h2>
  <h2>Current Plan</h2>
  {PLAN_NAMES[$userSubscriptionType]} ({$userSubscriptionType})

  <div class="m-10">
    <div
      class="card w-96 {$userSubscriptionType === SubscriptionType.Free
        ? `bg-neutral`
        : 'bg-base-100'} shadow-xl"
    >
      <figure><Img src={idclip} alt="idclip" /></figure>

      <div class="card-body">
        <h2 class="card-title font-mono">
          {PLAN_NAMES[SubscriptionType.Free]}
          <span class="text-primary font-sans"
            >{PLAN_NICKS[SubscriptionType.Free]}</span
          >
        </h2>
        <ul class="list-disc">
          <li>1 project</li>
          <li>Unlimited bandwidth, storage, and CPU</li>
          <li>Community support via Discord</li>
          <li>FTP access to PocketBase data, migrations, hooks, and files</li>
          <li>Static frontend hosting</li>
        </ul>
      </div>
    </div>
  </div>

  <div class="m-10">
    <div
      class="card w-96 {$userSubscriptionType === SubscriptionType.Premium
        ? `bg-neutral`
        : 'bg-base-100'} shadow-xl"
    >
      <figure><Img src={idkfa} alt="idkfa" /></figure>
      <div class="card-body">
        <h2 class="card-title font-mono">
          {PLAN_NAMES[SubscriptionType.Premium]}
          <span class="text-primary font-sans"
            >{PLAN_NICKS[SubscriptionType.Premium]}</span
          >
        </h2>
        <ul class="list-disc">
          <li>Everything in the free tier</li>
          <li>Unlimited projects</li>
          <li>Priority support channel on Discord</li>
          <li>{PLAN_NAMES[SubscriptionType.Premium]} Discord badge</li>
        </ul>
        <p>
          We have a lot of ideas for premium features. Please check our <a
            class="link"
            target="_blank"
            href="https://discord.com/channels/1128192380500193370/1180219900107706409"
            >Discord discussion</a
          > to join in the conversation.
        </p>

        <div class="card-actions justify-end">
          <a
            class="btn btn-primary"
            href="https://buy.stripe.com/fZe6sd8Mkfc30Kc4gg"
            target="_blank">$20/mo</a
          >
        </div>
      </div>
    </div>
  </div>

  <div class="m-10">
    <div
      class="card w-96 {$userSubscriptionType === SubscriptionType.Premium
        ? `bg-neutral`
        : 'bg-base-100'} shadow-xl"
    >
      <figure><Img src={idkfaAnnual} alt="idkfa" /></figure>
      <div class="card-body">
        <h2 class="card-title font-mono">
          {PLAN_NAMES[SubscriptionType.Premium]}
          <span class="text-primary font-sans"
            >{PLAN_NICKS[SubscriptionType.Premium]}</span
          >
        </h2>
        <ul class="list-disc">
          <li>Everything in the {PLAN_NAMES[SubscriptionType.Premium]} tier</li>
          <li>Special Discord badge</li>
        </ul>

        <div class="card-actions justify-end">
          <a
            class="btn btn-primary"
            href="https://buy.stripe.com/bIYeYJbYwd3VdwY289"
            target="_blank">$199/yr (save 20%)</a
          >
        </div>
      </div>
    </div>
  </div>

  <div class="m-10">
    <div class="card w-96 bg-base-100 shadow-xl">
      <figure><Img src={idkfaSpecial} alt="idkfa" /></figure>
      <div class="card-body">
        <h2 class="card-title font-mono">
          {PLAN_NAMES[SubscriptionType.Premium]}
          <span class="text-primary font-sans">Special Edition</span>
        </h2>

        <p class="text-info text-xl text-center">100 remaining</p>

        <ul class="list-disc">
          <li>
            Same as {PLAN_NAMES[SubscriptionType.Premium]}, but with Special
            Edition pricing
          </li>
          <li>
            Special Edition {PLAN_NAMES[SubscriptionType.Premium]} Discord badge
          </li>
        </ul>

        <div class="card-actions justify-end">
          <a
            class="btn btn-primary"
            href="https://buy.stripe.com/aEUdUF7Igfc350s28a"
            target="_blank">$99/yr</a
          >
        </div>
      </div>
    </div>
  </div>

  <div class="m-10">
    <div
      class="card w-96 {$userSubscriptionType === SubscriptionType.Founder
        ? `bg-neutral`
        : 'bg-base-100'} shadow-xl"
    >
      <figure><Img src={iddqd} alt="iddqd" /></figure>
      <div class="card-body">
        <h2 class="card-title font-mono">
          {PLAN_NAMES[SubscriptionType.Founder]}
          <span class="text-primary font-sans">Founder's Lifetime Edition</span>
        </h2>
        <p class="text-info text-xl text-center">100 remaining</p>
        <p>
          As a way of saying thank you to the PocketHost community, we are
          offering a limited supply of Founder's lifetime memberships. Pay once,
          use PocketHost forever.
        </p>

        <ul class="list-disc">
          <li>
            Everything in the {PLAN_NAMES[SubscriptionType.Premium]} tier, plus...
          </li>
          <li>Limited Edition Founder's badge on Discord</li>
        </ul>

        <div class="card-actions justify-end">
          <a
            class="btn btn-primary"
            href="https://buy.stripe.com/7sIg2N6Ecgg70KcdQT"
            target="_blank">$299</a
          >
        </div>
      </div>
    </div>
  </div>

  <div class="m-10">
    <div class="card w-96 bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">Fair Use Policy</h2>
        <p>
          When we say 'unlimited', we mean it in the Fair Use sense of the word.
          Obviously, everything has limits. In our study of PocketHost usage
          patterns, we found that even the busiest and most successful
          PocketHost instances rarely stress our system.
        </p>
        <p>
          PocketHost is a haven for developers who want to launch and iterate
          quickly on ideas without worrying about metering and infrastructure.
        </p>
        <p>
          If your app gets big and it starts affecting the system, we'll talk
          about an enterprise plan or a dedicated setup.
        </p>
        <p>
          Please enjoy PocketHost knowing that you can use as much storage,
          bandwidth, and CPU as your application requires under normal operating
          conditions. Let us handle the hosting so you can get back to work.
        </p>
      </div>
    </div>
  </div>

  <div class="m-10">
    <div class="card w-96 bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">Cancellation and Refunds</h2>
        <p>Short version: We only want your money if you are happy.</p>
        <p>
          Long version: If you need to cancel your membership for any reason,
          please <a class="link" href={DISCORD_URL}
            >contact @noaxis on Discord</a
          >. If you cancel within the first 5 days of a signup or renewal, we'll
          refund the full amount. Otherwise, we'll pro-rate it. Sound good?
        </p>
        <p>
          If you create additional instances and then downgrade to the free
          plan, the extra instances will remain accessible in your dashboard,
          but they will not run.
        </p>
      </div>
    </div>
  </div>
</AuthStateGuard>
