function loadEmployee(id) {
    fetch(`/employees/${id}`).then(res => res.json()).then(employee => {
        if (!employee) return;
        // Fill the form fields
        document.getElementById("tid").value = employee.id || '';
      document.getElementById("name").value = employee.name || '';
      document.getElementById("lname").value = employee.lname || '';
      document.getElementById("fname").value = employee.fname || '';
      document.getElementById("gfname").value = employee.gfname || '';
      document.getElementById("birth").value = employee.birth || '';
      document.getElementById("idcard").value = employee.idcard || '';
      document.getElementById("phone").value = employee.phone || '';
      document.getElementById("address").value = employee.address || '';
      document.getElementById("job").value = employee.job || '';
      document.getElementById("salary").value = employee.salary || '';

        const form = document.getElementById("employee_form"); // make sure your update form has this id

        form.onsubmit = function (e) {
            e.preventDefault();

            const updatedData = {
                name: document.getElementById("name").value.trim(),
                lname: document.getElementById("lname").value.trim(),
                fname: document.getElementById("fname").value.trim(),
                gfname: document.getElementById("gfname").value.trim(),
                birth: document.getElementById("birth").value.trim(),
                idcard: document.getElementById("idcard").value,
                phone: document.getElementById("phone").value,
                address: document.getElementById("address").value,
                job: document.getElementById("job").value.trim(),
                salary: document.getElementById("salary").value.trim(),
              };

            fetch(`/employees/${employee.id}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedData)
            }).then(res => res.json()).then(response => {
                alert("تغییرات اعمال شد");
                loadEmployee(employee.id);  // optionally reload
                showEmployeeData();    // refresh employee list
            }).catch(err => {
                console.error("❌ Update failed", err);
                alert("خطا در ذخیره اطلاعات کارمند");
            });
        };

    })
    .catch(err => {
      console.error("خطا در ریافت اطلاعات کارمند:", err);
    });
}

// close modal
function closeModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
}

// jalili date
    function toEnglishDigits(str) {
    if (!str) return '';
    return str.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
  }

  $('#birth').persianDatepicker({
    format: 'YYYY/MM/DD',
    autoClose: true,
    initialValue: false,
    onHide: function () {
      // Get the current value from input
      let pVal = $('#birth').val();
      let englishVal = toEnglishDigits(pVal);
      $('#birth').val(englishVal);
    }
  });


