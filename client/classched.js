 Template.welcome.events({
    'click button': function () {
      $( "#welcome" ).removeClass('in').addClass('afterIn');
      $( '#welcome' ).fadeOut(300, function() {$(this).remove(); });
      $( "#createSchool" ).removeClass('beforeIn').addClass('in');
      if (event.target.id == "loadSchool") {
        //populate fields
      }
    }
  });

 Session.set("teachers", [
        { name : "Johnty Doe", classes : ['cs111', 'cs143'] },
        { name : "Sarah Doe", classes : ['eng101', 'eng201', 'fra344']}
      ]);

 Session.set("students", [
        { name : "Student A", classes : ['cs111', 'cs143'] },
        { name : "Sarah Julies", classes : ['eng101', 'eng201', 'fra344']}
      ]);

 Session.set("teacherClasses", [
      'ebd12', 'math232', 'sdj21'
    ]);


  Session.set("days", 5);
  Session.set("curTeacher", Session.get("teachers").length);

  Template.editParticipants.helpers({
      teachers : function() {
        return Session.get("teachers");
      },
      students : function() {
        return Session.get("students");
      },
      teacherClasses : function() {
        var teachers = Session.get("teachers");
        if (teachers.length > Session.get("curTeacher")) {
        return teachers[Session.get("curTeacher")].classes;
        } else {
          return [];
        }
      },
      days : function() {
        return Session.get("days");
      }
  });


  function addTeacher(teacherName) {
    console.log("Add teacher");
    var teachers = Session.get("teachers");
    teachers.push({name : teacherName, classes : []});
    Session.set("teachers", teachers);
  }

  function changeTeacher(teacherName) {
    console.log("Change teacher");
    var teachers = Session.get("teachers");
    teachers[Session.get("curTeacher")].name = teacherName;
    Session.set("teachers", teachers);
  }

  function openTeacher(teacherName) {
    console.log("Open teacher");
    document.getElementById("teacherName").value = teacherName;
    var teachers = Session.get("teachers");
    for (var i = 0; i < teachers.length; i++) {
      if (teachers[i].name == teacherName) {
        Session.set("curTeacher", i);
        break;
      }
    }
  }

  var enterKey = 13;

Template.editParticipants.events({
  'keyup #daysInCycle' : function() {
    console.log("days changed");
    Session.set('days', event.target.value);
  },
  'keyup #teacherName' : function() {
    if (event.keyCode == enterKey) {
      document.getElementById('teacherClass').focus();
    }
    if (event.target.value && event.target.value.length >= 3) {
      if (Session.get("teachers").length <= Session.get("curTeacher")) {
        addTeacher(event.target.value);
      } else {
        changeTeacher(event.target.value);
      }
      document.getElementById("teacherClass").disabled = false;
    } else {
      document.getElementById("teacherClass").disabled = true;
    }
  },
  'focusout #teacherName' : function () {
    if (event.target.value && event.target.value.length < 3) {
      console.log("Teacher name not valid.");
      event.target.focus();
    } else if (event.target.value) {
      document.getElementById("teacherClass").disabled = false;
    }
  },
  'click #teachersList button' : function() {
    openTeacher(event.target.value);
    document.getElementById("teacherClass").disabled = false;
  },
  'keyup #teacherClass' : function() {
    if (event.keyCode == enterKey) {
      event.target.blur();
    }
  },
  'focusout #teacherClass' : function() {
    if (event.target.value && event.target.value.length < 3) {
      event.target.focus();
    } else {
      var teachers = Session.get("teachers");
      teachers[Session.get("curTeacher")].classes.push(event.target.value);
      Session.set("teachers", teachers);
      event.target.value = "";
    }
  },
  'click #calc' : function() {
    console.log("call server");
    Meteor.call('calculateTimetable', Session.get('teachers'), function(err, response) {
        if(err) {
          console.log(err.reason);
        } else {
          for (var prop in response) {
            console.log(prop + ' ' + response[prop]);
          }
        }
    });
  }
})


