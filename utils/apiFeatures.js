const Tour = require('../models/tourModel');
class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    const queryObject = { ...this.queryStr };

    //Extracting only "keys" of the data
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((field) => {
      delete queryObject[field];
    });

    //Advanced filter [Greater than, less than]
    let queryStr = JSON.stringify(queryObject);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => {
      return `$${match}`;
    });

    //convert back to JSON after modifying
    queryStr = JSON.parse(queryStr);
    this.query.find({ ...queryStr });
    return this;

    //basically and entire query object
    //   return this;
  }
  sort() {
    if (this.queryStr.sort) {
      let sortBy = this.queryStr.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }
  field() {
    //field limiting
    if (this.queryStr.fields) {
      let includingFields = this.queryStr.fields.split(',').join(' ');
      this.query = this.query.select(includingFields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }
  pagination() {
    const currentPage = this.queryStr.page * 1 || 1;
    const resultsPerPage = this.queryStr.limit || 3;
    const skip = resultsPerPage * (currentPage - 1);

    this.query = this.query.skip(skip).limit(resultsPerPage);
    return this;
  }
}

module.exports = APIFeatures;
