<template>
  <h2>Tree View</h2>
    <button v-if="!treeLoaded" @click="demo">
      Try Demo
    </button>
    <button v-if="treeLoaded" @click="embedGen">
      Code Embed
    </button>
  <header 
    v-if="treeLoaded"
    class="row between text-display-type"
  >
    <div class="col index">
      Index
    </div>
    <div class="col name">
      Name
    </div>
    <div class="col type">
      Type
    </div>
  </header>
  <ul
    v-if="treeView && treeLoaded"
    class="tree-bg"
  >
    <TreeItem
      v-for="(node) in treeView"
      :key="node.id"
      :node="node"
      :depth="0"
    />
  </ul>
<teleport to="body">
  <Modal
    v-if="bEmbed"
    @close="bEmbed = false"
  >
    <h2>HTML Code</h2>
    <p>Copy and paste into an HTML file.</p>
    <textarea class="embed" ref="embedText"
      :value="embed"/>
    <button @click="embedCopy">
      Copy
    </button>
  </Modal>
</teleport>
</template>

<script>
import { mapState, mapActions } from 'vuex'// mapActions mapGetters

import TreeItem from './TreeItem.vue'
import Modal from '../Modal'


export default {
  name: 'TreeView',
  components:{
    TreeItem,
    Modal
    },

  data(){
    return{
      ghost:false,
      rerender:false,
      draggingObject:null,
      dragId:null,
      bEmbed:false,
    }
  },
  computed:{
    ...mapState({
      illustration: 'illustration',
      treeLoaded: 'treeLoaded',
      embed:state=>state.treeview.embed,
      treeView:state=>state.treeview.list
    }),
  },
  watch:{
    illustration(nVal){
      if (nVal){
        this.$store.dispatch('treeview/changeList')
      }
    },
  },
  methods:{
    ...mapActions([
      'demoJSON',
    ]),
    getPanelWidth(){
      return this.$parent.$refs.treeview.clientWidth
    },
    log(){
      console.log(this.treeView)
    },
    embedGen(){
      this.bEmbed = true;
      this.$store.dispatch('treeview/createEmbed')
    },
    embedCopy(){
      let r = this.$refs.embedText
      r.select();
      r.setSelectionRange(0, 99999);
      document.execCommand("copy");
    },
    demo(){
      let testmodel = require('../../testmodel').default;
      this.demoJSON(testmodel);
    },
  },
}
</script>

<style lang="scss">
textarea.embed{
  height:70ch;
  max-height: 40vh;
  width: 100%;
}

.tree-view {
  ul.tree-bg{
    background-image: linear-gradient(0deg,
      var(--colorShade) 25%,
      transparent 25%, transparent 50%,
      var(--colorShade) 50%, var(--colorShade) 75%,
      transparent 75%, transparent 100%)
    ;
    background-size: 5.2rem 5.2rem;
  }
  ul ul {
    padding-left:1.1rem;
  }
  header{
    margin-top:10px;
    background-color:rgba(0,0,0,0.7);
    color:rgba(255,255,255,1);
  }
  .row{
    flex-wrap:nowrap;
    
    .index{
      padding:0 0.2rem 0 0.2rem;
      background-color:rgba(255,255,255,0.2);
    }
  }
  .name{
    flex-grow:4;
    padding:0 0.2rem;
  }  
  .type{
    padding:0 0.2rem 0 0.1rem;
    width:6rem;
    background-color:rgba(255,255,255,0.2);
  }
}
</style>
