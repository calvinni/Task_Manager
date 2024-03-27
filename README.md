# Task_Manager
 
A simple Task manager app that is programmed inside snack online expo based on my bus app. Works in both android and IOS
It features:
A basic dashboard displaying a list of tasks with a search function
Different sections for "In Progress", "Completed" and "Overdue" tasks
Settings to sort tasks either by due dates or priority Level
Task progress automatically set to overdue if current date is bigger than due date
Allow users to add, delete and edit any of the tasks
Each tasks contains:
1. TaskID
2. Task name
3. Task description
4. Task priority Level (High/Medium/Low)
5. Task due date
6. Task progress

How to run the Task manager app on expo snack:

1. Create a new snack on the expo page

2. Click on the 3 dots beside the project dropdown on the right bar

3. Select Git import and use this link: https://github.com/calvinni/Task_Manager/tree/main/task-manager

4. When imported, all files should be like shown:

![image](https://github.com/calvinni/Task_Manager/assets/109656337/8a26e307-02ae-48c4-8a17-d2d10df68ae0)

5. Make sure all packages are updated and now you should be able to run the app using the andriod or the IOS emulator on the right. 

Additional Info:
A lot of the code is reused from a previous project, Bus_app.
I've chosen to make this app due to the technical requirement of lightweight frontend framework, I would have chosen to use Django and SQLite instead as I've have more experience in it.
The completion status filter was changed to due date filter due to lack of details given and assumed to be the closer to the due date, it would be more complete than the others.

Live demonstration: https://www.youtube.com/watch?v=HPFx42v0tI0
