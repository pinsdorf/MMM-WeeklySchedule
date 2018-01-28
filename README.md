MMM-WeeklySchedule
==================

This a module for the [MagicMirror](https://github.com/MichMich/MagicMirror). It displays today's timetable for instance from a student's weekly class schedules. It is intended for regular weekly schedules, which have a low update frequency and thus can be maintained manually. 

## Preview

![](https://github.com/pinsdorf/MMM-WeeklySchedule/blob/master/screenshot.png?raw=true)

## Installation
1. Navigate into your MagicMirror's `modules` folder. 
2. Execute `git clone https://github.com/pinsdorf/MMM-WeeklySchedule.git`. A new folder will appear. 
3. Navigate into folder `MMM-WeeklySchedule`.
4. Execute `npm install` to install the node dependencies.

## Config
The entry in `config.js` can include the following options:

|Option|Description|
|---|---|
|`schedule`|Define the timetable this module shall show. It consists of a definition for `timeslots` and `lessons`. See below.|
|`updateInterval`|How often the content is updated.<br>**Default value:** `1 • 60 • 60 • 1000` // every 1 hour |
|`showWeekdayinHeader`|Appends the module header with text, e.g., *on Monday*<br>**Default value:** `true`|
|`showNextDayAfter`|From this time of the day the module shows the schedule of the next day. This is helpful when a school day is over and you want to show what is up tomorrow. If you don't like this set the value to `23:59`. <br>**Default value:** `16:00`|

Below is an example of an entry in `config.js`. Make sure that the days of week (mon, tue, wed, ...) are all lower case. All `lessons.*` arrays and the `timeslots` arrays shall have the same length. If you want to show nothing at a particular time simply put an empty string as in the example below (cf. entries for `mon` and  `tue`). You can omit one or many weekdays (cf. entries for `sat`). On such days the module shows a text *no lessons*.

```
{
    module: "MMM-WeeklySchedule",
    position: "top_left",
    header: "Hermione's classes",
    config: {
        schedule: {
            timeslots: [ "8:00", "10:00", "12:00", "14:00", "16:00" ],
            lessons: {
                mon: [ "Potions", "Defense against the Dark Arts", "Lunch Break", "Transfiguration", "" ],  // last lesson free
                tue: [ "", "Astronomy", "Lunch Break", "Charms", "History of Magic" ],  // first lesson free
                wed: [ "Arithmancy", "Divination", "Lunch Break", "Muggle Studies", "Herbology" ],
                thu: [ "Care of Magical Creatures", "Care of Magical Creatures", "Lunch Break", "Transfiguration", "Charms" ],
                fri: [ "Potions", "Herbology", "Lunch Break", "Charms", "Defense against the Dark Arts" ],
                // no school on Saturdays
                sun: [ "", "Quidditch Match", "Sunday Lunch", "", "" ]   // second lesson only
            }
        },
        updateInterval: 1 * 60 * 60 * 1000, // every hour
        showNextDayAfter: "16:00"
},
```

## Dependencies
- [moment](https://www.npmjs.com/package/moment) (installed via `npm install`)

## Important Notes
- This is my first project using Node, so feel free to submit pull requests or post on the issues/wiki and I will do my best to improve the project.

## Special Thanks
- [Michael Teeuw](https://github.com/MichMich) for creating the awesome [MagicMirror2](https://github.com/MichMich/MagicMirror/tree/develop) project that made this module possible.
- [LukeSkywalker92](https://github.com/LukeSkywalker92) for creating the [MMM-DWD-WarnWeather](https://github.com/LukeSkywalker92/MMM-DWD-WarnWeather) module that I used as guidance in creating this module.
