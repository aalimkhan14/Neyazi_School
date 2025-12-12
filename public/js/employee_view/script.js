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

      // Show current attachment (agreement)
      document.getElementById("download_agreement").dataset.file = employee.agreement || "";
      document.getElementById("download_diploma").dataset.file = employee.diplomaLetter || "";
      document.getElementById("download_idCard").dataset.file = employee.idCardLetter || "";

      const form = document.getElementById("employee_form"); // make sure your update form has this id

      // === Form submission (PUT) ===
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        const formData = new FormData(this);

        fetch(`/employees/${formData.get("id")}`, {
          method: "PUT",
          body: formData,
        })
          .then((res) => res.json())
          .then(() => {
            alert("تغییرات موفقانه ذخیره شد ✅");
            loadEmployee(formData.get("id"));
          })
          .catch((err) => console.error("Update failed:", err));
      });

    })
    .catch(err => {
      console.error("خطا در ریافت اطلاعات کارمند:", err);
    });
}

// === File input preview ===
document.getElementById("agreementFile").addEventListener("change", () => {
  const file = document.getElementById("agreementFile").files[0];
  if (file) document.getElementById("change_agreement").innerText = "فایل قرارداد انتخاب شد";
});
document.getElementById("diplomaFile").addEventListener("change", () => {
  const file = document.getElementById("diplomaFile").files[0];
  if (file) document.getElementById("change_diploma").innerText = "فایل اسناد تحصیلی انتخاب شد";
});
document.getElementById("idCardFile").addEventListener("change", () => {
  const file = document.getElementById("idCardFile").files[0];
  if (file) document.getElementById("change_idCard").innerText = "فایل تذکره انتخاب شد";
});


// === Download button ===
document.getElementById("download_agreement").addEventListener("click", () => {
  const file = document.getElementById("download_agreement").dataset.file;
  console.log(file);
  
  if (!file) return alert("فایلی برای دانلود موجود نیست ❌");
  const a = document.createElement("a");
  a.href = `/uploads/${file}`;
  a.download = file;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});
document.getElementById("download_diploma").addEventListener("click", () => {
  const file = document.getElementById("download_diploma").dataset.file;
  if (!file) return alert("فایلی برای دانلود موجود نیست ❌");
  const a = document.createElement("a");
  a.href = `/uploads/${file}`;
  a.download = file;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});
document.getElementById("download_idCard").addEventListener("click", () => {
  const file = document.getElementById("download_idCard").dataset.file;
  if (!file) return alert("فایلی برای دانلود موجود نیست ❌");
  const a = document.createElement("a");
  a.href = `/uploads/${file}`;
  a.download = file;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});

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


