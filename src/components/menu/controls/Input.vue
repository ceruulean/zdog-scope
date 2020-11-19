<template>
  <input :type="type" v-model="newValue" :placeholder="value" />
</template>

<script>
export default {
  name: 'Input',
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