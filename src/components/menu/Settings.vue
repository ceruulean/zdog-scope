<template>
  <div>
    <InputLabel
      v-model="wipSettings['backgroundColor']"
      element="ColorPicker"
      :color="currentSettings.backgroundColor"
    >
    Background Color:
    </InputLabel>
    <button @click="saveSettings">
      Save
    </button>
    <button @click="defaultSettings">
      Default
    </button>
  </div>
</template>

<script>
import InputLabel from './controls/InputLabel'

export default {
  name: 'Settings',
  components:{
    InputLabel,
  },
  emits:['close-prompt'],
  
  data(){
    return{
      wipSettings:{},
    }
  },
  mounted(){
    this.wipSettings = this.currentSettings
  },
  computed:{
    currentSettings(){
      return this.$store.state.canvas.settings
    }
  },
  methods:{
    saveSetting(name){
      let payload = {
        name: name,
        value: this.wipSettings[name]
      }
      this.$store.dispatch('canvas/changeSetting', payload)
    },
    defaultSettings(){

    }
  }
}
</script>

<style scoped>
</style>