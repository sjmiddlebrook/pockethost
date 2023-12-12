<script lang="ts">
  import { assertExists } from '$shared'
  import { instance } from '../store'
  import Logging from './Logging.svelte'

  $: ({ status, version, id } = $instance)

  assertExists($instance, `Expected instance here`)
  const { subdomain } = $instance
</script>

<svelte:head>
  <title>{subdomain} logging - PocketHost</title>
</svelte:head>

<Logging />
