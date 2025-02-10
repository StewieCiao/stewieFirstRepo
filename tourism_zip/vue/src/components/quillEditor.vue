<template>
  <quill-editor
    style="width: 100%; height: 150px"
    :options="editorOptions"
    contentType="html"
    ref="qeditor"
    @textChange="textChange"
  ></quill-editor>
</template>

<script setup>
import { QuillEditor } from "@vueup/vue-quill";
import "quill/dist/quill.core.css";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import "quill/dist/quill.bubble.css";

import { ref, defineProps, defineEmits } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "输入内容",
  },
});

const emit = defineEmits(["update"]);
const qeditor = ref(null);
const content = ref(null);
const textChange = () => {
  const editHTML = qeditor.value?.getHTML(); // 获取 Quill 实例的 HTML 内容
  if (editHTML) {
    emit("update", editHTML); // 发出事件更新父组件
  }
};

const editorOptions = {
  theme: "bubble‌",
  placeholder: props.placeholder,
  modules: {
    toolbar: [
      // [{ header: [1, 2, 3, false] }],
      // ["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线 -----['bold', 'italic', 'underline', 'strike']
      // ["blockquote", "code-block"], // 引用  代码块-----['blockquote', 'code-block']
      // [{ script: "sub" }, { script: "super" }], // 上标/下标-----[{ script: 'sub' }, { script: 'super' }]
      // [{ list: "ordered" }, { list: "bullet" }],
      // ["link", "image"],
      // ["clean"],

      ["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线 -----['bold', 'italic', 'underline', 'strike']
      ["blockquote", "code-block"], // 引用  代码块-----['blockquote', 'code-block']
      [{ list: "ordered" }, { list: "bullet" }], // 有序、无序列表-----[{ list: 'ordered' }, { list: 'bullet' }]
      [{ header: 1 }, { header: 2 }],
      [{ script: "sub" }, { script: "super" }], // 上标/下标-----[{ script: 'sub' }, { script: 'super' }]
      [{ indent: "-1" }, { indent: "+1" }],
      [{ size: ["small", false, "large", "huge"] }], // 配置字号
      [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题-----[{ header: [1, 2, 3, 4, 5, 6, false] }]
      [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色-----[{ color: [] }, { background: [] }]
      [{ font: [] }], //显示字体选择
      [{ align: [] }], // 对齐方式-----
      ["clean"], // 清除文本格式-----
      // ["link", "image", "video"], // 链接、图片、视频-----
    ],
  },
};
</script>

<style lang="less">
.ql-toolbar {
  width: 100% !important;
}
</style>
