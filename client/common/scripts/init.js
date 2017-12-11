/**
 * Created by tjdfa on 1/31/2016.
 */

// Bootstrap 3 javascript
import "bootstrap-sass/assets/javascripts/bootstrap.js";

// ALERTS
toastr.options.closeButton = true;
toastr.options.closeHtml = '<button><i class="fa fa-times"></i></button>';
toastr.options.timeOut = 7000; // How long the toast will display without user interaction
toastr.options.extendedTimeOut = 10000; // How long the toast will display after a user hovers over it

// Global subscription manager.
SubscriptionManager = new SubsManager();

// Global form hook
AutoForm.addHooks(null, {
	// Called when any submit operation succeeds
	onSuccess: function(formType, result) {
		toastr.success("Changes saved successfully");
	},

	// Called when any submit operation fails
	onError: function(formType, error) {
		toastr.error("Changes were not successful");
	}
});