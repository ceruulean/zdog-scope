<template>
  <main @click="deselect">
    <TopBar
      ref="menuTopbar"
    />
    <div
      class="split-grid overlay"
      style=""
    >
      <div
        ref="treeview"
        class="split-column tree-view
          no-select"
      >
        <TreeView/>
        <button @click="logSelected">Log Selected</button>
      </div>
      <div
        ref="gutter1"
        class="gutter-column-1"
      />
      <div class="split-column" ref="canvasWrapper">
        <Canvas />
      </div>
      <div
        ref="gutter2"
        class="gutter-column-2"
      />
      <div class="split-column properties">
        <PropertyPanel ref="menuPropertyPanel" />
      </div>
    </div>
  </main>
</template>

<script>
import {ref, onMounted, } from 'vue' // onUpdated, onUnmounted
import { mapState, mapActions} from 'vuex'// mapActions 

import TopBar from './components/menu/TopBar.vue'
import PropertyPanel from './components/menu/PropertyPanel.vue'
import TreeView from './components/menu/TreeView.vue'
import Canvas from './components/Canvas.vue'

import Split from 'split-grid'
//import Zdog from 'zdog'


export default {
  name: 'App',
  components: {
    TopBar,
    PropertyPanel,
    TreeView,
 //   TreeTest,
    Canvas,
  },
  setup(){
    const gutter1 = ref(null);
    const gutter2 = ref(null);


    onMounted(()=>{
        window.split = Split({
        columnGutters: [{
          track: 1,//index of element to resize
          element: gutter1.value,
        }, {
          track: 3,
          element: gutter2.value,
        }],
        // onDragEnd: (/*direction, track*/) => {
        //   resize.value = true;
        //   resize.value = false;
        // }
      /**Horizontal gutters */
        // rowGutters: [{
        //   track: 1,
        //   element: this.$refs.menuPropertyPanel,
        // }]
      })

    })

    return {
        gutter1,
        gutter2,
      }
  },
  data(){
    return {
      bWarning:false,
      isClickInsideEvent:null,
    }
  },
  computed:{
    ...mapState([
      'selected'
    ]),
  },
  methods:{
    ...mapActions([
      'changeSelected'
    ]),
    getRef(refName){
      return this.$refs[refName];
    },
    deselect(event){
      if (!this.selected.id) return;
        var isClickInside = this.$refs.treeview.contains(event.target);
        
        if (isClickInside) {
          //the click inside the element
          this.changeSelected({node:null,element:null});
        }
    },
    logSelected(){
      console.log(this.$store.getters['selectedNode'])
    }
  },
}
</script>

<style>
@import './assets/root.css';

html,body{
  margin:0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

*{
  box-sizing:border-box;
}

h1,h2,h3,h4,h5{
  margin:0.5rem 0.5rem 0.7rem 0.5rem
}


a, button{
  cursor:pointer;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  overflow:hidden;
}

.split-grid{
  display:grid;
  grid-template-columns: 1fr 6px 2fr 6px 1fr; /*define column and gutter widths here*/
  border-collapse:collapse;
  z-index:1;
}.split-grid.overlay{
  position:relative;
  top:0;
  width:100vw;
  height:var(--canvasHeight);
}

.split-column {
  overflow: auto;
  width: 100%;
}.split-column.tree-view, .split-column.properties{
  background-color:rgb(255,255,255);
  position:relative;
  z-index:19
}

[class^='gutter'] {
  position:relative;
  background-color:#616161;
  background-repeat: no-repeat;
  background-position: 50%;
  cursor: col-resize;
  z-index:20;
}

[class^='gutter']:before {
  content:'...';
  color:#ebebeb;
  line-height:0;
  font-size: 20px;
  width: 100%;
  height: 100%;
  position: absolute;
  font-family:Arial, sans-serif;
}

[class^='gutter-column']:before{
  top:0;
  right:-2.5px;
  width:3px;
  height:calc(100% - 3ch);
  writing-mode: vertical-rl;
}

ul{
  margin:0;
  padding:0;
  list-style-type:none;
}

.row{
  display:flex;
  flex-direction:row;
  flex-wrap:wrap;
  justify-content:center;
}

.col{
  display:flex;
  flex-direction:column;
  flex-wrap:wrap;
  justify-content:center;
}

[class*="between-"]{
  justify-content:space-between;
}

.text-display-type{
  font-variant: small-caps;
  color: var(--colorMain);
  font-size: 0.9em;
}

.no-select{
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}

</style>
