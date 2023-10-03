<script>
  import Meta from '$components/helpers/Meta.svelte'
  import '../app.css'
</script>

<Meta />

<div class="layout xl:flex">
  <div class="lg:p-4 lg:pt-0 xl:pt-4 min-h-screen grow">
    <div
      class="bg-base-300 border-base-300 border-[16px] xl:h-[calc(100vh-32px)] lg:p-4 rounded-2xl xl:overflow-hidden xl:overflow-y-auto"
    >
      <slot />
    </div>
  </div>
</div>
