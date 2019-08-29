import moment from 'moment';
//设定moment区域为中国
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

let dateFunc = {
    getMonthViewStartDate(date, firstDay) {
        firstDay = parseInt(firstDay);
        let start = moment(date);
        let startOfMonth = moment(start.startOf('month'));

        start.subtract(startOfMonth.day(), 'days');

        if (startOfMonth.day() < firstDay) {
            start.subtract(7, 'days');
        }

        start.add(firstDay, 'days');

        return start;
    },
    getMonthViewEndDate(date) {
        return this.getMonthViewStartDate().add(6, 'weeks');
    }
};

export default dateFunc;
