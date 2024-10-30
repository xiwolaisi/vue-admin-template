<template>
  <div>
    <div style="padding: 10px">
      命名空间:{{this.ns}} 名称:{{this.name}}
    </div>
    <div style="text-align: center">
      <el-table
          :data="CMData"
          style="width: 100%"
      >
        <el-table-column label="Key名" width="180">
          <template slot-scope="scope">
            <p>{{scope.row.key}}</p>
          </template>
        </el-table-column>
        <el-table-column label="Value值" width="380">
          <template slot-scope="scope">
            <p> {{scope.row.value}}</p>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>

</template>
<script>
import { getConfigmap } from '@/api/configmap'
export default {
  data(){
    return {
      CMData:[],
      ns:"",
      name:""
    }
  },
  created() {
    this.ns=this.$route.params.ns
    this.name=this.$route.params.name
    getConfigmap(this.ns,this.name).then(rsp=>{
      for (let key in rsp.data.Data){
        this.CMData.push({key,value:rsp.data.Data[key]})
      }
    })
  },
}

</script>

