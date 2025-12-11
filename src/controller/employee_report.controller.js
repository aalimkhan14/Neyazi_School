const jalaali = require("jalaali-js");
const employee_payment_model = require("../models/employees.payment.model");

const persianMonthNumbers = {
  "حمل": 1, "ثور": 2, "جوزا": 3, "سرطان": 4,
  "اسد": 5, "سنبله": 6, "میزان": 7, "عقرب": 8,
  "قوس": 9, "جدی": 10, "دلو": 11, "حوت": 12
};

const monthNumberToName = Object.fromEntries(
  Object.entries(persianMonthNumbers).map(([k, v]) => [v, k])
);

exports.getReport = async (req, res) => {
  try {
    const persianYear = req.query.year;
    const period = req.query.period || "yearly"; // Default to yearly
    const monthNumber = Number(req.query.month); // numeric

    // Fetch all teacher payments
    let payments = await employee_payment_model.findAll();

    // Filter by Persian year
    if (persianYear) {
      payments = payments.filter(payment => {
        const jDate = jalaali.toJalaali(new Date(payment.createdAt));
        return jDate.jy.toString() === persianYear;
      });
    }

    // Define numeric month groups
    const halfMonths = { half1: [1,2,3,4,5,6], half2: [7,8,9,10,11,12] };
    const quarters = { q1: [1,2,3], q2: [4,5,6], q3: [7,8,9], q4: [10,11,12] };

    // Group by teacher
    const employeeMap = {};
    payments.forEach(payment => {
      const { epid, name, month, payablea, payeda } = payment;
      if (!employeeMap[epid]) {
        employeeMap[epid] = {
          epid,
          name,
          months: Object.fromEntries([...Array(12)].map((_, i) => [i + 1, 0])),
        };
      }
      employeeMap[epid].months[Number(month)] = payeda;
    });

    // Determine months to include based on period
    const periodMonths = (() => {
      if (period === "yearly") return [...Array(12)].map((_, i) => i + 1);
      if (period.startsWith("half")) return halfMonths[period] || [];
      if (period.startsWith("q")) return quarters[period] || [];
      if (period === "month" && monthNumber) return [monthNumber];
      return [...Array(12)].map((_, i) => i + 1);
    })();

    if (period === "month") {
      // Monthly report
      const monthlyData = payments
        .filter(payment => Number(payment.month) === monthNumber)
        .map(payment => {
          const jDate = jalaali.toJalaali(new Date(payment.createdAt));
          const persianCreatedAt = `${jDate.jy}/${String(jDate.jm).padStart(2,'0')}/${String(jDate.jd).padStart(2,'0')}`;
          return {
            epid: payment.epid,
            name: payment.name,
            month: monthNumberToName[Number(payment.month)],
            payablea: payment.payablea,
            payeda: payment.payeda,
            r_p: payment.r_p,
            pdate: payment.pdate,
            createdAt: persianCreatedAt
          };
        });

      return res.json({ success: true, count: monthlyData.length, data: monthlyData });
    } else {
      // Grouped report
      const finalReport = Object.values(employeeMap).map(teacher => {
        const monthsData = {};
        let total = 0;
        periodMonths.forEach(m => {
          const val = teacher.months[m] ?? 0;
          monthsData[monthNumberToName[m]] = val;
          total += val;
        });
        return { ...teacher, months: monthsData, total };
      });

      return res.json({ success: true, count: finalReport.length, data: finalReport });
    }

  } catch (err) {
    console.error("REPORT ERROR:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
