<template>
  <div >
    calendar
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue"
import Widget from "./../libs/Widget"
import * as Utils from "./../utils/common"
import { ClickOutside as vClickOutside } from "element-plus"
export default defineComponent({
  name: "CalendarView",
  props: {
    widget: Widget,
    notes: [] as any[], //笔记集合
    attributes: [] as any[],
  },

  data() {
    return {
      Utils: Utils,
      buttonRef: ref(),
      popoverRef: ref(),
      visible: false,
      name: "test",
      popover: {
        menu: {},
        submenu: {},
      },
    }
  },

})
</script>
