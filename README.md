# JSLoader
=====

# Overview
JSLoader populates a table with data from 'data/articles.json' and 'data/more-articles.json', loading 10 rows at a time.
-  The table can be sorted via the 'words' and 'submitted' columns
-  The sort preference is saved in a cookie called "sortby." It is automatically set when the user returns to the page
-  Design elements are based on SheThinx.com

# Organization
- /data: contains JSON files
- /node_modules: required modules
- /public/assets: contains all images and fonts
- /public/scripts: contains all scripts including minified and formatted versions
- /public/stylesheets: contains minified and formatted versions of the [single] stylesheet. No CSS preprocessor was used in this project
- /views/: contains Jade templates

# Customization
-  Load increment can be changed by setting a new number in the variable "load" in /public/scripts/main.js
-  Additional routes can be added in app.js

# Built With
jQuery is used for all UI
jQuery TableSorter v2.27.5
Jade is used for the templating engine
Built with Node.js

# Install
Package includes all files including required node modules: Express and Moment. Recommended: Nodemon

Set to run on http://localhost:3000

[VIEW DEMO](https://aqueous-harbor-83322.herokuapp.com) on [Heroku](http://herokuapp.com)
