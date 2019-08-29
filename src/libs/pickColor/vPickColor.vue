<template>
    <div class="v-pick-color"
         ref="vPickColor"
        :style="{width: width, height: height}">
        <!--自定义内容-->
        <slot name="mark">
        
        </slot>
    </div>
</template>

<script>
    import "./js/jquery-1.4.4.min";
    import "./js/jquery.cxcolor";
    import "./css/jquery.cxcolor.css";
    export default {
        name: "vPickColor",
        props: [
            "width",
            'height',
            "defaultColor"   //初始颜色   #000000  16进制
        ],
        data(){
            return{
                pickColorBox: null,
                currentColor: "#000"
            }
        },
        created(){
            this.defaultColor && (this.currentColor = this.defaultColor)
        },
        mounted(){
            this.init();
        },
        methods: {
            init(){
                this.pickColorBox = $(this.$refs.vPickColor);
                this.pickColorBox.cxColor({
                    color: this.currentColor,
                    change: this.colorChange.bind(this)
                });
            },
            colorChange(colorHex){
                // todo 回调输出
                this.$emit('change', colorHex);
            }
        },
        beforeDestroy(){
            this.pickColorBox = null;
        }
    }
</script>

<style scoped>
    .v-pick-color{
        position: relative;
        width: 20px;
        height: 20px;
      /*  background: url("./img/cxcolor.png") no-repeat;
        background-size: 100% 100%;*/
    }
</style>
