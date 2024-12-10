<script setup lang="ts">
import { Outlet } from 'swico';
</script>

<template>
    <div>
        example示例页
        <!--   子路由组件在此渲染-->
        <Outlet />
    </div>
</template>

<style scoped lang="less"></style>
