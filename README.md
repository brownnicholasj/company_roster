# Company Roster Application

![License: MIT](https://img.shields.io/badge/License-MIT-green)

## Description

- This Company Rost CLI application will allow the user to manage their
  Employees, Roles and Departments.
- The technology used for this application are: node, javascript, mysql (npm),
  inquirer (npm), chalk (npm), asciiart-logo (npm), console.table (npm)
- The biggest challenge within this project was organizing the code and having a
  reliable pattern to store the code as, once I landed on one that worked for
  me, the solution came together pretty quickly.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Contributing](#contributing)
- [Demo](#demo)
- [Questions](#questions)

## Installation

To install necessary dependencies, run the following command:

```
npm i
```

The following dependencies will be installed:

- mysql
- inquirer
- chalk
- asciiart-logo
- console.table

## Usage

A user will start the app in their console log and be presented with the splash
logo and their options ![usage001](./assets/images/usage001.jpg)

The user will then be presented with stored notes on the left side and the
ability to add new notes with a Title and Body section.
![usage002](./assets/images/usage002.jpg)

When the user enters a note title and note text, then a save button will appear
in the top right. ![usage003](./assets/images/usage003.jpg)

When the user clicks the save button, the note will be stored in the database
and visible on the stored list to the left side of the screen.
![usage004](./assets/images/usage004.jpg)

When a user wants to view the details of a stored note, they can click on the
note title on the left side. A read only view of the note title and text will be
visible in the main section of the page
![usage005](./assets/images/usage005.jpg)

When a user wants to add a new note when they have a previous note pulled up (in
read only view), the user can click the '+' icon in the top right and the main
section will clear and be eligible for a user to create a title and text
![usage006](./assets/images/usage006.jpg)

WHen a user wants to delete a note, they can press the red trashcan icon on the
list to the left and the note will be deleted from the database and from the
list ![usage007](./assets/images/usage007.jpg)

## License

This project is licensed under the MIT license.

## Contributing

A thanks to the following contributors to this project:

- 2021 Trilogy Education Services, LLC
- Nicholas Brown (brownnicholasj.dev@gmail.com)

## Demo

Click the following link to watch video demo of the application (43sec
runtime)<br> https://youtu.be/wBTsdZ2h9fg

### Behind the Code

- The GET request for /notes will return the user the notes.html and all other
  requests to the index.html <br> ![btc001](./assets/images/btc001.jpg)

- The GET and POST requests for api/notes will return the database and allow
  notes to be saved to the db: <br> ![btc002](./assets/images/btc002.jpg)

  ![btc003](./assets/images/btc003.jpg)

- The saver function within the code is called when a POST or DELETE request
  comes in and posts (or deletes) the data to the db.json file
  ![btc004](./assets/images/btc004.jpg)

- The unique identifier is determined by utilizing the date function within
  Javascript. This will establish a UNIX formatted date as the unique ID, since
  it inherently counts up with milliseconds, it will serve well as a unique ID
  creator ![btc005](./assets/images/btc005.jpg)

  ![btc006](./assets/images/btc006.jpg)

## Questions

If you have any questions about the repo, open an issue or contact me directly
at brownnicholasj.dev@gmail.com.You can find more of my work at
[brownnicholasj](https://github.com/brownnicholasj/).
