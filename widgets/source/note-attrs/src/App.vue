<template>
  <div id="attrs-panel" @mousemove="resizeIframe">
    <draggable
      v-model="widget.attributes"
      group="attrs"
      item-key="label"
      class="attrs-list"
      @end="widget.saveAttrsOrder(widget)"
    >
      <div v-for="(attr, attrIndex) in widget.attributes" :key="attr.name">
        <div
          v-if="attr.show || (!attr.show && !hideAttrsList)"
          class="attr-item"
        >
          <div v-html="icons['drag']" class="drag"></div>
          <el-popover
            trigger="click"
            :width="200"
            :show-arrow="false"
            @hide="widget.saveAttrInfor(attr)"
          >
            <template #reference>
              <div class="attr-name">
                <span v-html="icons[attr.type || 'text']" class="icon"></span>
                <span class="overflow">{{
                  attr.label || attr.name.replaceAll("_", "-")
                }}</span>
              </div>
            </template>

            <!-- 属性信息设置 -->
            <div class="attr_setting">
              <!-- 展示名称 -->
              <div class="attr_setting_row">
                <!-- <div class="attr_setting_label">展示名称</div> -->
                <el-input
                  v-model="attr.label"
                  placeholder="请填写展示名称"
                  minlength="2"
                  maxlength="30"
                  autofocus
                  clearable
                />
              </div>
              <!-- 属性类型 -->
              <div class="attr_setting_row">
                <!-- <div class="attr_setting_label">属性类型</div> -->
                <el-select v-model="attr.type" style="width: 100%">
                  <el-option
                    v-for="(type, index) in Config.attr_types"
                    :key="index"
                    :label="type.value"
                    :value="type.name"
                    popper-class="select_option"
                  >
                    <div style="display: flex; align-items: center">
                      <span v-html="icons[type.name]" class="icon"></span
                      >{{ type.value }}
                    </div>
                  </el-option>
                </el-select>
              </div>
              <!-- 属性名 -->
              <div class="attr_setting_row">
                <span class="attr_setting_label">属性名：</span>
                <span class="attr_setting_value">{{
                  attr.name.replaceAll("_", "-")
                }}</span>
              </div>
              
              <!-- 隐藏状态 -->
              <div class="attr_setting_row">
                <span class="attr_setting_label">显示状态：</span>
                <span class="attr_setting_value">
                  {{
                    attr.show ? "显示" : "已隐藏"
                  }}
                </span>
              </div>

              <!-- 属性来源 -->
              <div class="attr_setting_row">
                <span class="attr_setting_label">来源：</span>
                <span class="attr_setting_value">
                  {{
                    attr.name.indexOf("custom") == -1 ? "系统属性" : "自定义"
                  }}
                </span>
              </div>

              <!-- 显示/隐藏属性 -->
              <el-button
                  type="primary"
                  style="width: 100%;margin-bottom: 10px"
                  plain
                  :icon="attr.show ?  ElIcons.Hide : ElIcons.View"
                  @click="toggleAttrShow(attr)"
                >
                  {{attr.show ? '隐藏属性' : '显示属性'}}
                </el-button>
              <!-- 删除属性 -->
              <div
                v-if="attr.name.indexOf('custom') > -1"
                class="attr_setting_row"
              >
                <el-button
                  type="warning"
                  style="width: 100%"
                  plain
                  :icon="ElIcons.Delete"
                  @click="widget.removeAttr(attr, attrIndex, widget)"
                >
                  删除属性
                </el-button>
              </div>
            </div>
          </el-popover>

          <!-- 属性值：可编辑 -->
          <div
            v-if="attr.name.indexOf('custom') > -1 || attr.name == 'tags'"
            class="attr-value"
          >
            <!-- 文本类型 -->
            <el-input
              v-if="attr.type == 'text'"
              v-model="attr.value"
              placeholder="请输入属性值"
              class="noborder"
              :disabled="attr.source == 'system'"
              type="textarea"
              autosize
              clearable
              @change="widget.saveAttrValue(attr, widget)"
            />

            <!-- 数值 -->
            <el-input-number
              v-else-if="attr.type == 'number'"
              v-model="attr.value"
              :controls="false"
              class="noborder"
              :disabled="attr.source == 'system'"
              @change="widget.saveAttrValue(attr, widget)"
            />

            <!-- 日期 -->
            <el-date-picker
              v-else-if="attr.type == 'date'"
              v-model="attr.value"
              type="date"
              placeholder="设置日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD HH:mm:ss"
              class="noborder"
              :disabled="attr.source == 'system'"
              @change="widget.saveAttrValue(attr, widget)"
            />

            <!-- 评分 -->
            <el-rate
              v-else-if="attr.type == 'rate'"
              v-model="attr.value"
              :disabled="attr.source == 'system'"
              style="margin-left: 11px"
              @change="widget.saveAttrValue(attr, widget)"
            />

            <!-- 勾选框 -->
            <el-checkbox
              v-else-if="attr.type == 'checkbox'"
              v-model="attr.value"
              true-label="true"
              false-label="false"
              :disabled="attr.source == 'system'"
              style="margin-left: 11px"
              @change="widget.saveAttrValue(attr, widget)"
            />

            <!-- 网络链接 -->
            <div v-else-if="attr.type == 'url'" class="url">
              <a :href="attr.value" target="_blank" class="url">{{
                attr.url || attr.value
              }}</a>

              <el-popover
                trigger="click"
                :offset="-30"
                :show-arrow="false"
                placement="right"
                :width="280"
                @hide="widget.saveAttrValue(attr, widget)"
              >
                <template #reference>
                  <el-button
                    type="text"
                    :icon="ElIcons.Edit"
                    class="url-btn"
                  ></el-button>
                </template>
                <el-input
                  v-model="attr.value"
                  placeholder="请输入网络链接"
                  clearable
                  autofocus
                />
              </el-popover>
              <!-- 用来执行函数 -->
              <div style="display: none">{{ Utils.getUrlTitle(attr) }}</div>
            </div>

            <!-- 单选多选 -->
            <div
              v-else-if="attr.type == 'select' || attr.type == 'multi_select'"
              style="padding-left: 8px"
            >
              <el-tag
                v-for="tag in Utils.toArray(attr.value)"
                :key="tag"
                class="select"
                :class="randomColor()"
                @close="widget.removeSelectItem(attr, tag, widget)"
                closable
              >
                {{ tag }}
              </el-tag>
              <!-- 新增选项 -->
              <el-input
                v-if="selectOption.index == attrIndex"
                class="select-input"
                v-model="selectOption.value"
                autofocus
                @keyup.enter="appendSelectItem(attr)"
              />

              <el-tag
                v-if="
                  (attr.type == 'select' && Utils.toArray(attr.value) == 0) ||
                  attr.type == 'multi_select'
                "
                class="select grey"
                @click="showSelectInput(attrIndex)"
                >+</el-tag
              >
            </div>

            <!-- 其他 -->
            <el-input
              v-else
              v-model="attr.value"
              placeholder="请输入属性值"
              :disabled="attr.source == 'system'"
              clearable
              @change="widget.saveAttrValue(attr, widget)"
            />
          </div>

          <!-- 属性值：不可编辑 -->
          <div v-else class="attr-value" style="padding-left: 11px">
            {{
              attr.name == "created" || attr.name == "updated"
                ? Utils.siyuanTimeToDateStr(attr.value)
                : attr.value
            }}
          </div>
        </div>
      </div>
    </draggable>

    <!-- 创建新属性 -->
    <div
      class="new-attr"
      v-for="(attr, index) in widget.createAttrs"
      :key="index"
    >
      <div class="label">
        <el-input
          type="text"
          v-model="attr.label"
          placeholder="展示名称"
          @blur="widget.checkAttrFormat(attr)"
          clearable
        />
      </div>
      <div class="name">
        <el-input
          type="text"
          v-model="attr.name"
          placeholder="属性名，字母 + 数字 + '-'"
          @blur="widget.checkAttrFormat(attr)"
          clearable
        />
      </div>
      <div class="type">
        <el-select v-model="attr.type">
          <el-option
            v-for="(type, index) in Config.attr_types"
            :key="index"
            :label="type.value"
            :value="type.name"
            popper-class="select_option"
          >
            <div style="display: flex; align-items: center">
              <span v-html="icons[type.name]" class="icon"></span
              >{{ type.value }}
            </div>
          </el-option>
        </el-select>
      </div>
      <!-- 属性值 -->
      <div class="value">
        <!-- 文本、图片、网络链接、单多选 -->
        <el-input
          v-if="
            attr.type == 'text' ||
            attr.type == 'img' ||
            attr.type == 'select' ||
            attr.type == 'multi_select' ||
            attr.type == 'url'
          "
          v-model="attr.value"
          :placeholder="
            attr.type == 'text'
              ? '请输入属性值'
              : attr.type == 'url'
              ? '请输入网络链接'
              : attr.type == 'img'
              ? '网络图片或附件地址'
              : attr.type == 'select'
              ? '请输入选项值'
              : '以 , 作为分割（支持中文逗号）'
          "
          clearable
          @keyup.enter="widget.saveNewAttr('create', index, attr, widget)"
        />
        <!-- 数值 -->
        <el-input-number
          v-else-if="attr.type == 'number'"
          v-model="attr.value"
        />

        <!-- 日期 -->
        <el-date-picker
          v-else-if="attr.type == 'date'"
          v-model="attr.value"
          type="date"
          placeholder="设置日期"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD HH:mm:ss"
        />

        <!-- 评分 -->
        <el-rate v-else-if="attr.type == 'rate'" v-model="attr.value" />

        <!-- 勾选框 -->
        <el-checkbox
          v-else-if="attr.type == 'checkbox'"
          v-model="attr.value"
          true-label="true"
          false-label="false"
        />
      </div>
      <!-- 保存按钮 -->
      <div class="save">
        <el-button
          type="primary"
          @click="widget.saveNewAttr('create', index, attr, widget)"
          >保存</el-button
        >
      </div>
    </div>

    <!-- 添加已有属性 -->
    <div
      class="new-attr"
      v-for="(attr, index) in widget.selectAttrs"
      :key="index"
    >
      <div class="label">
        <el-select
          v-model="attr.name"
          @change="widget.selectAttrName(attr, index, widget)"
          placeholder="选择属性"
        >
          <el-option
            v-for="(item, index) in attrsSelectOptions"
            :key="index"
            :label="item.label"
            :value="item.name"
            popper-class="select_option"
          >
            <div style="display: flex; align-items: center">
              <span v-html="icons[item.type]" class="icon"> </span
              ><span>{{ item.label }}</span>
              <span style="color: #999; margin-left: 8px; font-size: 13px">{{
                item.name.replaceAll("_", "-")
              }}</span>
            </div>
          </el-option>
        </el-select>
      </div>
      <!-- 属性值 -->
      <div class="value">
        <!-- 文本、图片、网络链接、单多选 -->
        <el-input
          v-if="
            attr.type == 'text' ||
            attr.type == 'img' ||
            attr.type == 'select' ||
            attr.type == 'multi_select' ||
            attr.type == 'url'
          "
          v-model="attr.value"
          :placeholder="
            attr.type == 'text'
              ? '请输入属性值'
              : attr.type == 'url'
              ? '请输入网络链接'
              : attr.type == 'img'
              ? '网络图片或附件地址'
              : attr.type == 'select'
              ? '请输入选项值'
              : '以 , 作为分割（支持中文逗号）'
          "
          clearable
          @keyup.enter="widget.saveNewAttr('select', index, attr, widget)"
        />
        <!-- 数值 -->
        <el-input-number
          v-else-if="attr.type == 'number'"
          v-model="attr.value"
        />

        <!-- 日期 -->
        <el-date-picker
          v-else-if="attr.type == 'date'"
          v-model="attr.value"
          type="date"
          placeholder="设置日期"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD HH:mm:ss"
        />

        <!-- 评分 -->
        <el-rate v-else-if="attr.type == 'rate'" v-model="attr.value" />

        <!-- 勾选框 -->
        <el-checkbox
          v-else-if="attr.type == 'checkbox'"
          v-model="attr.value"
          true-label="true"
          false-label="false"
        />

        <!-- 网络连接 -->
      </div>

      <!-- 保存按钮 -->
      <div class="save">
        <el-button
          type="primary"
          @click="widget.saveNewAttr('select', index, attr, widget)"
          >保存</el-button
        >
      </div>
    </div>

    <!-- 显示/隐藏属性 -->
    <div class="hide-attrs" v-if="hideAttrsCount > 0">
      <el-button
        class="add-btn"
        type="text"
        :icon="hideAttrsList ? ElIcons.ArrowDown : ElIcons.ArrowUp"
        @click="hideAttrsList = !hideAttrsList"
      >
        {{ hideAttrsList ? `${hideAttrsCount} 个隐藏属性` : `隐藏 ${hideAttrsCount} 个属性` }}
      </el-button>
    </div>

    <div class="btns">
      <el-button
        class="add-btn"
        type="text"
        :icon="ElIcons.Plus"
        @click="widget.appendAttr('create', widget)"
      >
        添加新属性
      </el-button>

      <el-button
        class="add-btn"
        type="text"
        :icon="ElIcons.Tickets"
        @click="widget.appendAttr('select', widget)"
      >
        选择已有属性
      </el-button>

      <el-button
        class="add-btn"
        type="text"
        :icon="ElIcons.Download"
        @click="widget.downloadAttrs(widget)"
      >
        保存属性到文档
      </el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import Widget from "./libs/Widget"
import * as Utils from "./utils/common"
import { icons } from "./utils/icons"
import { Config } from "./config/config"
import { Attribute } from "./libs/Types"
import { VueDraggableNext } from "vue-draggable-next"
import * as ElIcons from "@element-plus/icons-vue"
export default defineComponent({
  name: "App",
  components: {
    draggable: VueDraggableNext,
  },
  data() {
    return {
      widget: {} as Widget,
      icons: icons,
      ElIcons: ElIcons,
      Utils: Utils,
      Config: Config,
      hideAttrsList: true,
      selectOption: {
        index: -1,
        value: "",
      },
    }
  },
  computed: {
    hideAttrsCount(){
      let count = 0
      this.widget.attributes.forEach((attr) => {
        if (!attr.show) {
          count++
        }
      })

      return count
    },

    attrsSelectOptions() {
      const array: any[] = []
      this.widget.sharedAttrs.forEach((attr) => {
        const attrExist = this.widget.attributes.find(
          (item) => item.name == attr.name
        )
        if (!attrExist && attr.name.indexOf("custom") > -1) {
          // attr.editable = Config.uneditable_attrs.indexOf(attr.name) == -1
          array.push(attr)
        }
      })

      return array
    },
  },
  methods: {
    toggleAttrShow(attr: Attribute) {
      attr.show = !attr.show
      this.widget.saveAttrsOrder()
    },

    showSelectInput(index: number) {
      console.log(index)
      this.selectOption.index = index
    },

    appendSelectItem(attr: Attribute) {
      this.widget.appendSelectItem(attr, this.selectOption.value)
      this.selectOption.index = -1
      this.selectOption.value = ""
    },
    randomColor() {
      const range = Math.floor(Math.random() * (7 - 0 + 1)) + 0
      const color = Config.tag_colors[range]["name"]
      return color == "grey" ? "blue" : color
    },
    // 根据内容调整 iframe 高度
    resizeIframe() {
      const iframe = window.frameElement as HTMLIFrameElement
      const height = window.document.body.scrollHeight
      iframe.style.height = height + 50 + "px"
      // console.log(height);
    },
  },

  created() {
    this.widget = new Widget()
    this.widget.init()
  },

  mounted() {
    setTimeout(() => {
      this.resizeIframe()
    }, 800)
  },
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  font-size: 14px;
}

a {
  color: inherit;
  text-decoration: none;
  margin-left: 10px;
  padding: 1px;
  border-bottom: 1px solid #ddd;
}
a:hover {
  color: #409eff;
  border-color: #409eff;
}
.url-btn {
  opacity: 0;
  margin-left: 8px;
}
.url:hover .url-btn {
  opacity: 1;
}
/* 图标 */
.drag {
  opacity: 0;
  width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
}
.attr-item:hover .drag {
  opacity: 1;
  cursor: move;
}
.icon {
  width: 14px;
  height: 14px;
  margin: 4px;
}
.icon path {
  fill: #aaa;
}

.attr-item {
  display: flex;
  align-items: center;
  margin: 12px 0;
  min-height: 28px;
}
.attr-name .icon {
  width: 14px;
  height: 14px;
  margin-right: 6px;
}
.attr-name {
  display: flex;
  align-items: center;
  color: #666;
  cursor: pointer;
}
.overflow {
  width: 100px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
}
.attr-value {
  cursor: pointer;
  width: 100%;
}
.attr-value .el-textarea__inner {
  max-width: 500px;
  padding: 5px 11px;
}

/* 属性设置面板 */

.attr_setting_row {
  margin-bottom: 12px;
}
.attr_setting_label {
  color: rgb(130, 130, 130);
  margin-bottom: 5px;
}

.attr_setting_value {
  color: #444;
}

.btns {
  display: flex;
  align-items: center;
}
.btns button {
  margin-right: 10px;
}
.add-btn {
  margin-left: 12px;
}
.add-btn.el-button {
  font-weight: normal !important;
  color: #999;
  padding: 0 3px;
}
.add-btn.el-button:hover {
  background: #eee;
  color: #999;
}
.add-btn.el-button:focus {
  color: #999;
}
.new-attr_item {
  margin: 5px 0;
}
/* 数字输入框 */
.attr-item .el-input-number .el-input__inner {
  text-align: left !important;
}
.attr-item .el-input-number.is-without-controls .el-input__inner {
  padding-left: 11px !important;
}
/* 添加 noborder 可去除文本输入框的边框样式 */
.noborder .el-input__inner,
.noborder .el-textarea__inner {
  box-shadow: none;
  resize: none;
  background: transparent;
}
.noborder .el-input__inner:focus,
.noborder .el-textarea__inner:focus {
  box-shadow: 0 0 0 1px var(--el-input-focus-border-color) inset;
  outline: 0px;
}
.noborder .el-input__inner:hover,
.noborder .el-textarea__inner:hover {
  box-shadow: 0 0 0 1px var(--el-input-hover-border-color) inset;
}

.attr-item .el-textarea.is-disabled .el-textarea__inner,
.attr-item .el-input.is-disabled .el-input__inner {
  background-color: inherit !important;
  border-color: transparent !important;
  color: inherit !important;
  cursor: inherit !important;
  box-shadow: none !important;
}

.new-attr {
  display: flex;
  align-items: center;
  margin: 8px 0;
}
.new-attr > div {
  margin-right: 5px;
}
.new-attr .label {
  width: 120px;
}
.new-attr .name {
  width: 200px;
}
.new-attr .type {
  width: 90px;
}
.new-attr .value {
  min-width: 230px;
}
.value .el-date-editor.el-input,
.value .el-date-editor.el-input__inner {
  width: 230px !important;
}

.select-input {
  width: 70px !important;
  height: 24px !important;
}
.select-input .el-input {
  width: 70px !important;
}
.select-input .el-input__inner {
  height: 24px !important;
  line-height: 24px !important;
}

.el-tag.select {
  border-width: 0px;
  --el-tag-text-color: none;
  --el-tag-border-radius: 2px;
  --el-tag-font-size: 13px;
  margin: 2px;
  padding: 0 5px;
  cursor: pointer;
}
.el-tag.select .el-tag__close:hover {
  background: none;
  color: inherit;
}

.el-tag.select.orange {
  background: rgba(249, 139, 42, 0.2);
  color: rgb(198, 88, 0);
}
.el-tag.select.red {
  color: rgb(152, 13, 15);
  background-color: rgba(203, 64, 66, 0.2);
}
.el-tag.select.blue {
  color: rgb(0, 118, 172);
  background-color: rgba(46, 169, 223, 0.2);
}
.el-tag.select.green {
  color: rgb(0, 78, 11);
  background-color: rgba(27, 129, 62, 0.2);
}
.el-tag.select.yellow {
  color: rgb(204, 145, 0);
  background-color: rgba(255, 196, 8, 0.2);
}
.el-tag.select.grey {
  color: rgb(111, 113, 115);
  background-color: rgba(162, 164, 166, 0.2);
}
.el-tag.select.brown {
  color: rgb(65, 52, 11);
  background-color: rgba(116, 103, 62, 0.2);
}
.el-tag.select.purple {
  color: rgb(55, 25, 105);
  background-color: rgba(106, 76, 156, 0.2);
}
</style>
