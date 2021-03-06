const { SubscribeStatus } = require('../../enums');

class SubscribeData {

    constructor(subscribe) {
        const { id, indexId } = subscribe;
        this.id = id;
        this.indexId = indexId;
        this.creationDateTime = new Date();
        this.urlAddress = null;
        this.urlAddressCompare = null;
        this.textBoxFieldName = null;
        this.textBoxFieldValue = null;
        this.buttonFieldName = null;
        this.buttonFieldValue = null;
        this.status = SubscribeStatus.CREATE;
        this.resultDateTime = null;
        this.resultDetails = [];
    }
}

module.exports = SubscribeData;

/* const { CourseStatus, CourseType } = require('../../enums');

class CourseData {

    constructor(course) {
        const { id, postId, pageNumber, indexPageNumber, isFree, courseURL, udemyURL,
            udemyURLCompare, couponKey, courseURLCourseName, publishDate,
            indexDate, isSingleCourse } = course;
        this.id = id;
        this.postId = postId;
        this.creationDateTime = new Date();
        this.pageNumber = pageNumber;
        this.indexPageNumber = indexPageNumber;
        this.publishDate = publishDate;
        this.indexDate = indexDate;
        this.priceNumber = null;
        this.priceDisplay = null;
        this.courseURLCourseName = courseURLCourseName;
        this.udemyURLCourseName = null;
        this.type = isSingleCourse ? CourseType.SINGLE : CourseType.COURSES_LIST;
        this.isFree = isFree;
        this.courseURL = courseURL;
        this.udemyURL = udemyURL;
        this.udemyURLCompare = udemyURLCompare;
        this.couponKey = couponKey;
        this.status = CourseStatus.CREATE;
        this.resultDateTime = null;
        this.resultDetails = [];
    }
}

module.exports = CourseData; */