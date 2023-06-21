<template>
  <div>
    <InputLabel
      v-model="wipSettings['backgroundColor']"
      element="ColorPicker"
      :color="currentSettings.backgroundColor"
      @update="setWipSettings('backgroundColor', $event)"
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
    // copy current settings to wipSettings
    Object.assign(this.wipSettings, this.currentSettings)
  },
  computed:{
    currentSettings(){
      return this.$store.state.canvas.settings
    }
  },
  methods:{
    setWipSettings(property, newValue){
      this.wipSettings[property] = newValue;
    },
    saveSettings(){
      this.$store.dispatch('canvas/changeSetting', this.wipSettings)
    },
    defaultSettings(){
      this.$store.dispatch('canvas/restoreDefaultSettings')
    }
  }
}
</script>

<style scoped>
</style>