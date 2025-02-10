<template>
  <div>
    <myHeader />

    <div style="width: 60%; margin: 0 auto">
      <div class="body">
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="changeTab">
          <el-tab-pane label="我的游记" name="我的游记"></el-tab-pane>
          <el-tab-pane label="我收藏的游记" name="我收藏的游记"></el-tab-pane>
          <el-tab-pane label="发布游记" name="发布游记"></el-tab-pane>
        </el-tabs>

        <div>
          <div v-if="activeName == '发布游记'">
            <el-form label-width="100px" v-loading="loadingSaveData">
              <el-form-item label="分享图片">
                <div style="margin: 0 20px">
                  <el-upload
                    style="display: inline-block"
                    action="#"
                    :auto-upload="false"
                    :multiple="true"
                    drag
                    list-type="picture-card"
                    accept=".jpg, .jpeg, .png, .webp"
                    :on-change="handleChange"
                    v-model:file-list="imgList.obj"
                  >
                    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                    <div class="el-upload__text">
                      拖拽文件
                      <em>点击上传</em>
                    </div>
                  </el-upload>
                </div>
              </el-form-item>
              <el-form-item label="标题">
                <el-input
                  placeholder="输入此次游记的标题"
                  v-model="houseModel.obj.title"
                ></el-input>
              </el-form-item>

              <el-form-item label="游记标签">
                <div style="font-size: 14px">
                  <div>
                    <span
                      @click="selectTags(i, j)"
                      v-for="(j, index) in allTags.obj"
                      :key="index"
                      class="tags"
                      >{{ j.name }}</span
                    >
                  </div>
                  <div style="margin-bottom: 20px">
                    <span
                      @click="removeTags(index, j)"
                      v-for="(j, index) in selectedTags.obj"
                      :key="index"
                      class="tags green"
                      >{{ j.name }}</span
                    >
                  </div>
                </div>
              </el-form-item>

              <el-form-item label="旅游心得">
                <!-- <el-input
                  placeholder="输入此次游记的旅游心得，分享给更多人"
                  type="textarea"
                  rows="5"
                  v-model="houseModel.obj.share_content"
                ></el-input> -->
                <quillEditor
                  @update="updateContent"
                  style="margin-bottom: 20px"
                ></quillEditor>
              </el-form-item>
            </el-form>
            <el-form-item label-width="100px"
              ><el-button type="primary" @click="saveDiary" icon="select"
                >保存</el-button
              >
            </el-form-item>
          </div>

          <div v-else v-loading="loadingData">
            <div v-if="houseList.obj && houseList.obj.length > 0">
              <div
                v-for="(i, index) in houseList.obj"
                :key="index"
                style="margin-bottom: 20px; cursor: pointer; padding: 10px"
                @click="gotoHouseDetails"
                class="house-details"
              >
                <div style="display: flex; justify-content: space-between">
                  <div style="display: flex; width: 70%">
                    <div
                      style="
                        border-radius: 3px;
                        width: 150px;
                        margin-right: 20px;
                      "
                    >
                      <!-- <img
                        v-if="i.share_imgs && i.share_imgs.length > 0"
                        :src="i.share_imgs[0]"
                        style="width: 150px; height: 150px"
                      /> -->

                      <el-image
                        :preview-src-list="i.share_imgs"
                        :src="i.share_imgs[0]"
                        :zoom-rate="1.2"
                        :max-scale="7"
                        :min-scale="0.2"
                        :initial-index="0"
                        fit="contain"
                      />
                    </div>
                    <div>
                      <div
                        style="
                          margin-bottom: 20px;
                          display: flex;
                          align-items: center;
                        "
                      >
                        <span>
                          <span
                            style="
                              font-weight: bold;
                              font-size: 20px;
                              margin-right: 10px;
                            "
                          >
                            {{ i.title }}
                          </span>
                        </span>
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
                        >
                          <span
                            style="
                              margin-right: 4px;
                              font-size: 12px;
                              color: #9399a5;
                            "
                            >{{ i.collect_count }}</span
                          >
                          <img :src="l1Img" style="width: 100%" />
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
                              font-size: 12px;
                              color: #9399a5;
                            "
                            >{{ i.comment_count }}</span
                          >
                          <img :src="c1Img" style="width: 100%" />
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
                              font-size: 12px;
                              color: #9399a5;
                            "
                            >{{ i.zan_count }}</span
                          >
                          <img :src="zImg" style="width: 100%" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style="text-align: right">
                    <div style="height: 80%">
                      <div
                        v-if="i.userInfo"
                        style="
                          margin-right: 20px;
                          display: flex;
                          flex-direction: column;
                          align-items: center;
                        "
                      >
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

                        <span style="color: green">
                          {{ i.userInfo.user_name }}</span
                        >
                        <div style="font-size: 13px; color: #849aae">
                          <span> {{ showSimpleDate(i.create_dtme) }}</span>
                        </div>
                      </div>
                      <span
                        v-else
                        style="
                          color: #fa5741;
                          font-size: 22px;
                          line-height: 22px;
                          font-weight: 700;
                        "
                      >
                        <el-tag
                          style="margin-right: 10px"
                          :type="i.examine_status == 1 ? 'primary' : 'danger'"
                          >{{
                            i.examine_status == 1 ? "已审核" : "未审核"
                          }}</el-tag
                        >

                        <el-tag
                          :type="i.publish_status == 1 ? 'primary' : 'danger'"
                          >{{
                            i.publish_status == 1 ? "已发布" : "未发布"
                          }}</el-tag
                        >
                      </span>
                    </div>
                    <div class="house-hanlde" v-if="activeName == '我的游记'">
                      <el-button
                        type="primary"
                        size="small"
                        icon="edit"
                        @click="publishHouse(i)"
                        v-if="!i.publish_status || i.publish_status == 0"
                        >发布</el-button
                      >
                      <el-button
                        type="danger"
                        size="small"
                        icon="edit"
                        @click="closeDiary(i)"
                        v-else
                        >取消发布</el-button
                      >

                      <el-button
                        type="primary"
                        size="small"
                        icon="edit"
                        @click="gotoEdit(i)"
                        >编辑</el-button
                      >
                      <el-button
                        type="danger"
                        icon="delete"
                        size="small"
                        @click="deleteHouse(i)"
                        >删除</el-button
                      >
                    </div>

                    <div v-else-if="activeName == '我收藏的游记'">
                      <el-button
                        type="danger"
                        size="small"
                        icon="delete"
                        @click="removeCollect(i)"
                        >删除收藏</el-button
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <el-empty
              v-else
              description="暂无游记，赶紧前往发布属于您的旅行游记吧"
            ></el-empty>
          </div>
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
  showSimpleDate,
  errorMsgBox,
  successMsgBox,
  apiAll,
  withLoading,
  formDataApi,
  confirm,
  uploadImgs,
} = myMixin();

let router = useRouter();
let route = useRoute();
let activeName = ref("我的游记");
let rent_user = reactive({ obj: {} });
let imgList = reactive({ obj: [] });
let loadingData = ref(false);
let loadingSaveData = ref(false);

let houseModel = reactive({
  obj: {
    title: "",
    share_content: "",
    tags: "",
  },
});
let deleteHouseModel = reactive({
  obj: {},
});
let selectedTags = reactive({
  obj: [],
});
let tags = reactive({
  obj: [],
});

let lImg = require("../assets/l.png");
let l1Img = require("../assets/l1.png");

let c1Img = require("../assets/c.png");
let cImg = require("../assets/c1.png");

let zImg = require("../assets/z.png");
let z1Img = require("../assets/z1.png");
let houseList = reactive({
  obj: [],
});
onMounted(() => {
  rent_user.obj = { user_name: "小白", user_auth: "landload" };
  getMyDiary();
});
//选中标签
function selectFilter(index, d1, dom) {
  let isAdd = true;
  if (dom.target.classList.contains("checked")) {
    dom.target.classList.remove("checked");
    isAdd = false;
  } else {
    dom.target.classList.add("checked");
  }

  if (index == 0) {
    if (!isAdd) {
      let removeIndex = houseModel.obj.rentPriceZone.findIndex(
        (element) => element == d1
      );
      houseModel.obj.rentPriceZone.splice(removeIndex, 1);
    } else {
      houseModel.obj.rentPriceZone.push(d1);
    }
  } else if (index == 1) {
    if (!isAdd) {
      let removeIndex = houseModel.obj.rentWay.findIndex(
        (element) => element == d1
      );
      houseModel.obj.rentWay.splice(removeIndex, 1);
    } else {
      houseModel.obj.rentWay.push(d1);
    }
  } else if (index == 2) {
    if (!isAdd) {
      let removeIndex = houseModel.obj.houseType.findIndex(
        (element) => element == d1
      );
      houseModel.obj.houseType.splice(removeIndex, 1);
    } else {
      houseModel.obj.houseType.push(d1);
    }
  } else if (index == 3) {
    if (!isAdd) {
      let removeIndex = houseModel.obj.houseDirection.findIndex(
        (element) => element == d1
      );
      houseModel.obj.houseDirection.splice(removeIndex, 1);
    } else {
      houseModel.obj.houseDirection.push(d1);
    }
  }
}
function updateContent(content) {
  houseModel.obj.share_content = content;
}
function selectTags(i, tag) {
  selectedTags.obj.push(tag);
  // allTags.obj.forEach((element, index) => {
  //   if (element.id == tag.id) {
  //     allTags.obj.splice(index, 1);
  //   }
  // });
  let currentIndex;
  allTags.obj.some((element, index) => {
    if (element.id == tag.id) {
      currentIndex = index;
      return true;
    }
  });
  allTags.obj.splice(currentIndex, 1);
}
function removeTags(index, tag) {
  selectedTags.obj.splice(index, 1);
  allTags.obj.push(tag);
}
function changeTab(val) {
  activeName.value = val.props.name;
  if (activeName.value == "发布游记") {
    houseModel.obj = {};
  } else {
    getMyDiary();
  }
}

async function removeCollect(i) {
  const res = await withLoading(
    apiAll({ _id: i._id }, "/tourism/removeCollect")
  );
  if (res.code && res.code < 0) {
    errorMsgBox(res.message);
  } else {
    successMsgBox("移除成功！");
    getMyDiary();
  }
}
async function publishHouse(i) {
  const res = await withLoading(
    apiAll({ _id: i._id }, "/tourism/publishDiary")
  );
  if (res.code && res.code < 0) {
    errorMsgBox(res.message);
  } else {
    successMsgBox("发布成功！");
    getMyDiary();
  }
}
async function closeDiary(i) {
  const res = await withLoading(apiAll({ _id: i._id }, "/tourism/closeDiary"));
  if (res.code && res.code < 0) {
    errorMsgBox(res.message);
  } else {
    successMsgBox("取消成功！");
    getMyDiary();
  }
}

function gotoEdit(i) {
  houseModel.obj = i;
  activeName.value = "发布游记";
}
function deleteHouse(i) {
  deleteHouseModel.obj = i;
  confirm("确定删除该游记吗？", doDeleteHouse);
}
async function doDeleteHouse() {
  const res = await withLoading(
    apiAll({ _id: deleteHouseModel.obj._id }, "/tourism/deleteDiary")
  );
  if (res.code && res.code < 0) {
    errorMsgBox(res.message);
  } else {
    successMsgBox("删除成功！");
    getMyDiary();
  }
}
async function saveDiary() {
  let resf = await uploadImgs(imgList.obj);
  houseModel.obj.share_imgs = resf;
  houseModel.obj.tags = [];
  for (const element of selectedTags.obj) {
    houseModel.obj.tags.push(element.name);
  }
  loadingSaveData.value = true;
  const res = await withLoading(apiAll(houseModel.obj, "/tourism/saveDiary"));
  loadingSaveData.value = false;
  if (res.code && res.code < 0) {
    errorMsgBox(res.message);
  } else {
    successMsgBox(res.message);
    getMyDiary();
    activeName.value = "我的游记";
  }
}

async function getMyDiary() {
  let method = "/tourism/getMyDiary";
  if (activeName.value == "我收藏的游记") {
    method = "/tourism/getMyCollectDiary";
  }
  loadingData.value = true;
  const res = await withLoading(apiAll(houseModel.obj, method));
  loadingData.value = false;
  if (res.code && res.code < 0) {
    errorMsgBox(res.message);
  } else {
    houseList.obj = res.items;
  }
}
</script>
<style scoped lang="less">
.house-details {
  border-bottom: 1px solid #f5f5f6;
}
.house-details:hover {
  .house-hanlde {
    visibility: visible;
  }
}
.house-hanlde {
  visibility: hidden;
}
</style>
