<template>
  <div
    class="my-template-623"
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
      <el-row :gutter="5" :style="{ margin: '15px 0 15px 0' }">
        <el-col :span="5" style="display: flex; margin-bottom: 10px">
          <div style="width: 60%; margin-right: 10px">
            <el-input
              placeholder="输入名称"
              :style="{ height: '33px' }"
              :size="'default'"
              v-model="reqData.obj.data.name"
              clearable
              @keyup.enter="doGetData()"
              @clear="clearSearch(reqData, doGetData)"
            />
          </div>
          <el-button
            icon="search"
            :size="'default'"
            type="primary"
            @click="doGetData()"
          >
            搜索
          </el-button>
        </el-col>
      </el-row>

      <el-table
        :data="dataList.obj"
        :class="tableClassNames"
        ref="table"
        :size="tableSize"
        min-height="100"
        :border="true"
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
            <span v-if="i.name == 'share_imgs'">
              <div
                v-for="(imgSrc, index) in scope.row[i.name]"
                :key="index"
                style="cursor: pointer; margin-right: 10px; margin-bottom: 20px"
              >
                <!-- <el-image
                  style="width: 100px; height: 100px"
                  :src="imgSrc"
                  :zoom-rate="1.2"
                  :max-scale="7"
                  :min-scale="0.2"
                  :preview-src-list="scope.row[i.name]"
                  :initial-index="index"
                  fit="cover"
                /> -->
              </div>
            </span>
            <span v-else-if="i.name == 'user'">
              {{ scope.row[i.name].user_name }}
            </span>
            <span v-else-if="i.name == 'tags'">
              <el-tag v-for="(i, index) in scope.row[i.name]" :key="index">{{
                i
              }}</el-tag>
            </span>
            <span v-else-if="i.name == 'examine_status'">
              <el-tag v-if="scope.row[i.name] == 1">已审核</el-tag>
              <el-tag v-else type="danger">未审核</el-tag>
            </span>

            <span v-else>
              {{ scope.row[i.name] }}
            </span>
          </template>
        </el-table-column>

        <el-table-column width="130" align="right" label="操作" fixed="right">
          <template v-slot="scope">
            <el-button
              size="small"
              type="primary"
              text
              link
              v-if="!scope.row.examine_status"
              icon="select"
              @click="examineDiary(scope.row)"
            >
              审核
            </el-button>
            <!-- <el-button
              size="small"
              type="primary"
              text
              link
              icon="edit"
              @click="examineDiary(scope.row)"
            >
              游记审核
            </el-button> -->
            <!-- <el-button
              size="small"
              type="danger"
              text
              link
              icon="delete"
              @click="deleteById(scope.row._id)"
            >
              删除
            </el-button> -->
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
  formDataApi,
  withLoading,
  currentChange,
  sizeChange,
  getData,
  page,
  clearSearch,
  tableMaxHeight,
  account,
  getDialogWdith,
  getDialogLabelPosition,
} = myMixin();

let currentRow = reactive({
  obj: {},
});

let reqData = reactive({
  obj: {
    url: "/tourism/getAdminDiary",
    data: {
      name: "",
    },
  },
});
/**
 *  title: String, //游记标题
    user_id: String, //发布者
    share_content: String, //发布内容
    tags: Array, //标签，用来做推送，各类标签
    share_imgs: {
      //分享的图片

      type: Array,
      default: [],
    },
    publish_status: { default: 1, type: Number },
    status: { default: 1, type: Number },
    examine_status: { default: 0, type: Number }, //审核标记
    zan_count: { default: 0, type: Number },
    comment_count: { default: 0, type: Number },
    collect_count: { default: 0, type: Number },
    create_dtme: String, //发布时间
 */

let columns = reactive([
  {
    name: "examine_status",
    title: "是否审核",
  },
  {
    name: "share_imgs",
    title: "分享图片",
  },
  {
    name: "title",
    title: "游记标题",
  },
  {
    name: "share_content",
    title: "游记内容",
  },
  {
    name: "tags",
    title: "游记标签",
  },

  {
    name: "user",
    title: "游记作者",
  },
  {
    name: "zan_count",
    title: "点赞数",
  },
  {
    name: "comment_count",
    title: "评论数",
  },
  {
    name: "collect_count",
    title: "收藏数",
  },

  {
    name: "create_dtme",
    title: "创建时间",
  },
]);
let fieldsShow = ref(false);
let selectedFields = reactive({ obj: [] });
let exportType = ref(1);

let imgList = reactive({
  obj: [],
});
let users = reactive({
  obj: [],
});

let dataList = reactive({
  obj: [],
});

let smsWayShow = ref(false);
onMounted(() => {
  doGetData();
});
function showEdit(row) {
  imgList.obj.push[{ url: row.access_path }];
  currentRow.obj = row;
  smsWayShow.value = true;
}

async function doGetData() {
  const res = await getData(reqData.obj);
  dataList.obj = res.items;
  page.obj = res.page;
}
async function deleteById(id) {
  let data = {};
  const res = await withLoading(apiAll(data, "/doc/deleteEmail/" + id));
  doGetData();
}
async function examineDiary(row) {
  let data = { _id: row._id };
  const res = await withLoading(apiAll(data, "/tourism/examineDiary/"));
  doGetData();
}
function copyThirdRegistUrl(content) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(content).then(() => {
      successMsgBox("复制成功");
    });
  } else {
    copyToClip(content);
  }
}
function copyToClip(content) {
  var aux = document.createElement("input");
  aux.setAttribute("value", content);
  document.body.appendChild(aux);
  aux.select();
  document.execCommand("copy");
  document.body.removeChild(aux);
  if (message == null) {
    successMsgBox("复制成功");
  } else {
    successMsgBox(message);
  }
}

async function addSmsWay() {
  // if (!currentRow.obj.name) {
  //   errorMsgBox("名称不能为空！");
  //   return false;
  // }
  // if (!currentRow.obj.content) {
  //   errorMsgBox("内容不能为空！");
  //   return false;
  // }
  // let formData = new FormData();
  // if (imgList.obj && imgList.obj.length > 0) {
  //   formData.append("img", imgList.obj[0].raw);
  // }
  // formData.append("params", JSON.stringify(currentRow.obj));
  const res = await withLoading(apiAll(currentRow.obj, "/doc/addEmail"));
  if (res.code && res.code < 0) {
    errorMsgBox(res.message);
  } else {
    smsWayShow.value = false;
    doGetData();
  }
}
async function exportUser() {
  let data = {};
  const res = await withLoading(apiAll(data, "/docExcel/addPostExcel/"));
  if (res.code && res.code < 0) {
    errorMsgBox(res.code);
  } else {
    successMsgBox("导出成功");
    // let access_path = res.access_path;
    window.open(res.access_path);
  }
}
// async function updateSmsWay() {
//   const res = await withLoading(
//     apiAll(currentRow.obj, "/smsWenan/updateSmsWay/" + id)
//   );
//   doGetData();
// }
</script>

<style lang="less" scoped>
.my-template-623 {
}
</style>
