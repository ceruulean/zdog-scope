<template>
<div class="input-toggle">
  <span :id="`${name}_aria`"><slot/>Label</span>
  <label :for="`${name}_toggle`">
     <input type="checkbox" :id="`${name}_toggle`"
         :checked="checked"
         :aria-labelledby="`${name}_aria`">
    <div class="tog-des">
    </div>
  </label>
</div>

</template>

<script>
export default {
  name: 'Toggle',
  emits:['done'],
  props: {
    type:String,
    value:String,
    name:String,
    checked:Boolean
  },

  methods:{

  },
}
</script>

<style>
.input-toggle{
  display:flex;
}

.input-toggle span{
  margin-right:0.3rem;
}

.input-toggle input{
 display:none;
}

.input-toggle input:checked{

}

.tog-des{
  background-color:grey;
  border-radius:1.3rem;
  width:2.4rem;
  height:1.3rem;
}

.input-toggle input:checked + .tog-des{
  background-color:green;
}

</style>