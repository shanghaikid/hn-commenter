// reply
const textArea = document.querySelector("textarea");

textArea.value = localStorage.getItem("reply") || "";
textArea.style.width = "100%";
textArea.style.height = "60vh";
