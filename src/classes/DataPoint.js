export default class DataPoint {
    constructor(date = Date.now(), column, originalValue) {
        this.date = date;
        this.column = column;
        this.originalValue = originalValue
    }

    get value() {
        return [this.date.getTime(), this.originalValue / this.column.divisor]}
}