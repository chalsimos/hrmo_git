const express = require("express");
const router = express.Router();
const authController = require('../controllers/authController');
const { roleAuth } = require('../middleware/authMiddleware');
const bookController = require("../controllers/bookController");
const cashierController = require("../controllers/cashierController")

// router.get("/main", roleAuth(['admin', 'hr']), bookController.HrIndex);
router.get("/main", roleAuth(['admin', 'hr']), bookController.HrIndex);
router.get("/employees", roleAuth(['admin', 'hr']),  bookController.employees);
router.get("/modify-information/:id", roleAuth(['admin', 'hr']), bookController.modifyEmployee);
router.post("/modify-employee/:id", roleAuth(['admin', 'hr']), bookController.modify_employee);


router.get('/find-employee', bookController.findEmployee);
router.post('/save-endcoded', bookController.saveEncoded);
router.get('/locator-validator', bookController.locatorValidator);
router.get("/add-employee", roleAuth(['admin', 'hr']),  bookController.addEmployee);
router.post("/addemployee", roleAuth(['admin', 'hr']),  bookController.add_employee);
router.get("/salary", roleAuth(['admin', 'hr']),  bookController.salary);
router.post("/addsalary", roleAuth(['admin', 'hr']),  bookController.addsalary);
router.get("/filteryear", roleAuth(['admin', 'hr']),  bookController.filteryear);
router.get("/service-record/:id", roleAuth(['admin', 'hr']),  bookController.serviceRecord);
router.get("/service-record-print/:id", roleAuth(['admin', 'hr']),  bookController.printServiceRecord);
router.post("/add-service-record", roleAuth(['admin', 'hr']),  bookController.addserviceRecord);
router.get("/position", roleAuth(['admin', 'hr']),  bookController.position);
router.post("/add-position", roleAuth(['admin', 'hr']),  bookController.addPosition);
router.post("/update-time", roleAuth(['admin', 'hr']),  bookController.update_time);
router.post("/file-leave", roleAuth(['admin', 'hr']),  bookController.fileFeave);
router.get("/leave-report", roleAuth(['admin', 'hr']),  bookController.leaveReport);
router.get("/locator", roleAuth(['admin', 'hr']),  bookController.locator);
router.post("/generate-locator", roleAuth(['admin', 'hr']),  bookController.generateLocator);
router.get("/system-accounts", roleAuth(['admin', 'hr']),  bookController.systemAccounts);



router.post("/export", roleAuth(['admin', 'hr']), bookController.export);
router.post("/upload", roleAuth(['admin', 'hr']), bookController.uploadFile);
router.post("/batch",  roleAuth(['admin', 'hr']), bookController.batch);
router.get("/signatories", roleAuth(['admin', 'hr']), bookController.signatories);
router.post("/addsignatory", roleAuth(['admin', 'hr']), bookController.addSignatory);


// cashier and accounting
router.get("/cashier", roleAuth(['cashier']), cashierController.index);
router.get("/accounting/payroll", roleAuth(['cashier']), cashierController.payroll);
router.get("/accounting/salary", roleAuth(['cashier']), cashierController.salary);

router.get("/accounting/deduction", roleAuth(['admin', 'hr']), cashierController.deduction);
router.post("/add-deduction", cashierController.add_deduction);
router.post("/delete-deduction", cashierController.delete_deduction);

router.get("/accounting/payslip", roleAuth(['cashier']), cashierController.payslip);
router.post("/accounting/addPayroll", cashierController.addPayroll);
router.get("/accounting/payroll/:id", roleAuth(['cashier']), cashierController.payrollEmployee);


router.post("/books", roleAuth(['admin', 'hr']), bookController.createBook);
router.get("/books/edit/:id", roleAuth(['admin', 'hr']), bookController.getBookById);
router.post("/books/edit/:id", roleAuth(['admin', 'hr']), bookController.updateBook);
router.get("/books/delete/:id", roleAuth(['admin', 'hr']), bookController.deleteBook);





// router.get('/register', (req, res) => res.render('register', { error: null }));
router.get('/register', roleAuth(['admin']), authController.regView);
router.post('/register', authController.register);

router.get('/', (req, res) => {
  res.render('login', { error: null }); // Pass error as null by default
});

router.post('/login', authController.login);
router.get('/logout', authController.logout);



module.exports = router;
