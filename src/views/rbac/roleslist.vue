<template>
  <div class="container">
    <div class="form-item">
      <label>命名空间</label>
      <el-select class="namespace-select" @change="changeNs" v-model="namespace">
        <el-option v-for="ns in nslist"
                   :key="ns.Name"
                   :label="ns.Name"
                   :value="ns.Name"/>
      </el-select>
    </div>
    <el-container v-if="namespace" :key="namespace" class="namespace-container">
      <el-main>
        <el-table
            :data="roles[namespace]"
            border
            fit
            highlight-current-row
            class="role-table">
          <el-table-column align="center" label="序号" width="95">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label="角色名" width="350">
            <template slot-scope="scope">
              <p>{{ scope.row.Name }}</p>
            </template>
          </el-table-column>
          <el-table-column label="命名空间" width="150">
            <template slot-scope="scope">
              <p>{{ scope.row.NameSpace }}</p>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" width="170" align="center">
            <template slot-scope="scope">
              {{ scope.row.CreateTime }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="170" align="center">
            <template slot-scope="scope">
              <!-- 操作按钮或功能 -->
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { getList as getNsList } from "@/api/ns";
import { getRolesByNs } from "@/api/roles";
import { NewClient } from "@/utils/ws";

export default {
  data() {
    return {
      namespace: "",
      nslist: null,
      roles: {},
      wsClient: null
    };
  },
  created() {
    this.loadNamespaces();
    this.initializeWebSocket();
  },
  methods: {
    loadNamespaces() {
      getNsList().then(rsp => {
        this.nslist = rsp.data;
      });
    },
    initializeWebSocket() {
      this.wsClient = NewClient();
      this.wsClient.onmessage = (e) => {
        if (e.data !== 'ping') {
          const object = JSON.parse(e.data);
          if (object.type === 'roles') {
            this.$set(this.roles, object.result.ns, object.result.data);
          }
        }
      };
    },
    changeNs(ns) {
      this.namespace = ns;
      this.loadRoles(ns);
    },
    loadRoles(ns) {
      getRolesByNs(ns).then(rsp => {
        this.$set(this.roles, ns, rsp.data);
      });
    }
  }
};
</script>

<style>
.container {
  padding: 20px;
  background-color: #f9f9f9;
}

.form-item {
  margin-bottom: 20px;
}

.namespace-select {
  width: 300px;
}

.namespace-container {
  margin-top: 20px;
}

.role-table {
  width: 100%;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.el-header, .el-footer {
  background-color: #7cd1c0;
  color: #fff;
  text-align: center;
  line-height: 60px;
}

.el-table th {
  background-color: #e6f7ff;
}

.el-table td {
  font-size: 14px;
}

.el-table .el-table__header-wrapper {
  border-radius: 8px 8px 0 0;
}

.el-table .el-table__body-wrapper {
  border-radius: 0 0 8px 8px;
}

.el-table-column p {
  margin: 0;
  padding: 0;
}
</style>