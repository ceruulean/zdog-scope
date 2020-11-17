<template>
  <main data-teleport @click="deselect">
    <TopBar @create-new="eventCreateNew"
      :zdoglist="ZdogList"
      :workingillustration="workingIllustration"/>
    <Canvas ref="refCanvas" :zdogobjects="ZdogObjects"
      @illustration-mounted="updateWorkingIllustration"/>
    <div class="split-grid overlay" style="">
      <div class="split-column">
        <TreeView :workingillustration="workingIllustration"
          :nodeindexset="nodeIndexSet"
          :selectednode="selected.node"
          @change-selected="changeSelected"
          />
      </div>
      <div ref="gutter1" class="gutter-column-1"></div>
      <div class="split-column">
        <!--empty-->
      </div>
      <div ref="gutter2" class="gutter-column-2"></div>
      <div class="split-column">
        <PropertyPanel ref="menuPropertyPanel"
        :selectednode="selected.node"
        :workingillustration="workingIllustration"/>
      </div>
    </div>
    <Modal ref="warning">
      <p>WARNING: Are you sure you want to replace the current illustration?</p>
      <button @click="confirmNewIllustration">Yes</button><button @click="closeModal">Cancel</button>
    </Modal>
  </main>
</template>

<script>
import {ref, onMounted, } from 'vue' // onUpdated, onUnmounted

import TopBar from './components/menu/TopBar.vue'
import PropertyPanel from './components/menu/PropertyPanel.vue'
import TreeView from './components/menu/TreeView.vue'
import Canvas from './components/Canvas.vue'

import Modal from './components/Modal.vue'

import Split from 'split-grid'
import Zdog from 'zdog'
import Zdogger from './zdogrigger'


export default {
  name: 'App',
  components: {
    TopBar,
    PropertyPanel,
    TreeView,
    Canvas,
    Modal
  },
  setup(){
    const gutter1 = ref(null);
    const gutter2 = ref(null);

    onMounted(()=>{
        Split({
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
    getRef(refName){
      return this.$refs[refName];
    },

    eventCreateNew(itemName, options){
      console.log(`Creating ${itemName}`);
      if (itemName == "illustration"){
        if (this.workingIllustration){
        this.$refs.warning.open();
        } else {
          this.confirmNewIllustration();
        }
      } else {
        this._addToSelected(itemName, options);
      }
    },
    _addToSelected(itemName, options){
      let selected = this.selected.node || this.workingIllustration;
      let tempOp = Object.assign({}, {addTo:selected});
      Object.assign(tempOp, options);
      let newItem = this.$refs.refCanvas.createNew(itemName)(tempOp);
      this.createZdogger(itemName, newItem);
    },
    createZdogger(itemName, zDogObject){
      this.nodeIndexSet.add(new Zdogger.Node(itemName, zDogObject, 'unnamed'));
    },
    confirmNewIllustration(){
      this.$refs.refCanvas.newIllustration();
      this.closeModal();
    },

    updateWorkingIllustration(illuObj){
      this.workingIllustration = illuObj;
      this.nodeIndexSet = new Set();
      this.nodeIndexSet.add(new Zdogger.Node('illustration', illuObj, 'root'));
    },

    closeModal(){
      this.$refs.warning.close();
    },
    deselect(event){
      if (!this.selected.node) return;
        let cn = (el, event) => {return el.contains(event.target)}
        var isClickInside = cn(this.selected.element, event);
        var isClickPropertyPanel = cn(this.$refs.menuPropertyPanel.$el, event);
        //Gutterhandle must be done differently, maybe ondrag block click events?
       // var isClickGutter = cn(this.gutter1, event) || cn(this.gutter2, event); 

        if (!isClickInside && !isClickPropertyPanel) {
          //the click was outside the specifiedElement, do something
          this.selected.node = null;
         // this.selected.node.element = null;
         this._updateNodeSet();
        }
    },
    changeSelected(index, payload){

      let o = Array.from(this.nodeIndexSet)[index];
      this.selected.node = o;
      this.selected.element = payload;
      this._updateNodeSet();
    },
    _updateNodeSet(){
      this.nodeIndexSet.add(-1);
      this.nodeIndexSet.delete(-1);
    }
  },

  data(){
    return {
      workingIllustration:null,
      nodeIndexSet:null,
      ZdogObjects : {
        illustration:(options)=>{return new Zdog.Illustration(options)},
        anchor:(options)=>{return new Zdog.Anchor(options);},
        shape:(options)=>{return new Zdog.Shape(options);},
        rect:(options)=>{return new Zdog.Rect(options);},
        roundedrect:(options)=>{return new Zdog.RoundedRect(options);},
        ellipse:(options)=>{return new Zdog.Ellipse(options);},
        hemisphere:(options)=>{return new Zdog.Hemisphere(options);},
        polygon:(options)=>{return new Zdog.Polygon(options);},
        cone:(options)=>{return new Zdog.Cone(options);},
        cylinder:(options)=>{return new Zdog.Cylinder(options);},
        box:(options)=>{return new Zdog.Box(options);},
        group:(options)=>{return new Zdog.Group(options);},
        //dragger:(options)=>{return new Zdog.Dragger(options);},
        vector:(options)=>{return new Zdog.Vector(options);},
      },
      selected:{},
      bWarning:false,
    }
  },
  computed:{
    ZdogList(){
      return Object.keys(this.ZdogObjects);
    }
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
}

.split-column {
  overflow: auto;
  width: 100%;
}

[class^='gutter'] {
  position:relative;
  background-color: pink;
  background-repeat: no-repeat;
  background-position: 50%;
  cursor: col-resize;
}

[class^='gutter']:before {
  content:'...';
  color:black;
  line-height:0;
  font-size: 20px;
  width: 100%;
  height: 100%;
  position: absolute;
  font-family:Arial, sans-serif;
}

[class^='gutter-column']:before{
  top:0;
  right:-2px;
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
