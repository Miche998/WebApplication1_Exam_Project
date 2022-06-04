function Survey(id, title, aId, responses = 0) {
    this.id = id;
    this.title = title;
    this.aId = aId;
    this.responses = responses;
}

module.exports = {Survey};