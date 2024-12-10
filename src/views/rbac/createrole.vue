<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本配置</span>
      </div>
      <el-form :inline="true">
        <el-form-item label="角色名称">
          <el-input v-model="roleName" placeholder="角色名称"></el-input>
        </el-form-item>
        <el-form-item label="命名空间">
          <el-select v-model="namespace">
            <el-option v-for="ns in namespaces" :label="ns.Name" :value="ns.Name" />
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>资源授权</span>
      </div>
      <el-form v-for="(rule, ruleindex) in rules" :key="ruleindex" :inline="true">
        <el-form-item label="Api组">
          <el-select v-model="rule.groupversion" @change="(v)=>updateVerbs(v, ruleindex)">
            <el-option-group
                v-for="(group, index) in resources"
                :key="group.Group+index"
                :label="group.Group"
                :value="group.Group">
              <el-option v-for="item in group.Resources"
                :key="item.Name+index"
                :label="item.Name"
                :value="group.Group+':'+item.Name">
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="权限">
          <el-select v-model="rule.verbs" multiple>
            <el-option
                v-for="v in rule.verbscopy"
                :label="v"
                :value="v">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary" @click="addRule" v-if="ruleindex === rules.length - 1">+</el-button>
        <el-button type="danger" @click="removeRule(ruleindex)" v-else>-</el-button>
      </el-form>
    </el-card>
    <div style="text-align: center; margin-top: 20px;">
      <el-button type="primary" @click="save">保存</el-button>
    </div>
  </div>
</template>

<script>
import { getList as getNsList } from '@/api/ns';
import { getResources } from '@/api/resources';

export default {
  data() {
    return {
      roleName: '',
      namespace: '',
      namespaces: [],
      rules:[
        { groupversion:"",verbs:[],verbscopy:[] }
      ],
      resources: [],
    };
  },
  async created() {
    try {
      const nsRsp = await getNsList();
      this.namespaces = nsRsp.data;
      const resRsp = await getResources();
      this.resources = resRsp.data;
    } catch (error) {
      console.error(error);
    }
  },
  methods: {
    loadNamespaces() {
      getNsList().then(rsp => {
        this.namespaces = rsp.data;
      });
    },
    addRule() {
      this.rules.push({ apiGroup: '', resource: '', permission: [] });
    },
    removeRule(ruleindex) {
      this.rules.splice(ruleindex, 1);
    },
    updateVerbs(v, index) {
      var gv = v.split(":");
      var verbs = [];
      this.resources.forEach((item) => {
        if (item.Group === gv[0]) {
          item.Resources.forEach((res) => {
            if (res.Name === gv[1]) {
              verbs = res.Verbs;
            }
          });
        }
      });
      this.rules[index].verbs = [];
      this.rules[index].verbscopy = verbs;
    },
    save() {

    }
  },
};
</script>

