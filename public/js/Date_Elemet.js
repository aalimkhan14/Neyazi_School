// gregorian to persian 
function toPersianDate(isoDateString) {
  if (!isoDateString) return ''
  const date = new Date(isoDateString);
  const j = jalaali.toJalaali(date.getFullYear(), date.getMonth() + 1, date.getDate());
  // Pad single-digit months and days with zero
  const pad = (n) => n.toString().padStart(2, '0')
  return `${j.jy}/${pad(j.jm)}/${pad(j.jd)}`;
}

function toEnglishDigits(str) {
    if (!str) return "";
    return str.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
}
function datePicker(element){
    $(element).persianDatepicker({
        format: "YYYY/MM/DD",
        autoClose: true,
        initialValue: false,
        onHide: function () {
          // Get the current value from input
          let pVal = $(element).val();
          let englishVal = toEnglishDigits(pVal);
          $(element).val(englishVal);
        },
      });
}

function yearPicker(isoDateString) {
  if (!isoDateString) return ''
  const date = new Date(isoDateString);
  const j = jalaali.toJalaali(date.getFullYear(), date.getMonth() + 1, date.getDate())
  // Pad single-digit months and days with zero
  const pad = (n) => n.toString().padStart(2, '0')
  return `${j.jy}`;
}