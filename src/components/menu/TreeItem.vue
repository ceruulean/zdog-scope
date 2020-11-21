<template>
<div :class="{'roq':true}" v-if="node">
  <li class="tree-item"
    @dragover="dragOver"
    @dragleave="dragOverIndicate = false"
    @drop="drop"
  >
    <div @click.stop="highlight"
        ref="selectitem"
        :class="{
          'data-set':true,
          'row':true,
          'highlight': isSelected}"
      draggable="true"
      @dragstart="dragStart"
      @dragend="this.dragging = false;dragOverIndicate = false">
      <button v-if="hasChildren"
        @click="toggleCollapse"
        >
        {{collapsed? '+' : '-'}}
      </button>
      <div class="index">{{node.index}}</div>

      <input v-if="editingName && isSelected"
        autofocus
        ref="textbox"
        class="name" type="text" v-model="wipName"
        :placeholder="node.assignedName"
        @keydown="keydownHandler"
        @blur="finishEditAssignedName"/>
      <label v-else
        class="name"
        @dblclick="editAssignedName">
          {{node.assignedName}}
      </label>

      <div class="text-display-type type">
        {{node.assignedType}}
      </div>
    </div>
    <div v-show="dragOverIndicate"
      class="drag-over-ghost">
      </div>
    <!--
    <teleport to="[data-teleport]">
      <div v-if="editingName" class="editing-blocker"
        @click="editBlocker"
        ></div>
    </teleport>-->
    <ul v-if="hasChildren">
    <TreeItem v-for="(node) in node.children" :key="node.id"
    :class="{'collapsed':collapsed}"
    :node="node"
    :depth="depth + 1"
    />
    </ul>
  </li>
</div>
</template>

<script>
//import {ref} from 'vue' // onUpdated, onUnmounted
import { mapState, mapActions} from 'vuex'// mapGetters
//import { VueDraggableNext } from 'vue-draggable-next'

export default {
  name: 'TreeItem',
  emits:['change-name', 'sort-tree'],
 // components:{draggable: VueDraggableNext},
  props: {
    node:Object,
    depth:Number
  },
  watch:{
    selectedid(){
      this.finishEditAssignedName();
    }
  },
  methods:{
    ...mapActions([
      'changeSelectedName', //newName
      'changeSelected', //{node: obj, element: element}
    ]),
    dragStart(e){
      this.dragging = true;
      let payload = {childId: this.node.id, childDepth: this.depth}
      e.dataTransfer.setData("text/plain", JSON.stringify(payload));
    },
    dragOver(e){
      e.preventDefault();
      e.stopPropagation();
      this.dragOverIndicate = true;
      e.dataTransfer.dropEffect = "move";
    },
    drop(e){
      e.preventDefault();
      e.stopPropagation();
      let data = JSON.parse(e.dataTransfer.getData("text/plain"));
      let payload = {
        id: data.childId,
        newParentId: this.node.id,
        parentDepth: this.depth,
        childDepth: Number(data.childDepth)
      }
      this.$store.dispatch('treeview/sortItem', payload)
      //this.$emit('sort-tree', payload)
      this.dragging = false
      this.dragOverIndicate = false
    },
    editAssignedName(){
      this.editingName = true;
    },
    finishEditAssignedName(){
      this.editingName = false;
      if (!this.wipName) return
      this.changeSelectedName(this.wipName)
      // let newName = this.wipName
     // this.$emit('change-name', this.nestedindex, this.wipName);
      this.wipName = null;
    },
    keydownHandler(event){
      if (event.keyCode == 13) { //'Enter' pressed
        this.finishEditAssignedName();
      }
    },
    highlight(){
      //this.listElement.classList.add('highlight');
      let payload = {id: this.node.id,
       element: this.selectItem
       }
      this.changeSelected(payload)
      //this.$emit('change-selected', this.node.id, this.selectedElement);
    },
    toggleCollapse(){
      this.collapsed = !this.collapsed;
    },
    log(event) {
      console.log(event)
    },
  },
  computed:{
    ...mapState({
      selectedid:state => state.selected.id,
      Ztree: 'Ztree',
      updateTree:'updateTree'
    }),
    selectItem(){
      return this.$refs.selectitem;
    },
    isSelected(){
      return (this.selectedid && this.selectedid == this.node.id)
    },
    ZdogObject(){
      return this.Ztree.find(this.node.id);
    },
    hasChildren(){
      return (this.node.children && this.node.children.length > 0)
    },
  },
  data(){
    return{
      dragOverIndicate:false,
      dragging:false,
      editingName:false,
      wipName:null,
      collapsed:true,
    }
  }
}
</script>

<style scoped>
.tree-item{
 /* background-color:rgba(100, 97, 97, 1);*/
  display:flex;
  justify-content:space-between;
  flex-direction:column;
}

.tree-item * {
  cursor:pointer;
}


.tree-item .row{
  border-bottom: 1px solid rgba(0,0,0,0.2);
}

.tree-item .highlight{
  background-color:rgba(31, 79, 255, 0.4);
}

.tree-item .editing{
  z-index:51;
}

.tree-item .data-set{
  width: 100%;
}
.tree-item ul{
  position:relative;
}

.tree-item button{
  position:absolute;
  left:0;
  line-height:0.3rem;
  padding:0.2rem 0.1rem;
}

.tree-item .index{
  text-align:right;
  border-right:1px solid rgb(92, 85, 85);
}

.collapsed{
  display:none;
}

.tree-item .empty-list-dropzone{
  padding:0.5rem 0 0 0;
}

.drag-over-ghost{
  border:1px dashed grey;
  background-color:rgba(0,255,255,0.3);
  height:1rem;
  margin-left:1rem;
  /*needs arrow to indicate child*/
}

</style>
