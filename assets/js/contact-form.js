/**
 * Barking Bear — Contact / Booking form behavior
 * - Add / remove multiple dogs (each with notes + crate-trained status + crate-other detail)
 * - Show boarding date pairs (check-in / check-out) when Dog Boarding or Board and Train is selected
 * - "Other" follow-up free-text fields for: service, crate trained, "I'd like to", referral
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
  var phone = document.getElementById("phone");

  // "Other" conditionals
  var serviceOtherCb = form.querySelector('input[name="services[]"][value="Other"]');
  var serviceOtherWrap = document.getElementById("serviceOtherWrap");
  var serviceOtherInput = document.getElementById("service_other");

  var contactPrefRadios = form.querySelectorAll('input[name="contact_preference"]');
  var likeToOtherWrap = document.getElementById("likeToOtherWrap");
  var likeToOtherInput = document.getElementById("like_to_other");

  var referralRadios = form.querySelectorAll('input[name="referral"]');
  var referralNameWrap = document.getElementById("referralNameWrap");
  var referralNameInput = document.getElementById("referral_name");
  var referralOtherWrap = document.getElementById("referralOtherWrap");
  var referralOtherInput = document.getElementById("referral_other");

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
        '<div class="bb-crate-other-row" hidden>' +
          '<label class="bb-label">Please specify crate trained details</label>' +
          '<input type="text" name="crate_other[]" class="form-control" placeholder="Please specify">' +
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

  // Show crate-trained "Other" detail field when "Other" is chosen on a dog
  dogList.addEventListener("change", function (e) {
    if (e.target.matches && e.target.matches('select[name="crate_trained[]"]')) {
      var card = e.target.closest("[data-dog]");
      var row = card.querySelector(".bb-crate-other-row");
      var show = e.target.value === "Other";
      row.hidden = !show;
      var input = row.querySelector("input");
      input.required = show;
      if (!show) input.value = "";
    }
  });

  // ---- Boarding date pairs (check-in / check-out) ----
  function boardingDateRowHtml() {
    return (
      '<div class="bb-date-pair" data-date>' +
        '<div class="bb-date-field">' +
          '<label class="bb-label">Check-in <span class="bb-req">*</span></label>' +
          '<input type="date" name="boarding_checkin[]" class="form-control" required>' +
        "</div>" +
        '<div class="bb-date-field">' +
          '<label class="bb-label">Check-out <span class="bb-req">*</span></label>' +
          '<input type="date" name="boarding_checkout[]" class="form-control" required>' +
        "</div>" +
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

  // ---- Service "Other" conditional ----
  function updateServiceOther() {
    var show = serviceOtherCb.checked;
    serviceOtherWrap.hidden = !show;
    serviceOtherInput.required = show;
    if (!show) serviceOtherInput.value = "";
  }
  serviceOtherCb.addEventListener("change", updateServiceOther);

  // ---- "I'd like to" "Other" conditional ----
  function updateContactPreference() {
    var checked = form.querySelector('input[name="contact_preference"]:checked');
    var show = checked && checked.value === "Other";
    likeToOtherWrap.hidden = !show;
    likeToOtherInput.required = !!show;
    if (!show) likeToOtherInput.value = "";
  }
  contactPrefRadios.forEach(function (r) { r.addEventListener("change", updateContactPreference); });

  // ---- Referral conditionals (Referral name + Other detail) ----
  function updateReferralFields() {
    var checked = form.querySelector('input[name="referral"]:checked');
    var val = checked ? checked.value : "";
    var showName = val === "Referral/Word of Mouth";
    var showOther = val === "Other";
    referralNameWrap.hidden = !showName;
    referralNameInput.required = showName;
    if (!showName) referralNameInput.value = "";
    referralOtherWrap.hidden = !showOther;
    referralOtherInput.required = showOther;
    if (!showOther) referralOtherInput.value = "";
  }
  referralRadios.forEach(function (r) { r.addEventListener("change", updateReferralFields); });

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
    var phoneDigits = phone ? phone.value.replace(/\D/g, "") : "";
    if (phoneDigits.length !== 10) {
      showError("Please enter a valid 10-digit phone number.");
      if (phone) phone.focus();
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
          updateServiceOther();
          updateContactPreference();
          updateReferralFields();
          sentMsg.scrollIntoView({ behavior: "smooth", block: "center" });
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
  updateServiceOther();
  updateContactPreference();
  updateReferralFields();
})();
