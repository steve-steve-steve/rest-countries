# REST Countries Single-Page Web Application

## Setup

### `npm install`

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### Design Notes

All the logical functionality takes place within `App.js` and the styling within `App.css`\
As per the tech brief I make use of `Ag-grid` to display the specified fields and harness the inbuilt sorting/filtering that it provides.

When a user selects a row within the grid I display further details of that country above the grid in a simple container.\
On page load the further details container is populated with the UK (`countries[129]`)  

I have not implemented the optional pagination feature.
