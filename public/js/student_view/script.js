// Load student data into form fields

async function mloadClassOptions() {
  // getting class data for selection
  let mcurrent_class = document.getElementById('mcurrent_class');
  const mclass_response = await fetch(`http://localhost:3000/classes`);
  const mclass_result = await mclass_response.json();

  mclass_result.data.forEach((classe) => {
    mcurrent_class.innerHTML += `<option value='${classe.classlevel} ${classe.classmodify}'>
      ${classe.classlevel} ${classe.classmodify}</option>`;
    });
}

//Call the function after defining it
mloadClassOptions();

function loadStudent(id) {
  fetch(`/students/${id}`)
    .then(res => res.json())
    .then(student => {
      if (!student) return;

      document.getElementById('mid').value = student.id;
      document.getElementById('mname').value = student.name || '';
      document.getElementById('mlast_name').value = student.last_name || '';
      document.getElementById('mfname').value = student.fname || '';
      document.getElementById('mgfname').value = student.gfname || '';
      document.getElementById('mbirth').value = student.birth ? student.birth.substring(0, 10) : '';
      document.getElementById('mgender').value = student.gender || '';
      document.getElementById('midcard_no').value = student.idcard_no || '';
      document.getElementById('mnative_language').value = student.native_language || '';
      document.getElementById('mmean_location').value = student.mean_location || '';
      document.getElementById('mcurrent_location').value = student.current_location || '';
      document.getElementById('mphone1').value = student.phone1 || '';
      document.getElementById('mphone2').value = student.phone2 || '';
      document.getElementById('mrelatives').value = student.relatives || '';
      document.getElementById('mrelatives_name').value = student.relatives_name || '';
      document.getElementById('mcurrent_class').value = student.current_class || '';
      document.getElementById('mentry_way').value = student.entry_way || '';
      document.getElementById('mq_o_month').value = student.q_o_month || '';
      document.getElementById('mcreatedAt').value = student.createdAt ? toPersianDate(student.createdAt) : "";
      document.getElementById('mtransport_fee').value = student.transport_fee || '';

      // Handle yearly_fee and transport_fee and checkbox "free"
      const isFree = student.free === 'رایگان';
      const feeField = document.getElementById('yearly_fee');
      const freeCheckbox = document.getElementById('free');
      feeField.disabled = true;
      freeCheckbox.checked = isFree;

      if (isFree) {
        feeField.value = student.yearly_fee || '';
      } else {
        feeField.value = student.yearly_fee || '';
      }

      document.getElementById('content_picture').src = `/uploads/${student.picture ? student.picture : "default.png"}`;
      // Store attachment filename for download button
      document.getElementById('download_attachment').dataset.file = student.attachment || '';
      document.getElementById('download_attachment2').dataset.file = student.attachment2 || '';
      document.getElementById('download_attachment3').dataset.file = student.attachment3 || '';

      // === 🟨 Make sure to fix updateData to force 0 values even if fields are disabled ===
      const form = document.getElementById("parent_modal");
      form.onsubmit = function (e) {
        e.preventDefault();

        // If checkbox is checked, ensure 0 values
        if (freeCheckbox.checked) {
          feeField.disabled = false;
          feeField.value = 0;
        }

        const formData = new FormData(form);

        fetch(`/students/${formData.get('id')}`, {
          method: "PUT",
          body: formData
        })
          .then(res => res.json())
          .then(response => {

            openModal(formData.get('id'));
          })
          .catch(err => {
            console.error("Update failed", err);
          });
      };
    })
    .catch(err => {
      console.error("خطا در دریافت اطلاعات متعلم:", err);
    });
}

// Free checkbox toggles fee/transport fields
document.getElementById('free').addEventListener('change', function () {
  const isChecked = this.checked;
  const feeField = document.getElementById('yearly_fee');
  const transportField = document.getElementById('mtransport_fee');

  if (isChecked) {
    feeField.value = 0;
    feeField.disabled = true;
  } else {
    feeField.disabled = false;
  }
});

function toEdit() {
  document.getElementById('print_card').style.display = 'none';
  document.getElementById('print_details').style.display = 'none';
  document.getElementById('edit_modal').style.display = 'none';
  document.getElementById('download_attachment').style.display = 'none';
  document.getElementById('download_attachment2').style.display = 'none';
  document.getElementById('download_attachment3').style.display = 'none';
  document.getElementById('change_picture').style.display = 'flex';
  document.getElementById('save_modal').style.display = 'flex';
  document.getElementById('change_attachment').style.display = 'flex';
  document.getElementById('change_attachment2').style.display = 'flex';
  document.getElementById('change_attachment3').style.display = 'flex';

  const form = document.querySelector("form");
  const elements = form.querySelectorAll("[disabled]");

  const isFree = document.getElementById('free').checked;
  const feeField = document.getElementById('yearly_fee');
  const transportField = document.getElementById('mtransport_fee');
  const q_o_month = document.getElementById('mq_o_month');

  elements.forEach(el => {
    if (el === feeField) {
      el.disabled = isFree;
    } else {
      el.disabled = false;
    }
  });
}

function closeModal() {
  const modal = document.getElementById("modal");
  modal.style.display = "none";
}

function updateData() {
  const form = document.getElementById("parent_modal");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(this); // includes files and all fields

    fetch(`/students/${formData.get('id')}`, {
      method: "PUT",
      body: formData // DO NOT set Content-Type manually
    })
      .then((res) => res.json())
      .then((response) => {
        openModal(formData.get('id')); // reload updated student info
      })
      .catch((err) => {
        console.error("Update failed", err);
      });
  });
}

// Call once when the modal or page loads
updateData();

// preview the picture which selected
document.getElementById('pictureInput').addEventListener('change', () => {
  const pictureInput = document.getElementById('pictureInput');
  const contentPicture = document.getElementById('content_picture');
  const file = pictureInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      contentPicture.src = e.target.result;
    };
    reader.readAsDataURL(file);
    document.getElementById('change_picture').innerText = 'عکس انتخاب شد';
  }
});

// preview attachment selected
document.getElementById('attachmentInput').addEventListener('change', () => {
  const file = document.getElementById('attachmentInput').files[0];
  if (file) {
    document.getElementById('change_attachment').innerText = 'اسناد ضمیمه انتخاب شد';
  }
});
document.getElementById('attachmentInput2').addEventListener('change', () => {
  const file = document.getElementById('attachmentInput2').files[0];
  if (file) {
    document.getElementById('change_attachment2').innerText = 'اسناد تذکره انتخاب شد';
  }
});
document.getElementById('attachmentInput3').addEventListener('change', () => {
  const file = document.getElementById('attachmentInput3').files[0];
  if (file) {
    document.getElementById('change_attachment3').innerText = 'اسناد سه پارچه انتخاب شد';
  }
});

// printing id card
document.getElementById('print_card').addEventListener('click', () => {
  const iframe = document.getElementById('print_frame');
  const studentId = document.getElementById('mid').value;

  if (!studentId) {
    alert("Student ID is missing!");
    return;
  }

  // Pass the student ID as query parameter to idcard.html
  iframe.src = `pages/components/idcard.html?id=${studentId}`;

  iframe.style.display = 'none'; // show iframe if needed

  iframe.onload = () => {
    iframe.contentWindow.focus();
    // optionally trigger print inside iframe
    // iframe.contentWindow.print();
  };
});
// printing student details
document.getElementById('print_details').addEventListener('click', () => {
  const iframe = document.getElementById('print_frame');
  const studentId = document.getElementById('mid').value;

  if (!studentId) {
    alert("Student ID is missing!");
    return;
  }

  // Pass the student ID as query parameter to idcard.html
  iframe.src = `pages/components/studentDetails.html?id=${studentId}`;

  iframe.style.display = 'none'; // show iframe if needed

  iframe.onload = () => {
    iframe.contentWindow.focus();
    // optionally trigger print inside iframe
    // iframe.contentWindow.print();
  };
});

// Download attachment when clicking #download_attachment
document.getElementById('download_attachment').addEventListener('click', () => {
  const attachmentFile = document.getElementById('download_attachment').dataset.file;

  if (!attachmentFile) {
    alert('فایلی برای دانلود موجود نیست');
    return;
  }

  const fileUrl = `/uploads/${attachmentFile}`; // Adjust if your path is different

  const a = document.createElement('a');
  a.href = fileUrl;
  a.download = attachmentFile;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});
// Download attachment when clicking #download_attachment
document.getElementById('download_attachment2').addEventListener('click', () => {
  const attachmentFile = document.getElementById('download_attachment2').dataset.file;

  if (!attachmentFile) {
    alert('فایلی برای دانلود موجود نیست');
    return;
  }

  const fileUrl = `/uploads/${attachmentFile}`; // Adjust if your path is different

  const a = document.createElement('a');
  a.href = fileUrl;
  a.download = attachmentFile;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});
// Download attachment when clicking #download_attachment
document.getElementById('download_attachment3').addEventListener('click', () => {
  const attachmentFile = document.getElementById('download_attachment3').dataset.file;

  if (!attachmentFile) {
    alert('فایلی برای دانلود موجود نیست');
    return;
  }

  const fileUrl = `/uploads/${attachmentFile}`; // Adjust if your path is different

  const a = document.createElement('a');
  a.href = fileUrl;
  a.download = attachmentFile;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});

// Helper to convert Persian digits to English digits
function toEnglishDigits(str) {
  if (!str) return '';
  return str.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
}

// Persian datepicker initialization
$('#mbirth').persianDatepicker({
  format: 'YYYY/MM/DD',
  autoClose: true,
  initialValue: false,
  onHide: function () {
    let pVal = $('#mbirth').val();
    let englishVal = toEnglishDigits(pVal);
    $('#mbirth').val(englishVal);
  }
});

// gregorian to persian conversion
function toPersianDate(isoDateString) {
  if (!isoDateString) return '';
  const date = new Date(isoDateString);
  const j = jalaali.toJalaali(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const pad = (n) => n.toString().padStart(2, '0');
  return `${j.jy}/${pad(j.jm)}/${pad(j.jd)}`;
}
