class Schedule {    

  constructor(schedule) {
    this._schedule = schedule;
  }

  get schedule() {
    return this._schedule;
  }

  set schedule(val) {
    this._schedule = val;
  }

  checkParametersMsg() {
    if (this._schedule === undefined) {
      return 'no schedule defined';
    }
    if (this._schedule.lessons === undefined) {
      return 'no lessons defined';
    }
    if (this._schedule.timeslots === undefined) {
      return 'no timeslots defined';
    }
  }

  getTodaysLessons(date) {
    var dow = moment(date).locale('en').format('ddd').toLowerCase(); // 'sun', 'mon', 'tue', ...

    return this._schedule.lessons[dow];
  }

  getTodaysTimeslots(date) {
    return this._schedule.timeslots;
  }
}

class MultiWeekSchedule extends Schedule {
  constructor(schedule, startdate, pattern) {
    super(schedule);
    this._startdate = moment(startdate);
    this._pattern = pattern;
  }

  get schedule() {
    return this._schedule;
  }

  set schedule(val) {
    this._schedule = val;
  }

  get startdate() {
    if (this._startdate === undefined) {return undefined;} else {return this._startdate;}
  }

  set startdate(val) {
    this._startdate = val;
  }

  get pattern() {
    return this._pattern;
  }

  set pattern(val) {
    this._pattern = val;
  }

  checkParametersMsg() {
    if (this._schedule === undefined) {
      return 'no schedule defined';
    }
    if (this._startdate === undefined) {
      return 'no startdate defined';
    }
    if (this._pattern === undefined) {
      return 'no weekpattern defined';
    }
  }

  getTodaysLessons(date) {
    var weeklabel = this._getWeeklabelFromPattern(date, this._startdate, this._pattern);
    var dow = date.locale('en').format('ddd').toLowerCase();

    if (weeklabel === undefined) {return undefined;}

    return this._schedule[weeklabel].lessons[dow];
  }

  getTodaysTimeslots(date) {
    var weeklabel = this._getWeeklabelFromPattern(date);

    if (weeklabel === undefined) {return undefined;}

    return this._schedule[weeklabel].timeslots;
  }

  _getWeeklabelFromPattern(date) {
    // startdate is in future, so no lessons
    if (this._startdate.isAfter(date)) {return undefined;}

    // no proper pattern defined
    if (this._pattern.length === 0) {return undefined;}

    // we iterate through weeks until we find today's week
    let index = 0;
    let weekiterator = this._startdate;

    while (weekiterator.isBefore(date, 'week')) {
      index = (index + 1) % this._pattern.length;
      weekiterator.add(1, 'week');
    }

    // and return the respective identifier from the pattern
    return this._pattern.charAt(index);
  }

}
