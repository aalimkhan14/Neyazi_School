document.getElementById("catagory_form").addEventListener("submit", async function (e) {
    e.preventDefault();
    const form = e.target; 
    // Build a JSON object from form fields
    const data = {
        name: form.name.value,
    }; 
    try {
        const response = await fetch("http://localhost:3000/catagory", {
            method: "POST",
            headers: {"Content-Type": "application/json",},
            body: JSON.stringify(data),
        });
        if (response.ok) {
            alert("موفقانه ثبت شد");
            loadCatagory();
            form.reset();
        } else {
            alert("خطا در ثبت .");
            console.log(response);
        }
    } catch (error) {
        console.error("Error: ", error);
        alert("خطا در اتصال به سرور");
    }
});

// close modal
function closeModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
}


