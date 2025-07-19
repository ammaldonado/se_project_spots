import "./index.css";

import {
  enableValidation,
  settings,
  disableButton,
  resetValidation,
} from "../scripts/validation.js";

import { setButtonText } from "../utils/helpers.js";

import Api from "../utils/Api.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "f6313078-8031-4548-9b9d-372a72d5b29d",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, userData]) => {
    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });
    profileName.textContent = userData.name;
    profileDiscription.textContent = userData.about;
    profileAvatar.src = userData.avatar; // we need this
  })
  .catch(console.error);

//profile elements
const profileEditButton = document.querySelector(".profile__edit-btn");
const cardModalButton = document.querySelector(".profile__add-btn");
const avatarModalButton = document.querySelector(".profile__avatar-btn");
const profileName = document.querySelector(".profile__name");
const profileDiscription = document.querySelector(".profile__discription");
const profileAvatar = document.querySelector(".profile__avatar");

const modals = document.querySelectorAll(".modal");

//form elements
const editProfileModal = document.querySelector("#edit-modal");
const editFormElement = editProfileModal.querySelector(".modal__form");
const editButtonElement = editProfileModal.querySelector(".modal__submit-btn");
const editModalCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editModalNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editModalDiscriptionInput = editProfileModal.querySelector(
  "#profile-discription-input"
);
const cardModal = document.querySelector("#add-card-modal");
const cardForm = cardModal.querySelector(".modal__form");
const cardSubmitBtn = cardModal.querySelector(".modal__submit-btn");
const cardModalCloseBtn = cardModal.querySelector(".modal__close-btn");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");
const previewModalCloseBtn = document.querySelector(
  ".modal__close-btn_type_preview"
);

//avatar form element
const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarSubmitBtn = avatarModal.querySelector(".modal__submit-btn");
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");

//delete form element
const deleteModal = document.querySelector("#delete-modal");
const deleteModalCTA = deleteModal.querySelector("#card-delete");
const deleteModalX = deleteModal.querySelector(".modal__close-btn");
const deleteModalCancel = deleteModal.querySelector("#card-delete-cancel");

//select the modal
const previewModal = document.querySelector("#preview-modal");
const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");

//card related elements
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

// the element of the last card that was clicked on
let selectedCard;
// the id of the last card that was clicked on
let selectedCardId;

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);
  const inputValues = { name: cardNameInput.value, link: cardLinkInput.value };
  api
    .addCard(inputValues)
    .then((data) => {
      const cardEl = getCardElement(data);
      cardsList.prepend(cardEl);
      closeModal(cardModal);
      evt.target.reset();
      disableButton(cardSubmitBtn, settings);
    })
    .catch((err) => {
      console.error(err);

      alert("Could not add new card");
    })
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

function handleLike(evt, data) {
  const cardLiked = evt.target.classList.contains("card__like-button_liked");
  console.log(cardLiked);
  console.log(data._id);
  api
    .changeLikeStatus(data._id, cardLiked)
    .then(() => {
      evt.target.classList.toggle("card__like-button_liked");
    })
    .catch(console.error);
}

function getCardElement(data) {
  console.log(data);
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardNameEl = cardElement.querySelector(".card__title");
  const cardLinkEl = cardElement.querySelector(".card__image");
  const cardLikedBtn = cardElement.querySelector(".card__like-button");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-btn");

  //if the card is liked, st the active class on the card
  if (data.isLiked) {
    cardLikedBtn.classList.add("card__like-button_liked");
  }
  cardNameEl.textContent = data.name;
  cardLinkEl.alt = data.name;
  cardLinkEl.src = data.link;

  cardLikedBtn.addEventListener("click", (evt) => handleLike(evt, data));

  cardLinkEl.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImageEl.src = data.link;
    previewModalImageEl.alt = data.name;
    previewModalCaptionEl.textContent = data.name;
  });

  cardDeleteBtn.addEventListener("click", (evt) => {
    //inside this function, we can access the card's id with data._id
    //when we click this card's delete button, update the global variable to be the id of the card
    // set selectedCard this card's element
    selectedCard = cardElement;
    selectedCardId = data._id;
    openModal(deleteModal);
  });

  return cardElement;
}

function openModal(modal) {
  document.addEventListener("keyup", keyHandler);
  modal.classList.add("modal_open");
}

function closeModal(modal) {
  document.removeEventListener("keyup", keyHandler);
  modal.classList.remove("modal_open");
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  // submitBtn.textContent = "Saving...";
  setButtonText(submitBtn, true);
  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDiscriptionInput.value,
    })
    .then((data) => {
      // Use data argument instead of the input values
      profileName.textContent = data.name;
      profileDiscription.textContent = data.about;
      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);

      // call setbuttonText instead
      //submitBtn.textContent = "Save";
    });
}

// implement loading text for all other form submissions

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);
  api
    .editAvatarInfo(avatarInput.value)
    .then((data) => {
      // Update the avatar image
      profileAvatar.src = data.avatar;

      closeModal(avatarModal);
      evt.target.reset();
      //disableButton(avatarSubmitBtn);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

profileEditButton.addEventListener("click", () => {
  resetValidation(
    editFormElement,
    [editModalNameInput, editModalDiscriptionInput],
    editButtonElement,
    settings
  );
  editModalNameInput.value = profileName.textContent;
  editModalDiscriptionInput.value = profileDiscription.textContent;
  openModal(editProfileModal);
});

editModalCloseBtn.addEventListener("click", () => {
  closeModal(editProfileModal);
});

cardModalButton.addEventListener("click", () => {
  openModal(cardModal);
});

cardModalCloseBtn.addEventListener("click", () => {
  closeModal(cardModal);
});

previewModalCloseBtn.addEventListener("click", () => {
  closeModal(previewModal);
});

editFormElement.addEventListener("submit", handleEditFormSubmit);
cardForm.addEventListener("submit", handleAddCardSubmit);

function keyHandler(evt) {
  if (evt.key === "Escape") {
    const activeModal = document.querySelector(".modal_open");
    closeModal(activeModal);
  }
}

avatarModalButton.addEventListener("click", () => {
  openModal(avatarModal);
});

avatarForm.addEventListener("submit", handleAvatarSubmit);

avatarModalCloseBtn.addEventListener("click", () => {
  closeModal(avatarModal);
});

modals.forEach((modal) => {
  modal.addEventListener("mousedown", (evt) => {
    if (evt.target.classList.contains("modal")) {
      closeModal(modal);
    }
  });
});

deleteModalX.addEventListener("click", () => {
  closeModal(deleteModal);
});

deleteModalCancel.addEventListener("click", () => {
  closeModal(deleteModal);
});

// 1. use click event, but don't use evt.submitter

deleteModalCTA.addEventListener("click", (evt) => {
  const submitBtn = deleteModalCTA;
  setButtonText(submitBtn, true, "Delete", "Deleting...");
  api
    .deleteCard(selectedCardId)
    .then((data) => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false, "Delete", "Deleting...");
    });
});

enableValidation(settings);

// Find the 'x' close button - look at the previous modals to figure out how to select
// FInd the cancel button - declare teh cancel button
// Set the event listeners for a click event
// Call closeModal function
