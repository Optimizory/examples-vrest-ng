window.ContactListView = Backbone.View.extend({

  initialize: function () {
    this.render();
  },

  render: function () {
    var contacts = this.model.models;
    var len = contacts.length;
    var startPos = (this.options.page - 1) * 8;
    var endPos = Math.min(startPos + 8, len);

    $(this.el).html('<ul class="thumbnails"></ul>');

    for (var i = startPos; i < endPos; i++) {
      $('.thumbnails', this.el).append(new ContactListItemView({
        model: contacts[i]
      }).render().el);
    }

    $(this.el).append(new Paginator({
      model: this.model,
      page: this.options.page
    }).render().el);

    return this;
  }
});

window.ContactListItemView = Backbone.View.extend({

  tagName: "li",
  events: {
    'click': 'onCardClick'
  },

  initialize: function () {
    this.model.bind("change", this.render, this);
    this.model.bind("destroy", this.close, this);
  },

  render: function () {
    var obj = this.model.toJSON();
    if (!obj._id) { //if new card
      if (!obj.name) obj.name = 'Your Name';
      if (!obj.aboutMe) obj.aboutMe = 'About me section';
      if (!obj.email) obj.email = 'Email ID';
      if (!obj.designation) obj.designation = 'Designation';
      if (!obj.organization) obj.organization = 'Organization Name';
      if (!obj.country) obj.country = 'Country Name';
      if (!obj.linkedInId) obj.linkedInId = ' ';
      if (!obj.githubId) obj.githubId = ' ';
      if (!obj.facebookId) obj.facebookId = ' ';
      if (!obj.twitterId) obj.twitterId = ' ';
    }
    this.$el.html(this.template(obj));
    return this;
  },

  onCardClick: function (event) {
    var target = $(event.target);
    if (target.hasClass("social-link")) {
      return false;
    } else if (target.hasClass('switcher')) {
      var cardEl = target.closest('.ih-item');
      cardEl.toggleClass('hover');
      return false;
    } else {
      app.navigate('contacts/' + this.model.id, true);
    }
  }
});