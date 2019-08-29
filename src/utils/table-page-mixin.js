/*******废弃****** */
export default {
    data() {
        return {
            tableHeight: 400,
            pager: {
                total: 0,
                page: 1,
                rows: 15
            }
        };
    },
    mounted() {
        // 重置table高度
        this.resetTableHeight();
        // 监听窗口大小变化事件
        window.addEventListener('resize', this.resetTableHeight);
    },
    methods: {
        resetTableHeight() {
            // 重置table高度
            this.$nextTick(function() {
                const tableHeight =
                    window.innerHeight - this.$refs.table.$el.offsetTop - 350;
                this.tableHeight = tableHeight < 200 ? 200 : tableHeight;
            });
        },
        indexMethod(index) {
            // 序号
            return (this.pager.page - 1) * this.pager.rows + index + 1;
        }
    },
    beforeDestroy() {
        // 移除监听窗口大小变化事件
        window.removeEventListener('resize', this.resetTableHeight);
    }
};
