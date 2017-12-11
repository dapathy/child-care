/**
 * Created by tjdfa on 5/14/2017.
 */
Template.pageify.onCreated(function() {
	this.currentPageReactive = new ReactiveVar(0);
});

Template.pageify.helpers({
	currentPage: () => Template.instance().currentPageReactive.get(),
	isLastPage: function(collectionLength, limit) {
		return collectionLength <= (Template.instance().currentPageReactive.get() + 1) * limit;
	}
});

Template.pageify.events({
	'click #next-review': function(event, template) {
		template.currentPageReactive.set(template.currentPageReactive.get() + 1);
	},
	'click #previous-review': function(event, template) {
		template.currentPageReactive.set(template.currentPageReactive.get() - 1);
	}
});