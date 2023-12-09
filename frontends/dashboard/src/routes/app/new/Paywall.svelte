<script lang="ts">
  import paywall from '$assets/paywall.png?enhanced'
</script>

<div class="card w-96 bg-base-100 shadow-xl">
  <figure><img src={paywall.img.src} alt="paywall" /></figure>
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
      <a href="/account" class="btn btn-primary"
        >Upgrade to Unlimited Projects</a
      >
    </div>
  </div>
</div>
