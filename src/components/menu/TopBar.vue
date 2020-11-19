<template>
  <div class="toolbar row"
    :aria-label="`Create new`">
    <button v-for="(item,index) in ZDOG_CLASS_NAME" :key="`${item}_${index}`"
      :aria-label="item"
      @click="promptCreate"
      :class="{
        'hide': (item != 'illustration' && !hasIllustration)
      }"
      >
      +{{item}}
    </button>
    <Modal v-if="!bWarning && hasIllustration && creationItemName"
      @close="creationItemName = null">
      <Creation
        :itemName="creationItemName"
        @submit-new-shape="createNew"/>
    </Modal>
    <Modal v-if="bWarning && hasIllustration"
      @close="bWarning = false">
      <p>WARNING: Are you sure you want to replace the current illustration?</p>
      <button @click="confirmNewIllustration">Yes</button><button @click="bWarning = false">Cancel</button>
    </Modal>
  </div>
</template>

<script>
//import Zdog from 'zdog'
import {mapState, mapActions} from 'vuex'// mapActions 

import {ZDOG_CLASS_NAME} from '../../zdogrigger'

import Modal from '../Modal.vue'
import Creation from '../Creation.vue'

export default {
  name: 'TopBar',
  components:{Modal,Creation},
  emits: ['create-new'],
  props: {
  },

  methods:{
    ...mapActions([
      'newZdogObject', //argument should be in format {type:int, options:{}}
      'newIllustration'
    ]),
    promptCreate(event){
      let itemName = event.target.getAttribute('aria-label');
      if(!this.hasIllustration){
        this.newIllustration();
        return;
      } else if (itemName == "illustration") {
        this.bWarning = true;
      }
      this.creationItemName = itemName;
    },
    createNew(itemName, options){
      let temp = {
        type:itemName,
        options:options
        }
      //if a node is selected, add to that, otherwise add to illustration
      let selected = this.selectedNode || this.illustration;
      temp.options.addTo = selected;

      this.newZdogObject(temp)
      this.creationItemName = null
    },
    confirmNewIllustration(){
      this.newIllustration();
      this.bWarning = false;
    },
  },
  computed:{
    ...mapState({
      selectedNode(state){
        return (state.selected.node)
      }
    }),
    illustration(){
      return this.$store.getters.illustration;
    },
    hasIllustration() {
    return (this.illustration !== null && this.illustration !== undefined)
    },
  },
  data(){
    return {
      creationItemName: '',
      bWarning:false,
      ZDOG_CLASS_NAME: ZDOG_CLASS_NAME
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
