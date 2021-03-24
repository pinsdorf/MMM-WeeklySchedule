/* Magic Mirror
 * Module: MMM-WeeklySchedule
 *
 * By Ulrich Pinsdorf
 * MIT Licensed.
 */

Module.register('MMM-WeeklySchedule', {

  defaults: {
    customCssFile: 'MMM-WeeklySchedule.css',
    showWeekdayinHeader: true,
    updateInterval: 1 * 60 * 60 * 1000, // 1 hour
    showNextDayAfter: '16:00',
    fadeSpeed: 4000,
    allowHTML: false,
    debug: true
  },

  requiresVersion: '2.1.0', // Required version of MagicMirror

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

    if (this.config.showWeekdayinHeader) {
      header += ' ' + this.translate('ON_DAY') + ' ' + this.getDisplayDate().format('dddd'); 
    }
    return header;
  },

  /* getDom()
	 * Create the DOM to show content
	 */
  getDom: function() {
    var date; 
    var weekschedule;
    var lessons; 
    var timeslots;
    var row;
    var errormsg;
	
    // determine type of schedule (single vs multi) and collect parameters
    if (this.config.schedule) {
      weekschedule = new SimpleSchedule();
      weekschedule.timeslots = this.config.schedule.timeslots; 
      weekschedule.lessons = this.config.schedule.lessons; 
    } else if (this.config.multischedule) {
      weekschedule = new MultiSchedule();
      weekschedule.timeslots = this.config.schedule.timeslots; 
      weekschedule.lessons = this.config.schedule.lessons;
      weekschedule.startdate = this.config.schedule.startdate;
      weekpattern.pattern = this.config.schedule.pattern; 
    } else {
      return this.createTextOnlyDom('MMM-WeeklySchedule: neither schedule nor multischedule defined in configuration');
    }

    // check parameters
    errormsg = weekpattern.checkParametersMsg();
    if (errormsg) {
      return this.createTextOnlyDom('MMM-WeeklySchedule: ' + errormsg);
    }

    // get today's data or tomorrow's data if too late in the day
    date = this.getDisplayDate();
    lessons = weekschedule.lessons(date);
    timeslots = weekschedule.timeslots(date);

    // no lessons today, we return default text
    if (lessons === undefined) {
      return this.createTextOnlyDom(this.translate('NO_LESSONS'));
    }

    // build table with timeslot definitions and lessons
    wrapper = document.createElement('table');
    for (let index = 0; index < lessons.length; index++) {
      const lesson = lessons[index];
      const time = timeslots[index];

      // only create a row if the timeslot's lesson is defined and not an empty string
      if (lesson) {
        row = this.createTimetableRow(time, lesson); 
        wrapper.appendChild(row);
      }
    }
    return wrapper;
  },

  getDisplayDate: function() {
    var threshold; 
    var now; 

    // check if config contains a threshold 'showNextDayAfter'
    if (this.config.showNextDayAfter) {
      threshold = moment().startOf('day')
        .add(moment.duration(this.config.showNextDayAfter));
    } else {
      threshold = moment().endOf('day');
    }
		
    // get the current time and increment by one day if threshold time has passed
    now = moment();

    if (now.isAfter(threshold)) {
      now = now.add(1, 'day');
    }

    return now;
  },

  createTextOnlyDom: function(str) {
    var wrapper = document.createElement('table');
    var tr = document.createElement('tr');
    var td = document.createElement('td');
    var text = document.createTextNode(str); 

    td.className = 'xsmall bright lesson';

    wrapper.appendChild(tr);
    tr.appendChild(td);
    td.appendChild(text);

    return wrapper;
  },

  createTimetableRow: function(time, lesson) {
    var row;
    var tdtime;
    var tdlesson;

    row = document.createElement('tr');
    tdtime = document.createElement('td');
    tdtime.className = 'xsmall dimmed lessontime';
    if (this.config.allowHTML) {
      tdtime.innerHTML = time;
    } else {
      tdtime.appendChild(
        document.createTextNode(time)
      );
    }
    row.appendChild(tdtime);

    tdlesson = document.createElement('td');
    tdlesson.className = 'xsmall bright lesson';
    if (this.config.allowHTML) {
      tdlesson.innerHTML = lesson;
    } else {
      tdlesson.appendChild(
        document.createTextNode(lesson)
      );
    }
    row.appendChild(tdlesson);

    return row;
  },

  getScripts: function() {
    return ['moment.js'];
  },

  getStyles: function () {
    return [
      this.config.customCssFile
    ];
  },

  getTranslations: function() {
    return {
      'da': 'translations/da.json',
      'de': 'translations/de.json',
      'en': 'translations/en.json',
      'fr': 'translations/fr.json',
      'he': 'translations/he.json',
      'hu': 'translations/hu.json',
      'nb': 'translations/nb.json',
      'nn': 'translations/nn.json',
      'pl': 'translations/pl.json',
      'sv': 'translations/sv.json',
      'zh-cn': 'translations/zh-cn.json'
    };
  }

});
