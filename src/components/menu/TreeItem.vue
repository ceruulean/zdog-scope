<template>
  <li ref="listitem"
    :class="{
    'tree-item':true, 'row':true,
    'highlight':bHighlight}"
      @click="highlight"
      >
    <div class="index">{{index}}</div>
    <label v-if="!editingName"
      class="name"
      @dblclick="editAssignedName">
        {{assignedname}}
    </label>
    <input v-if="editingName"
      autofocus
      ref="textbox"
      class="name" type="text" v-model="wipName"
      :placeholder="assignedname"
      @keydown="keydownHandler"
      @blur="finishEditAssignedName"/>
    <div class="type">
      {{zdogtype}}
    </div>
    <!--
    <teleport to="[data-teleport]">
      <div v-if="editingName" class="editing-blocker"
        @click="editBlocker"
        ></div>
    </teleport>-->
  </li>
</template>

<script>
export default {
  name: 'TreeItem',
  emit:['editing-tree','edit-zdogger-node-name', 'change-selected'],
  props: {
    zdogtype:String,
    assignedname:String,
    index:Number
  },
  methods:{
    editAssignedName(){
      //event.preventDefault();
      //change to input box
      this.editingName = true;
      this.$emit('editing-tree');
      
      // this.$nextTick(() => {
      //   console.log(this.$refs.textbook)
      //     const textbox = this.$refs.textbox.$el;
      //     textbox.focus();
      //   });
      
    },
    finishEditAssignedName(){
      this.editingName = false;
      if (!this.wipName) return
      let newName = this.wipName
      this.$emit('edit-zdogger-node-name', this.index, newName);
      this.wipName = null;
    },
    keydownHandler(event){
      if (event.keyCode == 13) { //'Enter' pressed
        this.finishEditAssignedName();
      }
    },
    highlight(){
      this.$emit('change-selected', this.index, this.listElement);
    }
  },
  computed:{
    listElement(){
      return this.$refs.listitem;
    }
  },
  data(){
    return{
      editingName:false,
      wipName:null,
      bHighlight:false
    }
  }
}
</script>

<style>
.tree-item{
  border:1px solid rgba(0,0,0,0.2);
  background-color:rgba(0,0,0,0.1);
  display:flex;
  justify-content:space-between;
}

.tree-item.highlight{
  background-color:rgba(31, 79, 255, 0.4);
}

.tree-item .editing{
  z-index:51;
}

.editing-blocker{
  position:absolute;
  top:0;
  left:0;
  width:100vw;
  height:100vh;
  z-index:50;
}
</style>
