#  1. Project Overview

## 1.1 Project Objectives

 By the end of the fourth sprint we are looking to have a middle-fidelity prototype  that we can present and demo to showcase what our marketable product would look like.
 As a team we are looking to learn and improve in web programming, specifically get more experience using Express, MongoDB for a NoSQL database. We are also looking to implement
 and get comfortable with Agile methodologies such as Scrum meetings, user stories, task breakdown and incremental development. 

## 1.2 Scope

  We are looking to implement most core features for a car rental service. A client should be able to create an account, and later log in using their credentials, and use said account to make a rental request in which the client specifies duration, car type, location and other details. The customer will be able to modify and cancel a booking, sort cars based on their preferences, give reviews and more. 

## 1.3 Target Audience

  Our target audience for our services are tourists who need a car for th duration of their stay, people from abroad who are staying for an extended period of time, or newly arrived immigrants that need a rental car, either as a transition.

## Team Members

### Azal Al-Mashta, 40179492
#### Role 
  Back-end Developper, Database Design & Model Management
#### Background
 Student in Software Engineering with professional experience in Agile Methodologies 
### Thomas Mahut, 40249811
#### Role
  Scrum Master and Full-stack Developper, Integration & Testing
#### Background
  2nd year soen student with experience in web development.
### Mahmoud Mustafa, 40262016
#### Role
  Front-end Developper, Logic & Architecture
#### Background
   Second yearr software engineerring student
### Vincent Nguyen, 40246406
#### Role
 Front-end Developper, Designs & Styling
#### Background
Computer Engineering with low-level programming
### Alex Page-Slowik, 40193184 
#### Role
Front-end Developper, Templating & Layout
#### Background
Third year Computer Engineering student with embedded C programming experience.

### Adam Tahle, 40237870 
#### Role
 Back-end Developper, Routing and Controller Logic
#### Background
Second year Software Engineering student with academic and professional experience with traditional HTML/CSS/JS web development

### Activity log for all members
https://docs.google.com/spreadsheets/d/1uNgTQ0MPYsZqD4j4SAwWKReTsDaYdLrwizcvZZYlPd4/edit?usp=sharing

# Tech Stack  
Our project will utilize Express on the backend and leverage HTML, CSS, and JavaScript on the frontend (including libraries that consist of these technologies). Will we integrate the backend and frontend by using a templating engine to generate HTML files on the backend, and we will then serve these to the client side with publicly visible CSS and JavaScript files.

The templating engine of choice is the embedded JavaScript (EJS) templating engine, so that templates can be defined using a familiar HTML markup and JavaScript syntax.

Component-based reusability and custom functionality will be on the front-end using JavaScript web components, where needed. The HTMX library will be used to add interactivity and partial page reloads, and the Bootstrap library will be employed to facilitate styling and to maintain a consistent look.

# Installation Instructions

This project is built on Express, a Node.js framework. Node.js and the [Node.js package manager (npm)](https://nodejs.org/en/learn/getting-started/an-introduction-to-the-npm-package-manager)
must be installed in order to run the application.  

Furthermore please see our [Wiki](https://github.com/mahmoudmus/car2go2-soen341projectW2024/wiki/Team-Rules) for Team rules.

### Installing Node.js & Node.js Package Manager

On Windows:

1. Download `nvm-setup.zip` from the most recent [release](https://github.com/coreybutler/nvm-windows/releases) of the Node.js version manager for Windows.
2. Extract and run `nvm-setup.exe`.
3. Open a command prompt (with administrator privileges) and run `nvm install lts`.
4. Run `nvm list` to see which version of node.js was installed, and then `nvm use <version-number>`.

On MacOS:

1. If Homebrew isn't already installed, open a terminal and run `/bin/bash -c "$(curl -fsSL <https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh>)"`.
2. You can then use Homebrew to install Node.js by running `brew install node`. This also installs npm as it is bundled with Node.js.
3. Verify the installation of Node.js and npm by running `node -v` and `npm -v`, respectively.

### Cloning This Repository

Assuming you are using VS Code, you can follow the steps below.

1. Open VS Code.
2. Open the command palette by pressing **`Ctrl + Shift + P`** (Windows/Linux) or **`Cmd + Shift + P`** (Mac).
3. Type `Git: Clone` in the command palette and press enter.
4. Paste in the url of [this repository](https://github.com/mahutt/341bones) and press enter.
5. Specify a location on your machine.
6. VS Code will ask if you want to open the cloned repository - select `Yes` or `Open`.

### Installing Dependencies

Prior to starting the server locally, you must install project dependencies. You can do this by opening a terminal at the repository folder and running `npm install` to install Node.js packages.

Since dependencies may be added or even removed throughout the development process, it’s possible you may need to run `npm install` again, after pulling changes. 

### Handling Secrets

To facilitate development, all team members will be connecting to the same MongoDB cluster, hosted by MongoDB Atlas. To prevent exposing (shared) database credentials,
we will be storing them in a file called `.env`.

You might have noticed that this file does not yet exist in your local copy of the repository, as it is listed in `.gitignore` and thus was automatically excluded from git commits.

```jsx
MONGO_DB=<database-uri>
```

Create a `.env` file in the root of the repository, and replace `<database-uri>` with the actual URI. Ask a team member for this credential.

### Running The App

In the terminal, type `npm run start` to start a local server instance. You can then visit [http://localhost:3000/](http://localhost:3000/) to access the app.

However, during development, you should use `npm run devstart` instead. This command starts the server using nodemon (a dev dependency) instead of node. Nodemon auto-restarts the server when saved changes are detected in backend code, allowing us to save time during development.
