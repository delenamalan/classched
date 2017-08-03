# Class scheduler
## Introduction
Delena's playground for scheduling algorithms.

## How to run
Nothing to run yet, sorry.

## Backstory
Since my early high school years I have wondered how our school managed to
create our class timetables. I knew there had to be many variables and many
constraints. Individual teachers schedules and preferences, learners' subjects
choices, certain groups of classes that had to be together at certain times,
and various random constraints such as that mathematics were to be preferably
taught early in the morning.

After I first learned how to code, I set out to try and generate such a
timetable myself. However, I didn't know about arrays yet and soon realised that
I wouldn't be able to solve the problem with a set number of named variables.

Later, during my university years, I attempted to solve the problem again using
depth first search. I attempted this as a web application developed in MeteorJS.
I kept running into MeteorJS challenges and soon realised that simple depth
first search is not enough to solve this problem.

Now, I am back again.

## Variables (input/output)
Before reading any literature, this is my idea of the variables that a timetable
scheduling algorithm should have. 

### Independent variables (input)
1. Number of days in the timetable
2. Length of a single day
3. Length of a single period 
4. Number of teachers
5. Number of learners
6. Number of subjects
7. Which learners have to be together in a class for which subjects
8. Which teacher teaches which class of learners for which subjects
8. The number of times a learner should have a subject in a timetable
9. The number of periods in a day a learner should have a subject and whether
these times have to be consecutive 
10. The time periods during which certain classes have to occur.

### Dependent variables (output)
1. *The timetable*
