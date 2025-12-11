const { Op } = require("sequelize");
const jalaali = require("jalaali-js");
const fee_model = require("../models/fee.model");

const persianMonthNumbers = {
  "حمل": 1, "ثور": 2, "جوزا": 3, "سرطان": 4,
  "اسد": 5, "سنبله": 6, "میزان": 7, "عقرب": 8,
  "قوس": 9, "جدی": 10, "دلو": 11, "حوت": 12
};

const persianMonths = Object.keys(persianMonthNumbers);
const monthNumberToName = Object.fromEntries(
  Object.entries(persianMonthNumbers).map(([k, v]) => [v, k])
);

exports.getReport = async (req, res) => {
  try {
    const className = req.query.class;
    const persianYear = req.query.year;
    const period = req.query.period; // yearly, half1, half2, q1..q4, month
    const monthNumber = Number(req.query.month); // now numeric

    const whereClause = {};
    if (className) whereClause.fclass = className.trim();

    let fees = await fee_model.findAll({ where: whereClause });

    // Filter by Persian year
    if (persianYear) {
      fees = fees.filter(fee => {
        const jDate = jalaali.toJalaali(new Date(fee.createdAt));
        return jDate.jy.toString() === persianYear;
      });
    }

    // Define numeric month groups
    const halfMonths = { half1: [1,2,3,4,5,6], half2: [7,8,9,10,11,12] };
    const quarters = { q1: [1,2,3], q2: [4,5,6], q3: [7,8,9], q4: [10,11,12] };

    // Group by student
    const studentsMap = {};
    fees.forEach(fee => {
      const { sid, name, fname, fclass, month, f_payed } = fee;
      if (!studentsMap[sid]) {
        studentsMap[sid] = {
          sid, name, fname, fclass,
          months: Object.fromEntries([...Array(12)].map((_, i) => [i + 1, 0]))
        };
      }
      studentsMap[sid].months[month] = f_payed;
    });

    // Select months based on period
    const periodMonths = (() => {
      if (period === "yearly") return [...Array(12)].map((_, i) => i + 1);
      if (period.startsWith("half")) return halfMonths[period];
      if (period.startsWith("q")) return quarters[period];
      if (period === "month" && monthNumber) return [monthNumber];
      return [...Array(12)].map((_, i) => i + 1);
    })();

    if (period === "month") {
  const monthlyData = fees
    .filter(fee => Number(fee.month) === monthNumber) // <-- convert to number
    .map(fee => {
      const jDate = jalaali.toJalaali(new Date(fee.createdAt));
      const persianCreatedAt = `${jDate.jy}/${String(jDate.jm).padStart(2,'0')}/${String(jDate.jd).padStart(2,'0')}`;
      return {
        sid: fee.sid,
        name: fee.name,
        fname: fee.fname,
        fclass: fee.fclass,
        month: monthNumberToName[Number(fee.month)], // also convert here
        f_payable: fee.f_payable,
        f_payed: fee.f_payed,
        t_payable: fee.t_payable,
        t_payed: fee.t_payed,
        r_f: fee.r_f,
        r_t: fee.r_t,
        rdate: fee.rdate,
        createdAt: persianCreatedAt
      };
    });

    return res.json({ success: true, count: monthlyData.length, data: monthlyData });

    } else {
      // Grouped report
      const finalReport = Object.values(studentsMap).map(student => {
        const newMonths = {};
        periodMonths.forEach(m => newMonths[monthNumberToName[m]] = student.months[m] ?? 0);
        return { ...student, months: newMonths };
      });

      return res.json({ success: true, count: finalReport.length, data: finalReport });
    }

  } catch (err) {
    console.error("REPORT ERROR:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
