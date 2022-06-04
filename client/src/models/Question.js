function Question(id, title,sId, type, min, max) {
    this.id = id;
    this.title = title;
    this.sId =  sId;
    this.type = type;
    this.min = min;
    this.max = max;
}

module.exports = {Question};