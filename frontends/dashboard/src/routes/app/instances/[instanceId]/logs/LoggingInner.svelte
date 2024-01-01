<script lang="ts">
  import { LoggerService, Unsubscribe } from '$shared'
  import { client } from '$src/pocketbase-client'
  import { mkCleanup } from '$util/componentCleanup'
  import { onMount } from 'svelte'
  import { derived } from 'svelte/store'
  import { instance } from '../store'
  import XTerm from './XTerm.svelte'

  const { dbg, trace } = LoggerService().create(`Logging.svelte`)

  let miniTerm: XTerm
  let fullTerm: XTerm

  // This will open the full screen modal
  const handleFullScreenModal = () => {
    const modal = document.getElementById(
      'loggingFullscreenModal',
    ) as HTMLDialogElement
    modal?.showModal()
  }

  const onDestroy = mkCleanup()

  const instanceId = derived(instance, (instance) => instance.id)

  onMount(async () => {
    let unwatch: Unsubscribe | undefined
    const unsub = instanceId.subscribe((id) => {
      unwatch?.()
      unwatch = client().watchInstanceLog(id, (newLog) => {
        miniTerm.writeln(newLog)
        fullTerm.writeln(newLog)
      })
    })
    onDestroy(unsub)
    onDestroy(() => unwatch?.())
  })
</script>

<p class="mb-4">
  Instance logs appear here in realtime, including <code>console.log</code> from
  JavaScript hooks.
</p>

<dialog id="loggingFullscreenModal" class="modal backdrop-blur">
  <div class="modal-box max-w-[90vw] h-[90vh]">
    <h3 class="font-bold text-lg">Instance Logging</h3>

    <div class="py-4 h-[80vh]">
      <XTerm bind:this={fullTerm} />
    </div>
  </div>

  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>

<div class="mockup-code">
  <button
    class="btn btn-sm absolute top-[6px] right-[6px]"
    on:click={handleFullScreenModal}
    >Fullscreen <i class="fa-regular fa-arrows-maximize"></i></button
  >
  <div class="h-[450px]">
    <XTerm bind:this={miniTerm} />
  </div>
</div>
