// === Load Teacher Data ===
function loadTeacher(id) {
  fetch(`/teachers/${id}`)
    .then(res => res.json())
    .then(teacher => {
      if (!teacher) return;

      // Fill inputs
      document.getElementById("tid").value = teacher.id;
      document.getElementById("name").value = teacher.name || "";
      document.getElementById("lname").value = teacher.lname || "";
      document.getElementById("fname").value = teacher.fname || "";
      document.getElementById("gfname").value = teacher.gfname || "";
      document.getElementById("birth").value = teacher.birth || "";
      document.getElementById("idcard").value = teacher.idcard || "";
      document.getElementById("phone").value = teacher.phone || "";
      document.getElementById("address").value = teacher.address || "";
      document.getElementById("educatelevel").value = teacher.educatelevel || "";
      document.getElementById("educateunit").value = teacher.educateunit || "";
      document.getElementById("graduatedate").value = teacher.graduatedate || "";
      document.getElementById("graduateplace").value = teacher.graduateplace || "";
      document.getElementById("job").value = teacher.job || "";
      document.getElementById("salary").value = teacher.salary || "";
      document.getElementById("formcode").value = teacher.formcode || "";

      // Show current attachment (agreement)
      document.getElementById("download_agreement").dataset.file = teacher.agreement || "";
      document.getElementById("download_diploma").dataset.file = teacher.diplomaLetter || "";
      document.getElementById("download_idCard").dataset.file = teacher.idCardLetter || "";

      // === Form submission (PUT) ===
      const form = document.getElementById("teacher_form");
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        const formData = new FormData(this);

        fetch(`/teachers/${formData.get("id")}`, {
          method: "PUT",
          body: formData,
        })
          .then((res) => res.json())
          .then(() => {
            alert("تغییرات موفقانه ذخیره شد ✅");
            loadTeacher(formData.get("id"));
          })
          .catch((err) => console.error("Update failed:", err));
      });
    })
    .catch((err) => console.error("خطا در دریافت اطلاعات معلم:", err));
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

// === Close Modal ===
function closeModal() {
  document.getElementById("modal").style.display = "none";
}

// === Persian Date Pickers ===
function toEnglishDigits(str) {
  if (!str) return "";
  return str.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
}

$("#birth").persianDatepicker({
  format: "YYYY/MM/DD",
  autoClose: true,
  initialValue: false,
  onHide: function () {
    let pVal = $("#birth").val();
    $("#birth").val(toEnglishDigits(pVal));
  },
});
