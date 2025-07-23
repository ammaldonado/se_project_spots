export function setButtonText(
  btn,
  isLoading,
  defaultText = "Save",
  loadingText = "Saving..."
) {
  if (isLoading) {
    btn.textContent = loadingText;
    //set the loading text
  } else {
    btn.textContent = defaultText;
    // set not loading text
  }
}
