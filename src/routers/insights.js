const { response } = require("express");
const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

router.get("/categories", async (req, res, next) => {
  try {
    const url = "http://54.154.227.172:3000/transactions";

    const responses = await fetch(url).then((res) => res.json());
// added node-fetch and created an empty object called "categories".
    const categories = {};
//  assigned the fetched json data to "responses".
// looped through "responses" and defined each object as a "transaction"
// filtered through each transaction to pull the category and assigned this to the variable "cat".
    responses.forEach((transaction) => {
      const cat = transaction.category;
// if else statement added to check if an instance exists and add it to the object if it doesn't exist.
      if (categories[cat] == undefined) {
        categories[cat] = {
          totalNumber: 1,
          totalValue: transaction.amount,
          averageValue: transaction.amount,
        };
      } else {
        categories[cat] = {
          totalNumber: categories[cat].totalNumber + 1,
          totalValue: categories[cat].totalValue + transaction.amount,
        };
      }
    });

// Because it's an object of objects, used Object.keys(categories) to filter through the key/value
// pairs and pull out each category key

    Object.keys(categories).forEach((cat) => {
      categories[cat] = {
        ...categories[cat],
        averageValue: categories[cat].totalValue / categories[cat].totalNumber,
      };
    });

    res.status(200).json(categories);
  } catch (err) {
    return next(err);
  }
});

router.get("/cashflow", async (req, res, next) => {
  try {
    const url = "http://54.154.227.172:3000/transactions";

    const responses = await fetch(url).then((res) => res.json());

    const dates = {};
    responses.forEach((transaction) => {
      const d = new Date(transaction.paymentDate);
      if (dates[d] == undefined) {
        dates[d] = {
          totalNumber: 1,
          totalValue: transaction.amount,
          averageValue: transaction.amount,
        };
      } else {
        dates[d] = {
          totalNumber: dates[d].totalNumber + 1,
          totalValue: dates[d].totalValue + transaction.amount,
        };
      }
    });

    Object.keys(dates).forEach((day) => {
      dates[day] = {
        ...dates[day],
        averageValue: dates[day].totalValue / dates[day].totalNumber,
      };
    });

    const getDatesBetweenDates = (startDate, endDate) => {
      let dates = []
      const theDate = new Date(startDate)
      while (theDate < endDate) {
        dates = [...dates, new Date(theDate)]
        theDate.setDate(theDate.getDate() + 1)
      }
      return dates
    }

// takes in start and end dates, creates an array by iterating through the start and end dates given.

    let arrayOfDates = Object.keys(dates)
    .sort((a, b) => new Date(a) < new Date (b) ? -1: 1)

//gets the list of current date keys and sorts them then gets the keys of current object of dates and sorts them in order. 
    arrayOfDates = getDatesBetweenDates(new Date(arrayOfDates[0]), new Date(arrayOfDates[arrayOfDates.length - 1]))


    const ordered = {};
// taking the full list of dates and iterating through and creating the final object.
      arrayOfDates.forEach(function (key) {
        
        const d = new Date(key)
        const day = d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear();
// if the date key has values in the current date array then it creates a key/pair value in the new ordered object with the date and value from the original object
// else if there's no value, then create, add and return empty key/pair values. 
        ordered[day] = dates[key] || {totalNumber: 0, totalValue: 0, averageValue: 0}
      });



    res.status(200).json(ordered);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
