window.ContactView = Backbone.View.extend({
  events: {
    "change": "change",
    "click .save": "beforeSave",
    "click .delete": "deletecontact",
    "drop #picture": "dropHandler",
    'keyup :input': 'onKeyUp'
  },

  initialize: function () {
    this.card = new ContactListItemView({
      model: this.model,
      tagName: 'div'
    });
    this.render();
  },

  render: function () {
    var obj = this.model.toJSON();
    $(this.el).html(this.template(obj));
    $('.contact-card', this.$el).html(this.card.render().el);
    return this;
  },

  onKeyUp: function (event) {
    this.change(event);
  },

  change: function (event) {
    // Remove any existing alert message
    utils.hideAlert();

    // Apply the change to the model
    var target = event.target;
    var change = {};
    change[target.name] = target.value;
    this.model.set(change);

    // Run validation rule (if any) on changed item
    var check = this.model.validateItem(target.id);
    if (check.isValid === false) {
      utils.addValidationError(target.id, check.message);
    } else {
      utils.removeValidationError(target.id);
    }
  },

  beforeSave: function () {
    var self = this;
    var check = this.model.validateAll();
    if (check.isValid === false) {
      utils.displayValidationErrors(check.messages);
      return false;
    }
    this.savecontact();
    return false;
  },

  savecontact: function () {
    var self = this;
    console.log('before save');
    this.model.save(null, {
      success: function (model) {
        self.render();
        app.navigate('contacts/' + model.id, false);
        utils.showAlert('Success!', 'contact saved successfully', 'alert-success');
      },
      error: function (result) {
        var error = JSON.parse(arguments[1].responseText);
        console.log(error);
        utils.displayValidationErrors(error.errors || {});
        utils.showAlert('Error', 'An error occurred while trying to save this item. Please see the errors above.', 'alert-error');
      }
    });
  },

  deletecontact: function () {
    this.model.destroy({
      success: function () {
        alert('contact deleted successfully');
        window.history.back();
      }
    });
    return false;
  },

  dropHandler: function (event) {
    event.stopPropagation();
    event.preventDefault();
    var e = event.originalEvent;
    e.dataTransfer.dropEffect = 'copy';
    this.pictureFile = e.dataTransfer.files[0];

    // Read the image file from the local file system and display it in the img tag
    var reader = new FileReader();
    reader.onloadend = function () {
      $('#picture').attr('src', reader.result);
    };
    reader.readAsDataURL(this.pictureFile);
  }

});