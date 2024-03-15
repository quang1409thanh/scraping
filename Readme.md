# Project Description

This project utilizes Node.js libraries such as axios, cheerio, and fs to extract data from the digitallibrary website. It fetches information about vote counts from meetings held in various years and writes them to a CSV file for further processing.

## Usage Example:

```javascript
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

async function fetchDataAndWriteToFile(url, item, csvFilePath) {
  // Your implementation for fetching data and writing to file goes here
}

async function readDataFromFile(filename, csvFilePath) {
  // Your implementation for reading data from file and processing goes here
}

function sleep(ms) {
  // Function to introduce delay between requests
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Function to ensure directory existence
function ensureDirectoryExistence(filePath) {
  // Implementation to ensure directory existence goes here
}

// Function to clear directory
function clearDirectory(directory) {
  // Implementation to clear directory goes here
}

const outputDirectory = "rs";

clearDirectory(outputDirectory);
for (let year = 1992; year <= 1992; year++) {
  const filename = `datatest/${year}data.txt`;
  const csvFilePath = `${outputDirectory}/data${year}.csv`;
  ensureDirectoryExistence(csvFilePath);
  readDataFromFile(filename, csvFilePath);
}
