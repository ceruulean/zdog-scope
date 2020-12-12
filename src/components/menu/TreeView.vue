<template>
  <div class="min-10">
    <h2>Tree View</h2>
    TODO: filter anchors, add icon, searchbar
    <header class="row between text-display-type">
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
      <button @click="log">
        Console Log
      </button>
      <br>
    </ul>
  </div>
</template>

<script>
import { mapState} from 'vuex'// mapActions mapGetters

import TreeItem from './TreeItem.vue'


export default {
  name: 'TreeView',
  components:{
    TreeItem,
    },

  data(){
    return{
      ghost:false,
      rerender:false,
      draggingObject:null,
      dragId:null
    }
  },
  computed:{
    ...mapState({
      illustration:'illustration',
      treeLoaded:'treeLoaded'
    }),
    treeView: {
      get() {
        return this.$store.state.treeview.list
      }
    },
  },
  watch:{
    illustration(nVal){
      if (nVal){
        this.$store.dispatch('treeview/changeList')
      }
    }
  },
  methods:{
    log(){
      console.log(this.treeView)
    },
  },
}
</script>

<style >

.tree-view header{
  background-color:rgba(0,0,0,0.7);
  color:rgba(255,255,255,1);
}

.tree-view .row{
  flex-wrap:nowrap;
}

.tree-view .index{
  padding:0 0.2rem 0 0.2rem;
  background-color:rgba(255,255,255,0.2);
}
.tree-view .name{
  flex-grow:4;
  padding:0 0.2rem;
}
.tree-view .type{
  padding:0 0.2rem 0 0.1rem;
  width:6rem;
  background-color:rgba(255,255,255,0.2);
}

.tree-view ul ul {
  padding-left:1.1rem;
}

.tree-bg{
  background-image: linear-gradient(0deg,
    var(--colorShade) 25%,
  transparent 25%, transparent 50%,
  var(--colorShade) 50%, var(--colorShade) 75%,
   transparent 75%, transparent 100%);
background-size: 5.2rem 5.2rem;
}


.min-10{
  min-width:10rem;
}

</style>
