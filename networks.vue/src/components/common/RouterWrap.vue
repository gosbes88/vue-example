<template>
    <div>
        <transition name="router" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
</template>

<style lang="less" rel="stylesheet/less">
    .router-enter, .router-leave-to {
        opacity: 0;
    }

    .router-enter-active, .router-leave-active {
        transition: all 0.3s;
    }
</style>