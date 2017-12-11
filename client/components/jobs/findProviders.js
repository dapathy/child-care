/**
 * Created by tjdfa on 7/17/2016.
 */
import * as Location from "../../../both/helpers/location";

const FORM_NAME = "provider-filter-bar";

FindProvidersController = AppController.extend({
	waitOn: function () {

	},
	onAfterAction: function () {
		Meta.setTitle("Find Providers");
	},
	data: {}
});

Template.findProviders.onCreated(function() {
	this.selectedMaxDistanceReactive = new ReactiveVar(Location.DEFAULT_DISTANCE);
	this.providersReactive = new ReactiveArray([]);
	this.selectedChurchReactive = new ReactiveVar({name: "None"});
	this.churchesReactive = new ReactiveArray([]);
});

Template.findProviders.onRendered(function() {
	let self = this;
	getProviders(self);
});

Template.findProviders.helpers({
	providers: function() {
		let selectedChurch = Template.instance().selectedChurchReactive.get();
		if (selectedChurch.name === "None") {
			return Template.instance().providersReactive.get();
		}
		else {
			return Template.instance().providersReactive.get().filter(function(value) {
				return value.profile.primaryChurch.id === selectedChurch.id;
			});
		}
	},
	selectedMaxDistance: function() {
		return Template.instance().selectedMaxDistanceReactive.get();
	},
	selectedChurch: function() {
		return Template.instance().selectedChurchReactive.get();
	},
	churches: () => Template.instance().churchesReactive.get()
});

Template.findProviders.events({
	// This doesn't get called onCreate for some reason.
	"change #provider-filter-bar": _.debounce(function(event, template) {
		findProviders(template);
	}, 300),
	"click #church-dropdown li a": function(event, template) {
		if (event.currentTarget.text === "None") {
			template.selectedChurchReactive.set({name: "None"});
			return;
		}

		let selectedChurch = this;
		template.selectedChurchReactive.set(selectedChurch);
	},
	"click #max-distance-dropdown li a": function(event, template) {
		let selectedDistance = Number(event.currentTarget.childNodes[0].innerText);
		template.selectedMaxDistanceReactive.set(selectedDistance);

		findProviders(template);
	}
});

function findProviders(template) {
	let gender = AutoForm.getFieldValue("profile.providerProfile.gender", FORM_NAME);

	let searchCriteria = {
		maximumDistance: template.selectedMaxDistanceReactive.get()
	};
	if (gender) searchCriteria.gender = gender;

	getProviders(template, searchCriteria);
}

function getProviders(template, searchCriteria) {
	Meteor.call("findProviders", searchCriteria, function(error, response) {
		if (!error && response.result === "success") {
			template.providersReactive.set(response.data);
			setChurches(template, response.data);
		}
	});
}

function setChurches(template, data) {
	let churchMap = new Map();

	for (let provider of data) {
		let church = provider.profile.primaryChurch;

		let value = churchMap.get(church.id);
		if (value) {
			++value.count;
			churchMap.set(church.id, value);
		} else {
			church["count"] = 1;
			churchMap.set(church.id, church);
		}
	}

	let churches = [];
	churchMap.forEach(function(value, key) {
		churches.push(value);
	});

	churches.sort(function(a, b) {
		return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
	});

	template.churchesReactive.set(churches);
}