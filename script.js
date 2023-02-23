"use strict";

// BANKIST APP

// Data
const account1 = {
  owner: "Silvana Vidmar",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2023-02-14T21:31:17.178Z",
    "2023-02-15T07:42:02.383Z",
    "2023-02-13T09:15:04.904Z",
    "2023-02-10T10:17:24.185Z",
    "2023-02-08T14:11:59.604Z",
    "2023-02-07T17:01:17.194Z",
    "2020-07-11T23:36:17.929Z",
    "2020-07-12T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    "2023-02-14T21:31:17.178Z",
    "2023-02-15T07:42:02.383Z",
    "2022-02-13T09:15:04.904Z",
    "2023-02-10T10:17:24.185Z",
    "2021-02-08T14:11:59.604Z",
    "2023-02-07T17:01:17.194Z",
    "2021-07-11T23:36:17.929Z",
    "2020-07-12T10:51:36.790Z",
  ],
  currency: "CNY",
  locale: "en-US",
};

const account4 = {
  owner: "Rita Nicolas",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    "2023-02-14T21:31:17.178Z",
    "2023-02-15T07:42:02.383Z",
    "2023-02-13T09:15:04.904Z",
    "2023-02-10T10:17:24.185Z",
    "2019-02-08T14:11:59.604Z",
    "2015-02-07T17:01:17.194Z",
    "2018-07-11T23:36:17.929Z",
    "2020-07-12T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "en-US",
};

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnHomePage = document.querySelector(".logo");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");
const inputAmountLabel = document.querySelector(".form__label--loan");

// APPLICATION
let currentAccount, timer;

// TODO: calculate Current Date
const displayMovements = function (account, sort = false) {
  const movs = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;
  // making sure the default values are not exisiting
  containerMovements.innerHTML = "";

  // DATE FUNCTIONALITY
  // const currentAccountDate = currentAccount.movementsDates.map((date) => {
  //   const creatingDate = Number(new Date(date));
  //   return creatingDate;
  // });
  movs.forEach((movement, index) => {
    const daysPassed = (date1, date2) => {
      const days = Math.abs(
        Math.trunc((+date1 - +date2) / (1000 * 60 * 60 * 24))
      );
      if (days === 0) return `TODAY`;
      if (days === 1) return `YESTERDAY`;
      if (days <= 7) return `${days} DAYS AGO`;
      else {
        const indexDate = new Date(currentAccount.movementsDates[index]);
        return new Intl.DateTimeFormat(currentAccount.locale).format(indexDate);
      }
    };
    const displayDate = daysPassed(
      +new Date(currentAccount.movementsDates[index]),
      new Date()
    );
    const options = {
      style: "currency",
      currency: account.currency,
    };
    const movementFormatted = new Intl.NumberFormat(
      currentAccount.locale,
      options
    ).format(movement);
    const type = movement < 0 ? "withdrawal" : "deposit";
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>
    
      <div class="movements__date">${displayDate}</div> 
      <div class="movements__value">${movementFormatted}</div>
      
  </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

// TODO: Sort the array of the movements on click
let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
// function in order to create the usernames / login names
// TODO:
const createUsernames = (accounts) => {
  // here we used foreach as we wanted to impact the original object not create a new one so we did not use map
  accounts.forEach((account) => {
    account.username = account.owner
      .toLowerCase() // to lower case the names to make sure there are no weird capitlizations
      .split(" ") // split the name into parts with spaces to loop over each element seprately and pick the first letter out
      .map((currentEl) => currentEl[0]) // here we used .map as we wanted to create a new array not use the old one
      .join(""); // to join all in one string the seprated letters stored in the new array that the map generated
  });
};
createUsernames(accounts);

// when we log this we can see that the side effects have changed on the main object => "accounts"

// function to calculate the balance

// TODO:

const calculateBalance = (account) => {
  const balance = account.movements.reduce((acc, movement) => acc + movement);
  account.balance = balance;
  const options = {
    style: "currency",
    currency: account.currency,
  };
  labelBalance.innerHTML = `${new Intl.NumberFormat(
    currentAccount.locale,
    options
  ).format(balance)}`;
};

// function to display incomes outcomes and interest

// Each account has it's own interest to be calculated

// TODO:

const calcDisplaySummary = function (account) {
  const options = {
    style: "currency",
    currency: account.currency,
  };
  const summaryFormatted = new Intl.NumberFormat(
    currentAccount.locale,
    options
  );
  // displaying the incomes
  const incomes = account.movements
    .filter((movement) => movement > 0)
    ?.reduce((acc, movement) => acc + movement);
  labelSumIn.innerHTML = `${summaryFormatted.format(incomes)}`;
  // displaying the outcomes
  const outcomes = account.movements.filter((movement) => movement < 0);
  if (outcomes.length === 0) {
    labelSumOut.innerHTML = `${summaryFormatted.format(Math.abs(outcomes))}`;
  }
  const outcomesReduced = outcomes.reduce((acc, movement) => acc + movement);

  labelSumOut.innerHTML = `${summaryFormatted.format(
    Math.abs(outcomesReduced)
  )}`;
  // displaying the interest
  const interest = account.movements
    .filter((movement) => movement > 0)
    .map((movement, i, arr) => (movement * account.interestRate) / 100)
    .filter((interest, i, arr) => {
      return interest >= 1;
    })
    ?.reduce((acc, movement) => acc + movement, 0);
  labelSumInterest.innerHTML = `${summaryFormatted.format(interest)}`;
};

// update the UI

const updateUi = function (account) {
  displayMovements(account);
  calculateBalance(account);
  calcDisplaySummary(account);
};

// START LOGOUT TIMER

const logoutTimer = function () {
  // set the timer to 5 minutes
  let time = 300;
  // callback function that will be passed in the setInterval to avoid the 1s delay at first it has

  const tick = function () {
    let min = time / 60; // 5
    let seconds = time % 60;
    labelTimer.textContent = `${String(Math.trunc(min)).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;

    if (time === 0) {
      // Stop the timer
      clearInterval(timer);
      // Hide the UI
      containerApp.style.opacity = 0;
      // setting the welcome message back to default
      labelWelcome.textContent = `Log in to get started`;
      currentAccount = undefined;
    }
    // we are decreasing the time by time this callback function is called
    // we had to put the time below the if statement because it was logging the user out at 1 second left since it was still in the same iteration and then checked if the time was equal to zero which was true however we want it after the if statement
    time -= 1;
  };
  // we are immediately calling the function so we avoid the first exectution of waiting 1s to be executed
  tick();
  // then after 1 seconds we will keep calling tick over and over...
  const timer = setInterval(tick, 1000);
  return timer;
};
// TODO: LOGIN FUNCTIONALITY

// Event Handlers

btnLogin.addEventListener("click", function (e) {
  // this prevents the default behavior from taking place in this case the button is connected to a form therefore on click the default behavior of the link is to reload the page as an indication the form was submitted!
  e.preventDefault();
  // TIMER
  if (timer) clearInterval(timer); // this executes only in the second login functionality when another user logs in as the timer value is not set to that id
  timer = logoutTimer(); // here in the first log in the timer value is undefined as its decalred as a global variable

  currentAccount = accounts.find(
    (account) => account.username === inputLoginUsername.value
  );
  // CHECKING THAT INPUT FIELDS ARE NOT EMPTY
  if (inputLoginUsername === "" || inputLoginPin.value === "") {
    alert("Please Enter a username and password to login!");
    currentAccount = undefined;
  } else if (
    // condition that both the username and password matches the current account
    currentAccount?.username === inputLoginUsername.value &&
    currentAccount?.pin === Number(inputLoginPin.value)
  ) {
    // we will use the find method to find out the current account the person is logging into

    // Displaying the person that logged in name in the welcome statement
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;

    const userLocale = currentAccount.locale;
    // Using the internalization api to create the current date
    const now = new Date();
    // second argument that the intl function receives to be able to customize the way the dates are formatted
    const options = {
      hour: "numeric",
      month: "numeric",
      minute: "numeric",
      day: "numeric",
      year: "numeric",
    };
    labelDate.innerHTML = new Intl.DateTimeFormat(userLocale, options).format(
      now
    );
    // emptying the values of the login input fields after the user logged in

    inputLoginUsername.value = "";
    inputLoginPin.value = "";

    // clear the focus on the input field after logging

    inputLoginPin.blur();

    // implementing the opacity transition if the user logged in

    containerApp.style.opacity = 1;

    // Function to display the movements of the current user. The user data is captured from the input field
    displayMovements(currentAccount);
    // we are calculting the balance upon the username Received from the input field by calling the function that we setup earlier
    calculateBalance(currentAccount);
    // we are calculating the summary of the balances by calling the function that we setup earlier
    calcDisplaySummary(currentAccount);
  } else {
    currentAccount = undefined;
    alert("Please Enter a correct username and password to login!");
  }
  // ARRAY.FROM implementation
  // const movementUI = Array.from(
  //   document.querySelectorAll(".movements__value"),
  //   (movement) => Number(movement.textContent.replace("€", ""))
  // );
  // console.log(movementUI);
});

// TODO: TRANSFERING MONEY FUNCTIONALITY

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();

  console.log("---- CURRENT ACCOUNT ----");
  console.log(currentAccount);

  // saving the value of the transferTo input field in a variable

  const transferUserName = inputTransferTo.value;

  // finding the account that the movement will be transferred to

  const transferToAccount = accounts.find((account) => {
    return account.username === transferUserName;
  });
  console.log("---- TRANSFER ACCOUNT ----");
  console.log(transferToAccount);

  const transferAmount = Number(inputTransferAmount.value);

  // Conditions before any transfer

  if (
    transferAmount > 0 &&
    transferToAccount &&
    currentAccount.balance >= transferAmount &&
    transferToAccount?.username !== currentAccount.username
  ) {
    // pushing the movement to the account that we transferred the money to

    transferToAccount.movements.push(transferAmount);
    // here we are pushing the current Date that the transfered account received the transfer amount
    transferToAccount.movementsDates.push(new Date().toISOString());
    // here we are pushing to the current Account the current Date the money was transfered out of the current Account
    currentAccount.movementsDates.push(new Date().toISOString());

    // these are the movements of the account we are transferring the money to
    console.log("---- TRANSFER ACCOUNT MOVEMENTS ----");
    console.log(transferToAccount.movements);

    // calling the function to update the balance
    calculateBalance(currentAccount);

    // subtracting the money transferred from the movements
    labelBalance.innerHTML = `${(currentAccount.balance -= transferAmount)}€`;

    currentAccount.movements.push(-transferAmount);

    // calling the function to update the movements of the current account

    displayMovements(currentAccount);

    // updating the summary income , outcomes and interest

    calcDisplaySummary(currentAccount);

    // resetting the timer
    clearInterval(timer);
    timer = logoutTimer();
    // movements of the current account after being subtracted
    console.log("CURRENT ACCOUNT MOVEMENTS");
    console.log(currentAccount.movements);

    // Clearing The Input Fields

    inputTransferTo.value = "";
    inputTransferAmount.value = "";
    inputTransferAmount.blur();
  } else {
    alert(
      "not enough funds or you may have entered a negative transfer amount or have tried sending money to an unknown account"
    );
  }
});

// TODO: TAKE A LOAN FUNCTIONALITY

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  // Resetting the timer

  // storing the loan amount requested in a variable
  let requestedLoanAmount = Math.floor(Number(inputLoanAmount.value));
  inputAmountLabel.innerHTML = "Please Wait...";
  if (
    currentAccount.movements.some((mov) => mov >= 0.1 * requestedLoanAmount) &&
    requestedLoanAmount > 0
  ) {
    const approvedLoan = setTimeout(() => {
      currentAccount.movements.push(requestedLoanAmount);
      currentAccount.movementsDates.push(new Date().toISOString());
      clearInterval(timer);
      timer = logoutTimer();
      updateUi(currentAccount);
      inputAmountLabel.innerHTML = "Approved Request";
    }, 2000);
    const changeLabelBack = setTimeout(
      () => (inputAmountLabel.innerHTML = "Amount"),
      4000
    );
  } else {
    setTimeout(() => {
      clearInterval(timer);
      timer = logoutTimer();
      inputAmountLabel.innerHTML = "Failed Request";
    }, 2000);
    const changeLabelBack = setTimeout(
      () => (inputAmountLabel.innerHTML = "Amount"),
      4000
    );
  }
  // Clearing the input fields after the if statement
  inputLoanAmount.value = "";
  inputLoanAmount.blur();
});

// TODO: Close Account Functionality

btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    // getting the index through the condition
    const index = accounts.findIndex(
      (account) => account.username === currentAccount.username
    );

    // GETTING THE INDEX ACCORDING TO THE CURRENT ACCOUNT
    accounts.splice(index, 1);

    // Hide the UI
    containerApp.style.opacity = 0;
  }
  // Clearing the fields
  inputCloseUsername.value = inputClosePin.value = "";

  // setting the welcome message back to default

  labelWelcome.textContent = `Log in to get started

  `;
});

// Home page functionality / logout
btnHomePage.addEventListener("click", function (e) {
  // logout message when clicking on the image logo upon the condition
  if (currentAccount !== undefined) {
    alert("you are about to log out!");
  }
  // clearing the currentAccount value
  currentAccount = undefined;
  // Hide the UI
  containerApp.style.opacity = 0;

  // setting the welcome message back to default
  labelWelcome.textContent = `Log in to get started`;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/////////////////////////////////////////////////

// arrays in javascript are basically objects and they get access to methods which are bascially just functions

// array methods

// let arr = ["a", "b", "c", "d", "e"];
// let arr2 = ["t", "e", "v", "f"];

// // SLICE

// console.log("SLICE METHOD --------------------------------");

// let newArr = arr.slice(2, 4);

// console.log(newArr);

// // this method returns a new array so its not  changing the original array the end parameter is not included in the output so 2,4 is really 2 and 3

// // Usually we use the slice method to do a shallow copy of the original array

// newArr = arr.slice();

// // we can also achive the same result with the spread operator however usually slice is used to be able to chain more than once method calls

// console.log(arr);

// console.log(newArr);

// // SPLICE

// console.log("SPLICE METHOD --------------------------------");

// // The main fundmental difference between splice and slice is that splice mutates in other words changes from the original array just like the example below

// // here we removed the last element in the newArr and when we logged the newArr it changed from the original array not return a new array like the slice method did

// // newArr.splice(-1);

// // the second parameter for the splice method sets deleting count how many elements will be removed from the start that you state

// console.log(newArr); // [a,b,c,d,e,]

// newArr.splice(1, 3); //  here we are starting at position 1 and deleting 3 elements

// console.log(newArr); // [a,e]

// // REVERSE METHOD --------------------------------

// console.log("REVERSE METHOD --------------------------------");

// // This method mutates the original array reverses  the order of the elements in the original array
// console.log(arr);

// console.log("reversed");

// arr.reverse();

// console.log(arr);

// // CONCAT METHOD --------------------------------

// console.log("CONCAT METHOD --------------------------------");
// const letters = arr.concat(arr2);
// // This merges the array passed in concat argument to the end of the array the method it was called on this does not mutate the original array

// console.log(letters);
// // same result can be achived with the rest operator
// // Reversing the array back to its original order

// arr.reverse();

// // JOIN METHOD -----------------------------------------------
// console.log("JOIN METHOD --------------------------------");
// // this method adds the string that is passed in as the argment to the method as a seprator in between each element of the array

// console.log(arr.join(" | "));

// // AT Method --------------------------------
// console.log("AT Method --------------------------------");
// const arr3 = [23, 11, 53];

// // old way

// console.log(arr3[0]);

// // rather than using the old bracket notation

// console.log(arr3.at(0));

// // getting the last element in an array

// console.log(arr3[arr3.length - 1]);
// // we can avoid doing this

// console.log(arr3.slice(-1)[0]);

// // however the at method simplifies this process

// console.log(arr3.at(-1));

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// // Traditional way of looping through an array
// for (const movement of movements) {
//   if (movement < 0) {
//     console.log(`you have withdrawn ${Math.abs(movement)}`);
//   } else {
//     console.log(`you have deposited ${movement}`);
//   }
// }
// // Separator
// console.log("*************");
// console.log("for each method ⬇️⬇️⬇️");
// console.log("*************");

// // for each Method

// // so basically forEach is a higher order function as we said that a higher order function is a function that takes a callback as an argument or returns a function so forEach will call this callback function of each iteration in this example we are telling it to console.log each element in the array

// // for each takes 3 parameters however it is okay to use 1, 2 or even 3 but the order the parameter are written in matters for the function to execute properly

// // 1st parameter = current element of the array
// // 2nd parameter = index of the element
// // 3rd parameter = the entire array

// movements.forEach(function (movement, index, array) {
//   movement < 0
//     ? console.log(
//         `Movement ${index + 1}: you have withdrawn ${Math.abs(movement)}`
//       )
//     : console.log(`Movement ${index + 1}: you have deposited ${movement}`);

//   console.log(`list of your movements ${array}`);
// });

// // you cannot break or continue with the foreach loop

// // with the for of loop you can but for the rest it is completely up to you what you want to use

// console.log("FOR EACH WITH MAP");
// const currencies = new Map([
//   ["USD", "United States dollar"],
//   ["EUR", "Euro"],
//   ["GBP", "Pound sterling"],
// ]);

// // for each can also be used with maps and sets

// currencies.forEach(function (value, key, map) {
//   console.log(` ${key} => ${value}`);
// });

// const currenciesUnique = new Set(["USD", "EUR", "GBP"]);
// // in the case for sets. Sets dont actally have a keys so the second parameter in sets is often ignored
// currenciesUnique.forEach(function (value, key, set) {
//   console.log(value, key, set);
// });

// DATA TRANSFORMATIONS ARRAY METHODS

// MAP

// map is similar to the for each method which loops through the array the differecne with map is it generates a completely new array from the original array that it looped through.

// map returns a new array containing the results of applying an operation on all original array elements

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const euroToUsd = 1.1;

// const movementsConvertedToUsd = movements.map((movement, index) => {
//   return Math.floor(movement * euroToUsd);
// });

// movements.map((movement, index) => {
//   console.log(`${index + 1}: ${movement}`);
// });
// console.log(movements);
// console.log("----conversion----");
// console.log(movementsConvertedToUsd);

// FILTER

// filter is used to filter elements in a new array that satisfy a certain condition all other elements will get filtered out and not included in the new array

// this more functional code and the big advantage is chaining methods instead of using the for loop
// const deposits = movements.filter(function (mov) {
//   return mov > 0;
// });

// // other way of filtering elements in a new array that satisfy the condition
// let depositArr = [];
// for (const mov of movements) {
//   if (mov > 0) {
//     depositArr.push(mov);
//   }
// }
// console.log("WITHDRAWALS with for loop ARRAY >>>>");
// console.log(depositArr);
// console.log("DEPOSITS ARRAY >>>>");
// console.log(deposits);

// const withdrawals = movements.filter((mov) => mov < 0);
// console.log("WITHDRAWALS ARRAY >>>>");
// console.log(withdrawals);
// // REDUCE

// console.log("<<<<< reduce method >>>>>");

// reduce boils (reduces) all array elementts down to one single value
// here the first parameter is the accumulator which we initialize it's value as the second argument to the reduce method

// accumulator is basically the same as declaring a sum value which will keep in memory the sum added and add the current element to it.

// ACCUMULATOR => SnowBall
// const balance = movements.reduce(function (acc, mov, i, arr) {
//   return acc + mov;
// }, 0);

// console.log(balance);

// maximum value

// let balance2 = movements.reduce((acc, currentElement) => {
//   currentElement > acc ? (acc = currentElement) : "";
//   return acc;
// }, movements[0]);

// console.log(balance2);

// chaining methods and converting the deposits from euro to dollars

// we can only chain one method after another if the method that is called returns a new array not a vlaue in example map and filter returns a new array but reduce returns a value
// const depositsConversion = movements
//   .filter((movement) => movement > 0)
//   .map((movement) => Math.floor(movement * 1.1))
//   .reduce((acc, movement) => acc + movement);
// labelBalance.innerHTML = depositsConversion + "$";

// Find Method

// returns the first value that meets it's criteria

// if it does not find the criteria then returns undefined

// find changes the value from the original array it does not create a new array

// const find = movements.find((movement) => movement > 0);
// console.log(movements);
// console.log(find);
// // Cool Example related to the bankist project

// // find allows us to search the array and look if the condition matches (true) if it is then the object is returned if not then undefined
// console.log("--------WITH FIND METHOD-------");
// const loopOverAccounts = accounts.find(
//   (account) => account.owner === "Jessica Davis"
// );
// console.log(loopOverAccounts);
// // With for of loop

// console.log("-----WITH FOR OF LOOP-------------");
// for (const account of accounts) {
//   if (account.owner === "Jessica Davis") {
//     console.log(account);
//   }
// }

// INCLUDES here only checks for equality
// console.log(movements.includes(-130));

// // SOME: is more complex as it takes a condition
// console.log(movements.some((mov) => mov > 2000));

// // EVERY: if every element passes the test  in our callback function then the method returns true

// console.log(account4.movements.every((mov) => mov > 0));

// // Call backs dont always have to be written as arguments they can be stored in a variable and then just pass it in the callback function that variable that we stored it in

// // const deposit = (mov) => mov > 0;

// FLAT Method
// puts all the elements at the same level in the array

// const balanceOfAllAccounts = accounts
//   .map((account) => account.movements)
//   .flat()
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(balanceOfAllAccounts);

// it's very common to first map and then flatten the array so there was a method add to js called flatMap which basically combines both the methods to improve the performance of the application.

// FlatMap Method
// FlatMap only goes one level deep so if we need to go deeper than we have to use the flat Method to determine how many levels deep to go

// const balanceOfAllAccounts = accounts
//   // at the end it flattens the result
//   .flatMap((account) => account.movements)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(balanceOfAllAccounts);

// // sorting arrays
// // when using the sort method it mutates the original array
// // if compare returs a negative number then remain the order of the arrays
// // if compare returs a positive number then change the same

// //

// const x = new Array(9); // when entering only one argument in the array constructor it generates an empty array with the length of the parameter you have set

// // console.log(x.fill(3)); // fill method fills up the array with the value set in the parameters this method overwrites the original array

// // in the fill method sort of acts like slice method we can define a start point

// console.log(x.fill(2, 3, 5)); // here we are setting a start and end point

// // Cleaner way of creating an empty array and the filling it with what we want
// // creating the array programmatically
// console.log(Array.from({ length: 7 }, (_, i) => i + 1));

// // Genereating 100 random dice rolls programatically
// const generateRandomDiceRoll = Array.from(
//   { length: 100 },
//   () => Math.floor(Math.random() * 6) + 1
// );
// console.log(generateRandomDiceRoll);

// // Array methods practice

// // calculate how much has been deposited in the back in all the accounts across the bank
// const bankDepositSum = accounts
//   .flatMap((account) => account.movements)
//   .filter((mov) => mov > 0)
//   .reduce((acc, currentEl) => acc + currentEl, 0);
// console.log(`Total Bank Deposits Across All Accounts: ${bankDepositSum}€`);

// // count how many deposits there has been with at least 1000 dollars

// const numDeposits1000 = accounts
//   .flatMap((account) => account.movements)
//   .filter((mov) => mov > 0 && mov >= 1000).length;
// console.log(`${numDeposits1000} deposits that are greater than 1000`);

// // WITH REDUCE
// // count how many deposits there has been with at least 1000 dollars

// // const numDeposits1000 = accounts
// //   .flatMap((account) => account.movements)
// //   .reduce(
// //     (count, currentElement) => (currentElement >= 1000 ? count + 1 : count),
// //     0
// //   );
// // console.log(`${numDeposits1000} deposits that are greater than 1000`);

// // create a new object which contains the sum of the deposits and the withdrawals
// const sums = accounts
//   .flatMap((account) => account.movements)
//   .reduce(
//     (acc, current) => {
//       current > 0 ? (acc.deposits += current) : (acc.withdrawals += current);
//       return acc;
//     },
//     // here this is the accumulator
//     { deposits: 0, withdrawals: 0 }
//   );
// console.log(sums);

// const title = function (title) {
//   const convertedTitle = title
//     .toLowerCase()
//     .split(" ")
//     .map((letters) => {
//       return letters.length > 1
//         ? letters.split("")[0].toUpperCase().concat(letters.slice(1))
//         : letters.toLowerCase();
//     })
//     .join(" ");
//   return convertedTitle;
// };
// console.log(
//   title(
//     "this is a great example as we can see the letters with the length of 1 such as b will not be capitalized"
//   )
// );
// console.log(
//   title(
//     "this is a GREAT example as we can see the letters with the length of 1 such as b will not be capitalized"
//   )
// );

// // checking that a number is NAN
// console.log(Number.isNaN(23 / 0));

// // using the finite method we can realy check that the value is a number or not as it does not care about wheter it's a string and detects that the number is not infinite
// // this is method is most commonly used
// console.log(Number.isFinite(23 / 3));
// // checks if the number is a whole number
// console.log(Number.isInteger(10));

// // parseInt converts the string to a number and removes the extra characters as long as the strings begins with a number

// console.log(Number.parseInt("30px"));
// // this would not work
// console.log(Number.parseInt("e30px"));

// // we can also parse floating numbers numbers with a decimal points

// console.log(Number.parseFloat("2.5rem"));

// // --------------MATH METHODS BUILT IN JAVASCRIPT------------

// // This simply removes any decimal points without rounding up or down
// console.log(Math.trunc(23.9)); // 23
// // this rounds to the nearest
// console.log(Math.round(23.9)); // 24
// // this rounds down alwaus

// console.log(Math.floor(23.9)); // 23

// // this rounds up alwauys

// console.log(Math.ceil(23.3)); // 24

// // ---------REMAINDER OPERATOR------------

// // [...document.querySelectorAll(".movements__row")].forEach((element, i) => {
// //   return i % 2 === 0
// //     ? (element.style.backgroundColor = "orange") &&
// //         (element.style.color = "white")
// //     : (element.style.backgroundColor = "lightgreen");
// // });

// NUMERIC SEPERATOR
// its more clear to the eye what number this is
// const diameter = 287_460_000_000;
// console.log(diameter);

// const priceCents = 359_99;

// console.log(priceCents);

// // example where the underscores would not work

// // setting the underscore not between numbers will result in an invalid error
// // const PI = 3._1415 here it would result in an invalid error also not at the beggining or end
// const PI = 3.14_15; // here it would be just fine
// console.log(PI);

// // when dealing with very huge numbers larger than the limit javascript has in place we have use the bigINt datatype

// // by implementing the n at the end we are telling javascript this number is a bigINt so it is able to display it more accurately

// const huge = 9341041984291312903124141241421431424n;
// console.log(huge);

// const num = 23;
// // however we cannot do any operation between a regular number and a bigint we have to convert that number to bigint first by using the big Int function
// // console.log(num * huge); // error

// console.log(BigInt(num) * huge); // works just fine

// // when using division with bigInt it will round to the nearest integer

// console.log(10n / 3n); // 3

// console.log(10 / 3); // 3.3333333333

// ************* DATES ************

// Creating a date 4 ways of creating a date
// this is the first method by creating a date trough the constructor this generates a the present date
// const now = new Date();
// console.log(now);

// // the other way is by entering a string in between the date function

// console.log(new Date("January 1 2022 23:50")); // however this is not a good way as it may create bugs in future

// // logging each date from the account => movementsDates
// const accountDates = account1.movementsDates.map((date) =>
//   console.log(new Date(date))
// );

// console.log(new Date(account1.movementsDates[0]));

// // year month day hour minute second we can paass in the constructor

// console.log(new Date(2022, 0 + 1, 7, 14, 24, 15));

// console.log(new Date(0)); // when passing in 0 it starts from january 1st 1970

// // we can also pass in a timestamp and it will calculate the date

// // 4 days after the New Date (0)
// console.log(new Date(4 * 24 * 60 * 60 * 1000)); // this returns a timestamp

// // WORKING WITH DATES each date as its methods that we can use
// console.log("---DATES WITH METHODS---");
// const future = new Date(2037, 10, 19, 15, 23);
// console.log(future.getFullYear()); // 2037
// console.log(future.getMonth()); // returns 10 but it is zero based so 10 is actually 11
// console.log(future.getDay()); // not the day of the month but the day of the week sunday = 0 so thursday = 4
// console.log(future.getHours()); // returnns the hours
// console.log(future.getMinutes()); // returns minutes
// console.log(future.getSeconds()); // returns seconds
// console.log(future.getTime()); // this returns the number of milliseconds passed since jan 1, 1970
// console.log(new Date(2142249780000)); // here we passed in the timestamp that we received from the getTime method

// // to get current Timestamp we dont even have to create a new date constructor

// console.log(Date.now()); // returns the current Timestamp

// // we can also mutate the date by using the setMetods on the the date

// future.setFullYear(2040); // here we overwrite the date that we created above
// future.setMonth(1); // we overwrite the month we had above
// console.log(future);

// ------------- TIMERS ----------

// setTimeout runs once after a set time

// since setTimeout it's first argument is a callback function the arguments of that callback have to be declared after the timer set so here we are passing ing1 and ing 2 after the timeout

// also with the setTimeout the callback function only runs once
// if we wanted to run multiple times then we use SetInterval

// -----------SET TIMEOUT--------
// const ingredients = ["mushrooms", "olives"];
// const timer = setTimeout(
//   (ing1, ing2) => console.log(`ingredients: ${ing1}, ${ing2}`),
//   3000,
//   ...ingredients // result of doing  we used the spread operator this is = mushrooms,olives
// );
// // we can also stop a timer by setting conditions before the timeout is reached

// if (ingredients.includes("mushrooms")) {
//   clearTimeout(timer); // to stop the timer we have to pass in it's name or in other words the variable name the timer was stored in
// }

// --------------SET INTERVAL-------------

// const createNewDate = () => new Date(); // function that creates a new date everytime called
// const interval = setInterval(
//   () =>
//     console.log(
//       `${String(createNewDate().getHours()).padStart(2, "0")}:${String(
//         createNewDate().getMinutes()
//       ).padStart(2, "0")}:${String(createNewDate().getSeconds()).padStart(
//         2,
//         "0"
//       )}`
//     ),
//   1000
// );
