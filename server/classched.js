 var daysInCycle = 10;
 var periodsInDay = 10;
 var teachers = [{
     name: "CD",
     classes: [{
         name: "cs114",
         periods: 4
     }, {
         name: "map114",
         periods: 5
     }]
 }, {
     name: "AB",
     classes: [{
         name: "cl114",
         periods: 5
     }, {
         name: "math114",
         periods: 5
     }]
 }, {
     name: "GD",
     classes: [{
         name: "cm114",
         periods: 2
     }, {
         name: "mag114",
         periods: 5
     }]
 }, {
     name: "DF",
     classes: [{
         name: "cd114",
         periods: 3
     }, {
         name: "dath114",
         periods: 5
     }]
 }];
 var students = [{
     name: "type1",
     classes: ["cs114", "map114"]
 }, {
     name: "type2",
     classes: ["cs114", "map114", "cm114"]
 }, {
     name: "type3",
     classes: ["cd114", "cm114"]
 }, {
     name: "type4",
     classes: ["cl114", "mag114"]
 }];

 Meteor.startup(function() {
     Meteor.methods({
         calculateTimetable: function(teachers) {
             var tt = [];
             var st = [];
             initialiseTimetables(tt, st);
             calcTimetable(0, 0, tt, st, studentsWithClass(teachers[0].classes[0].name));
             printTimetables(tt, st);
             var perms = [];
             
             return perms;
         }
     })
 });

 function studentsWithClass(studClass) {
 	var swc = [];
 	for (s = 0; s < students.length; s++ ) {
 		for (var c = 0; c < students[s].classes; c++){
 			if (students[s].classes[c] == studClass) {
 				swc.push(s);
 				break;
 			}
 		}
 	}
 	return swc;
 }

/*
 * ti Index of current teacher in teachers
 * ci Index of current student in students
 * tt Timetables of teachers
 * st Timetables of students
 * swc Students who have the current class
 */
 function calcTimetable(ti, ci, tt, st, swc) {
 	var numClasses =  teachers[ti].classes[ci].periods;
 	var classDaysComb = [];
 	nchoosec(daysInCycle, numClasses, 0, 0, [], classDaysComb);
 	var periodCombs = [];
 	nPermutationsOfPeriods(numClasses, periodsInDay, 1, [], periodCombs);
 	for (var classComb in classDaysComb) {
 		var dayPeriodValid = [];
 		for (var d = 0; d < numClasses; d++) {
 			var dayValid = [];
 			for (var p = 0; p < periodsInDay; p++) {
 				dayValid.push(0);
 			}
 			dayPeriodValid.push(dayValid);
 		}
 		for (var periodComb in periodCombs) {
 			var feasable = true;
 			for (var day = 0; day < numClasses; day++ ) {
 				var period =  periodComb[day];
 				var dayPeriodStatus = dayPeriodValid[day][period];
 				if (dayPeriodStatus == -1) {
 					feasable = false;
 					break;
 				} else if (dayPeriodStatus == 0) {
 					//test
 					var viable = tt[ti][classComb[day]][period] == ' ';
 					if (viable) {
 						for (var s in swc) {
 							if (st[s][classComb[day]][period] != ' ') {
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
 				//go on to next class or teacher
 				
             calcTimetable(0, 0, tt, st, studentsWithClass(teachers[0].classes[0].name));
 			}
 		}
 	}

 }


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

 function printTimetables(tt, st) {
     console.log("Teacher timetables");
     for (var t = 0; t < teachers.length; t++) {
         console.log("Teacher: " + teachers[t].name);
         for (var d = 0; d < daysInCycle; d++) {
             console.log(tt[t][d].join(' '));
         }
     }
     console.log("Student timetables");
     for (var s = 0; s < students.length; s++) {
         console.log("Student: " + students[s].name);
         for (var d = 0; d < daysInCycle; d++) {
             console.log(st[s][d].join(' '));
         }
     }
 }

 /* nchoosec(n, c, v, i, cur, cs)
  * @param v Current vertex
  * @param i Index in c
  * @param cur Current permutation
  * @param cs All permutations
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

 function nPermutationsOfPeriods(n, p, i, cur, perms) {
 	var le = cur.length;
 	cur.push(0);
 	if (i == n) {
 		for (var x = 1; x <= p; x++ ) {
 			cur[le] = x;
 			perms.push(cur.slice(0));
 		}
 	} else {
 		for (var x = 1; x <= p; x++ ) {
 			cur[le] = x;
 			nPermutationsOfPeriods(n, p, i+1, cur.slice(0), perms);
 		}
 	}
 }