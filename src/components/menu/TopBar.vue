<template>
  <div class="toolbar row">
    <button @click="exportTree">Export</button>
    <button @click="importing">Import</button>
    <button @click="demo">Demo</button>
    <div :aria-label="`Create new`" tabIndex="0">
      <button v-for="(item,index) in creatables" :key="`${item}_${index}`"
        :aria-label="item"
        @click="promptCreate"
        :class="{
          'hide': (item != 'illustration' && !hasIllustration)
        }"
        >
        +{{item}}
      </button>
    </div>

    <Modal v-if="!bWarning && hasIllustration && creationItemType"
      @close="cancelPrompt">
      <Creation
        :itemtype="creationItemType"
        @close-prompt="cancelPrompt"/>
    </Modal>
    <Modal v-if="bWarning && hasIllustration"
      @close="cancelPrompt">
      <p>WARNING: Are you sure you want to replace the current illustration?</p>
      <button @click="closeWarning">Yes</button>
      <button @click="cancelPrompt">Cancel</button>
    </Modal>
  </div>
</template>

<script>
//import Zdog from 'zdog'
import {mapActions} from 'vuex'// mapActions 

import {ZDOG_CLASS_NAME} from '../../zdogrigger'

import Modal from '../Modal.vue'
import Creation from '../Creation.vue'

export default {
  name: 'TopBar',
  components:{
  Modal,
  Creation,
  },
  emits: ['create-new'],
  props: {
  },

  methods:{
    ...mapActions([
      'newIllustration',
      'demoJSON',
      'exportTree',
      'importTree'
    ]),
    promptCreate(event){
      let ItemType = event.target.getAttribute('aria-label');
      if(!this.hasIllustration){
        this.newIllustration();
        return;
      } else if (ItemType == "illustration") {
        this.bWarning = true;
      }
      this.creationItemType = ItemType;
    },
    confirmNewIllustration(){
      this.newIllustration();
      this.bWarning = false;
    },
    cancelPrompt(){
      this.creationItemType = null;
      this.bWarning = false;
    },
    closeWarning(){
      this.bWarning = false;
      if (this.bImporting){
        this.importTree();
      }
    },
    importing(){
      this.bImporting = true;
      if (this.hasIllustration){
        this.bWarning = true;
      } else {
        this.importTree();
        this.bImporting = false;
      }
    },
    demo(){
    let testmodel = require('../../testmodel').default;
    this.demoJSON(testmodel);
    }
  },
  computed:{
    // ...mapState({
    //   selectedid(state){
    //     return (state.selected.id)
    //   }
    // }),
    illustration(){
      return this.$store.getters.illustration;
    },
    hasIllustration() {
    return (this.illustration !== null && this.illustration !== undefined)
    },
    creatables(){
      let c = [...ZDOG_CLASS_NAME];
      return c.filter(name=>{
        return name != "dragger"
      })
    }
  },
  data(){
    return {
      bImporting:false,
      creationItemType: null,
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
