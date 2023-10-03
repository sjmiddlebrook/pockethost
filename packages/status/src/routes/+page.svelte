<script lang="ts">
  import Logo from '$components/Logo.svelte'
  import {
    PUBLIC_APP_DB,
    PUBLIC_APP_DOMAIN,
    PUBLIC_APP_PROTOCOL,
  } from '$src/env'
  import { onMount } from 'svelte'
  import { writable } from 'svelte/store'

  const instanceName = writable('')
  const instanceStatus = writable(200)

  const sites = [
    {
      name: `PocketHost Mothership`,
      url: `${PUBLIC_APP_PROTOCOL}://${PUBLIC_APP_DB}.${PUBLIC_APP_DOMAIN}/_/`,
    },
    {
      name: `PocketHost Docs`,
      url: `${PUBLIC_APP_PROTOCOL}://${PUBLIC_APP_DOMAIN}`,
    },
    {
      name: `PocketHost Dashboard`,
      url: `${PUBLIC_APP_PROTOCOL}://app.${PUBLIC_APP_DOMAIN}`,
    },
  ]

  const states = writable(sites.map((site) => 200))

  const _fetch = (url: string) =>
    fetch(url)
      .then((res) => res.status)
      .catch(() => 500)

  onMount(() => {
    const check = () => {
      Promise.all([
        ...sites.map((v, i) =>
          _fetch(v.url).then((status) => {
            states.update((update) => {
              update[i] = status
              return [...update]
            })
          }),
        ),
        $instanceName
          ? _fetch(
              `${PUBLIC_APP_PROTOCOL}://${$instanceName}.${PUBLIC_APP_DOMAIN}/_/`,
            ).then((status) => {
              console.log(
                `git gere`,
                $instanceName,
                status,
                `${PUBLIC_APP_PROTOCOL}://${$instanceName}.${PUBLIC_APP_DOMAIN}/_/`,
              )
              instanceStatus.set(status)
            })
          : undefined,
      ]).finally(() => {
        setTimeout(check, 5000)
      })
    }
    check()
  })
</script>

<svelte:head>
  <title>Home - PocketHost</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center">
  <div>
    <Logo />
    {#each sites as site, i}
      <div>
        {site.name} -
        {#if $states[i] === 200}
          <span class="text-success">Ok</span>
        {/if}
        {#if $states[i] !== 200}
          <span class="text-error">Down {$states[i]}</span>
        {/if}
      </div>
    {/each}
    <div>
      <input bind:value={$instanceName} />
      {#if $instanceStatus === 200}
        <span class="text-success">Ok</span>
      {/if}
      {#if $instanceStatus !== 200}
        <span class="text-error">Down {$instanceStatus}</span>
      {/if}
    </div>
  </div>
</div>
