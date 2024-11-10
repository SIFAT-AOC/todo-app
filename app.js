document.addEventListener("DOMContentLoaded", () => {
  const notesBody = document.getElementById("notes-body");
  const popupContainer = document.getElementById("popup-container");
  const closePopupBtn = document.getElementById("close-popup");
  const addNoteBtn = document.getElementById("new-notes");
  const saveNoteBtn = document.getElementById("save-note");
  const cancelNoteBtn = document.getElementById("cancel-note");

  let notes = JSON.parse(localStorage.getItem("notes")) || [];
  let editIndex = -1;

  renderNotes(); // Initial render of notes from localStorage

  // Open popup for adding a new note
  addNoteBtn.addEventListener("click", () => openPopup("Add Note"));

  // Close popup
  closePopupBtn.addEventListener("click", closePopup);
  cancelNoteBtn.addEventListener("click", closePopup);

  // Save note (add or update)
  saveNoteBtn.addEventListener("click", saveNote);

  // Open popup function
  function openPopup(title, index = -1) {
    document.getElementById("popup-title").textContent =
      index >= 0 ? "update" : title;
    document.getElementById("save-note").textContent =
      index >= 0 ? "update" : "add";
    popupContainer.style.display = "flex";
    if (index >= 0) {
      // Edit mode
      document.getElementById("note-title").value = notes[index].title;
      document.getElementById("note-description").value =
        notes[index].description;
      editIndex = index;
      document.getElementById("note-image").value = notes[index].imageFile;
    } else {
      // Add mode
      document.getElementById("note-title").value = "";
      document.getElementById("note-description").value = "";
      document.getElementById("note-image").value = "";
      editIndex = -1;
    }
  }

  // Close popup function
  function closePopup() {
    popupContainer.style.display = "none";
  }

  // Save note function (add or update)
  function saveNote() {
    const title = document.getElementById("note-title").value;
    const description = document.getElementById("note-description").value;
    const imageFile = document.getElementById("note-image").files[0];
    const currentDate = new Date();
    const formattedDate = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`;

    if (title.trim() === "") {
      alert("Title is required!");
      return;
    }

    // Function to add/update the note after image is processed
    const processNote = (imageData) => {
      if (editIndex === -1) {
        // Add new note
        const newNote = {
          title,
          description,
          date: formattedDate,
          imgefile: imageData,
        };
        notes.push(newNote);
      } else {
        // Update existing note
        notes[editIndex].title = title;
        notes[editIndex].description = description;
        notes[editIndex].date = formattedDate;
        notes[editIndex].imgefile = imageData || notes[editIndex].imgefile; // Keep existing image if no new image is added
      }

      saveNotesToLocalStorage(); // Save notes to localStorage
      renderNotes();
      closePopup();
    };

    if (imageFile) {
      const reader = new FileReader();
      reader.onload = () => {
        processNote(reader.result); // Call processNote with the image data
      };
      reader.readAsDataURL(imageFile);
    } else {
      // If no new image is uploaded, keep the existing image or set to empty if adding a new note
      const existingImage = editIndex >= 0 ? notes[editIndex].imgefile : "";
      processNote(existingImage);
    }
  }

  // Save notes to localStorage
  function saveNotesToLocalStorage() {
    localStorage.setItem("notes", JSON.stringify(notes));
  }

  // Render notes
  function renderNotes() {
    notesBody.innerHTML = "";
    notes.forEach((note, index) => {
      const noteDiv = document.createElement("div");
      noteDiv.classList.add("note-item-bg");
      noteDiv.innerHTML = `
        <div class="note-item">
          <div class="note-text">
            <h4>${note.title}</h4>
            <span>${note.date}</span>
            <p>${note.description}</p>
          </div>
          ${note.imgefile ? `<img src="${note.imgefile}" alt="" />` : ""}
        </div>
        <div class="d-flex align-center btn-list">
          <button class="View-notes" onclick="viewNote(${index})">View</button>
          <button class="edit-notes" onclick="editNote(${index})">edit</button>
          <button class="delet-notes" onclick="deleteNote(${index})">Delete</button>
        </div>
      `;
      notesBody.appendChild(noteDiv);
    });
  }

  // View note
  window.viewNote = function (index) {
    alert(
      `Title: ${notes[index].title}\nDescription: ${notes[index].description}`
    );
  };

  // Edit note
  window.editNote = function (index) {
    openPopup("Edit Note", index);
  };

  // Delete note
  window.deleteNote = function (index) {
    if (confirm("Are you sure you want to delete this note?")) {
      notes.splice(index, 1);
      saveNotesToLocalStorage(); // Save notes to localStorage after deletion
      renderNotes();
    }
  };
});
