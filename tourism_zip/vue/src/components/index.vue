<template>
  <div>
    <myHeader @searchData="searchData" />

    <div style="width: 60%; margin: 0 auto">
      <div class="body">
        <div style="margin-top: 20px">
          <div style="display: flex; flex-wrap: wrap">
            <!-- <span style="margin-right: 20px; font-weight: bold">标签</span> -->
            <div
              v-for="(i, index) in allTags.obj"
              :key="index"
              style="
                margin-right: 20px;
                width: fit-content;
                margin-bottom: 20px;
                color: #849aae;
              "
            >
              <span
                class="search-item"
                @click="selectFilter(0, i, $event, i.name)"
                style="font-size: 13px; width: fit-content"
              >
                {{ i.name }}</span
              >
            </div>
          </div>
        </div>

        <div>
          <el-tabs
            v-model="activeName"
            class="demo-tabs"
            @tab-click="changeTab"
          >
            <el-tab-pane label="热门" name="热门"></el-tab-pane>
            <el-tab-pane label="最新" name="最新"></el-tab-pane>
          </el-tabs>
          <div
            v-if="houseList.obj && houseList.obj.length > 0"
            v-loading="loadingData"
          >
            <div
              v-for="(i, index) in houseList.obj"
              :key="index"
              style="
                margin-bottom: 20px;
                cursor: pointer;
                padding: 10px;
                border-bottom: 1px solid #f5f5f6;
              "
            >
              <div style="display: flex">
                <div style="width: 10%; text-align: center">
                  <img
                    @click="gotoPerson"
                    style="
                      width: 70px;
                      height: 70px;
                      margin-bottom: 5px;
                      border-radius: 50%;
                    "
                    :src="i.userInfo.user_img"
                  />

                  <div style="margin-bottom: 20px">
                    <span style="color: green">
                      {{ i.userInfo.user_name }}</span
                    >
                  </div>
                  <div>
                    <span style="font-size: 13px; color: #849aae">
                      {{ showSimpleDate(i.create_dtme) }}</span
                    >
                  </div>
                </div>

                <div style="width: 90%">
                  <div
                    style="
                      margin-bottom: 20px;
                      display: flex;
                      align-items: center;
                    "
                  >
                    <span
                      style="
                        font-weight: bold;
                        font-size: 20px;
                        margin-right: 10px;
                      "
                    >
                      {{ i.title }}</span
                    >
                  </div>

                  <div
                    style="font-size: 14px; margin-bottom: 20px"
                    v-if="i.tags"
                  >
                    <span
                      v-for="(j, index) in i.tags"
                      :key="index"
                      class="tags"
                      >{{ j }}</span
                    >
                  </div>
                  <div
                    style="
                      font-size: 14px;

                      white-space: break-spaces;
                      margin-bottom: 20px;
                    "
                    v-html="i.share_content"
                  ></div>
                  <div
                    v-if="i.share_imgs && i.share_imgs.length > 0"
                    style="margin-bottom: 20px; display: flex"
                  >
                    <el-card
                      :key="index"
                      v-for="(k, index) in i.share_imgs"
                      style="width: 140px; margin-right: 10px; padding: 0"
                    >
                      <el-image
                        style="width: 100px; height: 100px; margin-right: 20px"
                        :src="k"
                        :zoom-rate="1.2"
                        :max-scale="7"
                        :min-scale="0.2"
                        :preview-src-list="i.share_imgs"
                        :initial-index="4"
                        fit="contain"
                    /></el-card>
                  </div>
                  <div
                    style="
                      display: flex;
                      align-items: center;
                      margin-bottom: 20px;
                    "
                  >
                    <div
                      style="
                        width: 15px;
                        margin-right: 30px;
                        display: flex;
                        align-items: center;
                        color: #849aae;
                      "
                      @click="collectDiary(i)"
                    >
                      <span
                        style="
                          margin-right: 4px;
                          font-size: 14px;
                          color: #9399a5;
                        "
                        >{{ i.collect_count }}</span
                      >
                      <img
                        :src="i.selfCollect && i.selfCollect > 0 ? lImg : l1Img"
                        style="width: 100%"
                      />
                    </div>
                    <div
                      style="
                        width: 15px;
                        margin-right: 30px;
                        display: flex;
                        align-items: center;
                        color: #849aae;
                      "
                    >
                      <span
                        style="
                          margin-right: 4px;
                          font-size: 14px;
                          color: #9399a5;
                        "
                        >{{ i.comment_count }}</span
                      >
                      <img
                        :src="c1Img"
                        style="width: 100%"
                        @click="showComment(i)"
                      />
                    </div>

                    <div
                      style="
                        width: 15px;
                        margin-right: 30px;
                        display: flex;
                        align-items: center;
                        color: #849aae;
                      "
                      @click="zanDiary(i)"
                    >
                      <span
                        style="
                          margin-right: 4px;
                          font-size: 14px;
                          color: #9399a5;
                        "
                        >{{ i.zan_count }}</span
                      >
                      <img
                        :src="i.selfZan && i.selfZan > 0 ? z1Img : zImg"
                        style="width: 100%"
                      />
                    </div>
                  </div>

                  <div v-if="i.isShowComment">
                    <quillEditor
                      @update="updateContent($event, i)"
                      style="margin-bottom: 20px"
                    ></quillEditor>
                    <el-button type="primary" @click="commentDiary(i)"
                      >发表</el-button
                    >
                    <el-button type="plain" @click="i.isShowComment = false"
                      >取消</el-button
                    >
                    <div style="margin-top: 20px">
                      <div
                        v-for="(k, index) in i.commentList"
                        :key="index"
                        style="
                          margin-bottom: 20px;
                          border-bottom: 1px solid #f5f5f6;
                        "
                      >
                        <div style="display: flex; margin-bottom: 10px">
                          <div
                            style="
                              width: 10%;
                              margin-right: 20px;
                              display: flex;
                              flex-direction: column;
                              align-items: center;
                            "
                          >
                            <img
                              @click="gotoPerson"
                              style="
                                width: 30px;
                                height: 30px;
                                margin-bottom: 5px;
                                border-radius: 50%;
                              "
                              :src="k.userInfo.user_img"
                            />
                            <span style="color: green; margin-bottom: 10px">
                              {{ k.userInfo.user_name }}</span
                            >
                            <span
                              style="font-size: 13px; color: rgb(147, 153, 165)"
                              >{{ showSimpleDate(k.create_dtme) }}</span
                            >
                          </div>
                          <div>
                            <div v-html="k.comment"></div>

                            <img
                              :src="reportImg"
                              style="width: 15px"
                              @click="isShowReport = !isShowReport"
                            />
                          </div>
                        </div>
                        <div v-if="isShowReport">
                          <quillEditor
                            placeholder="输入举报内容"
                            @update="updateContent1($event, k)"
                            style="margin-bottom: 20px"
                          ></quillEditor
                          ><el-button
                            type="primary"
                            @click="addCommentReport(k)"
                            >提交</el-button
                          >
                          <el-button
                            type="plain"
                            @click="i.isShowComment = false"
                            >取消</el-button
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <el-empty
            v-else
            descripiton="没有搜索到内容哦，尝试其他关键词搜索"
          ></el-empty>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted, nextTick } from "vue";
import { useRouter, useRoute, onBeforeRouteUpdate } from "vue-router";
import { myMixin } from "../mixin.js";
import quillEditor from "./quillEditor";
const {
  allTags,
  errorMsgBox,
  successMsgBox,
  apiAll,
  withLoading,
  showSimpleDate,
} = myMixin();

let router = useRouter();
let route = useRoute();
let activeName = ref("热门");
let lImg = require("../assets/l.png");
let l1Img = require("../assets/l1.png");

let c1Img = require("../assets/c.png");
let cImg = require("../assets/c1.png");

let zImg = require("../assets/z.png");
let z1Img = require("../assets/z1.png");
let reportImg = require("../assets/report.png");

let loadingData = ref(false);
let isShowReport = ref(false);

let houseList = reactive({
  obj: [],
});
let project_user = reactive({ obj: {} });

let currentRow = reactive({ obj: {} });
let selectedTags = reactive({ obj: [] });

onMounted(() => {
  getHouse();
  if (window.sessionStorage.getItem("tourism_user")) {
    project_user.obj = JSON.parse(
      window.sessionStorage.getItem("tourism_user")
    );
  }
});
function showComment(row) {
  currentRow.obj = row;
  row.isShowComment = !row.isShowComment;
  getComment(row);
}

function updateContent(content, row) {
  row.comment = content;
}
function updateContent1(content, row) {
  row.report = content;
}
async function addCommentReport(row) {
  if (!project_user || !project_user.obj) {
    errorMsgBox("请先登录！");
    return false;
  }
  if (!row.report) {
    errorMsgBox("您还没有输入内容哦！");
    return false;
  }
  loadingData.value = true;
  const res = await withLoading(
    apiAll(
      { comment_id: row._id, report_content: row.report },
      "/tourism/addCommentReport"
    )
  );
  loadingData.value = false;
  if (res.code && res.code < 0) {
    errorMsgBox(res.msg);
  } else {
    successMsgBox("举报成功！");
    getHouse();
  }
}
/**
 * 发布游记
 * 必须登录
 * @param row
 */
async function commentDiary(row) {
  if (!project_user || !project_user.obj) {
    errorMsgBox("请先登录！");
    return false;
  }
  if (!row.comment) {
    errorMsgBox("您还没有输入内容哦！");
    return false;
  }
  loadingData.value = true;
  const res = await withLoading(
    apiAll(
      { dirary_id: row._id, comment: row.comment },
      "/tourism/commentDiary"
    )
  );
  loadingData.value = false;
  if (res.code && res.code < 0) {
    errorMsgBox(res.msg);
  } else {
    successMsgBox("评论成功！");
    row.commentList.push({
      dirary_id: row._id,
      comment: row.comment,
      userInfo: project_user.obj,
    });
    getHouse();
  }
}
/**
 * 收藏游记
 * @param row
 */
async function collectDiary(row) {
  if (!project_user || !project_user.obj) {
    errorMsgBox("请先登录！");
    return false;
  }
  loadingData.value = true;
  const res = await withLoading(
    apiAll({ dirary_id: row._id }, "/tourism/collectDiary")
  );
  loadingData.value = false;
  if (res.code && res.code < 0) {
    errorMsgBox(res.msg);
  } else {
    successMsgBox("收藏成功！");
    getHouse();
  }
}
function changeTab(tab) {
  activeName.value = tab.props.name;
  getHouse();
}
/**
 * 点赞游记
 */
async function zanDiary(row) {
  if (!project_user || !project_user.obj) {
    errorMsgBox("请先登录！");
    return false;
  }
  loadingData.value = true;
  const res = await withLoading(
    apiAll(
      { zan_type: row.selfZan && row.selfZan > 0 ? 1 : "", dirary_id: row._id },
      "/tourism/zanDiary"
    )
  );
  loadingData.value = false;
  if (res.code && res.code < 0) {
    errorMsgBox(res.msg);
  } else {
    successMsgBox(row.selfZan && row.selfZan > 0 ? "点赞成功！" : "取消点赞");
    getHouse();
  }
}
/**
 * 获取游记评论
 */
async function getComment(row) {
  loadingData.value = true;
  const res = await withLoading(
    apiAll({ dirary_id: row._id }, "/tourism/getComment")
  );
  loadingData.value = false;
  if (res.code && res.code < 0) {
    errorMsgBox(res.msg);
  } else {
    row.commentList = res;
  }
}

async function getHouse(val) {
  loadingData.value = true;
  const res = await withLoading(
    apiAll(
      { name: val, hot: activeName.value, tags: selectedTags.obj },
      "/tourism/getDiary"
    )
  );
  loadingData.value = false;
  if (res.code && res.code < 0) {
    errorMsgBox(res.msg);
  } else {
    houseList.obj = res.items;
  }
}
function searchData(val) {
  getHouse(val);
}

function selectFilter(index, d1, dom, val) {
  if (dom.target.classList.contains("checked")) {
    dom.target.classList.remove("checked");
    let cindex;
    selectedTags.obj.some((e, index) => {
      cindex = index;
      return e == val;
    });

    if (cindex || cindex == 0) {
      selectedTags.obj.splice(cindex, 1);
    }
  } else {
    dom.target.classList.add("checked");
    selectedTags.obj.push(val);
  }
  getHouse();
}
</script>
<style scoped lang="less">
// /deep/.el-tabs__nav-wrap {
//   z-index: -1;
// }
</style>
