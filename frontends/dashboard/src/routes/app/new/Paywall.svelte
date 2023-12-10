<script lang="ts">
  import paywall from '$assets/paywall.png?as=run'
  import Img from '@zerodevx/svelte-img'
</script>

<div class="card w-96 bg-base-100 shadow-xl">
  <figure><Img src={paywall} alt="paywall" /></figure>
  <div class="card-body">
    <h2 class="card-title">Paywall!</h2>
    <p>
      Oof. You hit a paywall. You're only allowed 1 project on the Free plan.
    </p>
    <p>
      But that's okay, we know you want to support PocketHost if you love it
      this much!
    </p>
    <div class="card-actions justify-end">
      <a href="/account" class="btn btn-primary">Unlock Unlimited Projects</a>
    </div>
  </div>
</div>
