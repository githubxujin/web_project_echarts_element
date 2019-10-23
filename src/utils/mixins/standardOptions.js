import {
    RiskJudge,
    inputTypeOptions,
    judgeTypeOptions
} from '@/enum/operation-enum';
export const standardOptions = {
    data() {
        return {
            dialogLoading: false,
            RiskJudge,
            inputTypeOptions,
            unitTypeOptions: [], //单位列表
            judgeTypeOptions, //风险判断列表
            treeData: [],
            defaultProps: {
                children: 'childList',
                label: 'name',
                key: 'id',
                disabled: 'disabled'
            },
            ruleForm: {
                deviceTypeIdAndTopId: '', //设备类型
                paraName: '', //巡检参数
                checkMethod: '', //巡检方法
                riskJudge: 0, //风险判断
                inputType: 0, //输入类型
                unit: '', //单位ID
                riskAssess: 0, //风险评估
                standardValue: '', //标准值
                normalMax: '', //正常最大值
                normalMin: '', //正常最小值
                lowMax: '', //低风险最大值
                lowMin: '', //低风险最小值
                middleMax: '', //中风险最大值
                middleMin: '', //中风险最小值
                highMax: '', //高风险最大值
                highMin: '', //高风险最小值
                //文本量
                normalText: '', //正常描述文本
                abnormalText: '', //非正常描述文本
                lowText: '', //低风险描述文本
                middleText: '', //中风险描述文本
                highText: '' //高风险描述文本
            }
        };
    },
    methods: {
        validateStandard(rule, value, callback) {
            if (value === '') {
                callback(new Error('请输入标准值'));
            } else if (this.ruleForm.inputType == 2 && !value.isNumber()) {
                //输入类型为数值量时标准值必须是整数
                callback(new Error('请输入数字'));
            }
            callback();
        },
        //其它验证
        validateOther() {
            let res =
                this.validateRange(
                    this.ruleForm.normalMax,
                    this.ruleForm.lowMin,
                    this.ruleForm.lowMax
                ) &&
                this.validateRange(
                    this.ruleForm.normalMax,
                    this.ruleForm.middleMin,
                    this.ruleForm.middleMax
                ) &&
                this.validateRange(
                    this.ruleForm.normalMax,
                    this.ruleForm.highMin,
                    this.ruleForm.highMax
                ) &&
                this.validateRange(
                    this.ruleForm.normalMin,
                    this.ruleForm.lowMin,
                    this.ruleForm.lowMax
                ) &&
                this.validateRange(
                    this.ruleForm.normalMin,
                    this.ruleForm.middleMin,
                    this.ruleForm.middleMax
                ) &&
                this.validateRange(
                    this.ruleForm.normalMin,
                    this.ruleForm.highMin,
                    this.ruleForm.highMax
                ) &&
                this.validateRange(
                    this.ruleForm.lowMax,
                    this.ruleForm.normalMin,
                    this.ruleForm.normalMax
                ) &&
                this.validateRange(
                    this.ruleForm.lowMax,
                    this.ruleForm.middleMin,
                    this.ruleForm.middleMax
                ) &&
                this.validateRange(
                    this.ruleForm.lowMax,
                    this.ruleForm.highMin,
                    this.ruleForm.highMax
                ) &&
                this.validateRange(
                    this.ruleForm.lowMin,
                    this.ruleForm.normalMin,
                    this.ruleForm.normalMax
                ) &&
                this.validateRange(
                    this.ruleForm.lowMin,
                    this.ruleForm.middleMin,
                    this.ruleForm.middleMax
                ) &&
                this.validateRange(
                    this.ruleForm.lowMin,
                    this.ruleForm.highMin,
                    this.ruleForm.highMax
                ) &&
                this.validateRange(
                    this.ruleForm.middleMax,
                    this.ruleForm.lowMin,
                    this.ruleForm.lowMax
                ) &&
                this.validateRange(
                    this.ruleForm.middleMax,
                    this.ruleForm.normalMin,
                    this.ruleForm.normalMax
                ) &&
                this.validateRange(
                    this.ruleForm.middleMax,
                    this.ruleForm.highMin,
                    this.ruleForm.highMax
                ) &&
                this.validateRange(
                    this.ruleForm.middleMin,
                    this.ruleForm.lowMin,
                    this.ruleForm.lowMax
                ) &&
                this.validateRange(
                    this.ruleForm.middleMin,
                    this.ruleForm.normalMin,
                    this.ruleForm.normalMax
                ) &&
                this.validateRange(
                    this.ruleForm.middleMin,
                    this.ruleForm.highMin,
                    this.ruleForm.highMax
                ) &&
                this.validateRange(
                    this.ruleForm.highMax,
                    this.ruleForm.lowMin,
                    this.ruleForm.lowMax
                ) &&
                this.validateRange(
                    this.ruleForm.highMax,
                    this.ruleForm.middleMin,
                    this.ruleForm.middleMax
                ) &&
                this.validateRange(
                    this.ruleForm.highMax,
                    this.ruleForm.normalMin,
                    this.ruleForm.normalMax
                ) &&
                this.validateRange(
                    this.ruleForm.highMin,
                    this.ruleForm.lowMin,
                    this.ruleForm.lowMax
                ) &&
                this.validateRange(
                    this.ruleForm.highMin,
                    this.ruleForm.middleMin,
                    this.ruleForm.middleMax
                ) &&
                this.validateRange(
                    this.ruleForm.highMin,
                    this.ruleForm.normalMin,
                    this.ruleForm.normalMax
                );
            return res;
        },
        /**
         * 验证指定值是否在范围内
         * @param {*} val 指定值
         * @param {*} start 最小值
         * @param {*} end 最大值
         */
        validateRange(val, start, end) {
            let flag = true;
            let valF = parseFloat(val);
            if (valF >= parseFloat(start) && valF <= parseFloat(end)) {
                flag = false;
            }
            return flag;
        }
    }
};
