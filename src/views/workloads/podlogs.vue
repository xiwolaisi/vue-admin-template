<template>
  <div>
    <div style="padding-left: 20px;padding-top: 30px">
      容器: <el-select @change="containerChange"  placeholder="选择容器" v-model="selectContainer">
      <el-option v-for="c in containers" :label="c.Name" :value="c.Name"/>
    </el-select>
    </div>
    <div class="logs">
      <pre>{{logs}}</pre>
    </div>
  </div>

</template>
<script>
import { getPodContainers,getPodLogs } from "@/api/pods"

export default {
  data(){
    return {
      containers:{},
      selectContainer:"",
      logs:""
    }
  },
  created() {
    getPodContainers("default","ngx1-7c94c8775c-49859").then(rsp=>{
      this.containers=rsp.data
    })
  },
  methods: {
    containerChange(){
      getPodLogs("default","ngx1-7c94c8775c-49859",this.selectContainer).then(rsp=>{
        this.logs=rsp.data
      })
    }
  }
}

</script>
<style>
.logs {
  background-color: #8ad9da;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: 'Courier New', Courier, monospace;
  font-size: 18px;
  color: #fff;
  max-height: 400px;
  overflow-y: auto;
  margin-top: 20px;
}

.logs pre {
  margin: 0;
  padding: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>