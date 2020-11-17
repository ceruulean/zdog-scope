<template>
  <div class="toolbar row">
    <button v-for="item in zdoglist" :key="item"
      @click="promptCreate(item)"
      :class="{
        'hide': (item != 'illustration' && !hasWorkingIllu)
      }"
      >
      +{{item}}
    </button>
    <Modal ref="promptModal">
      <Creation :itemName="creationItemName"
      @submit-new-shape="emitCreateNew"/>
    </Modal>
  </div>
</template>

<script>
//import Zdog from 'zdog'
import Modal from '../Modal.vue'
import Creation from '../Creation.vue'

export default {
  name: 'TopBar',
  components:{Modal,Creation},
  emits: ['create-new'],
  props: {
    zdoglist: Object,
    workingillustration:Object
  },

  methods:{
    promptCreate(itemName){

      this.creationItemName = itemName;

      if(itemName == "illustration"){
        this.emitCreateNew(itemName);
        return;
      }
      this.$refs.promptModal.open();
    },
    emitCreateNew(itemName, payload){
      console.log(`Emitting: 'create-new', payload: ${itemName}, ${payload}`);
      this.$refs.promptModal.close();
      this.$emit('create-new', itemName, payload);
    }
  },
  computed:{
    hasWorkingIllu(){
      return (this.workingillustration != null && this.workingillustration != undefined && this.workingillustration != {});
    }
  },
  data(){
    return {
      creationItemName: null
    }
  }
}
</script>

<style scoped>
.toolbar{
  position:relative;
  border:1px solid black;
  height:var(--menuTopBarHeight);
  z-index:99;
}

button{
  text-transform:capitalize;
}

.hide{
  display:none;
  visibility:hidden;
}
</style>
