<template>
    <div class="step">
        <ol class="steps">
            <li :class="[activeIndex >= index ? 'step-active' : '']" v-for="(item, index) in items">
                <div class="step-content">
                    <div :class="['step-text', activeIndex >= index ? 'activeText' : '']">{{item.text}}</div>
                    <div class="step-round" :style="activeIndex >= 0?roundStyle:''" v-if="activeIndex >= index">
                        <div></div>
                    </div>
                    <div class="step-dot" v-else></div>
                </div>
            </li>
        </ol>
    </div>
</template>

<script>
    export default {
        name: "steps",
        props: {
            items: {
                type: Array,
                required: true
            },
            activeIndex: {
                type: Number,
                default: 0,
                required: true
            }
        },
        data(){
            return{
                roundStyle: {marginLeft:'0'}
            }
        }
    }
</script>

<style lang='scss' scoped>
    ol.steps{
        list-style: none;
        display: flex;
        height: 64px;
        margin: 0;
        padding-left: 5px;
    }
    ol.steps li .step-content .step-dot{
        margin-left: 11px;
    }
    ol.steps li{
        flex: 1;
        position: relative;
        z-index: 0;
        &::before{
            content:'';
            position:absolute;
            left: -155px;
            right: 150px;
            top:35px;
            height:2px;
            background-color:#EDEDED;
            z-index: -99;
        }
        &:first-child::before{
            content:none;
        }
        &:last-child .step-content .step-dot{
            margin-left: 28px;
        }
        &:last-child .step-content .step-text{
            margin-left: 0;
        }
        &:last-child .step-content .step-round{
            margin-left: 10px !important;
        }
        &.step-active::before{
            background-color: #CF2F2C;
        }
        &.step-active .step-content{
            .step-round{
                width: 26px;
                height: 26px;
                border-radius: 50%;
                padding-top: 6px;
                margin-left: 10px;
                background: #FAFAFA;
                box-shadow: 0 1px 6px 3px rgba(225,230,235,0.64);
                text-align: center;
            }
        }
        &.step-active .step-content .step-round{
            div{
                width: 14px;
                height: 14px;
                margin: 0 auto;
                border-radius: 50%;
                background: #CF2F2C;
            }
        }
        .step-content .step-dot{
            width: 14px;
            height: 14px;
            border-radius: 50%;
            margin-top: 16px;
            background: #EDEDED;
        }
        .step-text{
            font-size: 12px;
            color: #B4B4B4;
            margin-bottom: 8px;
            margin-left: -18px;
        }
        .activeText{
            color: #282828;
        }
    }
</style>