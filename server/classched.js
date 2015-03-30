 // Sample data begin
 var daysInCycle = 5;
 var periodsInDay = 6;
 var teachers = [{
     name: "Olivia",
     classes: [{
         name: "Afr8",
         periods: 4
     }, {
         name: "Afr10",
         periods: 4
     }, {
         name: "Afr11",
         periods: 4
     }, {
         name: "Afr12",
         periods: 4
     }, {
         name: "Bib10",
         periods: 2
     }]
 }, {
     name: "Harry",
     classes: [{
         name: "Math8",
         periods: 5
     }, {
         name: "Math9",
         periods: 5
     }, {
         name: "Math10",
         periods: 5
     }, {
         name: "Life10",
         periods: 3
     }]
 }, {
     name: "Grace",
     classes: [{
         name: "Life8",
         periods: 2
     }, {
         name: "Life9",
         periods: 2
     }, {
         name: "Bib9",
         periods: 3
     }, {
         name: "Phy11",
         periods: 3
     }, {
         name: "Math12",
         periods: 5
     }, {
         name: "Afr9",
         periods: 4
     }]
 }, {
     name: "Amelia",
     classes: [{
         name: "Life11",
         periods: 3
     }, {
         name: "Life12",
         periods: 2
     }, {
         name: "Phy12",
         periods: 4
     }, {
         name: "Phy10",
         periods: 3
     }, {
         name: "Phy9",
         periods: 2
     }, {
         name: "Math11",
         periods: 5
     }]
 }];
 var students = [{
     name: "Gr8",
     classes: ["Afr8", "Math8", "Life8", "Bib9"]
 }, {
     name: "Gr9",
     classes: ["Afr9", "Math9", "Life9", "Bib9", "Phy9"]
 }, {
     name: "Gr10",
     classes: ["Afr10", "Math10", "Life10", "Bib10", "Phy10"]
 }, {
     name: "Gr11",
     classes: ["Afr11", "Math11", "Life11", "Bib10", "Phy11"]
 }, {
     name: "Gr12",
     classes: ["Afr12", "Math12", "Life12", "Bib10", "Phy12"]
 }];
// Sample data end

 Meteor.startup(function() {
     var tt = [];
     var st = [];
     initialiseTimetables(tt, st);
     Meteor.methods({
         calculateTimetables: function(teachersc, studentsc, daysInCyclec, periodsInDayc) {
             Timetables.remove();
             teachers = teachersc;
             students = studentsc;
             daysInCycle = daysInCyclec;
             periodsInDay = periodsInDayc;
             initialiseTimetables(tt, st);
             if (!calcTimetables(0, 0, tt, st, studentsWithClass(teachers[0].classes[0].name))) {
                 return [];
             } else {
                 for (var t = 0; t < teachers.length; t++) {
                     Timetables.insert({
                         name: teachers[t].name,
                         timetable: tt[t]
                     });
                 }
                 for (var s = 0; s < students.length; s++) {
                     Timetables.insert({
                         name: students[s].name,
                         timetable: st[s]
                     });
                 }
                 console.log(Timetables.findOne());
                 return true;
             }
         },
         getTeachers: function() {
             return teachers;
         },
         getStudents: function() {
             return students;
         },
         getDaysInCycle: function() {
             return daysInCycle;
         },
         getPeriodsInDay: function() {
             return periodsInDay;
         }
     })
 });

/**
 * Return array with the student indexes of students that take a given course.
 *
 * @param studClass Class for the students to have.
 * @return Array of indexes of students in the <code>students</code> array.
 */
 function studentsWithClass(studClass) {
     var swc = [];
     for (s = 0; s < students.length; s++) {
         for (var c = 0; c < students[s].classes.length; c++) {
             if (students[s].classes[c] == studClass) {
                 swc.push(s);
                 break;
             }
         }
     }
     return swc;
 }

 /*
  * Calculate the timetable of the teachers stored in <code>teachers</code> and the students stored in <code>students</code>.
  *
  * @param ti Index of current teacher in teachers
  * @param ci Index of current student in students
  * @param tt Timetables of teachers
  * @param st Timetables of students
  * @param swc Students who have the current class
  */
 function calcTimetables(ti, ci, tt, st, swc) {
     var numClasses = teachers[ti].classes[ci].periods;
     var classDaysComb = [];
     nchoosec(daysInCycle - 1, numClasses - 1, 0, 0, [], classDaysComb); //change
     shuffleArray(classDaysComb);
     var periodCombs = [];
     nPermutationsOfPeriods(numClasses, periodsInDay, 0, [], periodCombs);
     shuffleArray(periodCombs);
     for (var cc = 0; cc < classDaysComb.length; cc++) {
         var classComb = classDaysComb[cc];
         var dayPeriodValid = [];
         for (var d = 0; d < numClasses; d++) {
             var dayValid = [];
             for (var p = 0; p < periodsInDay; p++) {
                 dayValid.push(0);
             }
             dayPeriodValid.push(dayValid.slice(0));
         }
         for (var pc = 0; pc < periodCombs.length; pc++) {
             var periodComb = periodCombs[pc];
             var feasable = true;
             for (var day = 0; day < numClasses; day++) {
                 var period = periodComb[day];
                 var dayPeriodStatus = dayPeriodValid[day][period];
                 if (dayPeriodStatus == -1) {
                     feasable = false;
                     break;
                 } else if (dayPeriodStatus == 0) {
                     //test
                     var viable = tt[ti][classComb[day]][period] == ' ';
                     if (viable) {
                         for (var s = 0; s < swc.length; s++) {
                             var student = swc[s];
                             if (st[student][classComb[day]][period] != ' ') {
                                 viable = false;
                                 break;
                             }
                         }
                     }
                     if (!viable) {
                         dayPeriodValid[day][period] = -1;
                         feasable = false;
                         break;
                     } else {
                         dayPeriodValid[day][period] = 1;
                     }
                 }
             }
             if (feasable) {
                 // go on to next class or teacher
                 var nextti;
                 var nextci;
                 if (ci == teachers[ti].classes.length - 1) {
                     if (ti == teachers.length - 1) {
                         return true; // found a solution!
                     }
                     nextti = ti + 1;
                     nextci = 0;
                 } else {
                     nextti = ti;
                     nextci = ci + 1;
                 }
                 // put changes in timetables
                 changeTimetables(ti, tt, st, classComb, periodComb, swc, teachers[ti].classes[ci].name);
                 if (calcTimetables(nextti, nextci, tt, st, studentsWithClass(teachers[nextti].classes[nextci].name))) {
                     return true;
                 } else {
                     // reverse changes
                     changeTimetables(ti, tt, st, classComb, periodComb, swc, ' ');
                 }
             }
         }
     }
     return false;
 }

 /**
  * Add a certain class (or blank if no class) to the timetable on the given days and periods.
  *
  * @param ti Index of teacher who teaches the class.
  * @param tt Teacher timetables.
  * @param st Student timetables.
  * @param days Array of days on which this class should be held.
  * @param periods Array of periods corresponding to the days in which this class should be held.
  * @param swc Array of students who take this class.
  * @param className Name of class to be used on the timetables.
  */
 function changeTimetables(ti, tt, st, days, periods, swc, className) {
     for (var d = 0; d < days.length; d++) {
         var day = days[d];
         var period = periods[d];
         tt[ti][day][period] = className;
         for (var s = 0; s < swc.length; s++) {
             st[swc[s]][day][period] = className;
         }
     }
 }

/*
 * Initialise the timetables by using ' ' for no class.
 *
 * @param tt Teacher timetables.
 * @param st Student timetables.
 */
 function initialiseTimetables(tt, st) {
     var day = [];
     for (var period = 0; period < periodsInDay; period++) {
         day.push(' ');
     }
     for (var teacher = 0; teacher < teachers.length; teacher++) {
         var person = [];
         for (var d = 0; d < daysInCycle; d++) {
             person.push(day.slice(0));
         }
         tt.push(person);
     }
     for (var student = 0; student < students.length; student++) {
         var person = [];
         for (var d = 0; d < daysInCycle; d++) {
             person.push(day.slice(0));
         }
         st.push(person.slice(0));
     }
 }

 /*
  * Log the timetables on the console (used for testing purposes).
  */
 function printTimetables(tt, st) {
     console.log("Teacher timetables");
     for (var t = 0; t < teachers.length; t++) {
         console.log("Teacher: " + teachers[t].name);
         for (var d = 0; d < daysInCycle; d++) {
             console.log(tt[t][d].join(' , '));
         }
     }
     console.log("Student timetables");
     for (var s = 0; s < students.length; s++) {
         console.log("Student: " + students[s].name);
         for (var d = 0; d < daysInCycle; d++) {
             console.log(st[s][d].join(' , '));
         }
     }
 }

 /* 
  * Calculates all the possible results of choosing c numbers from the set of numbers in the range 0 to v-1.
  *
  * @param n Number of number to choose from and the number 1 more than the maximum number to choose from.
  * @param c The number of numbers that can be chosen.
  * @param v v'th number being chosen.
  * @param i Current number being chosen.
  * @param cur Current choice
  * @param cs All choices
  */
 function nchoosec(n, c, v, i, cur, cs) {
     var le = cur.length;
     cur.push(0);
     if (v == c) {
         while (i <= n) {
             cur[le] = i++;
             cs.push(cur.slice(0));
         }
     } else {
         while (n - i >= c - v) {
             cur[le] = i++;
             nchoosec(n, c, v + 1, i, cur.slice(0), cs);
         }
     }
 }

 /*
  * Calculates all the possible results of choosing p numbers from the set of numbers in the range 0 to n-1 
  *  where the order of selection matters.
  *
  * @param n Number of digits in code.
  * @param p Number of possible digits.
  * @param i i'th number to be chosen.
  * @param cur Current code.
  * @param perms All codes.
  */
 function nPermutationsOfPeriods(n, p, i, cur, perms) {
     var le = cur.length;
     cur.push(0);
     if (i == n - 1) {
         for (var x = 0; x < p; x++) {
             cur[le] = x;
             perms.push(cur.slice(0));
         }
     } else {
         for (var x = 0; x < p; x++) {
             cur[le] = x;
             nPermutationsOfPeriods(n, p, i + 1, cur.slice(0), perms);
         }
     }
 }

 /**
  * Shuffle an array (Fisher-Yates shuffle)
  *
  * Code from <a href="http://bost.ocks.org/mike/shuffle/"> by Mike Bostock
  */
 function shuffleArray(array) {
     var m = array.length,
         t, i;

     // While there remain elements to shuffle…
     while (m) {

         // Pick a remaining element…
         i = Math.floor(Math.random() * m--);

         // And swap it with the current element.
         t = array[m];
         array[m] = array[i];
         array[i] = t;
     }

     return array;
 }