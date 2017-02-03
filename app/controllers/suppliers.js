import Ember from 'ember';

export default Ember.Controller.extend({
  application: Ember.inject.controller(),
  activityController: Ember.inject.controller(),
  view: true,
  editMode: false,
  supplier: null,

  clear: function(){
    if(this.get("supplier")) {
      if (!this.get("supplier.id")) {
        this.get("supplier").deleteRecord();
      }
    }
    this.set("view", true);
    this.set("supplier", null);
    this.set("editMode", false);
  },

  actions:{
    new: function(){
      this.set("supplier", this.store.createRecord("supplier"));
      this.set("view", false);
    },
    back: function(){
      this.clear();
    },
    save: function(){
      let controller = this;
      if(controller.get("supplier.name") && controller.get("supplier.tradingName") && controller.get("supplier.tradingAddress") && controller.get("supplier.contact")){

        if(controller.get("supplier.returnsAddress") === ""){
          controller.set("supplier.returnsAddress", controller.get("supplier.tradingAddress"));
        }

        this.get("supplier").save().then(function(){
          controller.set("application.message", "Success!");
          controller.get("activityController").set("Added " + controller.get("supplier.name"));
          controller.clear();
        });
      }
      else{
        controller.set("application.message", "Please fill in all required fields");
      }
    },
    delete: function(supplier){
      if(confirm("You are about to remove "+ supplier.get("name"))){
        let controller = this;
        controller.get("activityController").set("Deleted " + controller.get("supplier.name"));
        supplier.destroyRecord().then(function(){
          controller.set("application.message", "Supplier Removed");
        });
      }
    },
    select: function(supplier){
      this.set("editMode", true);
      this.set('view', false);
      this.set("supplier", supplier);
    },
    update: function(){
      let controller = this;

      if(controller.get("supplier.name") && controller.get("supplier.tradingName") && controller.get("supplier.tradingAddress") && controller.get("supplier.contact")) {
        this.get("supplier").save().then(function () {
          controller.set("application.message", "Updated Supplier");
          controller.get("activityController").set("Updated " + controller.get("supplier.name"));
        });
      }else{
        controller.set("application.message", "Please fill in all required fields");
      }
    }
  }
});