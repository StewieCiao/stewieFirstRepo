<template>
  <div
    style="
       {
        overflow: hidden;
        background-color: #f4f4f4;
        width: 100%;
        height: 100%;
      }
    "
  >
    <div style="padding: 10px">
      <el-table
        :data="dataList.obj"
        :class="tableClassNames"
        ref="table"
        :size="tableSize"
        min-height="100"
        :border="false"
        :highlight-current-row="true"
        :max-height="tableMaxHeight"
        style="width: 100%"
        :showHeader="true"
        @selection-change="handleSelectionChange"
        :header-cell-style="{
          background: '#eef1f6',
          color: '#606266',
        }"
      >
        <el-table-column
          v-for="(i, index) in columns"
          :key="index"
          :show-overflow-tooltip="true"
          align="center"
          :look="index"
          min-width="180px"
          :column-key="index"
          width="auto"
          class="itemTrue"
          :label="i.title"
        >
          <template v-slot="scope">
            <span v-if="i.name == 'user'">
              {{ scope.row[i.name].user_name }}
            </span>
            <span v-else-if="i.name == 'diary'">
              {{ scope.row[i.name].title }}
            </span>
            <span v-else>
              {{ scope.row[i.name] }}
            </span></template
          >
        </el-table-column>

        <el-table-column width="230" align="center" label="操作" fixed="right">
          <template v-slot="scope">
            <el-button
              size="small"
              type="danger"
              text
              link
              icon="delete"
              @click="deleteById(scope.row._id)"
            >
              删除评论
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="height: 30px; line-height: 30px">
      <el-pagination
        :total="page.obj.totalResult"
        :page-size="page.obj.pageSize"
        :current-page="page.obj.startPage"
        background
        small
        :page-sizes="[3, 6, 9, 12, 15, 20, 30]"
        layout="sizes,prev, pager, next"
        @size-change="sizeChange($event, doGetData, reqData.obj)"
        @current-change="currentChange($event, doGetData, reqData.obj)"
      />
    </div>
    <div></div>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from "vue";
import { myMixin } from "../mixin.js";
const {
  errorMsgBox,
  successMsgBox,
  apiAll,
  withLoading,
  page,
  currentChange,
  sizeChange,
  getData,
} = myMixin();
let reqData = reactive({
  obj: {
    url: "/tourism/getAdminComment",
    data: {
      name: "",
    },
  },
});

/**
   *   user_id: String, //用户名
      comment_id: String, //密码
      report_content: String,
      create_dtme: String, //注册时间
   */
let columns = reactive([
  {
    name: "user",
    title: "用户",
  },
  {
    name: "diary",
    title: "评论游记",
  },
  {
    name: "comment",
    title: "评论内容",
  },
  {
    name: "create_dtme",
    title: "举报时间",
  },
]);

let dataList = reactive({
  obj: [],
});

onMounted(() => {
  doGetData();
});
async function doGetData() {
  const res = await getData(reqData.obj);
  dataList.obj = res.items;
  page.obj = res.page;
}
async function deleteById(id) {
  let data = { _id: id };
  const res = await withLoading(apiAll(data, "/tourism/removeComment/"));
  doGetData();
}
</script>

<style lang="less" scoped></style>
