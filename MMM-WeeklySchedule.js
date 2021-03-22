
/* Magic Mirror
 * Module: MMM_WeeklySchedule
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
    var idx;
    var weekschedule;
    var dow;
    var lessons; 
    var timeslots;
    var row;
	
    // determine type of schedule (single vs multi)
    date = this.getDisplayDate();
	
    if (this.config.schedule) {
      // found a single schedule, it shall override multischedule
      weekschedule = this.config.schedule; 
    } else if (this.config.multischedule) {
      // we have a multi-schedule: let's first check if required parameters are present
      if (this.config.weekpattern === undefined) {
        return this.createTextOnlyDom('Error: no weekpattern defined');
      }
      if (this.config.startdate === undefined) {
        return this.createTextOnlyDom('Error: no startdate defined');
      }

      // fine, now we have to determine what is the right week
      idx = getWeekFromPattern(date, startdate, pattern);

      if (idx === undefined) {
        return this.createTextOnlyDom(
          this.translate('NO_LESSONS')
        );
      }
      weekschedule = this.config.multischedule[idx];
    } else {
      return this.createTextOnlyDom('Error: neither schedule nor multischedule defined in configuration');
    }

    // get day of week and access respective element in lessons array
    dow = date.locale('en').format('ddd').toLowerCase();
    lessons = weekschedule.lessons[dow];

    // no lessons today, we return default text
    if (lessons === undefined) {
      return this.createTextOnlyDom(
        this.translate('NO_LESSONS')
      );
    }

    // get timeslots
    timeslots = weekschedule.timeslots;

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

  getWeekFromPattern: function(today, startdate, pattern) {
    var m_today;
    var m_startdate;
    var index;

    // startdate of pattern is in future
    m_today = moment(today);
    m_startdate = moment(startdate, 'YYYY-MM-DD'); 

    if (m_today.isAfter(m_startdate)) {return undefined;}

    // no proper pattern defined
    if (pattern.length === 0) {return undefined;}

    // we iterate through weeks until we find today's week
    index = 0;

    while (m_startdate.isBefore(m_today, 'week')) {
      index = (index + 1) % pattern.length;
      m_startdate.add(1, 'week');
    }

    // and return the respective identifier from the pattern
    return pattern.charAt(index);
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
