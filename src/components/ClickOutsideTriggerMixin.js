const ClickOutsideTrigger = {

  emits:['close'],
  data(){
    return{
      isActive:false
    }
  },
  methods:{
    close(){
      this.$emit('close')
    },
    keydownHandler(e){
      if (e.key == "Escape"){
        this.close();
      }
    }
  }
}

export default ClickOutsideTrigger