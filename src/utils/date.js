class DateHandler {

    constructor() {
        this.today = new Date();
        this.todayStr = this.today.toDateString();
        this.days = [
            "Sun",
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat"
        ];

        this.months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
        ];
    }

    isEqual(lhs, rhs) {
        return (
          lhs.getFullYear() === rhs.getFullYear() &&
          lhs.getMonth() === rhs.getMonth() &&
          lhs.getDate() === rhs.getDate()
        );
      }

    convertForHuman(iso) {
        let dateObj = new Date(iso);
        if (this.isEqual(dateObj, this.today)) {
            return "Today";
        }
        
        let day = this.days[dateObj.getDay()];
        let date = dateObj.getDate();
        let month = this.months[dateObj.getMonth()];

        return day + " " + date + this.getOrdinal(date) + " " + month;
    }

    convertTaskListForHuman(tasks) {
        for (let i = 0; i < tasks.length; i++) {
            tasks[i]['date-formatted'] = this.convertForHuman(tasks[i]['date']);
        }

        return tasks;
    }

    getOrdinal(date) {
        if (date > 20 || date < 4) {
            switch (date % 10) {
                case 1:
                    return "st";
                case 2:
                    return "nd";
                case 3:
                    return "rd";
            }
        }

        return "th";
    }

}

module.exports = DateHandler;