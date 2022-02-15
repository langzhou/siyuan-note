<template>
    <div>dash</div>
</template>

<script>
export default {
  props:{
      data: null,
  },
  methods:{
        openNote(id) { window.open("siyuan://blocks/" + id, "_blank")},
  },
}
</script>