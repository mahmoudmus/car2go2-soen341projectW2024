#  1. Project Overview

## 1.1 Project Objectives

 By the end of the fourth sprint we are looking to have a middle-fidelity prototype  that we can present and demo to showcase what our marketable product would look like.
 As a team we are looking to learn and improve in web programming, specifically get more experience using Express, MongoDB for a NoSQL database. We are also looking to implement
 and get comfortable with Agile methodologies such as Scrum meetings, user stories, task breakdown and incremental development. 

## 1.2 Scope

  We are looking to implement most core features for a car rental service. A client should be able to create an account, and later log in using their credentials, and use said account to make a rental request in which the client specifies duration, car type, location and other details. The customer will be able to modify and cancel a booking, sort cars based on their preferences, give reviews and more. 

## 1.3 Target Audience

  Our target audience for our services are tourists who need a car for th duration of their stay, people from abroad who are staying for an extended period of time, or newly arrived immigrants that need a rental car, either as a transition.

## 1.4 Team Members

### Azal Al-Mashta, 40179492
#### Role 
  Back-end Developper, Database Design & Model Management
#### Background
 Student in Software Engineering with professional experience in Agile Methodologies 
### Thomas Mahut, 40249811
#### Role
  Scrum Master and Full-stack Developper, Integration & Testing
#### Background

### Mahmoud Mustafa, 40262016
#### Role
  Front-end Developper, Logic & Architecture
#### Background

### Vincent Nguyen, 40246406
#### Role
 Front-end Developper, Designs & Styling
#### Background

### Alex Page, 40193184 
#### Role
Front-end Developper, Templating & Layout
#### Background

### Adam Tahle, 40237870 
#### Role
 Back-end Developper, Routing and Controller Logic
#### Background




# 2. Project Approach

##  2.1 Development Methodology
Agile is the chosen development methodology for this project, as it enables teams to rapidly develop and deliver software. This choice is made possible by the team’s access
to an acting client (the teaching assistant) that can provide feedback at each incremental delivery. This feedback loop ensures adaptability to changing requirements,
enhancing our ability to deliver a minimum viable product within the given, restricted time frame.

## 2.2 Project Timeline
[Gantt Chart draft/template](https://docs.google.com/spreadsheets/d/1W6UDmOyMAhrc5ATTkXw4ieQeaSpQIkZw4eJ0Uxjhx08/edit?usp=sharing)

## 2.3 Collaboration and Communication
### Informal Communication
For informal communication the team will use a WhatsApp group chat where members can communicate with other members about meetings (time, location, availability, missing a meeting). 
All of the team members are added and are expected to check the group chat at least once per day. Additionally, if members wish to escalate any problems to the professor, they can use
a private forum in Moodle where team members can communicate and present any conflicts.
### Formal Communication
GitHub Issues provides a workspace for team members to break down complex problems and tasks into multiple steps. This collaborative workspace allows members to create, discuss, and manage tasks on GitHub.
Issues are organized into labels, milestones, and assignees. The advantage of using such a platform is that all discussions and changes are recorded and can be seen by all team members. 
Hence, members can see the progress of the project and provide comments on issues. The documentation for the discussions and resolution of  issues is also created by GitHub Issues.

# 3. Technology Stack

##  3.1 Backend Frameworks

###  Ruby on Rails
#### Description:  
  Ruby on Rails (RoR) is a web application framework that emphasizes convention over configuration. It comes with everything you might need for a database-backed web app, such as an ORM, routing,
   and even view rendering. It is thus technically a full stack framework, but can be used as a uniquely backend framework when paired with an alternative front end solution.
#### Rationale:  
  RoR is heavily opinionated towards the MVC architecture, which can greatly reduce development time in the context of an MCV app. The framework is suited with code generators that automate the creation of
   ​​boilerplate code for models, controllers, views, and database migrations. Development is further facilitated thanks to RoR’s active record ORM that facilitates database interactions and management,
   and its rich ecosystem of gems (libraries) to easily integrate common functionality. RoR is additionally well documented, has a large, active community, and provides testing tools that promote TDD.
   These factors allow developers to decrease the time spent troubleshooting chasing bugs and to focus instead on building the application.
#### Qualitative Assessment:  
  However, our team has little experience with the Ruby programming language, which is considered to have a steep learning curve. Further, the framework’s emphasis on convention may lack a desired
  flexibility to implement specific features.
##### Strengths  
  Relative to other frameworks, RoR’s strengths are its community support, ease of integration, extensibility, and learning curve (not counting the learning curve of the Ruby language).
##### Weaknesses  
  Relative to other frameworks, RoR’s weaknesses are its difficulty to scale, poor performance, difficulty to maintain, and poor out-of-the-box security.
##### Use Cases  
  Due to its rapid development, RoR is a popular choice for building MVPs. Large applications like Shopify and GitHub were, and still are, built on RoR. Not only did RoR allow these companies to build fast,
   but also handle increasingly complex business logic as the years went on.

###  3.1.2 Express
#### Description:   
  Express is a node.js web framework, designed to be minimal, flexible, and fast. Express handles the creation of a node.js web server and simplifies the creation of RESTful APIs,
   allowing developers to focus on building core functionality. 
#### Rationale:    
  Express.js is widely used and has a large community, such that solutions to common problems are readily available. It is relatively simple to learn, and its use of JavaScript means that developers
   with no web dev experience only need to learn a single language to work on both the frontend and backend. Furthermore, Express’s minimalistic design allows teams to extend its functionality as needed,
   which can be particularly beneficial team’s whose requirements are prone to rapidly change. Finally, Its middleware architecture facilitates the integration of new features, making it  ideal for developing
   modern, efficient, and modular backend systems. It is opinionated, meaning the team can decideto follow an architectural pattern of their choice, such as MVC. However, this same opinionated nature means
   the framework lacks some built-in features that other frameworks might provide. This results in a reliance on third-party libraries for certain functionalities. While this does mean that the team can decide
   which 3rd party technologies to use for security, testing, database management, etc., it simultaneously increases the complexity of the project.
#### Qualitative Assessment:    
##### Strengths    
  Community support, scalability, ease of integration, performance, maintenance, learning curve, and extensibility are all advantages of Express, relative to other frameworks, and in the context of building an
   MVP with a team of relatively inexperienced web developers.
##### Weaknesses    
  Its primary disadvantage is security, as the framework’s lack of built-in security features has given it a reputation for having security vulnerabilities. The solution is often to rely on 3rd party
   libraries for security features, which can increase the complexity of the project and of dependency management.
##### Use Cases    
  A few use cases include real-time applications (due to its middleware support and non-blocking I/O operations), API development (due to its flexible and modular design), and single page applications
   (due to its support for routing and middleware, and overall flexibility).

###  3.1.3  Laravel
#### Description:   
  Laravel is an open-source PHP framework designed for web application development. Laravel follows the MVC (model-view-controller) pattern, it offers an expressive syntax with sturdy features
   and a dev-friendly environment. Key focuses of Laravel are Eloquent ORM for database interaction, simple authentication systems, schema version control through database migrations and integrated
   testing tools. Since it was founded in 2011, Laravel became a famous choice thanks to it’s modular architecture and comprehensive and easy to use toolkit for simple and complex web applications.
#### Rationale:  
  Laravel offers an intuitive and easy to understand syntax and code structure, which makes it easy to learn/use. Compared with other PHP frameworks, this simplicity accelerates development times,
   and reduces chances of having difficulties along the way.Laravel also has a very large dev community, it offers a lot of support thanks to forums, blogs and tutorials. This strong community ensure
   the availability of necessary ressources to learn and overcome any struggles along the way.This framework will also come with all necessary equipment such as authentication, database migrations
   and task scheduling. These built-in tools make it all inclusive in one app and minimize the reliance on third-party programs or libraries.
#### Qualitative Assessment:  
  *(to do)*
##### Strengths  
  Compared to other PHP frameworks, Laravel thrives in code simplicity, community support, built-in features and Eloquent ORM. Which are all very desirable when choosing a framework.
##### Weaknesses  
  On the other hand though, Laravel may struggle with a steep learning curve, complexity for small projects, version compatibility issues and shared hosting limitations that require specific server configurations.
##### Use Cases  
 Some key use cases of Laravel are:  
- Enterprise Level Apps: Laravel empowers large-scale apps, it flourishes when handling numerous users, ensuring high performance and maintaining secure code.
- Industry specific Apps: It adapts well to various industries, devs can leverage its features to build solutions for specific business needs.
- Banking and Fintech Apps: With security and reliability as necessities, Laravel’s built-in security features make it a solid choice for banking and Fintech apps.
- E-commerce Platforms: With its extensibility, it allows devs to create feature-rich e-commerce platforms, with features that support payment gateways, inventory management, order processing etc..

##  3.2 Frontend Frameworks

### 3.2.1 HTML/CSS/JS & Libraries
#### Description: Brief overview of Framework X.
  HTML is the standard markup language for creating web pages, CSS is the stylesheet language used to style & format HTML, and JS is the scripting language used to make web pages dynamic. Libraries such as
  Bootstrap, JQuery, or HTMX, build on top of these 3 technologies to provide developers with pre-defined and reusable functionality.
#### Rationale:
  The team is generally inexperienced building fully fledged web applications, so starting with basic HTML, CSS, and JavaScript is straightforward and allows for a solid understanding of the core web technologies. 
  We can offset the increased development time (due to building the client-side from the ground up) by using libraries such as Bootstrap, JQeury, and/or HTMX. These libraries also allow us to extend
  functionality without needing to learn a new language.
  Developers also have total control of the client-side of the application, which can be beneficial for learning and debugging.
#### Qualitative Assessment:
##### Strengths
  Ease of integration, developer experience, responsiveness, performance, cross browser compatibility, community support and capabilities are relative advantages of using HTML/CSS/JS with libraries.
##### Weaknesses
  Poor modularity potential and lack of component libraries are disadvantages of this front-end “framework”.
##### Use Cases
  The choice of HTML/CSS/JS/Libraries over a full fledged front-end framework static sites, prototypes, lightweight applications, and performance-critical applications.

### 3.2.2 React
#### Description:  
  React is a javascript library that is commonly used for building user interfaces. Every React web app is composed of reusable components which will then make up parts of the user interface.
  That means we can have a separate component for each part (nav bar, footer, main etc.) React component are just simple javascript functions that will allow us to create, maintain, and delete UI elements.
  Also in a team it would permit us to easily combine components written by different people. On top of that we can add interactivity to components and update the screen in response to different user actions.
  This makes React a great choice for someone who is looking to build an entire app or a dynamic web interface.
#### Rationale:
  React’s core concept revolves around working with components, as we said earlier these reusable building blocks will allow devs to create nice modular UI elements. Whether it’s a small button or a whole page,
  React will make it simple to manage and maintain our user interface. Also, React uses a virtual DOM to optimize rendering performance. React will calculate the minimal updates needed when data changes so that
  it efficiently updates the actual DOM. This would result in a faster page rendering and smoother user experience. React also has a vast ecosystem of third-party libraries and tools with some like React Router,
  Redux or tailwind CSS that respectively help with routing, state management and styling. This rich ecosystem allows us devs to choose and customize tools tailoring them to our needs. Plus, React has a thriving
  community with a lot of tutorials, blogs, stack overflow discussions etc. Wether we’re beginners or experts, we will find answers to any question we have. Furthermore, React is also maintained by Facebook,
  which means that since such a big company is maintaining it then it will always be actively developed and tested. Many major companies cuh as Facebook, Instagram and AirBnB use React in production which
  reinforces its reliability. Finally, The learning curve is gentle, as we are familiar with JavaScript and HTML we can start building React apps quickly, its simple and reduces barrier for new devs.
#### Qualitative Assessment:
##### Strengths
  The strengths of React are that its easy to learn, it employs virtual DOM, it has reusable components, it follows one-way data flow and its friendly with search engine optimization (SEO).
##### Weaknesses
  The weaknesses associated with React are lack of proper documentation, development speed, JSX complexity (could be a stumbling block for beginners) and problems with SEO (proper implementation requires expertise).
##### Use Cases
  Some key use cases:  
-  SPA (Single-Page Applications): It is excellent for building high-performance SPAs.  
-  Interactive User Interfaces: React makes it easy to create interactive UIs with its component-based architecture.  
-  Progressive Web Apps (PWAs): It can be used to build PWAs, which are web apps that can function like native mobile apps.
-  Real time Apps: React can be used in real0time apps like chat applications, game applications, etc.
-  Content Management Systems: React could be used to build the frontend of CMSs, providing a nice responsive and interactive user experience.

### Vue.js
#### Description:
  Vue.js, pronounced just like “view”, is used to build interactive web interfaces. It focuses on the view layer only, which makes it easy for us to integrate it with other libraries or existing projects. 
  Vue.js provides the benefits of reactive data binding and composable view components with a simple API. It’s capable of powering complicated single-page applications when used with the proper tools and 
  supporting libraries.
#### Rationale:
  Vue.js has a lenient learning curve. Basic knowledge of HTML,CSS and JavaScript is all that is needed to start working with Vue.js. It is tremendously adaptable, it is flexible and we do not have to understand
  all the concepts in-depth. It also has an active community, which provides a lot of resources and support. It is also a great wen we need to integrate with current MPAs(Multiple Page Applications) and SPAs 
  (Single Page Applications) rendered by the server. It aswell offers multiple ways to be able to apply transitions to HTML elements when they are added, updated, or removed from the DOM.
#### Qualitative Assessment:
##### Strengths
-  Simplicity: Vue.js outlines the web app dev cycle by automating tasks such as linking data to DOM, creating watchers for each component and taking care of configurations.
-  Performance: Vue.js operates using virtual DOM, which allows for efficient testing of design and viewing of UI changes
-  Solid tooling ecosystem: It has a rich ecosystem and active community
-  Smooth learning curve: it has a smooth learning curve, which makes it accessible to devs with basic knowledge of web dev.
-  Reusability: The component-based approach of VUe enables the formation of reusable single file components.
##### Weaknesses
Language Barrier: Vue.js was created by a Chinese-American so a big part of the community is non-English speaking. WHich could complicate things for English-speaking devs such as ourselves.
Community Size: vue.js has a smaller community compared to some other frameworks, which may lead to a lack of resources and support.
Scalability: vue.js can face challenges when scaling large projects since it has a less mature ecosystem.
Dependency: VUe.js is very reliant on external libraries from the javascript ecosystem for advanced features.
##### Use Cases
-  Navigation Menu: it can be used to build simple,interactive nav bars.
-  Built-in Editor: It can handle models with predefined values, making it suitable for creating built-in editors.
-  Order form: It is also ideal to create dynamic order forms that show the total cost of certain selected services using vue.js
-  Instant Search: Vue.js can be used to implement an instant search feature which could be essential in some cases.
-  Popular web applications like Netflix, chess.com, GitLab and Grammarly rely on vue.js to create strong user interfaces.

# 4. Integration and Interoperability
## 4.1 Backend-Frontend Integration

Our project will utilize Express on the backend and leverage HTML, CSS, and JavaScript on the frontend (including libraries that consist of these technologies). Will we integrate the backend and frontend by using a templating engine to generate HTML files on the backend, and we will then serve these to the client side with publicly visible CSS and JavaScript files.

The templating engine of choice is the embedded JavaScript (EJS) templating engine, so that templates can be defined using a familiar HTML markup and JavaScript syntax.

Component-based reusability and custom functionality will be on the front-end using JavaScript web components, where needed. The HTMX library will be used to add interactivity and partial page reloads, and the Bootstrap library will be employed to facilitate styling and to maintain a consistent look.

## 4.2 Third-Party Services Adam Tahle

- Google Maps API: API for the map and how to get to the rental offices/cars
- Gas Prices API: API to track gas prices per day (additional feature) and showcase them on the website.
- The Google Maps Directions or Routes API.

# 5. Security Considerations

The security measures will make use of the features of node.js and libraries offered by mongo db. On the backend, we will utilize the Passport.js library, an authentication middleware of Node.js to handle the various user authentication strategies. Specifically, using the local-passport-mongoose library  to store the user's credentials locally. Also we will use the .env library to manage environment variables, in order, to separate the sensitive information and credentials from the codebase. On the frontend, we will implement cross-site scripting protection and cross-site request forgery protection. In order to prevent attackers from performing unwanted actions. 

# 6. Conclusion

In summary, during the first sprint, our team weighs the pros and cons of the different project approach and technology stack. We then come to choose Agile as the development methodology, for its flexible approach that prioritizes collaboration, adaptability and customer satisfaction. By delivering softwares in small incremental releases, it allows continuous improvement and responsiveness to changing requirements. Agile methodologies contribute to frequent communication among team members, regular reassessment of project goals, and the ability to adjust development priorities based on customer feedback throughout the development process. We also decided to use Express as the web framework for its minimalist, simplicity and adaptability. The built- in web server allows developers to focus on core functionality. The large community offers solutions to common problems. In order to comply to inexperienced web developers.

# Installation Instructions

This project is built on Express, a Node.js framework. Node.js and the [Node.js package manager (npm)](https://nodejs.org/en/learn/getting-started/an-introduction-to-the-npm-package-manager)
must be installed in order to run the application.

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
