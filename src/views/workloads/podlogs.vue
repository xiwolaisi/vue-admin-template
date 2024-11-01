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
import { getPodContainers } from "@/api/pods";

export default {
  data() {
    return {
      containers: {},
      selectContainer: "",
      logs: "",
    };
  },
  created() {
    getPodContainers("default", "ngx1-7c94c8775c-49859").then(rsp => {
      this.containers = rsp.data;
    });
  },
  methods: {
    containerChange() {
      const ns = "default";
      const podname = "ngx1-7c94c8775c-49859";
      const cname = this.selectContainer;
      this.fetchLogs(ns, podname, cname);
    },
    fetchLogs(ns, podname, cname) {
      const url = `http://127.0.0.1:8888/pods/logs?ns=${ns}&podname=${podname}&cname=${cname}`;
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