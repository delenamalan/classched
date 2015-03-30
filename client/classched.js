Session.set("teachers", []);
 Session.set("students", []);
 Session.set("curPerson", "");
 Session.set("daysInCycle", 5);
 Session.set("periodsInDay", 6);
 Session.set("teacherClasses", []);
 Session.set("studentClasses", []);

 Template.loadSchool.events({
     'click #loadData': function() {
         Meteor.call('getTeachers', function(err, response) {
          if (err) {
              console.log(err.reason);
          } else {
            Session.set("teachers", response);
          }
         });
         Meteor.call('getStudents', function(err, response) {
          if (err) {
              console.log(err.reason);
          } else {
            Session.set("students", response);
          }
         });
         Meteor.call('getDaysInCycle', function(err, response) {
          if (err) {
              console.log(err.reason);
          } else {
            Session.set("daysInCycle", response);
          }
         });
         Meteor.call('getPeriodsInDay', function(err, response) {
          if (err) {
              console.log(err.reason);
          } else {
            Session.set("periodsInDay", response);
          }
         });
         document.getElementById("daysInCycle").value = Session.get("daysInCycle");
         document.getElementById("periodsInDay").value = Session.get("periodsInDay");
         document.getElementById("schoolName").value = "Sample school";
     }
 });

 Template.editParticipants.helpers({
     teachers: function() {
         return Session.get("teachers");
     },
     students: function() {
         return Session.get("students");
     },
     teacherClasses : function() {
        return Session.get("teacherClasses");
     },
     studentClasses : function() {
        return Session.get("studentClasses");
     },
     classes : function() {
        var teachers = Session.get("teachers");
        var classes = [];
        for (var t = 0; t < teachers.length; t++) {
          for (var c = 0; c < teachers[t].classes.length; c++) {
            classes.push(teachers[t].classes[c].name);
          }
        }
        return classes;
     },
     days: function() {
         return Session.get("daysInCycle");
     }
 });

 Template.timetableTemplate.helpers({
     teachers: function() {
         return Session.get("teachers");
     },
     students: function() {
         return Session.get("students");
     }
 });

 Template.timetableTemplate.events({
     'change #personsTimetable': function() {
         changeTimetable();
     }
 });

 function getTimetable(person) {
     return Timetables.findOne({
         name: person
     });
 }

 function changeTimetable() {
     var person = document.getElementById("personsTimetable").value;
     Session.set("curPerson", person);
     var tt = getTimetable(person);
     var table = document.getElementById("timetable");
     var rows = table.rows.length;
     while (rows > 0) {
         table.deleteRow(0);
         rows--;
     }
     table.setAttribute("style", "display:block");
     var row, cell;
     var numPeriods = tt.timetable[0].length;
     row = table.insertRow(0);
    cell = row.insertCell(period);
     for (var period = 0; period < numPeriods; period++) {
        cell = row.insertCell(period+1);
        cell.innerHTML = "Period " + period;
     }
     for (var day = 0; day < tt.timetable.length; day++) {
         row = table.insertRow(day+1);
         cell = row.insertCell(0);
         cell.innerHTML = "Day " + (day+1);
         for (var period = 0; period < numPeriods; period++) {
             cell = row.insertCell(period+1);
             cell.innerHTML = tt.timetable[day][period];
         }
     }

 }

 function addTeacher(teacherName) {
     console.log("Add teacher");
     var teachers = Session.get("teachers");
     teachers.push({
         name: teacherName,
         classes: Session.get("teacherClasses")
     });
     Session.set("teachers", teachers);
     Session.set("teacherClasses", []);
     document.getElementById("teacherName").value = "";
 }

 function addClass(className, classPeriods) {
    var teacherClasses = Session.get("teacherClasses");
    teacherClasses.push({name : className, periods : Number(classPeriods)});
    Session.set("teacherClasses", teacherClasses);
    document.getElementById("teacherClass").value = "";
 }

 function addStudentClass(className) {
  var studentClasses = Session.get("studentClasses");
  studentClasses.push(className);
  Session.set("studentClasses", studentClasses);
 }

 function addStudent(typeName) {
  var students = Session.get("students");
  students.push({ name : typeName, classes : Session.get("studentClasses")});
  Session.set("students", students);
  Session.set("studentClasses", []);
  document.getElementById("studentType").value = "";
 }

 var enterKey = 13;

 Template.editParticipants.events({
     'keyup #daysInCycle': function() {
         Session.set('daysInCycle', event.target.value);
     },
     'keyup #teacherName': function() {
         if (event.keyCode == enterKey) {
             document.getElementById('teacherClass').focus();
         }
     },
     'focusout #teacherName': function() {
         if (event.target.value && event.target.value.length < 3) {
             console.log("Teacher name not valid.");
             event.target.focus();
         }
     },
     'focusout #teacherClass': function() {
         if (event.target.value && event.target.value.length < 3) {
             console.log("Teacher name not valid.");
             event.target.focus();
         }
     },
     'focusout #studentType' : function() {
         if (event.target.value && event.target.value.length < 3) {
             console.log("Student type not valid.");
             event.target.focus();
         }
     },
     'keyup #teacherClass': function() {
         if (event.keyCode == enterKey) {
            document.getElementById('classPeriods').focus();
         }
     },
     'click #saveClass' : function() {
        event.preventDefault();
        console.log("save " + document.getElementById("teacherClass").value);
        if (document.getElementById("teacherClass").value.length >= 3) {
          addClass(document.getElementById("teacherClass").value, document.getElementById("classPeriods").value);
        }
        return false;
     },
     'click #saveTeacher' : function() {
        event.preventDefault();
        if (document.getElementById("teacherName").value.length >= 3) {
          addTeacher(document.getElementById("teacherName").value);
        }
        return false;
     },
     'change #addStudentClass' : function() {
        addStudentClass(event.target.value);
     },
     'click #saveStudent' : function() {
        event.preventDefault();
        if (document.getElementById("studentType").value.length >= 3) {
          addStudent(document.getElementById("studentType").value);
        }
        return false;
     },
     'click #calc': function() {
        event.preventDefault();
        if (document.getElementById("schoolName").value.length >= 3) {
           console.log("Get server to calculate the timetables");
           Meteor.call('calculateTimetables', Session.get("teachers"), Session.get("students"), Session.get("daysInCycle"), 
            Session.get("periodsInDay"), function(err, response) {
               if (err) {
                   console.log(err.reason);
               } else {
                   console.log("Successful calculation");
               }
           });
           $('#editParticipants').fadeOut(100, function() {
               $(this).remove();
           });
           $('#createSchool').fadeOut(100, function() {
               $(this).remove();
           });
           $('#loadSchool').fadeOut(100, function() {
               $(this).remove();
           });
           document.getElementById("timetableTemplate").className = "in"; 
           changeTimetable();
           return false;
      }
     }
 });
