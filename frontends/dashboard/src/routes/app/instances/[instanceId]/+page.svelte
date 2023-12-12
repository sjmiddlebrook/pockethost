<script lang="ts">
  import { assertExists } from '$shared'
  import Code from './Code.svelte'
  import AdminSync from './Danger/AdminSync.svelte'
  import DangerZoneTitle from './Danger/DangerZoneTitle.svelte'
  import DeleteInstance from './Danger/DeleteInstance.svelte'
  import Maintenance from './Danger/Maintenance.svelte'
  import RenameInstance from './Danger/RenameInstance.svelte'
  import VersionChange from './Danger/VersionChange/VersionChange.svelte'
  import Ftp from './Ftpx.svelte'
  import Secrets from './secrets/Secrets.svelte'
  import { instance } from './store'

  $: ({ status, version, id } = $instance)

  assertExists($instance, `Expected instance here`)
  const { subdomain } = $instance
</script>

<svelte:head>
  <title>{subdomain} overview - PocketHost</title>
</svelte:head>

<div class="grid lg:grid-cols-2 grid-cols-1 gap-4 mb-4">
  <Code />
  <Ftp />
</div>

<div class="grid lg:grid-cols-2 grid-cols-1 gap-4 mb-16">
  <Secrets />
</div>

<DangerZoneTitle />

<div class="grid lg:grid-cols-3 gap-4 mb-4">
  <RenameInstance />

  <Maintenance />

  <VersionChange />

  <AdminSync />

  <DeleteInstance />
</div>
