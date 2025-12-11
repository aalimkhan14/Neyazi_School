function loadFee(id) {
    fetch(`/fees/${id}`).then(res => res.json()).then(fee => {
        if (!fee) return;
        // Fill the form fields
        document.getElementById('fid').value = fee.id;
        document.getElementById('msid').value = fee.sid || '';
        document.getElementById('mname').value = fee.name || '';
        document.getElementById('mfname').value = fee.fname || '';
        document.getElementById('mf_class').value = fee.fclass || '';
        document.getElementById('mmonth').value = fee.month || '';
        document.getElementById('mf_payable').value = fee.f_payable || 0;
        document.getElementById('mf_payed').value = fee.f_payed || 0;
        document.getElementById('mt_payable').value = fee.t_payable || 0;
        document.getElementById('mt_payed').value = fee.t_payed || 0;
        document.getElementById('mr_f').value = fee.r_f || 0;
        document.getElementById('mr_t').value = fee.r_t || 0;
        document.getElementById('mrdate').value = fee.rdate ? fee.rdate.substring(0, 10) : '';

        const form = document.getElementById("fee_form"); // make sure your update form has this id

        form.onsubmit = function (e) {
            e.preventDefault();

            const updatedData = {
                sid: document.getElementById("msid").value.trim(),
                name: document.getElementById("mname").value.trim(),
                fname: document.getElementById("mfname").value.trim(),
                fclass: document.getElementById("mf_class").value.trim(),
                month: document.getElementById("mmonth").value.trim(),
                f_payable: document.getElementById("mf_payable").value,
                f_payed: document.getElementById("mf_payed").value,
                t_payable: document.getElementById("mt_payable").value,
                t_payed: document.getElementById("mt_payed").value,
                r_f: document.getElementById("mr_f").value,
                r_t: document.getElementById("mr_t").value,
                rdate: document.getElementById("mrdate").value.trim(),
            };

            fetch(`/fees/${fee.id}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedData)
            }).then(res => res.json()).then(response => {
                alert("✅ فیس موفقانه تغییر یافت");
                loadFee(fee.id);  // optionally reload
                showFeeData();    // refresh fee list
            }).catch(err => {
                console.error("❌ Update failed", err);
                alert("خطا در ذخیره فیس");
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
    document.getElementById("mf_payed").addEventListener("input", function () {
      const f_payable =parseInt(document.getElementById("mf_payable").value) || 0;
      const f_payed = parseInt(document.getElementById("mf_payed").value) || 0;
      const r_f = f_payable - f_payed;
      document.getElementById("mr_f").value = r_f;
    });

    document.getElementById("mt_payed").addEventListener("input", function () {
      const t_payable =parseInt(document.getElementById("mt_payable").value) || 0;
      const t_payed = parseInt(document.getElementById("mt_payed").value) || 0;
      const r_t = t_payable - t_payed;
      document.getElementById("mr_t").value = r_t;
    });

// jalili date
    function toEnglishDigits(str) {
    if (!str) return '';
    return str.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
  }

  $('#mrdate').persianDatepicker({
    format: 'YYYY/MM/DD',
    autoClose: true,
    initialValue: false,
    onHide: function () {
      // Get the current value from input
      let pVal = $('#mrdate').val();
      let englishVal = toEnglishDigits(pVal);
      $('#mrdate').val(englishVal);
    }
  });


