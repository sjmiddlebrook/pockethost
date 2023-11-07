<script lang="ts">
  import { InstanceLogFields } from '$shared'
  import { Terminal } from 'xterm'
  import 'xterm/css/xterm.css'

  let elem: HTMLDivElement
  var term = new Terminal({
    cursorInactiveStyle: 'none',
    disableStdin: true,
  })

  $: {
    if (elem) {
      term.open(elem)
    }
  }

  export const bind = (e: HTMLDivElement) => {
    term.open(e)
  }
  export const writeln = (log: InstanceLogFields) => {
    term.writeln(log.message)
  }
</script>

<div bind:this={elem}></div>
