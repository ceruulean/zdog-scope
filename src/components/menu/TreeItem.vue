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
      @dragend="dragEnd">
      <div class="index">
        <button v-if="hasChildren"
        @click="toggleCollapse"
        >
          {{collapsed? '+' : '-'}}
        </button>
        <p>{{node.index}}</p>
      </div>

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
    <div v-if="dragOverIndicate"
      class="drag-over-ghost">
    </div>
    <!--
    <teleport to="[data-teleport]">
      <div v-if="editingName" class="editing-blocker"
        @click="editBlocker"
        ></div>
    </teleport>-->
    <ul v-if="hasChildren">
    <TreeItem v-for="(child) in node.children" :key="child.id"
    :class="{'collapsed':collapsed}"
    :node="child"
    :depth="depth + 1"
    :parentId="node.id"
    />
    </ul>
  </li>
</div>
</template>

<script>
//import {ref} from 'vue' // onUpdated, onUnmounted
import { mapState, mapActions} from 'vuex'// mapGetters

export default {
  name: 'TreeItem',
  emits:['drag-started', 'drag-stop'],
  props: {
    node:Object,
    depth:Number,
    parentId:String
  },
  watch:{
    selectedid(){
      this.finishEditAssignedName();
    }
  },
  methods:{
    ...mapActions({
      changeSelectedName:'changeSelectedName', //newName
      changeSelected:'changeSelected', //{node: obj, element: element}
      startDrag:'treeview/startDrag',
      stopDrag:'treeview/stopDrag'
    }),
    dragStart(e){
      let payload = {childId: this.node.id}
      this.startDrag({blockIds:[this.node.id, this.parentId]})
      e.dataTransfer.setData("text/plain", JSON.stringify(payload));
    },
    dragEnd(){
      this.dragOverIndicate = false;
      this.stopDrag()
    },
    dragOver(e){
      e.preventDefault();
      e.stopPropagation();
      if (!this.validDropzone) return;
      this.dragOverIndicate = true;
      e.dataTransfer.dropEffect = "move";
    },
    drop(e){
      e.preventDefault();
      e.stopPropagation();
      if (!this.validDropzone) return;
      let data = JSON.parse(e.dataTransfer.getData("text/plain"));
      let payload = {
        id: data.childId,
        newParentId: this.node.id,
      }
      this.$store.dispatch('treeview/sortItem', payload)
      //this.$emit('sort-tree', payload)
      this.dragEnd();
    },
    editAssignedName(){
      this.editingName = true;
    },
    finishEditAssignedName(){
      this.editingName = false;
      if (!this.wipName) return
      this.changeSelectedName(this.wipName)
      this.wipName = null;
    },
    keydownHandler(event){
      if (event.keyCode == 13) { //'Enter' pressed
        this.finishEditAssignedName();
      }
    },
    highlight(){
      let payload = {id: this.node.id,
       element: this.selectItem
       }
      if (this.selectedid == this.node.id) {return}
      this.changeSelected(payload)
    },
    toggleCollapse(e){
      e.preventDefault();
      e.stopPropagation();
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
    validDropzone(){
      let nid = this.node.id;
      if (this.$store.state.treeview.blockIds.includes(nid)) return false 
      return true
    }
  },
  data(){
    return{
      dragOverIndicate:false,
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
  position:relative;
}

.tree-item * {
  cursor:pointer;
}


.tree-item .row{
  border-bottom: 1px solid rgba(0,0,0,0.2);
}

.tree-item .highlight{
  background-color:var(--colorLight);
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
  position:relative;
  line-height:0.3rem;
  padding:0.2rem 0.1rem;
  width:2.5ch;
}

.tree-item .index{
  text-align:right;
  border-right:1px solid rgba(92, 85, 85, 0.2);
  display:flex;
  flex-flow:row nowrap;
}

.tree-item .index p{
  margin:0;
  padding:0;
  width:3ch;
  font-size:0.9rem;
  color:var(--colorMain);
}

.tree-item li:before{
  position:absolute;
  top:0;
  content:'';
  width:1px;
  background-color:var(--colorMain);
  height:100%;
}

.tree-item .name{
  width:99%;
  text-align:left;
  max-width:initial;
}

.collapsed{
  display:none;
}

.tree-item .empty-list-dropzone{
  padding:0.5rem 0 0 0;
}

.drag-over-ghost{
  border:1px dashed var(--colorPri);
  background-color:var(--colorLight);
  opacity:0.5;
  height:1rem;
  margin-left:1rem;
  /*needs arrow to indicate child*/
}

</style>
