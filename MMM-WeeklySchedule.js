
/* Magic Mirror
 * Module: MMM_WeeklySchedule
 *
 * By Ulrich Pinsdorf
 * MIT Licensed.
 */

Module.register("MMM-WeeklySchedule", {

	defaults: {
		customCssFile: "MMM-WeeklySchedule.css",
		showWeekdayinHeader: true,
		updateInterval: 1 * 60 * 60 * 1000,     // 1 hour
		showNextDayAfter: "16:00",
		fadeSeed: 4000,
		debug: true
	},

	requiresVersion: "2.1.0", // Required version of MagicMirror

	/* start()
	 * Start module after all modules have been loaded
	 * by the MagicMirror framework
	 */
	start: function() {
		// Schedule update timer.
		var self = this;
		setInterval(function() {
			self.updateDom(self.config.fadeSpeed);
		}, this.config.updateInterval);

		this.loaded = true;		
	},

	/* getHeader()
	 * Create the module header. Regards configuration showWeekdayinHeader 
	 */
	getHeader: function() {
		var header = this.data.header;
		if(this.config.showWeekdayinHeader) {
			header += " " + this.translate("ON_DAY") + " " + this.getDisplayDate().format("dddd"); 
		}
		return header;
	},

	/* getDom()
	 * Create the DOM to show content
	 */
	getDom: function() {
		var date = this.getDisplayDate(); 

		// get day of week and access respective element in lessons array
		var dow = date.locale('en').format("ddd").toLowerCase();
		var lessons = this.config.schedule.lessons[dow];

		// no lessons today, we return default text
		if(lessons == undefined)
		{
			var wrapper = document.createElement("table");
			var tr = document.createElement("tr");
			var td = document.createElement("td");
			var text = document.createTextNode(
				this.translate("NO_LESSONS")
			); 
			td.className = "xsmall bright lesson";

			wrapper.appendChild(tr);
			tr.appendChild(td);
			td.appendChild(text);

			return wrapper;
		}

		// get timeslots
		var timeslots = this.config.schedule.timeslots;

		// build table with timslot definitions and lessons
		wrapper = document.createElement("table");
		for (let index = 0; index < lessons.length; index++) {
			const lesson = lessons[index];
			const time = timeslots[index];

			var row = document.createElement("tr");
			var tdtime = document.createElement("td");
			tdtime.className = "xsmall dimmed lessontime";

			var tdlesson = document.createElement("td");
			tdlesson.className = "xsmall bright lesson";

			tdtime.appendChild(
				document.createTextNode(time)
			);
			tdlesson.appendChild(
				document.createTextNode(lesson)
			);
			row.appendChild(tdtime);
			row.appendChild(tdlesson);

			wrapper.appendChild(row);
		}
		return wrapper;
	},

	getDisplayDate: function() {
		// check if config contains a threshold 'showNextDayAfter'
		if(this.config.showNextDayAfter) {
			var threshold = moment().startOf("day")
							.add(moment.duration(this.config.showNextDayAfter));
		} else {
			var threshold = moment().endOf("day");
		}
		
		// get the current time and increment by one day if threshold time has passed
		var now  = moment();
		if(now.isAfter(threshold)) {
			now = now.add(1, "day");
		}

		return now;
	},

	getScripts: function() {
		return ["moment.js"];
	},

	getStyles: function () {
		return [
			this.config.customCssFile
		];
	},

	getTranslations: function() {
		return {
				en: "translations/en.json",
				de: "translations/de.json"
		}
	}

});