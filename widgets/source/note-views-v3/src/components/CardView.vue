<template>
  <div class="card-list">
    <div
      v-for="note in notes"
      :key="note.id"
      @click="Utils.openNote(note.block_id)"
      class="card-item"
    >
      <!-- 封面：采用题头图或其他图片类型的属性值 -->
      <div
        v-if="widget.cardView.coverAttr == 'title_img'"
        class="cover"
        :style="note['title_img']"
      ></div>
      <!-- 其他图片类型作为封面 -->
      <div v-else class="cover">
        <img
          :title="note[widget.cardView.coverAttr]"
          :src="
            note[widget.cardView.coverAttr]
              ? note[widget.cardView.coverAttr].indexOf('http') > -1
                ? note[widget.cardView.coverAttr]
                : Config.host + '/' + note[widget.cardView.coverAttr]
              : ''
          "
          style="
            width: 100%;
            border-radius: 2px;
            display: inline-block;
            cursor: pointer;
          "
          :style="note[widget.cardView.coverAttr] || 'background:#f3f3f3;'"
        />
      </div>

      <div style="padding: 14px">
        <!-- 标题 -->
        <div class="card-item-title">
          {{ Utils.cutString(note["content"], 50) || "[ 空 ]" }}
        </div>
        <!-- 属性：标题、正文、头图等不显示 -->
        <div v-for="(attr, key) in attributes" :key="key">
          <div
            v-if="
              attr.visible &&
              attr.name != 'title' &&
              attr.name != 'content' &&
              attr.name != 'title_img' &&
              ((attr.type != 'checkbox' && note[attr.name]) ||
                attr.type == 'checkbox')
            "
            class="card-item-attrs"
          >
            <!-- 是否显示属性名 -->
            <span
              v-if="widget.cardView.showAttrLabel == 'true'"
              style="color: grey"
              >{{ attr.label || attr.name }}：
            </span>

            <!-- 勾选框 -->
            <el-checkbox
              v-if="attr.type == 'checkbox'"
              v-model="note[attr.name]"
              style="height: inherit"
              :label="attr.label"
              true-label="true"
              false-label="false"
              @click.stop
              @change="
                widget.saveAttrValue(
                  note.block_id,
                  attr.type,
                  attr.name,
                  note[attr.name],
                  widget
                )
              "
            />

            <!-- 评分 -->
            <el-rate
              v-else-if="attr.type == 'rate'"
              v-model="note[attr.name]"
              :disabled="attr.source == 'system'"
              @click.stop
              @change="
                widget.saveAttrValue(
                  note.block_id,
                  attr.type,
                  attr.name,
                  note[attr.name],
                  widget
                )
              "
            />

            <!-- 多选 -->
            <div
              v-else-if="attr.type == 'select' || attr.type == 'multi_select'"
            >
              <span v-for="tag in Utils.toArray(note[attr.name])" :key="tag">
                <el-tag
                  class="select"
                  :class="Utils.tagStyle(tag, attr.name, attributes)"
                  >{{ tag }}</el-tag
                >
              </span>
            </div>

            <!-- 其他类型 -->
            <span v-else> {{ Utils.cutString(note[attr.name], 50) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
// import { VueDraggableNext } from "vue-draggable-next"
import * as Utils from "./../utils/common"
import Widget from "../libs/Widget"
export default defineComponent({
  name: "CardView",
  // components: {
  //   draggable: VueDraggableNext,
  // },
  props: {
    widget: {},
    notes: [],
    attributes: [],
  },
  
  data() {
    return {
      data: [] as any[],
      Utils: Utils,
    }
  },

  mounted() {
    // 因为 props 不可修改，所以先赋值
    this.data = (this.widget as Widget).totalNotes || []

    setTimeout(() => {
      this.$emit("doSomething", "resize_iframe")
    }, 1000)
  },

  watch: {
    // 监听父组件数据变动（包括数组排序）
    widget: {
      handler() {
        this.data = (this.widget as Widget).totalNotes || []
      },
      deep: true,
    },
  },
})
</script>

<style>
.card-list {
  display: flex;
  flex-wrap: wrap;
  /* justify-content: center; */
  word-break: break-all;
}
.card-list .el-checkbox__label {
  color: inherit;
  font-weight: normal;
  font-size: inherit;
}
.card-list .el-rate {
  height: inherit;
}
.card-item {
  margin: 5px;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #eee;
  width: calc(100% / 3 - 15px);
  min-width: 200px;
}
.card-item:hover {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}
.card-item-title {
  font-weight: bold;
  color: #555;
  cursor: pointer;
}
.card-item-attrs {
  margin-top: 10px;
  font-size: 14px;
  color: #555;
  display: flex;
  align-items: center;
}
.card {
  max-width: 400px;
  min-width: 200px;
}
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button {
  padding: 0;
  min-height: auto;
}

/* .image {
  width: 100%;
  display: block;
} */
.cover {
  width: 100%;
  height: 150px;
  background-position: center;
  background-size: cover;
  background-color: #eee;
  position: relative;
  overflow: hidden;
}
</style>
