<template>
  <div class="payslip" v-if="payslip">
    <div class="header">
      <div class="logo-container">
        <img src="https://minsu.edu.ph/template/images/responsive-logo.png" alt="Mindoro State University Logo" class="logo" />
      </div>
      <div class="university-details">
        <h1>Mindoro State University</h1>
        <p>Victoria, Oriental Mindoro 5205, Philippines</p>
        <p>Email: onestmsu@gmail.com | Website: www.minsu.edu.ph</p>
        <p>Phone: +63 917 876 78 48</p>
      </div>
    </div>

    <div class="title-section">
      <h2>P A Y S L I P</h2>
      <p class="period">{{ period }}</p>

    </div>

    <div class="employee-info">
      <table>
          <tr>
            <td class="label">Employee Name:</td>
            <td class="value">{{ payslip.name }}</td>
          </tr>
          <tr>
            <td class="label">Position:</td>
            <td class="value">{{ payslip.serviceRecordPosition }}</td>
          </tr>
          <tr>
            <td class="label">Employee Number:</td>
            <td class="value">{{ payslip.empno }}</td>
          </tr>
          <!-- <tr>
            <td class="label">Payroll Sequence No.:</td>
            <td class="value">{{ payslip.payrollSequence }}</td>
            <td class="salary-grade">Salary Grade:</td>
            <td class="value">{{ payslip.salaryGrade }}</td>
          </tr> -->
        </table>
      
    </div>

    <div class="summary">
      <p><strong><u> SUMMARY</u></strong> </p>
      <table>
          <tr>
            <td class="label">Gross</td>
            <td class="value">{{ formatCurrency(payslip.gross) }}</td>
          </tr>
          <tr>
            <td class="label">Total Deduction</td>
            <td class="value">{{ formatCurrency(payslip.totalDeduction) }}</td>
          </tr>
          <tr class="net-pay">
            <td class="label">NET Pay</td>
            <td class="value">{{ formatCurrency(payslip.netPay) }}</td>
          </tr>
          <tr>
            <td class="indent">1st Half</td>
            <td class="value">{{ formatCurrency(payslip.firstHalf) }}</td>
          </tr>
          <tr>
            <td class="indent">2nd Half</td>
            <td class="value">{{ formatCurrency(payslip.secondHalf) }}</td>
          </tr>
        </table>
    </div>
    

    

    <div class="details">
      <p><b>DETAILS</b></p>
        
        <div class="compensation">
          <div class="section-title label">Compensation</div>
          <table>
            <tr>
              <td class="indent">Basic Salary</td>
              <td class="value">{{ formatCurrency(payslip.gross) }}</td>
            </tr>
            <tr>
              <td class="indent">PERA</td>
              <td class="value">{{ formatCurrency(2000) }}</td>
            </tr>
            <tr>
              <td class="indent">Adjustments</td>
              <td class="value">{{ formatCurrency(payslip.adjustments) }}</td>
            </tr>
            <tr class="total">
              <td class="indent">Gross Amount Earned</td>
              <td class="value">{{ formatCurrency(payslip.gross + 2000) }}</td>
            </tr>
          </table>
        </div>
        <div class="deductions">
          <div class="section-title label">Deductions</div>
          <table>
            <tr>
              <td class="indent">Withholding Tax</td>
              <td class="value">{{ formatCurrency(payslip.tax) }}</td>
            </tr>
            <tr>
              <td class="indent">GSIS</td>
              <td></td>
            </tr>
            <tr>
              <td class="double-indent">Life & Retrmnt Ins. Premium</td>
              <td class="value">{{ formatCurrency(payslip.deductions.gsis.lr) }}</td>
            </tr>


            
            <tr>
              <td class="double-indent">GSIS Unpaid Premium</td>
              <td class="value">{{ formatCurrency(payslip.deductions.gsis.plr) }}</td>
            </tr>
            <tr>
              <td class="double-indent">Consolidated Loan</td>
              <td class="value">{{ formatCurrency(payslip.deductions.gsis.conso) }}</td>
            </tr>
            <tr>
              <td class="double-indent">Policy Loan Regular</td>
              <td class="value">{{ formatCurrency(payslip.deductions.gsis.uoli) }}</td>
            </tr>
            <tr>
              <td class="double-indent">Calamity/Emergency Loan</td>
              <td class="value">{{ formatCurrency(payslip.deductions.gsis.elmpl) }}</td>
            </tr>
            <tr>
              <td class="double-indent">MPL Lite</td>
              <td class="value">{{ formatCurrency(payslip.deductions.gsis.mplcpl) }}</td>
            </tr>
            <tr>
              <td class="double-indent">GSIS Fin. Asst. Loan (GFAL)</td>
              <td class="value">{{ formatCurrency(payslip.deductions.gsis.gfal) }}</td>
            </tr>
            <tr>
              <td class="double-indent">GSIS Multi Purpose Loan (MPL)</td>
              <td class="value">{{ formatCurrency(payslip.deductions.gsis.elmpl) }}</td>
            </tr>
            <tr>
              <td class="double-indent">Computer Loan</td>
              <td class="value">{{ formatCurrency(payslip.deductions.gsis.elmpl) }}</td>
            </tr>
            
            <tr>
              <td class="indent">HDMF</td>
              <td></td>
            </tr>
            <tr>
              <td class="double-indent">Pag-ibig Premium</td>
              <td class="value">{{ formatCurrency(payslip.deductions.hmdf.premium) }}</td>
            </tr>
            <tr>
              <td class="double-indent">Modified Pagibig 2 (MP2)</td>
              <td class="value">{{ formatCurrency(payslip.deductions.hmdf.premium) }}</td>
            </tr>
            <tr>
              <td class="double-indent">Multi Purpose Loan</td>
              <td class="value">{{ formatCurrency(payslip.deductions.hmdf.premium) }}</td>
            </tr>
            <tr>
              <td class="double-indent">Calamity Loan</td>
              <td class="value">{{ formatCurrency(payslip.deductions.hmdf.hdmfmpl) }}</td>
            </tr>
            
            <tr>
              <td class="indent">PHILHEALTH</td>
              <td class="value">{{ formatCurrency(payslip.deductions.philhealth) }}</td>
            </tr>
            <tr>
              <td class="indent">LANDBANK SALARY LOAN</td>
              <td class="value">{{ formatCurrency(payslip.deductions.lbspl) }}</td>
            </tr>
            
            <tr>
              <td class="indent">LEAVE W/O PAY</td>
              <td class="value">{{ formatCurrency(payslip.deductions.lbspl) }}</td>
            </tr>
            <tr>
              <td class="double-indent">Basic</td>
              <td class="value">{{ formatCurrency(payslip.deductions.lwop) }}</td>
            </tr>
            <tr>
              <td class="double-indent">Undertime</td>
              <td class="value">{{ formatCurrency(payslip.deductions.lwop) }}</td>
            </tr>
            
            <tr class="total">
              <td class="indent">Total Deduction</td>
              <td class="value">{{ formatCurrency(payslip.totalDeduction) }}</td>
            </tr>
          </table>
        </div>    
    </div>

    

    

    <div class="approval-section">
        <p class="label">Prepared by:</p>
        <p class="name">CHRISTIAN I. CABRERA <i>CESO-IV</i></p>
        <p class="position">ADMINISTRATIVE OFFICER V</p>
    </div>

    <div class="print-button">
      <button @click="printPayslip">Print</button>
    </div>
  </div>
  <div v-else>
  <v-alert type="warning" outlined class="mb-4">
    <strong>No Record found</strong> for the month of {{ month }} {{ year }}.
  </v-alert>

  <v-btn color="primary" @click="$router.back()" class="mt-2">
    <v-icon left>mdi-arrow-left</v-icon>
    Go Back
  </v-btn>
</div>

</template>

<script setup>
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

import { ref, computed } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router';

const route = useRoute();

const payslip = ref(null)
const employeeNumber = ref(null)
const month = route.query.month;
const year = route.query.year;

console.log('Month:', month);
console.log('Year:', year);

// Fetch employee number from Firestore after user logs in
onAuthStateChanged(auth, async (user) => {
  if (user) {
    try {
      const docRef = doc(db, "users", user.uid)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        employeeNumber.value = docSnap.data().employeeId
        console.log("Employee ID:", employeeNumber.value)

        // Now fetch the payslip
        await fetchPayslipData()
      } else {
        console.warn("User document not found")
      }
    } catch (error) {
      console.error("Error fetching employee number:", error)
    }
  } else {
    console.warn("User not authenticated")
  }
})

async function fetchPayslipData() {
  if (!employeeNumber.value) return

  try {
    const res = await axios.get('http://localhost:3000/payslip', {
      params: { empno: employeeNumber.value, month, year }
    })
    payslip.value = normalizePayslip(res.data)
    console.log('Fetched payslip:', res.data)
  } catch (err) {
    console.error('Error fetching payslip:', err)
  }
}

function normalizePayslip(data) {
  const gross = parseFloat(data.salary || 0)
  let totalDeductions = 0

  const tax = parseFloat(data.tax || data.deductions?.tax || 0)
  totalDeductions += tax

  if (data.deductions) {
    totalDeductions += parseFloat(data.deductions.sss || 0)
    totalDeductions += parseFloat(data.deductions.philhealth || 0)
    totalDeductions += parseFloat(data.deductions.hmdf?.premium || 0)
    totalDeductions += parseFloat(data.deductions.lwop || 0)
    totalDeductions += parseFloat(data.deductions.coop || 0)
    totalDeductions += parseFloat(data.deductions.sssLoan || 0)
    totalDeductions += parseFloat(data.deductions.pagibigMpl || 0)
    totalDeductions += parseFloat(data.deductions.lbspl || 0)

    if (data.deductions.gsis) {
      totalDeductions += parseFloat(data.deductions.gsis.lr || 0)
      totalDeductions += parseFloat(data.deductions.gsis.conso || 0)
      totalDeductions += parseFloat(data.deductions.gsis.plr || 0)
      totalDeductions += parseFloat(data.deductions.gsis.gfal || 0)
      totalDeductions += parseFloat(data.deductions.gsis.uoli || 0)
      totalDeductions += parseFloat(data.deductions.gsis.mplcpl || 0)
      totalDeductions += parseFloat(data.deductions.gsis.elmpl || 0)
      totalDeductions += parseFloat(data.deductions.gsis.unpaidPremium || 0)
      totalDeductions += parseFloat(data.deductions.gsis.calamityEl || 0)
      totalDeductions += parseFloat(data.deductions.gsis.computerLoan || 0)
    }

    if (data.deductions.hmdf) {
      totalDeductions += parseFloat(data.deductions.hmdf.hdmfmpl || 0)
    }
  }

  const netPay = gross - totalDeductions
  const firstHalf = (netPay / 2) + 2000
  const secondHalf = netPay / 2

  return {
    ...data,
    gross,
    adjustments: 0,
    totalDeduction: totalDeductions,
    netPay,
    firstHalf,
    secondHalf,
    tax,
    deductions: {
      sss: '0.00',
      philhealth: '0.00',
      lwop: '0.00',
      lbspl: '0.00',
      hmdf: {
        premium: '0.00',
        hdmfmpl: '0.00'
      },
      coop: '0.00',
      sssLoan: '0.00',
      pagibigMpl: '0.00',
      gsis: {
        lr: '0.00',
        conso: '0.00',
        plr: '0.00',
        gfal: '0.00',
        uoli: '0.00',
        mplcpl: '0.00',
        elmpl: '0.00',
        unpaidPremium: '0.00',
        calamityEl: '0.00',
        computerLoan: '0.00'
      },
      ...data.deductions,
      hmdf: {
        premium: '0.00',
        hdmfmpl: '0.00',
        ...data.deductions?.hmdf
      },
      gsis: {
        lr: '0.00',
        ...data.deductions?.gsis
      }
    },
    totaldeductions: totalDeductions.toFixed(2)
  }
}

const period = computed(() => {
  if (!payslip.value) return ''
  const date = new Date(payslip.value.year, parseInt(payslip.value.month) - 1)
  return date.toLocaleString('en-US', { month: 'long', year: 'numeric' })
})

const computeNetPay = computed(() => {
  if (!payslip.value) return '0.00'
  const salary = parseFloat(payslip.value.salary || 0)
  const deductions = parseFloat(payslip.value.totaldeductions || 0)
  return (salary - deductions).toFixed(2)
})

const totalGsisLoan = computed(() => {
  const gsis = payslip.value?.deductions?.gsis || {}
  return [
    'conso', 'plr', 'gfal', 'uoli', 'mplcpl', 'elmpl'
  ].reduce((sum, key) => sum + parseFloat(gsis[key] || 0), 0).toFixed(2)
})

function format(val) {
  return parseFloat(val || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })
}

function formatCurrency(value) {
  if (value === 0 || value === undefined) return '-'
  return new Intl.NumberFormat('en-PH', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

function printPayslip() {
  window.print()
}
</script>


<style scoped>
.payslip {
  width: 8.5in;
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  font-size: 12px;
  border: 1px solid #000;
  box-sizing: border-box;
  line-height: 1.3;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.logo {
  width: 50px;
  height: 50px;
  margin-right: 15px;
}

.university-details h1 {
  font-size: 16px;
  margin: 0;
  font-weight: bold;
}

.university-details p {
  margin: 0;
  font-size: 11px;
}

.title-section {
  text-align: center;
  margin-bottom: 15px;
}

.title-section h2 {
  font-size: 16px;
  margin: 0 0 5px 0;
}

.title-section p {
  margin: 0;
  font-size: 12px;
}



.info-row {
  display: flex;
  margin-bottom: 3px;
}


.net-pay {
  font-weight: bold;
  font-size: 12px;
}

.value {
  flex: 1;
  text-align: right;
}

.section h3 {
  font-size: 12px;
  margin: 10px 0 5px 0;
  font-weight: bold;
}

.subsection {
  margin-bottom: 5px;
}

.indented {
  margin-left: 20px;
}

.double-indented {
  margin-left: 40px;
}

.total-row {
  font-weight: bold;
  margin-top: 5px;
}

.divider {
  border-bottom: 1px solid #000;
  margin: 10px 0;
}

.net-pay {
  display: flex;
  font-weight: bold;
  font-size: 12px;
  margin: 0px 0;
}


.certified, .approved {
  width: 45%;
}
.period {
  font-weight: bold;
  font-size: 14px;
}
.employee-info, .summary, .details, .signature {
  border: 1px solid #003366;
  margin-bottom: 1px;
  padding: 5px;
}

.employee-info table, .summary table, .details table {
  width: 100%;
  border-collapse: collapse;
}

.employee-info td, .summary td, .details td {
  padding: 3px 5px;
}
.approval-section {
  text-align: center;
  margin-top: 2rem;
}

.label {
  font-weight: bold;
}

.position {
  margin: 0;
  font-style: italic;
}

.name {
  margin: 0;
  font-weight: bold;
}




.print-button {
  text-align: center;
  margin-top: 20px;
}

.print-button button {
  padding: 8px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.print-button button:hover {
  background-color: #45a049;
}

@media print {
  .print-button {
    display: none;
  }
  
  .payslip {
    border: none;
  }
}
</style>