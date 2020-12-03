<template>
  <div class="tooltip-wrapper">
    <div class="closer"
      @click="close" />
    <div class="tooltip-popover">
      <slot/>
    </div>
  </div>
</template>

<script>
import ClickOutsideTrigger from '../../ClickOutsideTriggerMixin'

export default {
  name: 'Tooltip',
  mixins:[ClickOutsideTrigger],
}
</script>

<style scoped>
.tooltip-wrapper{
  position:absolute;
}

.closer{
  position:fixed;
  top:0;
  left:0;
  width:100%;
  height:100%;
  background-color:transparent;
  transition:all 300ms linear;
  z-index:1;
}

.tooltip-popover{
  position:relative;
  z-index:99;
  background-color:white;
}

</style>