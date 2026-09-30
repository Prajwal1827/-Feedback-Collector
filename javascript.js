const form = document.querySelector("form");

const nameInput = document.getElementById("name");
const ratingInput = document.getElementById("rating");
const categoryInput = document.getElementById("category");
const commentInput = document.getElementById("comment");

const searchInput = document.getElementById("search");
const filterInput = document.getElementById("filter");

const feedbackList = document.getElementById("feedbackList");
const averageRating = document.getElementById("averageRating");
const emptyMessage = document.getElementById("emptyMessage");

let feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];

let editingId = null;

function displayFeedback(data = feedbacks) {

    feedbackList.innerHTML = "";

    if (data.length === 0) {
        feedbackList.innerHTML = `
            <p id="emptyMessage">No feedback available.</p>
        `;

        averageRating.textContent = "0.0 / 5";
        return;
    }


    data.forEach(function (feedback) {

        const feedbackItem = document.createElement("div");

        feedbackItem.className = "feedback-item";

        feedbackItem.innerHTML = `
            <h3>${feedback.name}</h3>

            <p><strong>Rating:</strong> ${feedback.rating} / 5</p>

            <p><strong>Category:</strong> ${feedback.category}</p>

            <p><strong>Comment:</strong> ${feedback.comment}</p>

            <button class="edit-btn" onclick="editFeedback(${feedback.id})">
                Edit
            </button>

            <button class="delete-btn" onclick="deleteFeedback(${feedback.id})">
                Delete
            </button>
        `;

        feedbackList.appendChild(feedbackItem);
    });


    calculateAverage(data);
}


form.addEventListener("submit", function (event) {

    event.preventDefault();


    const name = nameInput.value.trim();
    const rating = ratingInput.value;
    const category = categoryInput.value;
    const comment = commentInput.value.trim();

    if (name === "") {
        alert("Please enter your name.");
        return;
    }

    if (rating === "") {
        alert("Please select a rating.");
        return;
    }

    if (category === "") {
        alert("Please select a category.");
        return;
    }

    if (comment === "") {
        alert("Please enter your comment.");
        return;
    }

if (editingId !== null) {

    const feedback = feedbacks.find(function (item) {
        return item.id === editingId;
    });

    feedback.name = name;
    feedback.rating = Number(rating);
    feedback.category = category;
    feedback.comment = comment;

    editingId = null;

} else {

    const feedback = {

        id: Date.now(),

        name: name,

        rating: Number(rating),

        category: category,

        comment: comment
    };

    feedbacks.push(feedback);
}


    localStorage.setItem("feedbacks", JSON.stringify(feedbacks));


    displayFeedback();


    form.reset();


    alert("Feedback submitted successfully!");
});



function deleteFeedback(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this feedback?"
    );

    if (!confirmDelete) {
        return;
    }


    feedbacks = feedbacks.filter(function (feedback) {

        return feedback.id !== id;

    });


    localStorage.setItem("feedbacks", JSON.stringify(feedbacks));


    displayFeedback();
}


function editFeedback(id) {

    const feedback = feedbacks.find(function (item) {

        return item.id === id;

    });

    if (!feedback) {
        return;
    }

    nameInput.value = feedback.name;

    ratingInput.value = feedback.rating;

    categoryInput.value = feedback.category;

    commentInput.value = feedback.comment;

    editingId = id;

    nameInput.focus();
}
searchInput.addEventListener("input", function () {

    applyFilters();

});


filterInput.addEventListener("change", function () {

    applyFilters();

});


function applyFilters() {

    const searchText = searchInput.value.toLowerCase().trim();

    const selectedCategory = filterInput.value;


    const filteredFeedbacks = feedbacks.filter(function (feedback) {

        const matchesSearch =
            feedback.name.toLowerCase().includes(searchText) ||
            feedback.comment.toLowerCase().includes(searchText);


        const matchesCategory =
            selectedCategory === "" ||
            feedback.category === selectedCategory;


        return matchesSearch && matchesCategory;

    });


    displayFeedback(filteredFeedbacks);
};


function calculateAverage(data = feedbacks) {

    if (data.length === 0) {

        averageRating.textContent = "0.0 / 5";

        return;
    }


    let total = 0;


    data.forEach(function (feedback) {

        total += feedback.rating;

    });


    const average = total / data.length;


    averageRating.textContent =
        average.toFixed(1) + " / 5";
}

displayFeedback();