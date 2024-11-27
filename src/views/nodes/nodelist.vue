<template>
  <div class="app-container">
    <el-table
        v-loading="listLoading"
        :data="nodelist"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column label="名称" width="300">
        <template slot-scope="scope">
          <p>{{ scope.row.Name }}<br>
          <el-tag type="success" v-for="label in scope.row.Labels">{{label}}</el-tag>
          <br/>
            <el-tag type="danger" v-for="taint in scope.row.Taints">{{taint}}</el-tag>
            <br/>
          <p/>
        </template>
      </el-table-column>
      <el-table-column label="IP" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.IP }}</span>
        </template>
      </el-table-column>
      <el-table-column label="主机名" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.HostName }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="180" align="center">
        <template slot-scope="scope">
          {{ scope.row.CreateTime }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="{name:'Nodedatail',params:{name:scope.row.Name}}">详情<i class="el-icon-document"></i></router-link>
          <router-link :to="{name:'Nodeshell',params:{name:scope.row.Name}}">Webshell<i class="el-icon-s-platform"></i></router-link>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
import {getnodeList} from "@/api/node";
import { NewClient } from "@/utils/ws"
export default {
  data() {
    return {
      nodelist:null,
      list: null,
      listLoading: true,
      wsClient: null
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.wsClient = NewClient()
      // 通过rest api 获取
      getnodeList().then(response => {
        this.nodelist = response.data
        this.listLoading = false
      })
      // 通过websocker获取,并动态刷新
      this.wsClient.onmessage = (e) => {
        if (e.data !== 'ping') {
          const object = JSON.parse(e.data)
          if (object.type === 'node') {
            this.$set(this, 'nodelist', object.result.data)
          }
        }
      }
    },
    getStatus(row) {
      if (row.IsComplete)
        return "<span class='green'>Active</span>"
      return "<span class='red'>Waiting</span>"
    },
    getMessage(row) {
      if (!row.IsComplete) {
        return row.Message
      }
      return ''
    }
  }
}
</script>
<style>
.red{color: #d20000
}
.green{color:green}
.bold-text {
  font-weight: bold;
}
</style>