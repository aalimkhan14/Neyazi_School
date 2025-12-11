// Example 2: OK-Cancel confirmation
document.getElementById("deleteBtn").addEventListener("click", async () => {
  const confirmed = await showModal({
    title: "حذف دانش‌آموز",
    message: "آیا از حذف این دانش‌آموز اطمینان دارید؟",
    type: "ok-cancel",
    okText: "بله، حذف شود",
    cancelText: "انصراف",
    iconColor: "#dc3545",
    iconBg: "#ffe6e6",
  });

  if (confirmed) {
    console.log("✅ حذف انجام شد");
  } else {
    console.log("❌ لغو شد");
  }
});


const confirmed = await showModal({
  title: "آیا مطمئن هستید؟",
  message: "آیا می‌خواهید دانش‌آموز حذف شود؟",
  type: "ok-cancel"
});

if (confirmed) {
  console.log("User confirmed ✅");
} else {
  console.log("User cancelled ❌");
}

showModal({
  	title: "موفقیت",
  	message: "فیس شاگرد موفقانه ثبت شد.",
  	icon: "success",
});




              async function apply(){
            const confirmed = await showModal({
            title: "حذف",
            message: "آیا می‌خواهید فیس حذف شود؟",
            type: "ok-cancel"
          });
        
          if (confirmed) {
            console.log("User confirmed ✅");

          } else {
            this.close();
            console.log("User cancelled ❌");
          }
        }
        apply();
