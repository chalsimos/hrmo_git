module.exports = {
    getDaysInMonth: function(month, year) {
        const one = ["01", "03", "05", "07", "08", "10", "12"];
        return one.includes(month) ? 31 : (month === "02" ? (isLeapYear(year) ? 29 : 28) : 30);
    },
    
    isLeapYear: function(year) {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    },
    
    getScheduledTime: function(schedule) {
        switch (schedule) {
            case '7AM': return new Date('1970-01-01T07:00:00');
            case '9AM': return new Date('1970-01-01T09:00:00');
            default: return new Date('1970-01-01T08:00:00');
        }
    }
};