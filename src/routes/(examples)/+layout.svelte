<script lang="ts">
  import "../../app.css";
  let { children } = $props();
</script>

<!-- <div class="absolute top-0 inset-x-0 bg-blue-500 z-50">examples group checking in</div> -->
{@render children()}
