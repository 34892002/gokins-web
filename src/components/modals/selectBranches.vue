<template>
  <CModal title="拉取选项" :show="shown" @update:show="(val) => $emit('update:shown', val)" :centered="true">
    <template #footer>
      <CButton color="warning" variant="outline" @click="$emit('update:shown', false)">取消</CButton>
      <CButton color="info" @click="run" :disabled="loading">确定</CButton>
    </template>
    <div>
      <CRow>
        <CCol>
          <CInput label="仓库引用: " placeholder="不填则使用默认分支" v-model="curSha" />
          <label>历史纪录: </label>
          <Multiselect v-model="value" :options="options" placeholder="使用上次的分支或者commitSha" 
            label="name" track-by="name" @select="change">
          </Multiselect>
        </CCol>
      </CRow>
    </div>
  </CModal>
</template>
<script>
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css';
import { RunPipeline, SearchSha, UtilCatch, } from "@/assets/js/apis";

export default {
  components: { Multiselect },
  props: {
    id: String,
    shown: Boolean,
    orgId: String,
  },
  watch: {
    id(nv) {
      if (nv != "") {
        this.searchSha()
      }
    },
    shown(nv) {
      this.value = {};
      /* this.value = {}
      if (this.options.length > 0)
        this.value = this.options[0]; */
    }
  },
  mounted() {
    this.searchSha();
  },
  data() {
    return {
      value: {},
      options: [],
      loading: false,
      curSha: '',
    }
  },
  methods: {
    searchSha(q) {
      if (this.id === "") {
        return
      }
      SearchSha({
        q: q,
        id: this.id,
      }).then((res) => {
        this.options = res.data || [];
        if (this.options.length > 0)
          this.value = this.options[0];
        else
          this.value = {}
      }).catch((err) => UtilCatch(this, err));
    },
    change(value, id) {
      this.curSha = value.name
    },
    run() {
      if (this.loading) return;
      this.loading = true;
      const par = { pipelineId: this.id, }
      par.sha = this.curSha || ''
      RunPipeline(par)
        .then((res) => {
          this.value = {}
          if (this.orgId && this.orgId != '')
            this.$router.push(`/pipeline/build/${res.data.id}?org=${this.orgId}`);
          else
            this.$router.push(`/pipeline/build/${res.data.id}`);
        })
        .catch((err) => UtilCatch(this, err, () => {
          this.loading = false;
        }));
    }
  },
};
</script>
<style lang="sass">
</style>