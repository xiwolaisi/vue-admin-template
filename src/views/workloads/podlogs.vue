<template>
  <div>
    <div style="padding-left: 20px;padding-top: 30px">
      容器: <el-select @change="containerChange"  placeholder="选择容器" v-model="selectContainer">
      <el-option v-for="c in containers" :label="c.Name" :value="c.Name"/>
    </el-select>
      <el-button @click="fetchLogs(selectContainer)" type="primary" style="margin-left: 10px;">
        显示日志
      </el-button>
      <el-button @click="clearLogs" type="danger" style="margin-left: 10px;">
        清空日志
      </el-button>
    </div>
    <div class="logs">
      <pre>{{logs}}</pre>
    </div>
  </div>

</template>
<script>
import { getPodContainers } from "@/api/pods";

export default {
  data() {
    return {
      Name:"",
      NameSpace:"",
      containers: {},
      selectContainer: "",
      logs: "",
      logReader: null // 用于存储日志读取器
    };
  },
  created() {
    this.Name = this.$route.params.name
    this.NameSpace = this.$route.params.ns
    if(this.Name===undefined||this.NameSpace===undefined){
      alert("错误的参数！")
    } else {
      getPodContainers(this.NameSpace,this.Name).then(rsp=>{
        this.containers=rsp.data
      })
    }
  },
  methods: {
    containerChange() {
    },
    async fetchLogs(containerName) {
      if (!containerName) {
        alert("请选择容器");
        return;
      }
      // 调用 clearLogs 方法，确保不会重复显示内容
      this.clearLogs();

      // 如果之前存在日志读取器，则取消读取
      if (this.logReader) {
        this.logReader.cancel();
        this.logReader = null;
      }
      const url = `http://127.0.0.1:8888/pods/logs?ns=${this.NameSpace}&podname=${this.Name}&cname=${containerName}`;
      fetch(url, {
        method: "GET",
      }).then(response => {
        if (response.body) {
          const reader = response.body.getReader();
          reader.read().then(function processText({ done, value }) {
            if (done) {
              console.log("Stream finished");
              return;
            }
            const chunk = new TextDecoder("utf-8").decode(value, { stream: true });
            this.logs += chunk;
            reader.read().then(processText.bind(this));
          }.bind(this));
        }
      });},
    clearLogs() {
      this.logs = "";
      // 如果之前存在日志读取器，则取消读取
      if (this.logReader) {
        this.logReader.cancel();
        this.logReader = null;
      }
    }
  },
};
</script>
<style>
.logs {
  max-height: 600px;
  overflow: auto;
  padding: 10px;
  margin-top: 20px;
  background-color: #53c2c5;
  color: white;
  border: 1px solid #ccc;
  white-space: pre-wrap;
  word-wrap: break-word;
  word-break: break-all;
}

.logs pre {
  margin: 0;
  padding: 0;
}
</style>