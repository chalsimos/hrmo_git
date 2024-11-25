<template>
      <div class="payslip">
      <div class="header">
        <img src="https://minsu.edu.ph/template/images/responsive-logo.png" alt="Mindoro State University" class="logo" />
        <div class="university-details">
          <h1>Mindoro State University</h1>
          <p>Victoria, Oriental Mindoro 5205, Philippines</p>
          <p>Email: onestmsu@gmail.com | Website: www.minsu.edu.ph</p>
          <p>Phone: +63 917 876 78 48</p>
        </div>
      </div>
      
      <h2>Payslip</h2>
    <h6>{{ payslipData.length > 0 ? payslipData[0].period : 'No period available' }}</h6>

      <div class="employee-details">
        <p>
          <strong>Name:</strong>
          <span style="display: inline-block; width: 75px"></span> {{ completeName }}
        </p>
        <p>
          <strong>Position:</strong
          ><span style="display: inline-block; width: 65px"></span> Instructor I
        </p>
        <p>
          <strong>Employee ID #:</strong
          ><span style="display: inline-block; width: 30px"></span> MCC - {{ employeeNumber }}
        </p>
      </div>
      <div class="compensations">
        <p><strong>COMPENSATIONS</strong></p>
        <p><strong>Salary for the period:</strong> 29,165.00</p>
        <p>Less: Adjustments/Holidays</p>
      </div>
      <div class="earnings">
        <p>
          <strong>Gross Amount Earned:</strong>
          <span style="display: inline-block; width: 150px"></span> 29,165.00
        </p>
      </div>
      <div class="deductions">
        <p><strong>DEDUCTIONS</strong></p>
        <p><strong>Mandatory (Contributions)</strong></p>
        <p>
          <span style="display: inline-block; width: 25px"></span>* SSS<span
            style="display: inline-block; width: 65px"
          ></span
          >{{ payslipData.length > 0 ? payslipData[0].sss : '' }}
        </p>
        <p>
          <span style="display: inline-block; width: 25px"></span>HDMF<span
            style="display: inline-block; width: 64px"
          ></span
          >1
        </p>
        <p>
          <span style="display: inline-block; width: 25px"></span
          ><strong>* PhilHealth:</strong>
          <span style="display: inline-block; width: 25px"></span>{{ payslipData.length > 0 ? payslipData[0].PhilHealth : '' }}
        </p>
        <p>Withholding Tax</p>
        <p><strong>Loans</strong></p>
        <p>COOP</p>
        <p>SSS</p>
        <p>Pag-IBIG MPL/Calamity</p>
        <p>GSIS Loans</p>
        <div class="loan-details">
          <p>
            <span style="display: inline-block; width: 25px"></span>Conso. Loan
          </p>
          <p>
            <span style="display: inline-block; width: 25px"></span>P.L.R/PLO
          </p>
          <p><span style="display: inline-block; width: 25px"></span>GFAL</p>
          <p><span style="display: inline-block; width: 25px"></span>O.I.P</p>
          <p><span style="display: inline-block; width: 25px"></span>MPL/CPL</p>
          <p>
            <span style="display: inline-block; width: 25px"></span>EI/educ'l
            Assistance
          </p>
        </div>
        <p>
          <strong>LWOP:</strong
          ><span style="display: inline-block; width: 85px"></span> {{ payslipData.length > 0 ? payslipData[0].lwop : '' }}
        </p>
        <p>
          <strong>Total Deductions:</strong>
          <span style="display: inline-block; width: 170px"></span>{{totalDeductions}}
        </p>
      </div>

      <div class="net-pay">
        <p>
          <strong>NET PAY:</strong
          ><span style="display: inline-block; width: 220px"></span> 26,334.12
        </p>
      </div>
      <br>
      <div class="approval">
        <table>
            <tr>
                <td><p><strong>Certified Correct:</strong></p></td>
            </tr>
            <tr>
                <td><p>ANNABELLE Q. MADRIGAL</p><p>AO V</p></td>
            </tr>
        </table>        
            <p><strong>Approved by:</strong></p>
            <p>FRANIE M. AFABLE, DBMHM</p>
            <p>Campus Executive Director</p>
        </div>
    </div>
</template>

<script>
import { db, auth } from '../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';



export default {
  data() {
    return {
      completeName: '',
      employeeNumber: '',
      payslipData: [], 
      sss: 0,
      philHealth: 0,
      lwop: 0,
      totalDeductions: 0,

    };
  },
   methods: {
    calculateDeductions() {
      // Example values, update as per actual data from Firestore
        this.sss = parseFloat(this.payslipData[0].sss) || 0;
    this.philHealth = parseFloat(this.payslipData[0].PhilHealth) || 0;
    this.lwop = parseFloat(this.payslipData[0].lwop) || 0;
      
      // Sum of SSS, PhilHealth, and LWOP
      this.totalDeductions = this.sss + this.philHealth + this.lwop;
      
      
    }
  },
   async created() {
  try {
    // Step 1: Listen for auth state changes
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const usersCollection = collection(db, 'users');
        const userQuery = query(usersCollection, where('email', '==', user.email));
        const userSnapshot = await getDocs(userQuery);
      
      
        if (!userSnapshot.empty) {
          const userData = userSnapshot.docs[0].data();
          this.completeName = userData.completeName;
          this.employeeNumber = userData.employeeNumber;
          // Step 2: Use employee number to retrieve the specific payslip
          const payslipsCollection = collection(db, 'payslips');
          const payslipQuery = query(payslipsCollection, where('employeeNumber', '==', this.employeeNumber));
          const payslipSnapshot = await getDocs(payslipQuery);
          console.log(payslipSnapshot);
          
            if (!payslipSnapshot.empty) {
            this.payslipData = payslipSnapshot.docs.map(doc => doc.data());
            this.calculateDeductions();

          } else {
            console.log('No payslip data found for this employee.');
          } 
        }
      } else {
        this.$router.push('/'); 
        
      }
    });
  } catch (error) {
    console.error('Error fetching user or payslip data:', error);
  }
},
};
</script>

<style scoped>
 body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
}

.payslip {
    width: 4.25in; 
    height: 6.5in; 
    padding: 8px; 
    border: 1px solid #000;
    box-sizing: border-box;
}

.header {
    display: flex;
    align-items: center;
}

.logo {
    width: 50px; 
    height: 50px;
    margin-right: -70px; 
}

.university-details {
    flex: 1;
}

h1 {
    font-size: 12px; 
    margin: 0;
}

p {
    margin: 1px 0; 
    font-size: 10px; 
    line-height: 1.2; 
}

h2 {
    text-align: center;
    font-size: 14px; 
    margin: 8px 0;
}

h6 {
    text-align: center;
    font-size: 10px; 
    margin: 4px 0;
}

.employee-details, .compensations, .earnings, .deductions, .net-pay, .approval {
    margin: 3px 0; 
    text-align: left;
}

.earnings, .net-pay {
    font-weight: bold;
}

.deductions {
    border-top: 1px solid #000;
    border-bottom: 1px solid #000;
    padding: 5px 0; 
}

.deductions p {
    margin: 2px 0; 
}

.approval {
    text-align: center;
    font-size: 10px; 
}

.approval p {
    margin: 1px 0;
}

.loan-details {
    margin-left: 0; 
}
</style>

<style scoped>
 body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
}

.payslip {
    width: 4.25in; 
    height: 6.5in; 
    padding: 8px; 
    border: 1px solid #000;
    box-sizing: border-box;
}

.header {
    display: flex;
    align-items: center;
}

.logo {
    width: 50px; 
    height: 50px;
    margin-right: -70px; 
}

.university-details {
    flex: 1;
}

h1 {
    font-size: 12px; 
    margin: 0;
}

p {
    margin: 1px 0; 
    font-size: 10px; 
    line-height: 1.2; 
}

h2 {
    text-align: center;
    font-size: 14px; 
    margin: 8px 0;
}

h6 {
    text-align: center;
    font-size: 10px; 
    margin: 4px 0;
}

.employee-details, .compensations, .earnings, .deductions, .net-pay, .approval {
    margin: 3px 0; 
    text-align: left;
}

.earnings, .net-pay {
    font-weight: bold;
}

.deductions {
    border-top: 1px solid #000;
    border-bottom: 1px solid #000;
    padding: 5px 0; 
}

.deductions p {
    margin: 2px 0; 
}

.approval {
    text-align: center;
    font-size: 10px; 
}

.approval p {
    margin: 1px 0;
}

.loan-details {
    margin-left: 0; 
}
</style>