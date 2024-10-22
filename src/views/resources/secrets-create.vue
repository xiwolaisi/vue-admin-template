<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本配置</span>
      </div>
      <el-form  :inline="true">
        <el-form-item label="secret名称">
          <el-input v-model="name"   placeholder="secret名称"></el-input>
        </el-form-item>
        <el-form-item label="命名空间">
          <el-select v-model="namespace">
            <el-option v-for="ns in nslist "
                       :label="ns.Name"
                       :value="ns.Name"/>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
    <Opaque v-bind:Name="name" v-bind:NameSpace="namespace"></Opaque>
    </div>
  </div>
</template>
<script>
import { getList  as getNsList } from '@/api/ns'
import Opaque from '@/views/resources/secrets-create-opaque'
export default {
  components: {
    // 注册 secrets-create-opaque 组件
    Opaque
  },
  data(){
    return {
      name:"",
      namespace: "",
      nslist:[], //ns列表
    }
  },
  created(){
    getNsList().then(rsp=>{
      this.nslist=rsp.data
    })
  }
}

</script>
