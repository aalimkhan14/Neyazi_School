function loadTeacherPayment(id) {
    fetch(`/teachers_payment/${id}`).then(res => res.json()).then(teacherpay => {
        if (!teacherpay) return;
        // Fill the form fields
        
        document.getElementById('pid').value = teacherpay.id;
        document.getElementById('mtpid').value = teacherpay.tpid || '';
        document.getElementById('mname').value = teacherpay.name || '';
        document.getElementById('mmonth').value = teacherpay.month || '';
        document.getElementById('mpdate').value = teacherpay.pdate || '';
        document.getElementById('mpayablea').value = teacherpay.payablea || 0;
        document.getElementById('mpayeda').value = teacherpay.payeda || 0;
        document.getElementById('mrest').value = teacherpay.r_p || 0;
        

        const form = document.getElementById("teacherPayment_form"); // make sure your update form has this id

        form.onsubmit = function (e) {
            e.preventDefault();

            const updatedData = {
                tpid: document.getElementById("pid").value.trim(),
                name: document.getElementById("mname").value.trim(),
                month: document.getElementById("mmonth").value.trim(),
                pdate: document.getElementById("mpdate").value.trim(),
                payablea: document.getElementById("mpayablea").value,
                payeda: document.getElementById("mpayeda").value,
                r_p: document.getElementById("mrest").value,  
            };

            fetch(`/teachers_payment/${teacherpay.id}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedData)
            }).then(res => res.json()).then(response => {
                alert("✅ تغییرات موفقانه اعمال شد");
                loadTeacherPayment(teacherpay.id);  // optionally reload
                showTeacherPaymentData();    // refresh fee list
            }).catch(err => {
                console.error("❌ Update failed", err);
                alert("خطا در ذخیره معاش");
            });
        };

    })
    .catch(err => {
      console.error("❌ خطا در دریافت اطلاعات فیس:", err);
    });
}

// close modal
function closeModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
}


// to update the r_f and r_t
    document.getElementById("mpayeda").addEventListener("input", function () {
      const mpayablea =parseInt(document.getElementById("mpayablea").value) || 0;
      const mpayeda = parseInt(document.getElementById("mpayeda").value) || 0;
      const r_p= mpayablea - mpayeda;
      document.getElementById("mrest").value = r_p;
    });

// jalili date
    function toEnglishDigits(str) {
    if (!str) return '';
    return str.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
  }

  $('#mpdate').persianDatepicker({
    format: 'YYYY/MM/DD',
    autoClose: true,
    initialValue: false,
    onHide: function () {
      // Get the current value from input
      let pVal = $('#mpdate').val();
      let englishVal = toEnglishDigits(pVal);
      $('#mpdate').val(englishVal);
    }
  });


