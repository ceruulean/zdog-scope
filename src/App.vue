<template>
  <main @click="deselect">
    <TopBar
      ref="menuTopbar"
      />
    <div class="split-grid overlay" style="">
      <div class="split-column tree-view
          user-select-none"
       ref="treeview">
        <h2>Tree View</h2>
        TODO: filter anchors, add icon, searchbar
        <header class="row between">
          <div class="col index">
            Index
          </div>
          <div class="col name">Name</div>
          <div class="col type">Type</div>
        </header>
        <TreeView/>
      </div>
      <div ref="gutter1" class="gutter-column-1"></div>
      <div class="split-column">
        <Canvas ref="refCanvas"/>
      </div>
      <div ref="gutter2" class="gutter-column-2"></div>
      <div class="split-column property-panel">
        <h2>Properties</h2>
        <PropertyPanel ref="menuPropertyPanel"/>
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
  watch:{
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
  }
  
}
</script>

<style>
@import './assets/root.css';

html,body{
  margin:0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

input,p,label{
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

*{
  box-sizing:border-box;
}

h1,h2,h3,h4,h5{
  margin:0.5rem 0.5rem 0.7rem 0.5rem
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
}.split-column.tree-view, .split-column.property-panel{
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

input[type="text"], textarea{
  border-radius:3px;
  border:1px solid var(--colorMain);
  padding: 1px 5px;
}

.row{
  display:flex;
  flex-direction:row;
  flex-wrap:wrap;
  justify-content:center;
}
[class*="between-"]{
  justify-content:space-between;
}

.text-display-type{
  font-variant: small-caps;
  color: rgba(0,0,0,0.6);
  font-size: 0.9em;
}

.user-select-none{
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
</style>
