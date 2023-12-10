<script lang="ts">
  import Img from '@zerodevx/svelte-img'

  export let src = ''
</script>

<div class="avatar">
  <div class="w-24 rounded">
    <Img {src} />
  </div>
</div>
