function loadStorage(id) {
    fetch(`/storage/${id}`).then(res => res.json()).then(storage => {
        if (!storage) return;
        // Fill the form fields
        document.getElementById("id").value = storage.id || '';
        document.getElementById("catagory").value = storage.catagory || '';
        document.getElementById("name").value = storage.name || '';
        document.getElementById("quantity").value = storage.quantity || '';
        document.getElementById("buyamount").value = storage.buyamount || '';
        document.getElementById("sellamount").value = storage.sellamount || '';

        const form = document.getElementById("storage_form"); // make sure your update form has this id

        form.onsubmit = function (e) {
            e.preventDefault();

            const updatedData = {
                catagory: document.getElementById("catagory").value.trim(),
                name: document.getElementById("name").value.trim(),
                quantity: document.getElementById("quantity").value.trim(),
                buyamount: document.getElementById("buyamount").value.trim(),
                sellamount: document.getElementById("sellamount").value.trim(),
              };

            fetch(`/storage/${storage.id}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedData)
            }).then(res => res.json()).then(response => {
                alert("تغییرات اعمال شد");
                loadStorage(storage.id);  // optionally reload
                showStorageData();    // refresh storage list
            }).catch(err => {
                console.error("❌ Update failed", err);
                alert("خطا در ذخیره اطلاعات معلم");
            });
        };

    })
    .catch(err => {
      console.error("خطا در ریافت اطلاعات معلم:", err);
    });
}

// close modal
function closeModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
}


