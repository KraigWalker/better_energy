/**
	File:		eqtr_main.css
	Created:	***24th September 2014***
	Author:		***Kraig Walker***

	Notes:
			Need to make the whole <li> the 'is-selected' class
*/


    		* give the whole <li> element the 'is-selected' css class.
     * Tabs
     * @description Keyboard and screen reader accessible tabs.
     * @constructor
     * @param element
     */
    var Tabs = function(element) {
        this.target = element;
        this.tabs = element.getElementsByTagName('a');		// get every <a> tag
        this.panels = [];		// Store the panel content

        // for each tab we found, change the <a>'s URL hash to ''
        for (var i = 0, len = this.tabs.length; i < len; i++) {
            this.panels.push( document.getElementById(this.tabs[i].hash.replace('#', '')) );
        }
        // Create tabs (if tabs have already been created, active will exist)
        if (this.active === undefined) {
            this.init();
        }
    };

    /**
     * Init
     */
    Tabs.prototype.init = function() {
        var self = this;

        // Give the parent element we called this upon the aria role "tablist"
        this.target.setAttribute('role', 'tablist');

        this.clickListener = function(e) {
            var target = e.srcElement || e.target;

            if (target  && target.nodeName.toLowerCase() === 'a') {

                if (e.preventDefault) {		// if we can prevent default, do it!
                    e.preventDefault();
                }
                else {	// Livin' in a pre-preventDefault world
                    e.returnValue = false;
                }
                // Not to be confused with the jQuery toggle...
                // Set the active tab to the one that's been clicked (ie, this)
                self.toggle(target);
            }
        };

        // Wouldn't make much sense if we made a tabbed content widget wth all
        // these cool accessible roles and stuff and NOT allow keyboard control
        this.keyupListener = function(e) {
            var tab;

            // Right key
            if (e.keyCode === 39 && self.active.index < self.tabs.length) {
                tab = self.tabs[self.active.index + 1];
            }

            // Left key
            else if (e.keyCode === 37 && self.active.index > 0) {
                tab = self.tabs[self.active.index - 1];
            }

            if (tab) {
                tab.focus();
                self.toggle(tab);
            }
        };

        // For each tab (we keep counting down until i is at index 0)
        // Working from the last tab to the first
        var i;
        for ( i = this.tabs.length - 1; i >= 0; i--) {
            var tab = this.tabs[i];
            var panel = this.panels[i];

            var preSelected = tab.className.indexOf('is-selected') > -1;
            // selected = true if this.active is false & we have preSelected &
            // i is at the first tab (index[0])
            // else selected = false
            var selected = ! this.active && (preSelected || i === 0);

            // Apply the ARIA roles of each tab.
            tab.setAttribute('role', 'tab');
            tab.setAttribute('aria-selected', selected);	// true/false

            // <a href="#panel-01"> == aria-controls="panel-01"
            tab.setAttribute('aria-controls', this.tabs[i].hash.replace('#', ''));

            // Apply the ARIA roles to each tab's content panel
            //panel.setAttribute('role', 'tabpanel');
            panel.setAttribute('aria-hidden', !selected);	// only hide if not selected
            // Add CSS styles to each panel
            panel.className += 'panel';

            // if the current tab we've created is the one to be 'selected'
            if (selected) {

                if (!preSelected) {
                    tab.className+= ' is-selected ';
                }
                // Create and set the initial properties of the active object
                // this lets us check what tab is currently... active...
                // try console.log(Tabs.active);
                this.active = {
                    tab: tab,
                    index: i,
                    panel: panel
                };
            }
            else {	// our panel is not initially selected, so it's hidden
                panel.style.display = 'none';
            }
        }
        // create an event listener for this tab
        // Modern browser
        if (this.target.addEventListener) {
            this.target.addEventListener('click', this.clickListener, false);
            this.target.addEventListener('keyup', this.keyupListener, false);
        }
        else {		// Ye olde IEe
            this.target.attachEvent('onclick', this.clickListener);
            this.target.attachEvent('onclick', this.keyupListener);
        }

    };

    /**
     * Toggle
     * @param {Object} tab
     */
    Tabs.prototype.toggle = function(tab) {
        var panel = document.getElementById(tab.hash.replace('#', ''));

        // strip the existing 'active' tab of it's activeness
        this.active.tab.className = this.active.tab.className.replace('is-selected', '');
        this.active.tab.setAttribute('aria-selected', false);

        this.active.panel.style.display = 'none';
        this.active.panel.setAttribute('aria-hidden', true);

        // display the current tab's content, and set as 'is-selected'
        tab.className+= ' is-selected ';
        tab.setAttribute('aria-selected', true);

        panel.style.display = '';
        panel.setAttribute('aria-hidden', false);

        // Find tab index
        for (var i = 0, len = this.tabs.length; i < len; i++) {
            if (tab === this.tabs[i]) {
                break;
            }
        }
        // Change active values to that of the current tab
        this.active.tab = tab;
        this.active.index = i;
        this.active.panel = panel;
    };

// create a set of tabs on our page
// TODO replace with IE6 compatible selector
document.addEventListener("DOMContentLoaded", function(event) {
    console.log("DOM fully loaded and parsed");
    var instance = new Tabs( document.querySelector('[data-directive=tabs]') );
  });
//var instance = new Tabs( document.querySelector('[data-directive=tabs]') );
