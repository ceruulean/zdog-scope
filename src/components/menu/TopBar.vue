<template>
  <div class="toolbar row">
    <button @click="settings">
      Settings
    </button>
    <button v-if="hasIllustration"
      @click="exportTree">
      Export
    </button>
    <button @click="importing">
      Import
    </button>
    <div
      :aria-label="`Create new`"
      tabIndex="0"
    >
      <button
        v-for="(item,index) in creatables"
        :key="`${item}_${index}`"
        :aria-label="item"
        :class="{
          'hidden': (item != 'illustration' && !hasIllustration)
        }"
        @click="promptCreate"
      >
        +{{ item }}
      </button>
    </div>
  </div>
  <teleport to="body">
    <Modal
      v-if="!bWarning && hasIllustration && creationItemType"
      @close="cancelPrompt"
    >
      <Creation
        :itemtype="creationItemType"
        @close-prompt="cancelPrompt"
      />
    </Modal>
    <Modal
      v-if="bWarning && hasIllustration"
      @close="cancelPrompt"
    >
      <p>WARNING: Are you sure you want to replace the current illustration?</p>
      <button @click="closeWarning">
        Yes
      </button>
      <button @click="cancelPrompt">
        Cancel
      </button>
    </Modal>
    <Modal
      v-if="bSettings"
      @close="cancelPrompt"
    >
    <Settings
      @close-prompt="cancelPrompt"
    />
    </Modal>
  </teleport>
</template>

<script>
//import Zdog from 'zdog'
import {mapActions} from 'vuex'// mapActions 
import {ZCLASS} from '../../zdogger/ztree'

import Modal from '../Modal.vue'
import Creation from '../Creation.vue'
import Settings from './Settings.vue'

export default {
  name: 'TopBar',
  components:{
  Modal,
  Creation,
  Settings
  },
  emits: ['create-new'],

  data(){
    return {
      bImporting:false,
      creationItemType: null,
      bWarning:false,
      bSettings:false
    }
  },
  computed:{
    illustration(){
      return this.$store.state.illustration
    },
    hasIllustration() {
      return (!!this.illustration)
    },
    creatables(){
      let c = [...ZCLASS.NAMES];
      return c.filter(name=>{
        return (name != "dragger" && name != "vector")
      })
    },
    currentSettings(){
      return this.$store.state.canvas.settings
    }
  },
  methods:{
    ...mapActions([
      'newIllustration',
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
      this.bSettings = false;
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

    settings(){
      this.bSettings = true;
    },
    saveSettings(){
      this.$store.state.canvas
    },
    defaultSettings(){

    }
  },
}
</script>

<style>
.toolbar{
  position:relative;
  border:1px solid black;
  height:var(--menuTopBarHeight);
  z-index:var(--zTopBar);
}

.toolbar button{
  text-transform:capitalize;
}
</style>
