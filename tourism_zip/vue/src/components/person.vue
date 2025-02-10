<template>
  <div>
    <myHeader />

    <div style="width: 60%; margin: 0 auto; padding: 20px">
      <el-form label-width="100px" v-loading="loadingSaveData">
        <el-form-item label="头像" style="margin-bottom: 50px">
          <div>
            <img
              style="
                width: 120px;
                height: 120px;
                margin-right: 20px;
                margin-right: 10px;
              "
              :src="
                userModel.obj && userModel.obj.user_img
                  ? userModel.obj.user_img
                  : defaultImg
              "
            />
          </div>
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
              <em>点击上传</em>
            </div>
          </el-upload>
        </el-form-item>

        <el-form-item label="用户名">
          <el-input
            placeholder="输入用户名"
            v-model="userModel.obj.user_name"
          ></el-input>
        </el-form-item>

        <el-form-item label="个性标签">
          <div style="font-size: 14px">
            <div style="margin-bottom: 20px">
              <div><el-tag>个人标签</el-tag></div>
              <div v-if="userTags.obj">
                <el-tag
                  @click="selectTags(i, j)"
                  v-for="(j, index) in userTags.obj"
                  :key="index"
                  class="tags"
                  closable
                  @close="removeUserTags(j)"
                  >{{ j.name }}</el-tag
                >
              </div>
              <el-button
                type="plain"
                @click="showUserTags = true"
                icon="plus"
                style="margin-bottom: 10px"
                >添加自定义标签</el-button
              >
              <div
                style="font-size: 14px; display: flex; width: 100%"
                v-if="showUserTags"
              >
                <el-input
                  v-model="tagModel.obj.name"
                  maxlength="15"
                  show-word-limit
                  style="margin-right: 10px; width: 60%"
                  placeholder="输入自定义标签,15个字以内"
                ></el-input>

                <el-button type="primary" @click="addUserTags" icon="select"
                  >保存</el-button
                ><el-button type="plain" @click="showUserTags = false"
                  >取消</el-button
                >
              </div>
            </div>
            <div><el-tag>系统标签</el-tag></div>
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
                v-for="(j, index) in userModel.obj.tags"
                :key="index"
                class="tags green"
                >{{ j.name }}</span
              >
            </div>
          </div>
        </el-form-item>
      </el-form>
      <el-form-item label-width="100px"
        ><el-button type="primary" @click="saveUser" icon="select"
          >保存</el-button
        ><el-button type="plain" @click="goBack">返回</el-button>
      </el-form-item>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter, useRoute, onBeforeRouteUpdate } from "vue-router";
import { myMixin } from "../mixin.js";
import router from "../router/index.js";
const route = useRoute();
const {
  allTags,
  errorMsgBox,
  successMsgBox,
  apiAll,
  withLoading,
  formDataApi,
  confirm,
  uploadImgs,
} = myMixin();
let loadingSaveData = ref(false);
let showUserTags = ref(false);
let selectedTags = reactive({
  obj: [],
});
let imgList = reactive({
  obj: [],
});
let userTags = reactive({
  obj: [],
});
let tagModel = reactive({ obj: {} });
let defaultImg = require("../assets/user.png");
onMounted(() => {
  if (window.sessionStorage.getItem("tourism_user")) {
    userModel.obj = JSON.parse(window.sessionStorage.getItem("tourism_user"));
  }
  getUserTags();
});
let userModel = reactive({ obj: {} });
async function saveUser() {
  if (imgList.obj && imgList.obj.length > 0) {
    let resf = await uploadImgs(imgList.obj);
    userModel.obj.user_img = resf[0];
  }
  let tags = [];
  loadingSaveData.value = true;
  const res = await withLoading(apiAll(userModel.obj, "/tourism/saveUser"));
  loadingSaveData.value = false;
  if (res.code && res.code < 0) {
    errorMsgBox(res.message);
  } else {
    successMsgBox("保存成功！");
    window.sessionStorage.setItem(
      "tourism_user",
      JSON.stringify(userModel.obj)
    );
    router.push("/personCenter");
  }
}

async function addUserTags() {
  loadingSaveData.value = true;
  const res = await withLoading(apiAll(tagModel.obj, "/tourism/addUserTags"));
  loadingSaveData.value = false;
  if (res.code && res.code < 0) {
    errorMsgBox(res.message);
  } else {
    successMsgBox("保存成功！");
    getUserTags();
  }
}
async function getUserTags() {
  loadingSaveData.value = true;
  const res = await withLoading(apiAll({}, "/tourism/getUserTags"));
  loadingSaveData.value = false;
  if (res.code && res.code < 0) {
    errorMsgBox(res.message);
  } else {
    userTags.obj = res;
  }
}
async function removeUserTags(row) {
  loadingSaveData.value = true;
  const res = await withLoading(
    apiAll({ _id: row._id }, "/tourism/removeUserTags")
  );
  loadingSaveData.value = false;
  if (res.code && res.code < 0) {
    errorMsgBox(res.message);
  } else {
    successMsgBox("删除成功！");
    getUserTags();
  }
}

function goBack() {
  router.push("/personCenter");
}

function selectTags(i, tag) {
  userModel.obj.tags.push(tag);
  let currentIndex;
  if (tag._id) {
    userTags.obj.some((element, index) => {
      if (element._id == tag._id) {
        currentIndex = index;
        return true;
      }
    });
    userTags.obj.splice(currentIndex, 1);
  } else {
    allTags.obj.some((element, index) => {
      if (element.name == tag.name) {
        currentIndex = index;
        return true;
      }
    });
    allTags.obj.splice(currentIndex, 1);
  }
}
function removeTags(index, tag) {
  if (tag) {
    if (tag._id) {
      userTags.obj.push(tag);
    } else {
      allTags.obj.push(tag);
    }
    userModel.obj.tags.splice(index, 1);
  }
}
</script>
<style scoped lang="less">
/deep/ .el-form-item__content {
  width: 100%;
}
</style>
