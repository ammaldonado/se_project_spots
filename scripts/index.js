const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

const profileEditButton = document.querySelector(".profile__edit-btn");

const profileName = document.querySelector(".profile__name");
const profileDiscription = document.querySelector(".profile__discription");

const editProfileModal = document.querySelector("#edit-modal");
const editFormElement = editProfileModal.querySelector(".modal__form");

const editModalCloseBtn = editProfileModal.querySelector(".modal__close-btn");

const editModalNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editModalDiscriptionInput = editProfileModal.querySelector(
  "#profile-discription-input"
);
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

function getCardElement(data) {
  const cardElement = document
    .querySelector("#card-template")
    .content.querySelector(".card")
    .cloneNode(true);
  const cardNameEl = cardElement.querySelector(".card__title");
  const cardLinkEl = cardElement.querySelector(".card__image");
  cardNameEl.textContent = data.name;
  cardLinkEl.alt = data.name;

  cardLinkEl.src = data.link;

  return cardElement;
}

function openModal() {
  editModalNameInput.value = profileName.textContent;
  editModalDiscriptionInput.value = profileDiscription.textContent;
  editProfileModal.classList.add("modal__open");
}

function closeModal() {
  editProfileModal.classList.remove("modal__open");
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = editModalNameInput.value;
  profileDiscription.textContent = editModalDiscriptionInput.value;
  closeModal();
}

profileEditButton.addEventListener("click", openModal);

editModalCloseBtn.addEventListener("click", closeModal);

editFormElement.addEventListener("submit", handleEditFormSubmit);

for (let i = 0; i < initialCards.length; i++) {
  const cardElement = getCardElement(initialCards[i]);
  console.log(cardElement);
  cardsList.prepend(cardElement);
}
