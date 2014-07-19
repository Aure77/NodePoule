var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

/**
* Schemas definitions
*/
var NewsSchema = new Schema({
  newsId: { type: Number, index: true },
  title : String,
  content : String,
  date : { type: Date, default: Date.now },
  iconRelPath : String
}, { collection: 'news' });

NewsSchema.plugin(mongoosePaginate);

NewsSchema.virtual('prettyDate').get(function () {
  return moment(this.date).format('DD/MM/YYYY');
});

/**
* Register schema
*/
mongoose.model('News', NewsSchema);