/**
 * Barking Bear — Contact / Booking form behavior
 * - Add / remove multiple dogs (each with notes + crate-trained status)
 * - Show "specific dates when boarding is needed" (multiple date pickers) when
 *   Dog Boarding or Board and Train is selected
 * - Show "Who can we thank..." when Referral/Word of Mouth is selected
 * - Phone number formatting
 * - Custom validation + AJAX submit to forms/contact.php
 */
(function () {
  "use strict";

  var form = document.querySelector(".bb-contact-form");
  if (!form) return;

  var dogList = document.getElementById("dogList");
  var addDogBtn = document.getElementById("addDog");
  var boardingWrap = document.getElementById("boardingDatesWrap");
  var boardingDateList = document.getElementById("boardingDateList");
  var addBoardingDateBtn = document.getElementById("addBoardingDate");
  var boardingCheckboxes = form.querySelectorAll(".bb-boarding-service");
  var referralNameWrap = document.getElementById("referralNameWrap");
  var referralNameInput = document.getElementById("referral_name");
  var referralRadios = form.querySelectorAll('input[name="referral"]');
  var phone = document.getElementById("phone");

  var errorMsg = form.querySelector(".error-message");
  var sentMsg = form.querySelector(".sent-message");
  var loadingMsg = form.querySelector(".loading");

  var SEX_OPTIONS = ["Male Intact", "Male Neutered", "Female Intact", "Female Spayed"];
  var AGE_OPTIONS = [
    "Under 6 months", "6 months – 1 year",
    "1 year", "2 years", "3 years", "4 years", "5 years",
    "6 years", "7 years", "8 years", "9 years", "10 years",
    "11 years", "12 years", "13 years", "14 years", "15+ years"
  ];
  var CRATE_OPTIONS = ["Yes", "No", "Other"];

  function buildSelect(name, options) {
    var html = '<select name="' + name + '" class="form-select"><option value="">Select...</option>';
    options.forEach(function (o) { html += '<option>' + o + "</option>"; });
    html += "</select>";
    return html;
  }

  function dogCardHtml() {
    return (
      '<div class="bb-dog-card" data-dog>' +
        '<div class="bb-dog-head">' +
          '<span class="bb-dog-title">Dog</span>' +
          '<button type="button" class="bb-remove-dog">Remove</button>' +
        "</div>" +
        '<div class="row g-3">' +
          '<div class="col-md-6 col-lg-3">' +
            '<label class="bb-label">Name <span class="bb-req">*</span></label>' +
            '<input type="text" name="dog_name[]" class="form-control" required>' +
          "</div>" +
          '<div class="col-md-6 col-lg-3">' +
            '<label class="bb-label">Sex &amp; S/N</label>' +
            buildSelect("dog_sex[]", SEX_OPTIONS) +
          "</div>" +
          '<div class="col-md-6 col-lg-3">' +
            '<label class="bb-label">Age</label>' +
            buildSelect("dog_age[]", AGE_OPTIONS) +
          "</div>" +
          '<div class="col-md-6 col-lg-3">' +
            '<label class="bb-label">Breed/Mix</label>' +
            '<input type="text" name="dog_breed[]" class="form-control">' +
          "</div>" +
          '<div class="col-md-6 col-lg-3">' +
            '<label class="bb-label">Crate Trained?</label>' +
            buildSelect("crate_trained[]", CRATE_OPTIONS) +
          "</div>" +
        "</div>" +
        '<label class="bb-label">Any behavioral/medical details to be aware of</label>' +
        '<textarea name="dog_notes[]" class="form-control" rows="3" ' +
          'placeholder="social style with dogs, behavioral challenges, food allergies, etc"></textarea>' +
      "</div>"
    );
  }

  function renumberDogs() {
    var cards = dogList.querySelectorAll("[data-dog]");
    cards.forEach(function (card, i) {
      card.querySelector(".bb-dog-title").textContent = "Dog " + (i + 1);
      card.querySelector(".bb-remove-dog").style.display = cards.length > 1 ? "" : "none";
    });
  }

  function addDog() {
    dogList.insertAdjacentHTML("beforeend", dogCardHtml());
    renumberDogs();
    dogList.lastElementChild.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  addDogBtn.addEventListener("click", addDog);

  dogList.addEventListener("click", function (e) {
    if (e.target.classList.contains("bb-remove-dog")) {
      e.target.closest("[data-dog]").remove();
      renumberDogs();
    }
  });

  // ---- Boarding dates (multiple date pickers) ----
  function boardingDateRowHtml() {
    return (
      '<div class="bb-date-row" data-date>' +
        '<input type="date" name="boarding_dates[]" class="form-control" required>' +
        '<button type="button" class="bb-remove-date">Remove</button>' +
      "</div>"
    );
  }

  function renumberBoardingDates() {
    var rows = boardingDateList.querySelectorAll("[data-date]");
    rows.forEach(function (row) {
      row.querySelector(".bb-remove-date").style.display = rows.length > 1 ? "" : "none";
    });
  }

  function addBoardingDate() {
    boardingDateList.insertAdjacentHTML("beforeend", boardingDateRowHtml());
    renumberBoardingDates();
  }

  addBoardingDateBtn.addEventListener("click", addBoardingDate);

  boardingDateList.addEventListener("click", function (e) {
    if (e.target.classList.contains("bb-remove-date")) {
      e.target.closest("[data-date]").remove();
      renumberBoardingDates();
    }
  });

  function updateBoardingDates() {
    var anyBoarding = Array.prototype.some.call(boardingCheckboxes, function (c) { return c.checked; });
    boardingWrap.hidden = !anyBoarding;
    if (anyBoarding && boardingDateList.children.length === 0) {
      addBoardingDate();
    }
    if (!anyBoarding) {
      boardingDateList.innerHTML = "";
    }
  }
  boardingCheckboxes.forEach(function (cb) { cb.addEventListener("change", updateBoardingDates); });

  // ---- Referral name conditional ----
  function updateReferralName() {
    var checked = form.querySelector('input[name="referral"]:checked');
    var show = checked && checked.value === "Referral/Word of Mouth";
    referralNameWrap.hidden = !show;
    referralNameInput.required = !!show;
    if (!show) referralNameInput.value = "";
  }
  referralRadios.forEach(function (r) { r.addEventListener("change", updateReferralName); });

  // ---- Phone formatting -> (000) 000-0000 ----
  if (phone) {
    phone.addEventListener("input", function () {
      var d = phone.value.replace(/\D/g, "").slice(0, 10);
      var f = d;
      if (d.length > 3) f = "(" + d.slice(0, 3) + ") " + d.slice(3, 6);
      else if (d.length > 0) f = "(" + d.slice(0, 3);
      if (d.length >= 7) f += "-" + d.slice(6, 10);
      phone.value = f;
    });
  }

  // ---- Submit ----
  function showError(msg) {
    errorMsg.innerHTML = msg;
    errorMsg.classList.add("d-block");
    loadingMsg.classList.remove("d-block");
    sentMsg.classList.remove("d-block");
  }
  function clearMsgs() {
    errorMsg.classList.remove("d-block");
    sentMsg.classList.remove("d-block");
    loadingMsg.classList.remove("d-block");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearMsgs();

    if (form.querySelectorAll('input[name="services[]"]:checked').length === 0) {
      showError("Please select at least one service.");
      return;
    }
    var dogNameInputs = form.querySelectorAll('input[name="dog_name[]"]');
    var hasDog = Array.prototype.some.call(dogNameInputs, function (i) { return i.value.trim() !== ""; });
    if (!hasDog) {
      showError("Please add at least one dog (name is required).");
      return;
    }
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    loadingMsg.classList.add("d-block");

    fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { "X-Requested-With": "XMLHttpRequest" }
    })
      .then(function (r) {
        if (!r.ok) throw new Error(r.status + " " + r.statusText);
        return r.text();
      })
      .then(function (data) {
        loadingMsg.classList.remove("d-block");
        if (data.trim() === "OK") {
          sentMsg.classList.add("d-block");
          form.reset();
          dogList.innerHTML = "";
          boardingDateList.innerHTML = "";
          addDog();
          updateBoardingDates();
          updateReferralName();
          form.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          showError(data || "Submission failed. Please try again.");
        }
      })
      .catch(function (err) {
        showError(err.message || "Submission failed. Please try again.");
      });
  });

  // initial state
  addDog();
  updateBoardingDates();
  updateReferralName();
})();
