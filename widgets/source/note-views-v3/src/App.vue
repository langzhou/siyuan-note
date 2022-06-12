<template>
  <div
    @mousemove="widget.resizeIframe"
    @click="togglePopoverVisible('body', 'menu', 'close_all')"
  >
    <div id="header">
      <div class="left">
        <!-- 挂件名 -->
        <span
          class="widget_name"
          @click="toggleDialogVisible('widget_setting')"
          >{{ widget.widgetSetting.widgetName }}</span
        >

        <!-- 测试环境 -->
        <div
          v-if="widget.testMode == 1"
          style="
            font-size: 12px;
            color: rgb(152, 13, 15);
            background-color: rgba(203, 64, 66, 0.2);
            padding: 2px 4px;
            border-radius: 3px;
            margin: 0 2px;
          "
        >
          测试版本
        </div>

        <!-- 缓存模式 -->
        <div
          v-if="widget.widgetSetting.reload == 'false'"
          style="
            font-size: 12px;
            color: #777;
            background: #f3f3f3;
            padding: 2px 4px;
            border-radius: 3px;
            margin: 0 2px;
          "
        >
          缓存模式
        </div>

        <!-- 刷新按钮 -->
        <el-button
          type="text"
          style="color: #888"
          :icon="icon.Refresh"
          @click="refresh"
        />

        <!-- 笔记条数 -->
        <span
          v-if="widget.totalNotes.length > 0"
          style="font-size: 12px; color: #888; margin-left: 5px"
        >
          共 {{ widget.totalNotes.length }} 条
        </span>

        <!-- loading 图标 -->
        <div
          v-if="widget.loading"
          style="
            font-size: 12px;
            color: #e6a23c;
            background: #faecd8;
            padding: 2px 4px;
            border-radius: 3px;
            margin: 0 2px;
          "
        >
          数据加载中..
        </div>
      </div>

      <!-- 右侧按钮 -->
      <div class="right">
        <!-- 设置数据源 -->
        <el-popover trigger="hover">
          <template #reference>
            <el-button
              v-if="widget.dataSource == 'subdoc'"
              type="text"
              style="color: grey"
              :icon="icon.Folder"
            >
              子文档
            </el-button>

            <el-button
              v-else-if="widget.dataSource == 'custom_sql'"
              type="text"
              style="color: grey"
              :icon="icon.Burger"
              @click="toggleDialogVisible('custom_sql')"
            >
              自定义 SQL
            </el-button>

            <el-button
              v-else-if="widget.dataSource == 'selected_notes'"
              type="text"
              style="color: grey"
              :icon="icon.Sugar"
              @click="toggleDialogVisible('selected_notes')"
            >
              手动添加
            </el-button>

            <el-button
              v-else
              type="text"
              style="color: grey"
              :icon="icon.Burger"
            >
              数据源
            </el-button>
          </template>

          <div class="popover-item">
            <el-button
              type="text"
              :style="
                widget.dataSource == 'subdoc' ? 'color: #5a9cf8' : 'color: grey'
              "
              :icon="icon.Folder"
              @click="changeDataSource('subdoc')"
            >
              展示子文档
            </el-button>
          </div>

          <div class="popover-item">
            <el-button
              type="text"
              :style="
                widget.dataSource == 'custom_sql'
                  ? 'color: #5a9cf8'
                  : 'color: grey'
              "
              :icon="icon.Burger"
              @click="toggleDialogVisible('custom_sql')"
            >
              自定义 SQL
            </el-button>
          </div>

          <div class="popover-item">
            <el-button
              type="text"
              :style="
                widget.dataSource == 'selected_notes'
                  ? 'color: #5a9cf8'
                  : 'color: grey'
              "
              :icon="icon.Sugar"
              @click="toggleDialogVisible('selected_notes')"
            >
              手动添加文档
            </el-button>
          </div>
        </el-popover>

        <!-- 视图类型 -->
        <el-popover :width="160" trigger="hover">
          <template #reference>
            <el-button
              v-if="widget.viewType == 'table-view'"
              type="text"
              style="color: grey"
              :icon="icon.IceTea"
            >
              表格
            </el-button>

            <el-button
              v-else-if="widget.viewType == 'card-view'"
              type="text"
              style="color: grey"
              :icon="icon.Watermelon"
            >
              卡片
            </el-button>

            <el-button
              v-else-if="widget.viewType == 'list-view'"
              type="text"
              style="color: grey"
              :icon="icon.Pear"
            >
              列表
            </el-button>

            <el-button
              :icon="icon.Soccer"
              v-else
              type="text"
              style="color: grey"
            >
              视图
            </el-button>
          </template>

          <div class="popover-item flex-between">
            <el-button
              type="text"
              :style="
                widget.viewType == 'table-view'
                  ? 'color: #5a9cf8'
                  : 'color: grey'
              "
              @click="
                widget.saveSettings(
                  'view_type',
                  { view_type: 'table-view' },
                  widget
                )
              "
              :icon="icon.IceTea"
            >
              表格
            </el-button>
            <el-button
              class="view-type-setting"
              type="text"
              size="small"
              @click.stop="toggleDialogVisible('table_view')"
              >视图设置</el-button
            >
          </div>

          <div class="popover-item flex-between">
            <el-button
              type="text"
              :style="
                widget.viewType == 'card-view'
                  ? 'color: #5a9cf8'
                  : 'color: grey'
              "
              @click="
                widget.saveSettings(
                  'view_type',
                  { view_type: 'card-view' },
                  widget
                )
              "
              :icon="icon.Watermelon"
            >
              卡片
            </el-button>
            <el-button
              class="view-type-setting"
              type="text"
              size="small"
              @click.stop="toggleDialogVisible('card_view')"
              >视图设置</el-button
            >
          </div>

          <div class="popover-item flex-between">
            <el-button
              type="text"
              :style="
                widget.viewType == 'list-view'
                  ? 'color: #5a9cf8'
                  : 'color: grey'
              "
              @click="
                widget.saveSettings(
                  'view_type',
                  { view_type: 'list-view' },
                  widget
                )
              "
              :icon="icon.Pear"
            >
              列表
            </el-button>
            <el-button
              class="view-type-setting"
              type="text"
              size="small"
              @click.stop="toggleDialogVisible('list_view')"
              >视图设置</el-button
            >
          </div>
        </el-popover>

        <!-- 属性设置 -->
        <el-popover
          :width="260"
          :visible="popoverVisible.menu.attrs"
          trigger="manual"
          @hide="widget.saveWidgtAttrs(widget)"
        >
          <template #reference>
            <el-button
              type="text"
              style="color: grey"
              :icon="icon.SetUp"
              @click.stop="togglePopoverVisible('attrs')"
            >
              属性
            </el-button>
          </template>
          <el-scrollbar max-height="294px">
            <draggable
              v-model="widget.attributes"
              group="attrs"
              item-key="label"
            >
              <!-- 单个属性设置 -->
              <el-popover
                v-for="attr in widget.attributes"
                :key="attr['label']"
                :show-arrow="false"
                :offset="-2"
                :width="200"
                trigger="manual"
                :visible="popoverVisible.submenu['attrs_' + attr.name]"
                @hide="widget.saveAttrInfor(attr)"
              >
                <template #reference>
                  <div
                    class="attr_item"
                    @click="togglePopoverVisible('attrs_' + attr.name, 'submenu')"
                  >
                    <div class="attr_item_info">
                      <div class="attr_item_name">
                        <span v-html="icons['drag']" class="drag"></span>
                        <span
                          v-html="icons[attr.type || 'text']"
                          class="icon"
                        ></span>
                        <span>{{ attr.label ? attr.label : attr.name }}</span>
                      </div>
                      <el-switch
                        v-model="attr.visible"
                        @click.stop
                        style="height: 24px !important"
                        size="small"
                      />
                    </div>
                    <div class="attr_item_raw" v-if="attr.label != attr.name">
                      {{ attr.name }}
                    </div>
                  </div>
                </template>

                <div class="attr_setting">
                  <div class="attr_setting_row">
                    <div class="attr_setting_label">展示名称</div>
                    <el-input
                      v-model="attr.label"
                      placeholder="展示名称"
                      minlength="2"
                      maxlength="30"
                      @update.stop
                      clearable
                    />
                  </div>
                  <div class="attr_setting_row">
                    <div class="attr_setting_label">属性类型</div>
                    <el-select v-model="attr.type" style="width: 100%">
                      <el-option
                        v-for="(type, index) in Config.attr_types"
                        :key="index"
                        :label="type.value"
                        :value="type.name"
                        popper-class="attr_setting_select_option"
                      >
                        <div style="display: flex; align-items: center">
                          <span v-html="icons[type.name]" class="icon"></span
                          >{{ type.value }}
                        </div>
                      </el-option>
                    </el-select>
                  </div>

                  <div class="attr_setting_row">
                    <span class="attr_setting_label">属性名：</span>
                    <span class="attr_setting_value">{{ attr.name }}</span>
                  </div>
                  <div class="attr_setting_row">
                    <span class="attr_setting_label">属性来源：</span>
                    <span class="attr_setting_value">
                      {{ attr.source == "system" ? "系统" : "自定义" }}
                    </span>
                  </div>
                </div>
              </el-popover>
            </draggable>
            <el-divider style="margin: 10px 0px 2px 0px !important" />
            <!-- <div style="display: flex; justify-content: center"> -->
            <el-button
              type="text"
              :icon="icon.Setting"
              style="color: #999"
              @click="toggleDialogVisible('shared_attrs')"
              >全局属性设置</el-button
            >
            <!-- </div> -->
          </el-scrollbar>
        </el-popover>

        <!-- 筛选弹框 -->
        <el-popover
          :width="400"
          class="filter"
          :visible="popoverVisible.menu.filter"
          trigger="manual"
          @hide="widget.saveSettings('filters', { data: 'null' }, widget)"
        >
          <template #reference>
            <el-button
              type="text"
              :icon="icon.Filter"
              :style="
                widget.filters.length > 0 && widget.filterOn == 'true'
                  ? 'color: #5a9cf8'
                  : 'color: grey'
              "
              @click.stop="togglePopoverVisible('filter')"
            >
              筛选
            </el-button>
          </template>
          <!-- 筛选条件为空 -->
          <div v-if="widget.filters.length == 0">
            <el-button
              type="text"
              :icon="icon.CirclePlus"
              style="color: #999"
              @click="widget.appendFilterItem(widget)"
              >创建筛选条件</el-button
            >
          </div>
          <!-- 筛选条件不为空 -->
          <div v-else>
            <div class="filter-head">
              <div style="display: flex; align-items: center">
                <el-dropdown @command="handleFilterMode">
                  <span>
                    筛选符合下方 <b v-if="widget.filterMode == 'and'">全部</b
                    ><b v-else>任意</b>
                    <el-button
                      :icon="icon.ArrowDown"
                      type="text"
                      size="small"
                      style="color: grey"
                    />
                    条件的数据
                  </span>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item command="and">全部</el-dropdown-item>
                      <el-dropdown-item command="or">任意</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
              <!-- 开关：开启/关闭筛选 -->
              <el-switch
                v-model="widget.filterOn"
                @click.stop
                @change="
                  widget.saveSettings('filters', { data: 'null' }, widget)
                "
                active-value="true"
                inactive-value="false"
                size="small"
              />
            </div>

            <!-- 筛选条件 -->
            <div
              class="filter-row"
              v-for="(filter, filterIndex) in widget.filters"
              :key="filter.name"
            >
              <!-- 筛选项 -->
              <el-select
                v-model="filter.name"
                class="filter-row_item filter-row_item_name"
                @change="
                  widget.handleFilterNameChange($event, filterIndex, widget)
                "
              >
                <el-option
                  v-for="(attr, index) in widget.attributes"
                  :key="index"
                  :label="attr.label"
                  :value="attr.name"
                  popper-class="select_option"
                  ><div
                    style="cursor: pointer; display: flex; align-items: center"
                  >
                    <span
                      v-html="icons[attr.type || 'text']"
                      class="icon"
                    ></span>
                    {{ attr.label || attr.name }}
                  </div></el-option
                >
              </el-select>

              <!-- 运算符 -->
              <el-select
                v-model="filter.operator"
                class="filter-row_item filter-row_item_operator"
                @change="
                  widget.saveSettings('filters', { data: 'null' }, widget)
                "
              >
                <el-option
                  v-for="item in widget.operators[filterIndex]"
                  :key="item.name"
                  :label="item.label"
                  :value="item.name"
                >
                  {{ item.label }}
                </el-option>
              </el-select>

              <!-- 筛选值 -->
              <!-- 已填写/未填写/已勾选/未勾选 不显示输入框 -->
              <div
                v-if="
                  widget.filters[filterIndex]['operator'] == 'empty' ||
                  widget.filters[filterIndex]['operator'] == 'not_empty' ||
                  widget.filters[filterIndex]['operator'] == 'checked' ||
                  widget.filters[filterIndex]['operator'] == 'not_checked'
                "
              ></div>

              <div v-else class="filter-row_item filter-row_item_value">
                <!--数字 -->
                <el-input-number
                  v-if="Utils.getAttrType(filter.name, widget) == 'number'"
                  v-model="filter.value"
                  :controls="false"
                  @change="
                    widget.saveSettings('filters', { data: 'null' }, widget)
                  "
                />
                <!-- 日期 -->
                <el-date-picker
                  v-else-if="Utils.getAttrType(filter.name, widget) == 'date'"
                  v-model="filter.value"
                  type="date"
                  placeholder="选择日期"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  :prefix-icon="2"
                  clearable
                  @change="
                    widget.saveSettings('filters', { data: 'null' }, widget)
                  "
                />
                <!-- 评分 -->
                <el-rate
                  v-else-if="Utils.getAttrType(filter.name, widget) == 'rate'"
                  v-model="filter.value"
                  @change="
                    widget.saveSettings('filters', { data: 'null' }, widget)
                  "
                />
                <!-- 勾选框 -->
                <el-select
                  v-else-if="
                    Utils.getAttrType(filter.name, widget) == 'checkbox'
                  "
                  v-model="filter.value"
                  @change="
                    widget.saveSettings('filters', { data: 'null' }, widget)
                  "
                >
                  <el-option label="已勾选" value="true"></el-option>
                  <el-option label="未勾选" value="false"></el-option>
                </el-select>

                <!-- 单选或多选 -->
                <el-select
                  v-else-if="
                    Utils.getAttrType(filter.name, widget) == 'select' ||
                    Utils.getAttrType(filter.name, widget) == 'multi_select'
                  "
                  v-model="filter.value"
                  filterable
                  remote
                  clearable
                  reserve-keyword
                  placeholder="请输入筛选值"
                  :remote-method="getSelectSuggestions(filter.name, widget)"
                  :loading="loading"
                  :default-first-option="true"
                  @change="
                    widget.saveSettings('filters', { data: 'null' }, widget)
                  "
                >
                  <el-option
                    v-for="item in widget.selectSuggestions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <!-- 普通属性 -->
                <el-input
                  v-else
                  v-model="filter.value"
                  class="filter-row_item"
                  placeholder="请输入筛选值"
                  @change="
                    widget.saveSettings('filters', { data: 'null' }, widget)
                  "
                  clearable
                />
              </div>

              <!-- 删除按钮 -->
              <el-button
                type="text"
                style="color: #999"
                :icon="icon.Close"
                @click="widget.removeFilterItem(filterIndex, widget)"
              />
            </div>

            <!-- 按钮：新增筛选条件 -->
            <el-divider style="margin: 10px 0px 2px 0px !important" />
            <el-button
              type="text"
              :icon="icon.CirclePlus"
              style="color: #999"
              @click="widget.appendFilterItem(widget)"
              >创建筛选条件</el-button
            >
          </div>
        </el-popover>

        <!-- 排序 -->
        <el-popover
          :width="200"
          trigger="click"
          @hide="widget.saveSettings('sort', { data: '' }, widget)"
        >
          <template #reference>
            <el-button type="text" style="color: grey" :icon="icon.Sort">
              排序
            </el-button>
          </template>
          <el-select
            v-model="widget.sortField"
            placeholder="排序方式"
            style="width: 100%; margin-bottom: 10px"
          >
            <el-option label="默认排序" value="default"></el-option>
            <el-option
              v-for="(attr, index) in widget.attributes"
              :key="index"
              :label="attr.label || attr.name"
              :value="attr.name"
            ></el-option>
          </el-select>
          <el-select
            v-model="widget.sortType"
            placeholder="排序方式"
            style="width: 100%"
          >
            <el-option label="升序" value="asc"></el-option>
            <el-option label="降序" value="desc"></el-option>
          </el-select>
        </el-popover>

        <!-- 挂件设置 -->
        <el-button
          type="text"
          style="color: grey"
          :icon="icon.Setting"
          @click="toggleDialogVisible('widget_setting')"
        >
          设置
        </el-button>
      </div>
      <!-- 右侧按钮 end -->
    </div>
    <!-- header end -->

    <!-- 视图组件 -->
    <component
      v-if="widget.pageNotes.length > 0"
      id="component"
      :is="widget.viewType"
      :widget="widget"
      :notes="widget.pageNotes"
      :attributes="widget.attributes"
      :popoverVisible="popoverVisible"
      @doSomething="doSomething"
    ></component>
    <el-empty
      v-else
      :description="
        widget.loading ? '🏃🏻‍♀️ 数据加载中，请稍等片刻...' : widget.emptyMessage
      "
    ></el-empty>

    <!-- 分页 -->
    <div
      style="display: flex; justify-content: center; margin: 15px 0"
      v-if="widget.widgetSetting.pageSize > 0 && widget.totalNotes.length > 0"
    >
      <el-pagination
        small
        hide-on-single-page
        layout="prev, pager, next"
        :total="widget.totalNotes.length"
        :page-size="widget.widgetSetting.pageSize"
        :current-page="widget.currentPage"
        @current-change="handlePageChange"
      />
    </div>

    <!-- 对话框 -->
    <dialog-view
      :dialog_visible="widget.dialogVisible"
      :type="widget.dialogType"
      :widget="widget"
      @closeDialog="toggleDialogVisible"
      @doSomething="doSomething"
    ></dialog-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import * as Icon from "@element-plus/icons-vue"
import Widget from "./libs/Widget"
import TableView from "./components/TableView.vue"
import CardView from "./components/CardView.vue"
import ListView from "./components/ListView.vue"
import CalendarView from "./components/CalendarView.vue"
import * as Utils from "./utils/common"
import { icons } from "./utils/icons"
import { VueDraggableNext } from "vue-draggable-next"
import { Attribute, SettingType } from "./libs/Types"
import DialogView from "./components/DialogView.vue"
import { Config } from "./config/config"
export default defineComponent({
  name: "App",
  components: {
    draggable: VueDraggableNext,
    TableView,
    CardView,
    ListView,
    CalendarView,
    DialogView,
  },
  data() {
    return {
      test: "",
      icon: Icon,
      icons: icons,
      Config: Config,
      Utils: Utils,
      widget: {} as Widget,
      popoverVisible: {
        menu: {},
        submenu: {},
      } as { [key: string]: any },
      // popoverVisible3: {
      //   attrs_list: false,
      //   attrs_setting: false,
      //   filter: false,
      //   sort: false,
      // } as { [key: string]: boolean },
    }
  },

  methods: {
    async loadNotes() {
      await this.widget.loadNotes()
    },

    refresh() {
      this.widget.refresh()
    },

    query() {
      this.widget.fetchLocalNotes()
    },

    getSelectSuggestions(attrName: string, widget: Widget) {
      return function (keyword: string) {
        widget.getSelectSuggestions(keyword, attrName)
      }
    },

    /**
     * 响应子组件的事件
     */
    doSomething(type: string, data: any = {}) {
      // console.log("接收到子组件事件", type, data)
      switch (type) {
        case "resize_table_width":
          this.widget.resizeTableWidth(data)
          break
        case "resize_iframe":
          this.widget.resizeIframe()
          break
        case "clear_database":
          this.widget.clearDatabase()
          break
        case "toggle_popover": {
          const { menuName, type, action } = data
          this.togglePopoverVisible(menuName, type, action)
          break
        }
        default:
          break
      }
    },

    // 阻止事件冒泡
    // stopPropagation(event: any) {
    //   event.stopPropagation()
    // },

    // 关闭所有 popover
    // closePopovers(event: Event) {
    //   for (const item in this.popoverVisible) {
    //     this.popoverVisible[item] = false
    //   }
    // },

    // 切换弹框显示
    // togglePopoverVisible3(event: any, type: string) {
    //   event.stopPropagation() //阻止事件冒泡 todo 可以使用@click.stop代替
    //   // 切换弹框显示
    //   this.popoverVisible[type] = !this.popoverVisible[type]

    //   // 关闭其他弹框
    //   for (const item in this.popoverVisible) {
    //     if (item != type) {
    //       this.popoverVisible[item] = false
    //     }
    //   }
    // },

    togglePopoverVisible(menuName: string, type = "menu", action = "toggle") {
      // console.log("togglePopoverVisible", menuName, type, action)
      // 关闭全部弹框
      if (action == "close_all") {
        // 关闭一级菜单
        for (const item in this.popoverVisible["menu"]) {
          this.popoverVisible["menu"][item] = false
        }
        // 关闭二级菜单
        for (const item in this.popoverVisible["submenu"]) {
          this.popoverVisible["submenu"][item] = false
        }
        // 关闭所有子菜单
      } else if (action == "close_submenu") {
        for (const item in this.popoverVisible["submenu"]) {
          if (item.indexOf(menuName) > -1) {
            this.popoverVisible["submenu"][item] = false
          }
        }
      } else {
        // 切换菜单显示
        if (this.popoverVisible[type][menuName] == undefined) {
          this.popoverVisible[type][menuName] = true
        } else {
          this.popoverVisible[type][menuName] =
            !this.popoverVisible[type][menuName]
        }

        // 关闭其他菜单
        for (const item in this.popoverVisible[type]) {
          if (item != menuName) {
            if (this.popoverVisible[type][item] == true) {
              this.popoverVisible[type][item] = false
            } else {
              delete this.popoverVisible[type][item]
            }
          }
        }
      }
    },

    /**
     * 显示设置面板
     */
    toggleDialogVisible(type: string, show: boolean | undefined, data: any) {
      this.widget.dialogType = type

      if (show === undefined) {
        this.widget.dialogVisible = !this.widget.dialogVisible
      } else {
        this.widget.dialogVisible = show
      }

      if (data) {
        this.widget.saveSettings(type as SettingType, data)
      }
    },

    // 切换开启或关闭筛选
    // handleFilterOn(newVal: boolean | string) {
    //   // this.widget.handleFilterChange("change_filter_on", {})
    //   this.widget.saveSettings(SettingType.Filters, {data:"null"})
    // },

    // 更改筛选模式 and 或 or
    handleFilterMode(newVal: string) {
      // this.widget.handleFilterChange("change_filter_mode", {
      //   filter_mode: newVal,
      // })
      this.widget.filterMode = newVal
      this.widget.saveSettings(SettingType.Filters, { data: "null" })
    },

    // 筛选条件变更
    // handleFilterCondition(val: any, saveFilters = false) {
    //   this.widget.handleFilterChange("change_filter_condition", {
    //     save_filters: saveFilters,
    //   })

    // 保存到思源笔记

    // 翻页
    handlePageChange(page: number) {
      this.widget.changePage(page)
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

    // const str = `[美国](siyuan://blocks/20210222174714-7hz5wop) [爱的艺术](https://book.douban.com/subject/3026879/)[美国2](siyuan://blocks/20210222174714-1234567)`

    // const a = Utils.parseBlockLink(str)
    // console.log(a)

    this.widget = new Widget()
    this.widget.init().then(() => {
      this.loadNotes()
    })
  },
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #444;
}

/* 首页布局 */
#header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding: 10px;
  margin-bottom: 15px;
}
.left,
.right {
  display: flex;
  align-items: center;
}
.right .el-button {
  font-weight: normal;
  color: grey;
}
.right .el-button,
.popover-item .el-button {
  font-weight: normal !important;
}

/* 右侧按钮间距 */
.el-button + .el-button {
  margin-left: 14px !important;
}
.widget_name {
  font-weight: bold;
  margin-right: 5px;
  cursor: pointer;
}

/* popover */
.el-popper .el-button {
  font-weight: normal !important;
}
.popover-item {
  min-height: 28px;
  display: flex;
  align-items: center;
  cursor: pointer;
}
.view-type-setting {
  display: none !important;
}
.popover-item:hover .view-type-setting {
  display: inline !important;
}
.attr_item {
  margin-bottom: 6px;
  min-height: 36px;
  cursor: pointer;
}
.attr_item_info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.attr_item_name {
  display: flex;
  align-items: center;
}
.attr_item_name .drag {
  width: 12px;
  height: 12px;
  margin-right: 4px;
  fill:#ccc;
}
.attr_item_name .drag:hover {
  cursor: pointer;
}
.attr_item_raw {
  color: #aaa;
  font-size: 12px;
  margin-left: 20px;
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

/* 筛选面板 */
.filter-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.filter-head .el-dropdown {
  vertical-align: middle;
}
.filter-head .el-button {
  height: inherit !important;
}
.filter-row {
  display: flex;
  margin: 8px 0;
  align-items: center;
}
.filter-row_item {
  margin-right: 4px;
}
/* 筛选项宽度 */
.filter-row_item_name .el-input {
  width: 120px;
}
/* 筛选运算符宽度 */
.filter-row_item_operator {
  flex-grow: 1;
  width: 90px;
}
/* .filter-row_item_operator .el-input {
  width: 90px;
} */
.filter-row_item_value {
  width: 160px;
  flex-shrink: 0;
}
.filter-row_item_value .el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 160px !important;
}
.filter-row_close {
  margin: 0 8px;
  cursor: pointer;
}

/* 通用 */

.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.flex-default {
  display: flex;
  align-items: center;
}

.divider {
  height: 1px;
  border-top: 1px solid #e5e5e5;
  margin: 10px 0;
}
/* 下拉选项 */
[popper-class="select_option"] {
  padding: 0 20px 0 10px !important;
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

/* 表格 */
/* 移除表格固定高度 23px */
.el-table .cell {
  line-height: inherit !important;
}
/* 表头字体不需要加粗 */
.el-table th {
  font-weight: normal;
}
/* 移除表格行悬浮时高亮 */
.el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell {
  background: none !important;
}
/* 单选或多选类型时的 el-tag 样式 */
.new_select_option:hover {
  background: #f5f5f5;
  cursor: pointer;
}
.tag-colors {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 5px;
}
.tag-colors-item_inner {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 40px;
  background: #efefef;
  margin: 5px;
  cursor: pointer;
}
.tag {
  border-radius: 2px;
  padding: 2px 5px;
  margin: 2px;
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

/* 图标 */
.icon {
  width: 14px;
  height: 14px;
  margin: 4px;
}
.icon path {
  fill: #aaa;
}


/* 表格中数字输入框文本左对齐 */
.table-view.el-input-number .el-input__inner {
  text-align: left;
}
</style>
