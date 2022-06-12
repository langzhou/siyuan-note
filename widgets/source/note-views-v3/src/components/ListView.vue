<template>
  <div>
    <div class="list-view-row" v-for="note in notes" :key="note.id">
      <!-- 正文 -->
      <div class="list-view-row_content" @click="Utils.openNote(note.block_id)">
        {{ note.content }}
      </div>
      <!-- 属性 -->
      <div class="list-view-row_attrs">
        <div v-for="(attr, key) in attributes" :key="key">
          <div
            v-if="
              attr.visible &&
              attr.name != 'content' &&
              attr.name != 'title_img' &&
              ((attr.type != 'checkbox' && note[attr.name]) ||
                attr.type == 'checkbox')
            "
            class="list-view-row_attr"
          >
            <!-- 属性名 -->
            <span
              v-if="widget.widgetSetting.showAttrLabel == 'true'"
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
              size="small"
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
              size="small"
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
            <!-- 单选多选 -->
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
            <!-- 其他属性类型 -->
            <span v-else>{{ note[attr.name] }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue"
import Widget from "./../libs/Widget"
import * as Utils from "./../utils/common"
export default defineComponent({
  name: "TableView",
  props: {
    widget: Widget,
    notes: [] as any[], //笔记集合
    attributes: [] as any[],
  },
  computed: {
    visibleAttrs() {
      return this.widget!.attributes.filter((attr: any) => attr.visible)
    },
  },
  data() {
    return {
      Utils: Utils,
    }
  },
})
</script>
<style>
.list-view-row {
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  margin: 5px 0;
}
.list-view-row_content {
  max-width: 70%;
  font-weight: bold;
  cursor: pointer;
}
.list-view-row_attrs {
  display: flex;
  align-items: center;
  font-size: 13px;
  margin: 0 5px;
  color: #666;
}
.list-view-row_attrs .el-rate {
  height: inherit;
}
.list-view-row_attr {
  margin: 0 5px;
  display: flex;
  align-items: center;
}
</style>
