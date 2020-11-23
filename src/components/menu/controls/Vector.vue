<template>
 
</template>

<script>
export default {
  name: 'Vector',
  emits:['done'],
  props: {
    type:String,
    value:String
  },

  methods:{
    close(){
     // this.$emit('close')
    }
  },
  data(){
    return{
      newValue:this.value
    }
  }
}
</script>

<style scoped>

</style>