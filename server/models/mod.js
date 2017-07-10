
const mongoose = require('mongoose');
const Promise = require('bluebird');

const widgetSchema = mongoose.Schema({
  color: String
});

widgetSchema.methods = {
  foo() {
	  return 'bar'
  }
}

widgetSchema.statics.b = function() {
	// return Promise.resolve()
	return Promise.cast(this.findOne().exec())
	.then(function(){
		return 1
	})
}

module.exports = mongoose.model('Widget', widgetSchema);

module.exports.a = function() {
	return 123;
}

