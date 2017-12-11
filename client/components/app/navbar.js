/**
 * Created by tjdfa on 5/6/2016.
 */

Template.sidebar.onRendered(function() {
	initMenu();
	stickyScroll();
	setHeight();
	closeOnClick();
});

Template.sidebar.helpers({
	isItemActive: function(segment) {
		let path = Router.routes[segment].getName();
		let currentRoute = Router.current().route.getName();
		return path === currentRoute;
	}
});

Template._header.events({
	'click #menu-toggle': function(event, template) {
		event.preventDefault();
		$("#wrapper").toggleClass("toggled");
	},
	'click #-menu-toggle-2': function(event) {
		event.preventDefault();
		$("#wrapper").toggleClass("toggled-2");
		$('#menu ul').hide();
	}
});

function closeOnClick() {
	$('#menu').on('click', '.sidebar-item', function() {
		// Only close if in collapse mode.
		if ($("#menu-toggle").css("display") !== "none") {
			$("#menu-toggle").click();
		}
	});
}

function setHeight() {
	const navbarHeight = 65;
	let sidebar = $("#sidebar-wrapper");

	$(window).on("load resize scroll", function() {
		let windowHeight = $(window).height();
		let scrollTop = $(window).scrollTop();
		if (scrollTop < navbarHeight) {
			sidebar.height(windowHeight - navbarHeight + scrollTop);
		}
		else {
			sidebar.height(windowHeight);
		}
	});
}

function stickyScroll() {
	let sidebar = $("#sidebar-wrapper");

	// I guess the element can be empty at some point...
	if (!sidebar.length) return;

	let top = sidebar.offset().top;
	let maxTop = $("#navbar").offset().bottom;

	let scrollHandler = function(){
		let scrollTop = $(window).scrollTop();
		if (scrollTop <= top) {
			sidebar.css({position: "absolute", top: ""});
		} else if (scrollTop >= maxTop) {
			sidebar.css({position: "absolute", top:(maxTop + "px")})
		} else {
			sidebar.css({position: "fixed", top: "0px"})
		}
	};

	$(window).scroll(scrollHandler);
	scrollHandler();
}

function initMenu() {
	$('#menu ul').hide();
	$('#menu ul').children(".current").parent().show();
	//$('#menu ul:first').show();
	$('#menu li a').click(
		function() {
			let checkElement = $(this).next();
			if((checkElement.is('ul')) && (checkElement.is(':visible'))) {
				return false;
			}
			if((checkElement.is('ul')) && (!checkElement.is(':visible'))) {
				$('#menu ul:visible').slideUp('normal');
				checkElement.slideDown('normal');
				return false;
			}
		}
	);
}

// This is pretty ugly, but it should work.
// Also home ('/'), but that screws up the logic when included in the list.
const pathsWithoutSidebar = ['/registration', '/sign-in', '/change-password', '/forgot-password', '/enroll-account', '/reset-password', '/sign-up', '/verify-email', '/send-again'];
export function isSidebarEnabled() {
	let path = Iron.Location.get().path;
	return !pathsWithoutSidebar.some(p => path.includes(p)) && path != '/';
}