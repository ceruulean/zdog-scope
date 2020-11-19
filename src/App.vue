<template>
  <main @click="deselect">
    <TopBar
      ref="menuTopbar"
      />
    <div class="split-grid overlay" style="">
      <div class="split-column tree-view">
        <h2>Tree View</h2>
        filter anchor icon links
        <div class="tree-view">
        <header class="row between">
          <div class="col index">
            Index
          </div>
          <div class="col name">Name</div>
          <div class="col type">Type</div>
        </header>
          <TreeView/>
        </div>
      </div>
      <div ref="gutter1" class="gutter-column-1"></div>
      <div class="split-column">
        <Canvas ref="refCanvas"/>
      </div>
      <div ref="gutter2" class="gutter-column-2"></div>
      <div class="split-column property-panel">
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
      if (!this.selected.node) return;

        var isClickInside = (this.selected.element.contains(event.target)
        || this.$refs.menuPropertyPanel.$el.contains(event.target))
        || this.$refs.menuTopbar.$el.contains(event.target);

        if (!isClickInside) {
          //the click was outside the specifiedElement, do something
          this.changeSelected(null);
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

:root{
  --menuTopBarHeight:2rem;
  --canvasHeight:calc(100vh - 2rem);
  --modalBGColor:white;
  --readableParagraph:76ch;
}

html,body{
  margin:0;
}

*{
  box-sizing:border-box;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
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
  background-color: #A0A0A0;
  background-repeat: no-repeat;
  background-position: 50%;
  cursor: col-resize;
  z-index:20;
}

[class^='gutter']:before {
  content:'...';
  color:white;
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
[class*="between-"]{
  justify-content:space-between;
}
</style>
