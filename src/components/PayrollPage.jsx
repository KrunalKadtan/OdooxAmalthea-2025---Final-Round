import { useState } from "react";
import "./PayrollPage.css";

function PayrollPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [employerCostView, setEmployerCostView] = useState("monthly");
  const [employeeCountView, setEmployeeCountView] = useState("monthly");
  const [payrunView, setPayrunView] = useState("payrun");
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [payslipTab, setPayslipTab] = useState("worked-days");

  // Mock data for charts
  const employerCostData = {
    monthly: [
      { month: "Jan 2025", value: 45000 },
      { month: "Feb 2025", value: 52000 },
      { month: "Mar 2025", value: 58000 },
    ],
    annually: [
      { month: "Jan 2025", value: 540000 },
      { month: "Feb 2025", value: 624000 },
      { month: "Mar 2025", value: 696000 },
    ],
  };

  const employeeCountData = {
    monthly: [
      { month: "Jan 2025", value: 110 },
      { month: "Feb 2025", value: 115 },
      { month: "Mar 2025", value: 118 },
    ],
    annually: [
      { month: "Jan 2025", value: 105 },
      { month: "Feb 2025", value: 112 },
      { month: "Mar 2025", value: 118 },
    ],
  };

  // Mock payrun data
  const payruns = [
    {
      period: "Oct 2025",
      employerCost: 50000,
      gross: 50000,
      net: 43800,
      status: "done",
      employees: [
        {
          name: "John Doe",
          employerCost: 50000,
          basicWage: 25000,
          grossWage: 50000,
          netWage: 43800,
          status: "done",
        },
        {
          name: "Jane Smith",
          employerCost: 45000,
          basicWage: 22000,
          grossWage: 45000,
          netWage: 39500,
          status: "done",
        },
        {
          name: "Mike Johnson",
          employerCost: 48000,
          basicWage: 24000,
          grossWage: 48000,
          netWage: 42000,
          status: "done",
        },
      ],
    },
    {
      period: "Sept 2025",
      employerCost: 48000,
      gross: 48000,
      net: 42000,
      status: "done",
      employees: [],
    },
  ];

  // Payslip data
  const payslipData = {
    employeeName: "John Doe",
    employeeCode: "EMP001",
    department: "Engineering",
    location: "Mumbai Office",
    dateOfJoining: "20/6/2017",
    pan: "DIBxxxxx3",
    uan: "23423423423",
    bankAccount: "23423423432",
    payrun: "Payrun Oct 2025",
    salaryStructure: "Regular Pay",
    period: "01 Oct To 31 Oct",
    payPeriod: "1/10/2025 to 31/10/2025",
    payDate: "3/11/2025",
    workingDaysPerWeek: 5,
    attendanceDays: 20,
    paidTimeOff: 2,
    totalPayableDays: 22,
    attendanceAmount: 45833.33,
    paidLeaveAmount: 4166.67,
    totalAmount: 50000,
  };

  const salaryComponents = {
    allowances: [
      { name: "Basic Salary", rate: 100, amount: 25000 },
      { name: "House Rent Allowance", rate: 100, amount: 12500 },
      { name: "Standard Allowance", rate: 100, amount: 4167 },
      { name: "Performance Bonus", rate: 100, amount: 2082.5 },
      { name: "Leave Travel Allowance", rate: 100, amount: 2082.5 },
      { name: "Fixed Allowance", rate: 100, amount: 4168 },
    ],
    deductions: [
      { name: "PF Employee", rate: 100, amount: 3000 },
      { name: "PF Employer", rate: 100, amount: 3000 },
      { name: "Professional Tax", rate: 100, amount: 200 },
    ],
  };

  const grossTotal = salaryComponents.allowances.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const deductionsTotal = salaryComponents.deductions.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const netAmount = grossTotal - deductionsTotal;

  const currentEmployerData = employerCostData[employerCostView];
  const currentEmployeeData = employeeCountData[employeeCountView];

  const getMaxValue = (data) => {
    return Math.max(...data.map((item) => item.value));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCompute = () => {
    alert("Payslip computed successfully!");
  };

  const handleValidate = () => {
    alert("Payslip validated successfully!");
  };

  const handleCancel = () => {
    alert("Payslip cancelled!");
  };

  const handleEmployeeClick = (employee) => {
    setSelectedPayslip(employee);
  };

  const handleBackToPayrun = () => {
    setSelectedPayslip(null);
  };

  // Render Payslip View
  if (selectedPayslip) {
    return (
      <div className="payroll-container">
        <style>{`
          @media print {
            body * {
              visibility: hidden;
            }
            #printable-payslip, #printable-payslip * {
              visibility: visible;
            }
            #printable-payslip {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              padding: 20px;
            }
            .no-print {
              display: none !important;
            }
          }
        `}</style>

        {/* Print View */}
        <div id="printable-payslip" className="print-only">
          <div className="payslip-print">
            <div className="payslip-print-header">
              <h2>[Company Logo]</h2>
              <p>WorkZen HRMS Platform</p>
            </div>

            <div className="payslip-print-title">
              <h3>Salary slip for month of Oct 2025</h3>
            </div>

            <div className="payslip-print-details">
              <div className="detail-row">
                <div className="detail-item">
                  <span className="detail-label">Employee name</span>
                  <span className="detail-value">: [{payslipData.employeeName}]</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">PAN</span>
                  <span className="detail-value">: {payslipData.pan}</span>
                </div>
              </div>
              <div className="detail-row">
                <div className="detail-item">
                  <span className="detail-label">Employee Code</span>
                  <span className="detail-value">: [{payslipData.employeeCode}]</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">UAN</span>
                  <span className="detail-value">: {payslipData.uan}</span>
                </div>
              </div>
              <div className="detail-row">
                <div className="detail-item">
                  <span className="detail-label">Department</span>
                  <span className="detail-value">: [{payslipData.department}]</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Bank A/c NO.</span>
                  <span className="detail-value">: {payslipData.bankAccount}</span>
                </div>
              </div>
              <div className="detail-row">
                <div className="detail-item">
                  <span className="detail-label">Location</span>
                  <span className="detail-value">: [{payslipData.location}]</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Pay period</span>
                  <span className="detail-value">: {payslipData.payPeriod}</span>
                </div>
              </div>
              <div className="detail-row">
                <div className="detail-item">
                  <span className="detail-label">Date of joining</span>
                  <span className="detail-value">: {payslipData.dateOfJoining}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Pay date</span>
                  <span className="detail-value">: {payslipData.payDate}</span>
                </div>
              </div>
            </div>

            <div className="payslip-print-section">
              <div className="section-header">
                <span>Worked Days</span>
                <span>Number of Days</span>
              </div>
              <div className="section-content">
                <div className="section-row">
                  <span>Attendance</span>
                  <span>{payslipData.attendanceDays} Days</span>
                </div>
                <div className="section-row section-total">
                  <span>Total</span>
                  <span>{payslipData.totalPayableDays} Days</span>
                </div>
              </div>
            </div>

            <div className="payslip-print-section">
              <div className="section-header section-header-grid">
                <span>Earnings</span>
                <span>Amounts</span>
                <span>Deductions</span>
                <span>Amounts</span>
              </div>
              <div className="section-content section-content-grid">
                <div>
                  {salaryComponents.allowances.map((item, index) => (
                    <div key={index} className="section-row">
                      {item.name}
                    </div>
                  ))}
                  <div className="section-row section-total">Gross</div>
                </div>
                <div>
                  {salaryComponents.allowances.map((item, index) => (
                    <div key={index} className="section-row">
                      ₹ {item.amount.toFixed(2)}
                    </div>
                  ))}
                  <div className="section-row section-total">
                    ₹ {grossTotal.toFixed(2)}
                  </div>
                </div>
                <div>
                  {salaryComponents.deductions.map((item, index) => (
                    <div key={index} className="section-row">
                      {item.name}
                    </div>
                  ))}
                  <div className="section-row">TDS Deduction</div>
                </div>
                <div>
                  {salaryComponents.deductions.map((item, index) => (
                    <div key={index} className="section-row">
                      - ₹ {item.amount.toFixed(2)}
                    </div>
                  ))}
                  <div className="section-row">- ₹ 0.00</div>
                </div>
              </div>
            </div>

            <div className="payslip-print-footer">
              <div className="footer-label">
                <p>Total Net Payable (Gross Earning - Total deductions)</p>
              </div>
              <div className="footer-amount">
                <p className="amount-value">{netAmount.toFixed(2)}</p>
                <p className="amount-words">[Amount in words] only</p>
              </div>
            </div>
          </div>
        </div>

        {/* Screen View */}
        <div className="no-print">
          <div className="payslip-actions">
            <button className="btn-back" onClick={handleBackToPayrun}>
              ← Back to Payrun
            </button>
            <div className="action-buttons">
              <button className="btn-primary">New Payslip</button>
              <button className="btn-primary" onClick={handleCompute}>
                Compute
              </button>
              <button className="btn-outline" onClick={handleValidate}>
                Validate
              </button>
              <button className="btn-outline" onClick={handleCancel}>
                Cancel
              </button>
              <button className="btn-outline" onClick={handlePrint}>
                🖨️ Print
              </button>
            </div>
          </div>

          <div className="payslip-card">
            <div className="payslip-header">
              <h2>[{payslipData.employeeName}]</h2>
              <div className="payslip-info">
                <div className="info-item">
                  <p className="info-label">Payrun</p>
                  <p className="info-value">{payslipData.payrun}</p>
                </div>
                <div className="info-item">
                  <p className="info-label">Salary Structure</p>
                  <p className="info-value">{payslipData.salaryStructure}</p>
                </div>
                <div className="info-item">
                  <p className="info-label">Period</p>
                  <p className="info-value">{payslipData.period}</p>
                </div>
              </div>
            </div>

            <div className="payslip-tabs">
              <button
                className={`tab-btn ${
                  payslipTab === "worked-days" ? "active" : ""
                }`}
                onClick={() => setPayslipTab("worked-days")}
              >
                Worked Days
              </button>
              <button
                className={`tab-btn ${
                  payslipTab === "salary-computation" ? "active" : ""
                }`}
                onClick={() => setPayslipTab("salary-computation")}
              >
                Salary Computation
              </button>
            </div>

            {payslipTab === "worked-days" && (
              <div className="tab-content">
                <div className="table-wrapper">
                  <table className="payslip-table">
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Days</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Attendance</td>
                        <td>
                          {payslipData.attendanceDays}.00 (
                          {payslipData.workingDaysPerWeek} working days in week)
                        </td>
                        <td>₹ {payslipData.attendanceAmount.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td>Paid Time off</td>
                        <td>
                          {payslipData.paidTimeOff}.00 (2 Paid leaves/Month)
                        </td>
                        <td>₹ {payslipData.paidLeaveAmount.toLocaleString()}</td>
                      </tr>
                      <tr className="total-row">
                        <td></td>
                        <td>{payslipData.totalPayableDays}.00</td>
                        <td>₹ {payslipData.totalAmount.toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="info-note">
                  <p>
                    Salary is calculated based on the employee's monthly
                    attendance. Paid leaves are included in the total payable
                    days, while unpaid leaves are deducted from the salary
                  </p>
                </div>
              </div>
            )}

            {payslipTab === "salary-computation" && (
              <div className="tab-content">
                <div className="table-wrapper">
                  <table className="payslip-table">
                    <thead>
                      <tr>
                        <th>Rule Name</th>
                        <th>Rate %</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salaryComponents.allowances.map((item, index) => (
                        <tr key={`allowance-${index}`}>
                          <td>{item.name}</td>
                          <td>{item.rate}</td>
                          <td>₹ {item.amount.toLocaleString()}</td>
                        </tr>
                      ))}
                      <tr className="gross-row">
                        <td>Gross</td>
                        <td>100</td>
                        <td>₹ {grossTotal.toLocaleString()}</td>
                      </tr>
                      {salaryComponents.deductions.map((item, index) => (
                        <tr key={`deduction-${index}`}>
                          <td>{item.name}</td>
                          <td>{item.rate}</td>
                          <td className="deduction-amount">
                            - ₹ {item.amount.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                      <tr className="net-row">
                        <td>Net Amount</td>
                        <td>100</td>
                        <td>₹ {netAmount.toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="breakdown-grid">
                  <div className="breakdown-card">
                    <h3 className="breakdown-title gross-title">
                      Gross Salary Breakdown
                    </h3>
                    <div className="breakdown-items">
                      {salaryComponents.allowances.map((item, index) => (
                        <div key={index} className="breakdown-item">
                          <span>{item.name}</span>
                          <span>₹ {item.amount.toLocaleString()}</span>
                        </div>
                      ))}
                      <div className="breakdown-total">
                        <span>Total Gross</span>
                        <span className="gross-total">
                          ₹ {grossTotal.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="breakdown-card">
                    <h3 className="breakdown-title deduction-title">
                      Deductions Breakdown
                    </h3>
                    <div className="breakdown-items">
                      {salaryComponents.deductions.map((item, index) => (
                        <div key={index} className="breakdown-item">
                          <span>{item.name}</span>
                          <span className="deduction-amount">
                            ₹ {item.amount.toLocaleString()}
                          </span>
                        </div>
                      ))}
                      <div className="breakdown-total">
                        <span>Total Deductions</span>
                        <span className="deduction-total">
                          ₹ {deductionsTotal.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Main Payroll View
  return (
    <div className="payroll-container">
      <div className="payroll-tabs">
        <button
          className={`tab-btn ${activeTab === "dashboard" ? "active" : ""}`}
          onClick={() => setActiveTab("dashboard")}
        >
          Dashboard
        </button>
        <button
          className={`tab-btn ${activeTab === "payrun" ? "active" : ""}`}
          onClick={() => setActiveTab("payrun")}
        >
          Payrun
        </button>
      </div>

      {activeTab === "dashboard" && (
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="card-header">
              <div className="card-icon warning-icon">⚠️</div>
              <h3>Warning</h3>
            </div>
            <div className="card-content">
              <p className="warning-link">1 Employee without Bank A/c</p>
              <p className="warning-link">1 Employee without Manager</p>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <h3>Payrun</h3>
            </div>
            <div className="card-content">
              <p className="payrun-link">Payrun for Oct 2025 (3 Payslip)</p>
              <p className="payrun-link">Payrun for Sept 2025 (3 Payslip)</p>
            </div>
          </div>

          <div className="dashboard-card chart-card">
            <div className="card-header">
              <div>
                <h3>Employer Cost</h3>
                <p className="card-subtitle">Total payroll expenses</p>
              </div>
              <div className="toggle-group">
                <button
                  className={`toggle-btn ${
                    employerCostView === "annually" ? "active" : ""
                  }`}
                  onClick={() => setEmployerCostView("annually")}
                >
                  Annually
                </button>
                <button
                  className={`toggle-btn ${
                    employerCostView === "monthly" ? "active" : ""
                  }`}
                  onClick={() => setEmployerCostView("monthly")}
                >
                  Monthly
                </button>
              </div>
            </div>
            <div className="card-content">
              <div className="chart-container">
                {currentEmployerData.map((item, index) => (
                  <div key={index} className="chart-bar-wrapper">
                    <div className="chart-bar-container">
                      <div
                        className="chart-bar"
                        style={{
                          height: `${
                            (item.value / getMaxValue(currentEmployerData)) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <span className="chart-label">{item.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="dashboard-card chart-card">
            <div className="card-header">
              <div>
                <h3>Employee Count</h3>
                <p className="card-subtitle">Total active employees</p>
              </div>
              <div className="toggle-group">
                <button
                  className={`toggle-btn ${
                    employeeCountView === "annually" ? "active" : ""
                  }`}
                  onClick={() => setEmployeeCountView("annually")}
                >
                  Annually
                </button>
                <button
                  className={`toggle-btn ${
                    employeeCountView === "monthly" ? "active" : ""
                  }`}
                  onClick={() => setEmployeeCountView("monthly")}
                >
                  Monthly
                </button>
              </div>
            </div>
            <div className="card-content">
              <div className="chart-container">
                {currentEmployeeData.map((item, index) => (
                  <div key={index} className="chart-bar-wrapper">
                    <div className="chart-bar-container">
                      <div
                        className="chart-bar"
                        style={{
                          height: `${
                            (item.value / getMaxValue(currentEmployeeData)) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <span className="chart-label">{item.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "payrun" && (
        <div className="payrun-container">
          <div className="payrun-tabs">
            <button
              className={`tab-btn ${payrunView === "payrun" ? "active" : ""}`}
              onClick={() => setPayrunView("payrun")}
            >
              Payrun
            </button>
            <button
              className={`tab-btn ${
                payrunView === "validate" ? "active" : ""
              }`}
              onClick={() => setPayrunView("validate")}
            >
              Validate
            </button>
          </div>

          <div className="payrun-list">
            {payruns.map((payrun, index) => (
              <div key={index} className="payrun-card">
                <div className="payrun-header">
                  <div className="payrun-info">
                    <h3>Payrun {payrun.period}</h3>
                    <div className="payrun-stats">
                      <div className="stat-item">
                        <span className="stat-value">
                          ₹ {payrun.employerCost.toLocaleString()}
                        </span>
                        <span className="stat-label">Employer Cost</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-value">
                          ₹ {payrun.gross.toLocaleString()}
                        </span>
                        <span className="stat-label">Gross</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-value">
                          ₹ {payrun.net.toLocaleString()}
                        </span>
                        <span className="stat-label">Net</span>
                      </div>
                    </div>
                  </div>
                  <button
                    className={`btn-status ${
                      payrun.status === "done" ? "done" : ""
                    }`}
                    disabled={payrun.status === "done"}
                  >
                    {payrun.status === "done" ? "Done" : "Validate"}
                  </button>
                </div>

                {payrun.employees.length > 0 && (
                  <div className="payrun-table-wrapper">
                    <table className="payrun-table">
                      <thead>
                        <tr>
                          <th>Pay Period</th>
                          <th>Employee</th>
                          <th>Employer Cost</th>
                          <th>Basic Wage</th>
                          <th>Gross Wage</th>
                          <th>Net Wage</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payrun.employees.map((employee, empIndex) => (
                          <tr
                            key={empIndex}
                            className="employee-row"
                            onClick={() => handleEmployeeClick(employee)}
                          >
                            <td>[{payrun.period}]</td>
                            <td className="employee-name">[{employee.name}]</td>
                            <td>₹ {employee.employerCost.toLocaleString()}</td>
                            <td>₹ {employee.basicWage.toLocaleString()}</td>
                            <td>₹ {employee.grossWage.toLocaleString()}</td>
                            <td>₹ {employee.netWage.toLocaleString()}</td>
                            <td onClick={(e) => e.stopPropagation()}>
                              <button
                                className={`btn-status ${
                                  employee.status === "done" ? "done" : ""
                                }`}
                                disabled={employee.status === "done"}
                              >
                                {employee.status === "done"
                                  ? "Done"
                                  : "Validate"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PayrollPage;
