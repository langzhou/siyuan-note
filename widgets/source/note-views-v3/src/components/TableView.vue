<template>
  <div>
    <el-table
      id="table-view"
      :data="appendNotes"
      border
      class="tabel-view"
      @header-dragend="changeColWidth"
    >
      <!-- 行序号 -->
      <el-table-column
        type="index"
        min-width="40"
        align="center"
        label="#"
        v-if="widget.tableView.tableIndex == 'true'"
      />
      <!-- 属性 -->
      <el-table-column
        v-for="(attr, index) in visibleAttrs"
        :key="index"
        :prop="attr.name"
        :label="attr.label"
        :width="attr['width']"
      >
        <!-- 表头 -->
        <template #header>
          <el-popover
            trigger="click"
            :width="200"
            :show-arrow="false"
            @hide="widget.saveAttrInfor(attr)"
          >
            <template #reference>
              <div style="cursor: pointer; display: flex; align-items: center">
                <span v-html="icons[attr.type || 'text']" class="icon"></span>
                <span>{{ attr.label || attr.name }}</span>
                <span
                  v-if="attr.source == 'system'"
                  style="
                    display: inline-block;
                    width: 4px;
                    height: 4px;
                    border-radius: 4px;
                    margin-left: 3px;
                    background: rgb(238 146 146);
                  "
                ></span>
              </div>
            </template>

            <!-- 点击表头弹出的属性信息设置 -->
            <div class="attr_setting">
              <!-- 展示名称 -->
              <div class="attr_setting_row">
                <div class="attr_setting_label">展示名称</div>
                <el-input
                  v-model="attr.label"
                  placeholder="请填写展示名称"
                  minlength="2"
                  maxlength="30"
                  clearable
                />
              </div>
              <!-- 属性类型 -->
              <div class="attr_setting_row">
                <div class="attr_setting_label">属性类型</div>
                <el-select
                  v-model="attr.type"
                  style="width: 100%"
                  @change="
                    () => {
                      tableCount()
                    }
                  "
                >
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
                <span class="attr_setting_value">{{ attr.name }}</span>
              </div>
              <!-- 属性来源 -->
              <div class="attr_setting_row">
                <span class="attr_setting_label">来源：</span>
                <span class="attr_setting_value">
                  {{ attr.source == "system" ? "系统属性" : "自定义" }}
                </span>
              </div>
              <!-- 列宽 -->
              <div
                class="attr_setting_row"
                style="display: flex; align-items: center"
              >
                <span class="attr_setting_label">列宽：</span>
                <span class="attr_setting_value" style="margin-bottom: 5px"
                  >{{ attr.width ? attr.width + " px" : "自动宽度" }}
                  <span
                    v-if="attr.width"
                    style="
                      color: rgb(90, 156, 248);
                      cursor: pointer;
                      margin-left: 2px;
                    "
                    @click="deleteColWidth(attr)"
                    >设为自动宽度</span
                  >
                </span>
              </div>
            </div>
          </el-popover>
        </template>

        <template #default="scope">
          <!-- 末尾统计行 -->
          <div
            v-if="
              scope.row[attr.name] &&
              String(scope.row[attr.name]).indexOf('[count]-') > -1
            "
          >
            <el-popover
              trigger="click"
              placement="top"
              :show-arrow="false"
              :width="200"
            >
              <template #reference>
                <div style="text-align: right; cursor: pointer">
                  <div
                    v-if="attr['count_type'] && attr['count_type'] != 'none'"
                    style="color: #888"
                  >
                    {{ getCountTypeName(attr["count_type"]) }}
                    {{ getCount(attr.name, attr["count_type"]) }}
                  </div>
                  <div v-else style="color: #ccc">统计</div>
                </div>
              </template>

              <!-- 常规统计 -->
              <div class="table-count">
                <div
                  v-for="(type, key) in Config.count_types['common']"
                  :key="key"
                  class="table-count-item"
                  @click="saveCountType(attr, key)"
                >
                  {{ type }}
                </div>

                <!-- 数字统计 -->
                <div v-if="attr.type == 'number'">
                  <div
                    v-for="(type, key) in Config.count_types['number']"
                    :key="key"
                    class="table-count-item"
                    @click="saveCountType(attr, key)"
                  >
                    {{ type }}
                  </div>
                </div>

                <!-- 日期统计 -->
                <div v-if="attr.type == 'date'">
                  <div
                    v-for="(type, key) in Config.count_types['date']"
                    :key="key"
                    class="table-count-item"
                    @click="saveCountType(attr, key)"
                  >
                    {{ type }}
                  </div>
                </div>

                <!-- 勾选框 -->
                <div v-if="attr.type == 'checkbox'">
                  <div
                    v-for="(type, key) in Config.count_types['checkbox']"
                    :key="key"
                    class="table-count-item"
                    @click="saveCountType(attr, key)"
                  >
                    {{ type }}
                  </div>
                </div>
              </div>
            </el-popover>
          </div>

          <!-- 非统计行按照属性类型分别展示 -->
          <div v-else>
            <!-- 图片 -->
            <div v-if="attr.type == 'img'">
              <el-popover trigger="click" :width="350">
                <template #reference>
                  <!-- 题头图 -->
                  <div
                    v-if="attr.name == 'title_img'"
                    style="
                      width: 100%;
                      min-height: 80px;
                      border-radius: 2px;
                      cursor: pointer;
                    "
                    :style="scope.row[attr.name] || 'background:#f3f3f3;'"
                  ></div>
                  <!-- 普通图片：assets 图片需要添加 host 前缀 -->
                  <div v-else>
                    <img
                      :title="scope.row[attr.name]"
                      :src="
                        scope.row[attr.name]
                          ? scope.row[attr.name].indexOf('http') > -1
                            ? scope.row[attr.name]
                            : Config.host + '/' + scope.row[attr.name]
                          : ''
                      "
                      style="
                        width: 100%;
                        min-height: 50px;
                        border-radius: 2px;
                        display: inline-block;
                        cursor: pointer;
                      "
                      :style="scope.row[attr.name] || 'background:#f3f3f3;'"
                    />
                  </div>
                </template>
                <div style="margin-bottom: 3px">设置图片地址</div>
                <el-input
                  v-model="scope.row[attr.name]"
                  placeholder="支持网络图片或思源笔记附件(assets)地址"
                  clearable
                  @change="
                    widget.saveAttrValue(
                      scope.row.block_id,
                      scope.row.type,
                      attr.name,
                      scope.row[attr.name],
                      widget
                    )
                  "
                />
              </el-popover>
            </div>

            <!-- 文本 -->
            <div v-else-if="attr.type == 'text'">
              <!-- Markdown：仅查看 -->
              <div
                v-if="attr.name == 'markdown'"
                v-html="
                  Markdown(scope.row[attr.name]).replaceAll(
                    'assets/',
                    Config.host + '/assets/'
                  )
                "
                class="col-markdown"
              ></div>

              <!-- created 等系统属性不支持更改 -->
              <div
                v-else-if="
                  [
                    'id',
                    'block_id',
                    'box',
                    'fold',
                    'title_img',
                    'type',
                    'created',
                    'updated',
                    'hpath',
                  ].indexOf(attr.name) > -1
                "
              >
                {{ scope.row[attr.name] }}
              </div>

              <!-- title：仅文档块支持编辑 -->
              <div v-else-if="attr.name == 'title'" class="note_content">
                <el-input
                  v-model="scope.row[attr.name]"
                  class="noborder"
                  @change="
                    widget.saveAttrValue(
                      scope.row.block_id,
                      scope.row.type,
                      attr.name,
                      scope.row[attr.name],
                      widget
                    )
                  "
                  :disabled="['文档'].indexOf(scope.row.type) == -1"
                />
                <div
                  @click="Utils.openNote(scope.row.block_id)"
                  class="open_note"
                >
                  打开
                </div>
              </div>

              <!-- content：文档、列表、超级块类型不支持编辑 -->
              <!-- <el-input
                v-else-if="attr.name == 'content'"
                v-model="scope.row[attr.name]"
                class="noborder"
                type="textarea"
                autosize
                @change="
                  widget.saveAttrValue(
                    scope.row.id,
                    scope.row.type,
                    attr.name,
                    scope.row[attr.name],
                    widget
                  )
                "
                :disabled="['doc', 'd', 'l', 's'].indexOf(scope.row.type) > -1"
              /> -->

              <!-- 使用 div 来代替 element textarea。因为 el-input 设置为 autosize 时初始高度会计算出错 -->
              <div v-else-if="attr.name == 'content'" class="note_content">
                <div
                  :contenteditable="
                    ['文档', '列表', '超级块'].indexOf(scope.row.type) == -1
                      ? true
                      : false
                  "
                  v-html="scope.row[attr.name]"
                  class="lz-textarea"
                  :ref="scope.row.id + attr.name"
                  @blur="saveTextarea(scope.row.id, attr.name)"
                ></div>
                <div
                  @click="Utils.openNote(scope.row.block_id)"
                  class="open_note"
                >
                  打开
                </div>
              </div>

              <!-- 普通文本属性 -->
              <div
                v-else
                :contenteditable="attr.source != 'system' ? true : false"
                v-html="scope.row[attr.name]"
                class="lz-textarea"
                :ref="scope.row.id + attr.name"
                @blur="saveTextarea(scope.row.id, attr.name)"
              ></div>
            </div>

            <!-- 数字 -->
            <div v-else-if="attr.type == 'number'">
              <el-input-number
                v-model="scope.row[attr.name]"
                :controls="false"
                class="noborder table-view"
                :disabled="attr.source == 'system'"
                @change="
                  widget.saveAttrValue(
                    scope.row.block_id,
                    scope.row.type,
                    attr.name,
                    scope.row[attr.name],
                    widget
                  )
                "
              />
            </div>

            <!-- 日期 -->
            <div v-else-if="attr.type == 'date'">
              <el-date-picker
                v-model="scope.row[attr.name]"
                type="date"
                placeholder="设置日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD HH:mm:ss"
                class="noborder"
                style="width: 130px"
                :disabled="attr.source == 'system'"
                @change="
                  widget.saveAttrValue(
                    scope.row.block_id,
                    scope.row.type,
                    attr.name,
                    scope.row[attr.name],
                    widget
                  )
                "
              />
            </div>

            <!-- 评分 -->
            <div v-else-if="attr.type == 'rate'">
              <el-rate
                v-model="scope.row[attr.name]"
                :disabled="attr.source == 'system'"
                @change="
                  widget.saveAttrValue(
                    scope.row.block_id,
                    scope.row.type,
                    attr.name,
                    scope.row[attr.name],
                    widget
                  )
                "
              />
            </div>

            <!-- 勾选框 -->
            <div v-else-if="attr.type == 'checkbox'">
              <el-checkbox
                v-model="scope.row[attr.name]"
                true-label="true"
                false-label="false"
                :disabled="attr.source == 'system'"
                @change="
                  widget.saveAttrValue(
                    scope.row.block_id,
                    scope.row.type,
                    attr.name,
                    scope.row[attr.name],
                    widget
                  )
                "
              />
            </div>

            <!-- 单选、多选 -->
            <div
              v-else-if="attr.type == 'select' || attr.type == 'multi_select'"
            >
              <!-- 只能查看不能修改 -->
              <div
                v-if="
                  attr.source == 'system' &&
                  ((attr.name == 'tags' && scope.row['type'] != 'd') ||
                    attr.name != 'tags')
                "
              >
                <span v-if="Utils.toArray(scope.row[attr.name]).length > 0">
                  <span
                    v-for="tag in Utils.toArray(scope.row[attr.name])"
                    :key="tag"
                  >
                    <el-tag
                      class="select"
                      :class="Utils.tagStyle(tag, attr.name, attributes)"
                      >{{ tag }}</el-tag
                    >
                  </span>
                </span>
                <span v-else>
                  <el-tag class="select grey">&lt;空&gt;</el-tag>
                </span>
              </div>

              <!-- 可以修改 -->
              <el-popover
                v-else
                trigger="manual"
                :visible="
                  popoverVisible['menu'][
                    'table_' + scope.row.block_id + attr.name
                  ]
                "
                :width="250"
                :show-arrow="false"
                :offset="-22"
                @show="initNewOption"
                @hide="saveSelectOptions(scope.row, attr)"
              >
                <template #reference>
                  <!-- 标签列表 -->
                  <span v-if="Utils.toArray(scope.row[attr.name]).length > 0">
                    <span
                      v-for="tag in Utils.toArray(scope.row[attr.name])"
                      :key="tag"
                    >
                      <el-tag
                        class="select"
                        :class="Utils.tagStyle(tag, attr.name, attributes)"
                        @click.stop="
                          togglePopover(
                            `table_${scope.row.block_id}${attr.name}`
                          )
                        "
                        >{{ tag }}</el-tag
                      >
                    </span>
                  </span>
                  <!-- 空值 -->
                  <span v-else>
                    <el-tag
                      class="select grey"
                      @click.stop="
                        togglePopover(`table_${scope.row.block_id}${attr.name}`)
                      "
                      >&lt;空&gt;</el-tag
                    >
                  </span>
                </template>

                <!-- 弹框内容：已选内容 -->
                <div>
                  <span
                    v-for="tag in Utils.toArray(scope.row[attr.name])"
                    :key="tag"
                  >
                    <el-tag
                      class="select"
                      closable
                      :class="Utils.tagStyle(tag, attr.name, attributes)"
                      @close="
                        chooseSelectOption(
                          attr,
                          scope.row,
                          tag,
                          attr.type,
                          'remove'
                        )
                      "
                      >{{ tag }}</el-tag
                    >
                  </span>
                </div>
                <!-- 输入选项值 -->
                <el-input
                  v-model="newSelectOption.value"
                  :autofocus="true"
                  placeholder="查找或创建选项"
                  style="margin: 5px 0"
                  @keyup.enter="
                    chooseSelectOption(
                      attr,
                      scope.row,
                      newSelectOption,
                      attr.type,
                      'add'
                    )
                  "
                  clearable
                />
                <!-- 候选值 -->
                <el-scrollbar max-height="212px">
                  <div
                    v-for="option in queryOptions(
                      newSelectOption.value,
                      attr.name
                    )"
                    :key="option"
                    class="select-suggestion"
                    @click="
                      chooseSelectOption(
                        attr,
                        scope.row,
                        option,
                        attr.type,
                        'add'
                      )
                    "
                  >
                    <div class="select-suggestion_left">
                      <!-- <span v-html="icons['drag']" class="icon"></span> -->
                      <el-tag
                        class="select"
                        :data-hash="option.hash"
                        :style="Utils.selectOptionStyle(option.color)"
                        >{{ Utils.cutString(option.value, 14) }}</el-tag
                      >
                    </div>
                    <el-popover
                      placement="right"
                      :width="200"
                      trigger="click"
                      :show-arrow="false"
                      class="select-suggestion_right"
                    >
                      <template #reference>
                        <span
                          v-html="icons['dots']"
                          class="icon"
                          @click.stop
                        ></span>
                      </template>
                      <div>
                        <el-input
                          v-model="option.value"
                          placeholder="输入选项值"
                          style="margin-bottom: 5px"
                          clearable
                          @input="
                            widget.updateOptionInfor(
                              attr.name,
                              option,
                              attr,
                              'check',
                              widget
                            )
                          "
                          @change="
                            widget.updateOptionInfor(
                              attr.name,
                              option,
                              attr,
                              'value',
                              widget
                            )
                          "
                        />
                        <el-button
                          type="warning"
                          size="small"
                          :icon="ElementIcons.Delete"
                          plain
                          @click.stop="
                            widget.updateOptionInfor(
                              attr.name,
                              option,
                              attr,
                              'delete',
                              widget
                            )
                          "
                          >删除</el-button
                        >
                        <div class="divider"></div>
                        <div style="color: #999; size: 13px">颜色</div>
                        <div class="tag-colors">
                          <div
                            class="tag-colors-item"
                            v-for="item in Config.tag_colors"
                            :key="item"
                          >
                            <div
                              class="tag-colors-item_inner"
                              :style="`background: ${item.background};border:1px solid rgba(0,0,0,.06)`"
                              @click="
                                widget.updateOptionInfor(
                                  attr.name,
                                  option,
                                  item.name,
                                  'color',
                                  widget
                                )
                              "
                            >
                              <el-button
                                v-if="option.color == item.name"
                                type="text"
                                :style="`color: ${item.color}`"
                                size="large"
                                :icon="ElementIcons.Check"
                                circle
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </el-popover>
                  </div>

                  <!-- 创建选项 -->
                  <div
                    v-if="newSelectOption.value"
                    class="select-suggestion"
                    @click="
                      chooseSelectOption(
                        attr,
                        scope.row,
                        newSelectOption,
                        attr.type,
                        'add'
                      )
                    "
                  >
                    <div>
                      <span style="color: #999; margin-right: 3px"
                        >创建选项</span
                      >
                      <el-tag
                        class="select"
                        :data-hash="newSelectOption.hash"
                        :class="newSelectOption.color"
                        >{{ newSelectOption.value }}</el-tag
                      >
                    </div>
                  </div>
                </el-scrollbar>
              </el-popover>
            </div>
            <!-- 其他未知类型 -->
            <div v-else>
              {{ scope.row[attr.name] }}
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue"
import { icons } from "./../utils/icons"
import * as Utils from "./../utils/common"
import Widget from "../libs/Widget"
import { marked } from "marked"
import { Config } from "./../config/config"
import { Note, Attribute } from "./../libs/Types"
import * as ElementIcons from "@element-plus/icons-vue"

export default defineComponent({
  name: "TableView",
  props: {
    widget: Widget,
    notes: [] as any[], //笔记集合
    attributes: [] as any[],
    popoverVisible: {},
  },
  data() {
    return {
      icons: icons,
      Utils: Utils,
      Config: Config,
      ElementIcons: ElementIcons,
      Markdown: marked.parse, //Markdown 渲染
      counts: [] as any[], //表格统计数据
      optionValue: "",
      newSelectOption: {
        value: "",
        color: "",
        hash: "",
      },
      popoverVisible2: {
        select: false,
        multi_select: false,
      },
    }
  },

  computed: {
    // 用于显示的属性
    visibleAttrs() {
      return this.widget!.attributes.filter((attr: any) => attr.visible)
    },

    // 将统计标识添加到笔记集合中。标识：[count]-
    appendNotes() {
      if (this.widget!.tableView.tableCount == "true") {
        const note = {} as any
        this.attributes.forEach((attr: any) => {
          note[attr.name] = "[count]-" + attr.name
        })
        return this.notes.concat([note])
      } else {
        return this.notes
      }
    },
  },

  watch: {
    notes: {
      handler(notes: Note[]) {
        this.tableCount(notes) //笔记更新时就执行统计，主要用于计算分页数据
      },
      deep: true,
    },
  },

  methods: {
    // 初始化选项值
    initNewOption() {
      const range = Math.floor(Math.random() * (7 - 0 + 1)) + 0
      this.newSelectOption = {
        value: "",
        color: Config.tag_colors[range]["name"],
        hash: Utils.randomWord(true, 4, 4),
      }
    },

    // 检索多选项候选值
    queryOptions(keyword: string, attrName: string) {
      const options = this.widget!.widgetAttrs.find(
        (attr: any) => attr.name == attrName
      )!.options
      if (options) {
        return options.filter(
          (option: any) => option.value.indexOf(keyword) > -1
        )
      } else {
        return []
      }
    },

    // 选中某个选项值
    chooseSelectOption(
      attr: Attribute,
      note: Note,
      data: any,
      type = "select",
      action = "add"
    ) {
      this.widget!.chooseSelectOption(attr, note, data, type, action)
      this.initNewOption()
    },

    // 保存单选、多选选项值
    saveSelectOptions(note: any, attr: any) {
      console.log("save select options:", note, attr)
      this.newSelectOption.value = ""

      this.widget!.saveAttrValue(
        note.block_id,
        note.type,
        attr.name,
        note[attr.name]
      )
    },

    // 保存 textarea 的值
    saveTextarea(blockID: string, attrName: string) {
      const ref = this.$refs[blockID + attrName] as any[]
      const div = ref[0] as HTMLDivElement
      if (div && div.innerText) {
        const text = div.innerText
        console.log("save textarea", blockID, attrName)

        this.widget!.saveAttrValue(blockID, "text", attrName, text)
      }
    },

    // 保存统计类型名称
    saveCountType(attr: Attribute, countType: string) {
      const attribute = attr
      attribute.count_type = countType
      this.widget!.saveWidgtAttrs()
    },

    // 获取统计类型名称 type → name
    getCountTypeName(type: string) {
      let name = "统计"
      const countTypes = this.Config.count_types
      for (const index in countTypes) {
        const item = countTypes[index as keyof typeof countTypes]
        const typeName = item[type as keyof typeof item]
        if (typeName) {
          name = typeName
          break
        }
      }
      return name
    },

    // 获取单个统计数值
    getCount(attrName: string, countType: string) {
      const count = this.counts.find(
        (count: any) => count.attr_name == attrName
      )
      if (count) {
        return count[countType]
      } else {
        return 0
      }
    },

    // 执行统计
    tableCount(note: Note[]) {
      // console.log("开始表格统计", note)
      note = note || this.appendNotes
      const counts = [] as any[]

      if (this.attributes.length > 0) {
        for (let i = 0; i < this.attributes.length; i++) {
          const attr = this.attributes[i]
          const newCount = {
            attr_name: attr.name,
            attr_label: attr.label,
            total_count: 0,
            unique: 0,
            with_value: 0,
            without_value: 0,
            null_percent: "0",
            not_null_percent: "0",
            done: 0,
            undone: 0,
            sum: 0,
            avg: 0,
            max: 0,
            min: 0,
            range: 0,
            most_early: "",
            most_late: "",
          }

          let max = 0,
            min = 0,
            most_early = "",
            most_late = "",
            unique_value = new Set()

          // 开始遍历笔记进行统计
          const notes =
            this.widget!.tableView.tableCountMode == "page"
              ? this.notes
              : this.widget!.totalNotes
          for (let j = 0; j < notes.length; j++) {
            const note = notes[j]
            const value = note[attr.name]
            newCount.total_count++ //总数

            if (!(value == null || value == "" || value == undefined)) {
              newCount.with_value++ //有值
              unique_value.add(value) //唯一值

              // 勾选框
              if (attr.type == "checkbox" && value == "true") {
                newCount.done++
              } else {
                newCount.undone++
              }

              // 数值
              if (attr.type == "number") {
                newCount.sum += parseFloat(value)
                if (parseFloat(value) > max) {
                  max = parseFloat(value)
                }
                if (parseFloat(value) < min) {
                  min = parseFloat(value)
                }
              }
              // 日期
              if (attr.type == "date") {
                most_early = most_early || value

                most_late = most_late || value

                if (value > most_late) {
                  most_late = value
                }
                if (value < most_early) {
                  most_early = value
                }
              }
            } else {
              newCount.without_value++
              newCount.undone++
            }
          }
          newCount.null_percent =
            String(
              ((newCount.without_value / newCount.total_count) * 100).toFixed(2)
            ) + "%"
          newCount.not_null_percent =
            ((newCount.with_value / newCount.total_count) * 100).toFixed(2) +
            "%"
          newCount.avg = parseFloat(
            (newCount.sum / newCount.with_value).toFixed(2)
          )
          newCount.unique = unique_value.size
          newCount.max = max
          newCount.min = min
          newCount.range = newCount.max - newCount.min
          newCount.most_early = most_early
          newCount.most_late = most_late

          counts.push(newCount)
        }
        // console.log("结束表格统计", counts)
        this.counts = counts
      }
    },

    // 获取单选、多选类型属性的值集合
    getOptions(attrName: string) {
      if (attrName) {
        const attribute = (this.widget as Widget).attributes.find(
          (attr: any) => attr.name == attrName
        )
        if (attribute) {
          return attribute.options
        } else {
          return []
        }
      } else {
        return []
      }
    },

    // 弹框显示
    togglePopover(menuName: string, type = "menu", action = "toggle") {
      this.$emit("doSomething", "toggle_popover", {
        menuName: menuName,
        type: type,
        action: action,
      })
    },

    // 调整表格列宽
    changeColWidth(
      newWidth: number,
      oldWidth: number,
      column: any,
      event: Event
    ) {
      this.$emit("doSomething", "resize_table_width", {
        attrName: column.property,
        newWidth: newWidth,
      })
    },

    // 删除表格列宽
    deleteColWidth(attr: Attribute) {
      this.$emit("doSomething", "resize_table_width", {
        attrName: attr.name,
        newWidth: "",
      })

      attr.width = ""
    },
  },

  created() {
    this.tableCount(this.appendNotes)
  },

  mounted() {
    console.log("table mounted")
    // 数据加载完成后重新计算iframe高度
    setTimeout(() => {
      this.$emit("doSomething", "resize_iframe")
    }, 500)
  },
})
</script>

<style>
#table-view .el-textarea.is-disabled .el-textarea__inner,
#table-view .el-input.is-disabled .el-input__inner {
  background-color: inherit;
  border-color: transparent;
  color: inherit;
  cursor: inherit;
  box-shadow: none;
}

#table-view .note_content {
  position: relative;
  font-weight: bold;
}

.note_content .el-input__inner {
  font-weight: bold;
}
#table-view .note_content:hover .open_note {
  display: block;
}
.open_note {
  position: absolute;
  top: 5px;
  right: 0;
  cursor: pointer;
  display: none;
  font-size: 13px;
  background: #f5f5f5;
  border-radius: 3px;
  border: 1px solid #eee;
  padding: 2px 5px;
  box-shadow: 0 0 2px #eee;
}
.open_note:hover {
  border-color: rgb(90, 156, 248);
  color: white;
  background: rgb(90, 156, 248);
}
/* 替换 el-textarea */
.lz-textarea {
  padding: 5px 10px;
  outline: none;
  border: 1px solid transparent;
  border-radius: 4px;
}
.lz-textarea:focus {
  border: 1px solid #409eff;
  transition: border 1s;
}

.table-count-item {
  cursor: pointer;
  padding: 8px 5px;
  border-radius: 3px;
}
.table-count-item:hover {
  background-color: #f5f5f5;
}

.col-markdown img {
  max-width: 100%;
}

.col-markdown p,
.col-markdown h1,
.col-markdown h2,
.col-markdown h3,
.col-markdown h4,
.col-markdown ul {
  margin: 0;
}

.col-markdown ul,
.col-markdown ol {
  margin: 5px 0;
  padding-inline-start: 15px;
}

.col-markdown h1 {
  font-size: 1.3em;
}
.col-markdown h2 {
  font-size: 1.2em;
}
.col-markdown h3 {
  font-size: 1.1em;
}
.col-markdown h4,
.col-markdown h5,
.col-markdown h6 {
  font-size: 1em;
}

/* 单选、多选候选项 */
.select-suggestion {
  display: flex;
  align-items: center;
  cursor: pointer;
  justify-content: space-between;
}
.select-suggestion:hover {
  background-color: #f5f5f5;
}
.select-suggestion_left {
  display: flex;
  align-items: center;
  cursor: pointer;
}
</style>
