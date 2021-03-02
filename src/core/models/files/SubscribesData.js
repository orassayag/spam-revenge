class SubscribesData {
    constructor() {}
}

module.exports = SubscribesData;

/* const { CourseStatus } = require('../../enums');

class CoursesData {

	constructor() {
		this.coursesList = [];
		this.totalPurchasedCount = 0;
		this.totalPriceNumber = 0;
		this.totalCreateCoursesCount = 0;
		this.totalPagesCount = 0;
		this.totalSingleCount = 0;
		this.totalCourseListCount = 0;
		this.courseIndex = null;
		this.course = null;
		const keysList = Object.values(CourseStatus);
		for (let i = 0; i < keysList.length; i++) {
			this[`${keysList[i]}Count`] = 0;
		}
	}

	updateCount(isAdd, counterName, count) {
		const fieldName = `${counterName}Count`;
		if (Object.prototype.hasOwnProperty.call(this, fieldName)) {
			if (isAdd) { this[fieldName] += count; } else { this[fieldName] -= count; }
		}
	}
}

module.exports = CoursesData; */