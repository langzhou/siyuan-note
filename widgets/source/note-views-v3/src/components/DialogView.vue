<template>
  <el-dialog
    v-model="isVisiable"
    :title="dialogSetting.title"
    :width="dialogSetting.width"
    :show-close="false"
    :close-on-click-modal="false"
    top="2vh"
  >
    <!-- 自定义 SQL -->
    <div v-if="type == 'custom_sql'">
      <el-form label-width="80px">
        <el-form-item label="SQL语句">
          <el-input
            v-model="customSQL"
            placeholder="请输入SQL语句"
            type="textarea"
            :autosize="{ minRows: 1, maxRows: 5 }"
          />
        </el-form-item>
      </el-form>
    </div>

    <!-- 手动添加文档 -->
    <div v-else-if="type == 'selected_notes'">
      <div
        style="
          display: flex;
          algin-item: center;
          justify-content: center;
          margin-bottom: 5px;
        "
      >
        <el-input
          v-model="searchInput"
          placeholder="输入笔记标题或 ID 查询，回车键进行搜索，最多添加 100 条"
          @keyup.enter="searchNote"
          autofocus="true"
        />
      </div>
      <!-- 展示已选的笔记标题 -->
      <div v-if="selectedNotes.length > 0" style="margin-bottom: 5px">
        <el-tag type="info" style="margin: 2px">
          已选 {{ selectedNotes.length }} 条
        </el-tag>
        <el-tag
          type="danger"
          @close="handleTagClose(undefined)"
          closable
          style="margin: 2px"
          >移除所有</el-tag
        >
        <draggable v-model="selectedNotes" style="display: inline">
          <el-tag
            v-for="(item, index) in selectedNotes"
            :key="index"
            closable
            style="margin: 2px; cursor: move"
            @close="handleTagClose(item)"
          >
            {{ cutString(item.content) }}
          </el-tag>
        </draggable>
      </div>
      <!-- 搜索结果 -->
      <el-scrollbar max-height="280px">
        <el-table
          ref="selectNoteTable"
          :data="notes"
          style="width: 100%"
          border
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="40" />
          <el-table-column prop="content" label="标题" />
          <el-table-column prop="hpath" label="目录" />
          <el-table-column prop="updated" label="更新时间" />
          <el-table-column prop="id" label="ID" /> </el-table
      ></el-scrollbar>
    </div>

    <!-- card view -->
    <div v-else-if="type == 'card_view'">
      <el-form label-width="100px">
        <el-form-item label="卡片封面">
          <el-select v-model="cardView.coverAttr" :teleported="false">
            <el-option
              v-for="attr in coverAttrs"
              :key="attr.name"
              :label="attr.label"
              :value="attr.name"
            />
          </el-select>
          <div style="font-size: 13px; color: grey; margin-left: 10px">
            可以指定一个“图片”类型的属性作为卡片封面来源
          </div>
        </el-form-item>

        <el-form-item label="显示属性名称">
          <el-switch
            v-model="cardView.showAttrLabel"
            active-value="true"
            inactive-value="false"
          />
          <div style="font-size: 13px; color: grey; margin-left: 10px">
            卡片视图下是否显示属性名称
          </div>
        </el-form-item>
      </el-form>
    </div>

    <!-- list view -->
    <div v-else-if="type == 'list_view'">
      <el-form label-width="100px">
        <el-form-item label="显示属性名称">
          <el-switch
            v-model="listView.showAttrLabel"
            active-value="true"
            inactive-value="false"
          />
          <div style="font-size: 13px; color: grey; margin-left: 10px">
            列表视图下是否显示属性名称
          </div>
        </el-form-item>
      </el-form>
    </div>

    <!-- table view 设置 -->
    <div v-else-if="type == 'table_view'">
      <el-form label-width="100px">
        <el-form-item label="表格序号">
          <el-switch
            v-model="tableView.tableIndex"
            active-value="true"
            inactive-value="false"
          />
          <div style="font-size: 13px; color: grey; margin-left: 10px">
            是否显示表格行序号
          </div>
        </el-form-item>

        <el-form-item label="表格统计">
          <el-switch
            v-model="tableView.tableCount"
            active-value="true"
            inactive-value="false"
          />
          <div style="font-size: 13px; color: grey; margin-left: 10px">
            是否在表格底部显示统计信息
          </div>
        </el-form-item>

        <el-form-item
          label="表格统计范围"
          v-if="tableView.tableCount == 'true'"
        >
          <div>
            <el-radio v-model="tableView.tableCountMode" label="total"
              >所有数据</el-radio
            >
            <el-radio v-model="tableView.tableCountMode" label="page"
              >分页数据</el-radio
            >
          </div>
          <div style="font-size: 13px; color: grey; margin-left: 10px">
            选择是对分页数据还是所有数据进行统计
          </div>
        </el-form-item>
      </el-form>
    </div>

    <!-- 属性设置 -->
    <div v-else-if="type == 'shared_attrs'">
      <el-tag type="warning">
        移除后展示名称将显示为属性名，属性类型恢复为文本类型。该设置将在多个挂件中同步生效。
      </el-tag>

      <el-scrollbar max-height="300px">
        <el-table :data="widget.sharedAttrs" style="width: 100%">
          <el-table-column label="属性名">
            <template #default="scope">
              <el-tag>{{ scope.row.name }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="展示名称">
            <template #default="scope">
              <el-input
                v-model="scope.row.label"
                placeholder="展示名称"
                style="width: 100%"
                clearable
              />
            </template>
          </el-table-column>
          <el-table-column label="属性类型">
            <template #default="scope">
              <el-select v-model="scope.row.type" style="width: 100%">
                <el-option
                  v-for="(type, index) in Config.attr_types"
                  :key="index"
                  :label="type.value"
                  :value="type.name"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>

          <el-table-column label="操作">
            <template #default="scope">
              <el-button
                size="small"
                type="warning"
                @click="
                  widget.removeSharedAttr(scope.row, scope.$index, widget)
                "
                >移除设置
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-scrollbar>
    </div>

    <!-- 默认：系统设置 -->
    <div v-else>
      <el-scrollbar max-height="400px">
        <el-form label-width="110px">
          <el-form-item label="挂件名称">
            <el-input
              v-model="widgetSettings.widgetName"
              placeholder="设置挂件名称"
              minlength="1"
              maxlength="50"
              show-word-limit="true"
              style="width: 220px"
            />
          </el-form-item>

          <el-form-item label="分页大小">
            <el-input-number
              v-model="widgetSettings.pageSize"
              :min="0"
              :max="100"
              :controls="false"
              style="width: 90px"
            />
            <div style="font-size: 13px; color: grey; margin-left: 10px">
              设置为 0 时则不分页
            </div>
          </el-form-item>

          <el-form-item label="加载模式" style="align-items: center">
            <div>
              <el-radio v-model="widgetSettings.reload" label="true"
                >自动加载</el-radio
              >
              <el-radio v-model="widgetSettings.reload" label="false"
                >手动加载</el-radio
              >
            </div>
            <div style="font-size: 13px; color: grey; margin-left: 10px">
              启动时是否自动加载最新数据，数据量大时建议选择手动加载
            </div>
          </el-form-item>

          <el-form-item label="属性过滤">
            <el-input
              v-model="widgetSettings.attrFilterReg"
              placeholder="输入正则表达式"
              style="width: 220px"
            />
            <div style="font-size: 13px; color: grey; margin-left: 10px">
              过滤满足正则表达式的属性
            </div>
          </el-form-item>

          <div style="display: flex; justify-content: center">
            <div class="recommend">
              <div class="recommend_tips">
                如果
                <b>Note Views</b>
                对你有帮助，订阅思源笔记时欢迎使用我的推荐码（点击复制）
              </div>
              <div class="recommend_code">
                <el-tag @click="copyCode" size="large" type="warning"
                  ><b>4EY48YJ</b></el-tag
                >
              </div>
              <div
                style="
                  display: flex;
                  justify-content: center;
                  font-size: 13px;
                  color: #aaa;
                  margin-top: 35px;
                "
              >
                Created by
                <a
                  href="https://github.com/langzhou/siyuan-note"
                  target="_blank"
                  >Langzhou</a
                >, Inspired by
                <a href="https://www.notion.so/" target="_blank">Notion</a>.
              </div>
            </div>
          </div>
        </el-form>
      </el-scrollbar>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose(type)">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { VueDraggableNext } from "vue-draggable-next"
import { cutString, copyText, miniSearch } from "./../utils/common"
import { ElMessage } from "element-plus"
import Widget from "../libs/Widget"
import { SettingType } from "./../libs/Types"
import { Config } from "../config/config"

export default defineComponent({
  name: "DialogView",
  components: {
    draggable: VueDraggableNext,
  },
  props: {
    dialog_visible: Boolean,
    type: String,
    widget: Widget,
  },
  data() {
    return {
      isVisiable: false,
      dialogSetting: {
        title: "挂件设置",
        width: "70%",
      },

      dialogTypes: {
        table_view: {
          title: "表格视图",
          width: "70%",
        },
        card_view: {
          title: "卡片视图",
          width: "50%",
        },
        list_view: {
          title: "列表视图",
          width: "70%",
        },
        custom_sql: {
          title: "自定义SQL",
          width: "70%",
        },
        selected_notes: {
          title: "手动添加文档",
          width: "70%",
        },
      } as { [key: string]: any },

      widgetSettings: {},
      tableView: {
        tableCount: "true",
        tableCountMode: "page",
      },
      cardView: {
        showAttrLabel: "true",
        coverAttr: "title_img",
      },
      listView: {
        showAttrLabel: "true",
      },

      Config: Config,

      reload: "true",
      customSQL: "",
      widgetName: "",
      pageSize: 0,

      tableCount: "true",
      tableCountMode: "page",
      showAttrLabel: "true",
      attrFilter: "",

      searchInput: "",
      selectedNotes: [] as any[],
      notes: [] as any[],
    }
  },
  methods: {
    // 关闭对话框
    handleClose(type = "") {
      // 告知父组件进行关闭
      this.$emit("closeDialog", type, false)
      // 清除表单数据
      this.searchInput = ""
      this.notes = this.selectedNotes = []
    },

    // 自选笔记多选
    handleSelectionChange(val: any[]) {
      val.forEach((item) => {
        if (!this.selectedNotes.includes(item)) {
          this.selectedNotes.push(item)
        }
      })
    },

    // 关闭标签
    handleTagClose(item: any) {
      const table = this.$refs.selectNoteTable as any
      if (item) {
        const indexInSelected = this.selectedNotes.indexOf(item)
        const indexInNotes = this.notes.indexOf(item)
        // 在从已选标签数组中移除
        this.selectedNotes.splice(indexInSelected, 1)
        // 取消表格中的选中状态
        table.toggleRowSelection(this.notes[indexInNotes], false)
      } else {
        this.selectedNotes = []
        table.clearSelection()
      }
    },

    // 点击确认按钮
    submit() {
      switch (this.type) {
        case "custom_sql":
          this.widget!.saveSettings(
            SettingType.CustomSQL,
            { custom_sql: this.customSQL },
            this.widget
          )
          this.customSQL = "" //清空输入框
          break
        case "selected_notes":
          // 限制最大添加数量
          if (this.selectedNotes.length > 100) {
            ElMessage.error("最多选择100条")
            return
          }
          this.$emit("closeDialog", this.type, false, {
            selected_notes: this.selectedNotes,
          })
          this.selectedNotes = [] //清空已选
          break
        case "shared_attrs":
          this.$emit("closeDialog", this.type, false, {})
          break

        case "table_view":
          this.widget!.saveSettings(SettingType.TableView, this.tableView)
          break
        case "list_view":
          this.widget!.saveSettings(SettingType.ListView, this.listView)
          break
        case "card_view":
          this.widget!.saveSettings(SettingType.CardView, this.cardView)
          break

        case "widget_setting":
          this.widget!.saveSettings(
            SettingType.WidgetSetting,
            this.widgetSettings
          )
          break
        default:
          this.$emit("closeDialog", this.type, false, {})
          break
      }
    },

    // 字符串截取
    cutString(text: string) {
      return cutString(text, 10)
    },

    // 根据不同类型初始化对话框
    init() {
      this.dialogSetting = this.dialogTypes[this.type as string] || {
        title: "挂件设置",
        width: "70%",
      }
    },

    // 搜索笔记
    searchNote() {
      if (this.searchInput.length > 0) {
        miniSearch(this.searchInput).then((res) => {
          this.notes = res.data
          if (this.notes.length == 0) {
            ElMessage({
              message: "没有搜索到相关结果",
              type: "warning",
            })
          }
        })
      } else {
        ElMessage.error("请输入搜索内容")
      }
    },

    clearDatabase() {
      this.$emit("doSomething", "clear_database")
    },

    // 复制邀请码
    copyCode() {
      copyText("4EY48YJ")
      ElMessage({
        showClose: false,
        message: "❤  推荐码已复制 ~笔芯~ ❤",
        center: true,
        type: "success",
      })
    },
  },

  computed: {
    coverAttrs() {
      return this.widget!.attributes.filter((item) => item.type == "img")
    },
  },

  watch: {
    widget: {
      handler(val) {
        this.widgetSettings = { ...val.widgetSetting }

        this.tableView = val.tableView
        this.cardView = val.cardView
        this.listView = val.listView

        this.customSQL = val.customSQL
        this.selectedNotes = val.selectedNotes
      },
      deep: true,
    },

    dialog_visible(val) {
      this.isVisiable = val
    },

    type(val) {
      if (val) {
        this.init()
      }
    },
  },
})
</script>

<style scoped>
.recommend {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  /* background: #fafafa; */
  padding: 20px;
  width: 80%;
  border-radius: 4px;
  border-top: 1px dashed #efefef;
  /* border-bottom: 1px dashed #efefef; */
  margin-top: 20px;
}
.recommend a {
  text-decoration: none;
  color: #aaa;
  font-weight: bold;
  border-bottom: 1px solid #eee;
  padding: 0 2px;
  margin: 0 2px;
}
.recommend_tips {
  color: #888;
  font-size: 13px;
}
.recommend_code {
  margin-top: 8px;
  cursor: pointer;
}

.custom-attr {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 10px 0;
}
.custom-attr_field {
  margin-right: 15px;
  font-weight: bold;
}
.custom-attr_name {
  margin: 0 5px;
}
.custom-attr_order {
  margin: 0 5px;
}
</style>
