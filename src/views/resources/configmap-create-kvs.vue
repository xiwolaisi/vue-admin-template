<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>配置详细</span>
      </div>
      <el-form  :inline="true" label-width="80px" v-for="(item,itemindex) in kvs">
        <el-form-item label="key">
          <el-input v-model="item.key"></el-input>
        </el-form-item>
        <el-form-item label="value">
          <el-input v-model="item.value"></el-input>
        </el-form-item>
        <el-button v-show="itemindex>0" type="primary" @click="rmKV(itemindex)" >-</el-button>
      </el-form>
      <el-button type="primary" @click="addKV" icon="el-icon-plus">添加Configmap</el-button>
      <el-button type="primary" @click="Save" icon="el-icon-success">保存</el-button>
    </el-card>
  </div>
</template>
<script>
import { postConfigmap } from '@/api/configmap'

export default {
  props:["Name","NameSpace"],
  data(){
    return {
      kvs:[
        {key:"",value:""}
      ],
      errorMsg:""
    }
  },
  methods:{
    addKV(){
      this.kvs.push({key: "",value:""})
      },
    rmKV(index){
      this.kvs.splice(index,1)
    },
    Save(){
      //把kv数组整合成一个大对象
      let postData={}
      this.kvs.forEach((item)=> {
        console.log(item.key)
        console.log(item.value)
        postData[item.key]=item.value
      })
      const postModel={
        Name:this.$props.Name,
        NameSpace:this.$props.NameSpace,
        Data:postData,
      }
      postConfigmap(postModel).then((rsp)=>{
        this.errorMsg= ''
        alert("成功")
      }).catch((error)=>{
        if(error.response){
          this.errorMsg = JSON.stringify(error.response.data)
        }else{
          this.errorMsg = JSON.stringify(error.message)
        }
      })
    }
  }
}

</script>
