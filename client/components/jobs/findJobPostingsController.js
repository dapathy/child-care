/**
 * Created by tjdfa on 6/18/2016.
 */
import {JobPostings} from "../../../both/collections/jobPosting";
import * as Location from "../../../both/helpers/location";

const FORM_NAME = "jobPosting-filter-bar";

FindJobPostingsController = AppController.extend({
	waitOn: function () {
	},
	onAfterAction: function () {
		Meta.setTitle("Find Job Postings");
	},
	data: {}
});

Template.findJobPostings.onCreated(function() {
	this.selectedMaxDistanceReactive = new ReactiveVar(Location.DEFAULT_DISTANCE);
	this.jobPostingsReactive = new ReactiveArray([]);
	this.selectedChurchReactive = new ReactiveVar({name: "None"});
	this.churchesReactive = new ReactiveArray([]);
});

Template.findJobPostings.helpers({
	jobPostings: function() {
		let selectedChurch = Template.instance().selectedChurchReactive.get();
		if (selectedChurch.name === "None") {
			return Template.instance().jobPostingsReactive.get();
		}
		else {
			return Template.instance().jobPostingsReactive.get().filter(function(value) {
				return value.primaryChurch.id === selectedChurch.id;
			});
		}
	},
	JobPostingsCollection: () => JobPostings,
	selectedMaxDistance: function() {
		return Template.instance().selectedMaxDistanceReactive.get();
	},
	selectedChurch: function() {
		return Template.instance().selectedChurchReactive.get();
	},
	churches: () => Template.instance().churchesReactive.get()
});

Template.findJobPostings.events({
	// This will get called onCreate.
	"change #jobPosting-filter-bar": _.debounce(function(event, template) {
		findJobPostings(template);
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

		findJobPostings(template);
	}
});

function findJobPostings(template) {
	let oneTime = AutoForm.getFieldValue("oneTime", FORM_NAME);
	let startDate = AutoForm.getFieldValue("startDate", FORM_NAME);

	let searchCriteria = {
		oneTime: oneTime,
		maximumDistance: template.selectedMaxDistanceReactive.get()
	};
	if (startDate) searchCriteria.startDate = startDate;

	getJobPostings(template, searchCriteria);
}

function getJobPostings(template, searchCriteria){
	Meteor.call("findJobPostings", searchCriteria, function(error, response) {
		if (!error && response.result === "success") {
			template.jobPostingsReactive.set(response.data);
			setChurches(template, response.data);
		}
	});
}

function setChurches(template, data) {
	let churchMap = new Map();

	for (let post of data) {
		let church = post.primaryChurch;

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