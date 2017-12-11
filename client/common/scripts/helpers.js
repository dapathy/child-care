import * as Helpers from '../../../both/helpers/helpers';
import {isSidebarEnabled} from '../../components/app/navbar';
import {ProfilePictures} from "../../../both/collections/images";

Template.registerHelper('truncate', function(string, length) {
  let cleanString = s(string).stripTags();
  return s(cleanString).truncate(length);
});

Template.registerHelper('sliceCollection', function(collection, beginning, limit) {
  return collection.slice(beginning * limit, beginning * limit + limit);
});

Template.registerHelper('isNonSeeker', function() {
  let user = Meteor.user();
  if (user) {
    return user.profile.userType !== 'seeker';
  }
});

Template.registerHelper('isCurrentUser', function() {
  let currentUser = Meteor.user().username;
  let profileUser = Router.current().params.user;
  return currentUser === profileUser;
});

Template.registerHelper('isEmailVerified', function() {
  let user = Meteor.user();
  if (user) {
    return user.emails[0].verified;
  }
});

Template.registerHelper('isNotHome', function() {
  return Iron.Location.get().path !== '/';
});

Template.registerHelper('shouldShowSidenav', function() {
  return isSidebarEnabled();
});

Template.registerHelper('formatDateUtc', function(date) {
  return Helpers.formatDateUtc(date);
});

Template.registerHelper('formatDateLocal', function(date) {
	return Helpers.formatDateLocal(date);
});

Template.registerHelper('pictureBaseURL', function() {
  return ProfilePictures.baseURL + '/id';
});