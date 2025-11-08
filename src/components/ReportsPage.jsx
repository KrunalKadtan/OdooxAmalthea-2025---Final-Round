import { useState } from "react";
import "./ReportsPage.css";

function ReportsPage({ userRole = "Administrator" }) {
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [reportGenerated, setReportGenerated] = useState(false);

  const isAuthorized =
    userRole === "Administrator" || userRole === "Payroll Officer";

  // Mock employee data
  const employees = [
    { id: "1", name: "John Doe", employeeId: "EMP001" },
    { id: "2", name: "Jane Smith", employeeId: "EMP002" },
    { id: "3", name: "Mike Johnson", employeeId: "EMP003" },
    { id: "4", name: "Emily Brown", employeeId: "EMP004" },
    { id: "5", name: "Sarah Wilson", employeeId: "EMP005" },
  ];

  // Generate years (current year and past 5 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

  // Mock salary data for the report
  const getEmployeeName = () => {
    const employee = employees.find((e) => e.id === selectedEmployee);
    return employee ? employee.name : "";
  };

  const getEmployeeId = () => {
    const employee = employees.find((e) => e.id === selectedEmployee);
    return employee ? employee.employeeId : "";
  };

  const salaryData = {
    employeeName: getEmployeeName(),
    employeeId: getEmployeeId(),
    year: selectedYear,
    months: [
      {
        month: "January",
        basicSalary: 25000,
        allowances: 15000,
        deductions: 6200,
        netSalary: 33800,
      },
      {
        month: "February",
        basicSalary: 25000,
        allowances: 15000,
        deductions: 6200,
        netSalary: 33800,
      },
      {
        month: "March",
        basicSalary: 25000,
        allowances: 15000,
        deductions: 6200,
        netSalary: 33800,
      },
      {
        month: "April",
        basicSalary: 25000,
        allowances: 15000,
        deductions: 6200,
        netSalary: 33800,
      },
      {
        month: "May",
        basicSalary: 25000,
        allowances: 15000,
        deductions: 6200,
        netSalary: 33800,
      },
      {
        month: "June",
        basicSalary: 25000,
        allowances: 15000,
        deductions: 6200,
        netSalary: 33800,
      },
      {
        month: "July",
        basicSalary: 25000,
        allowances: 15000,
        deductions: 6200,
        netSalary: 33800,
      },
      {
        month: "August",
        basicSalary: 25000,
        allowances: 15000,
        deductions: 6200,
        netSalary: 33800,
      },
      {
        month: "September",
        basicSalary: 25000,
        allowances: 15000,
        deductions: 6200,
        netSalary: 33800,
      },
      {
        month: "October",
        basicSalary: 25000,
        allowances: 15000,
        deductions: 6200,
        netSalary: 33800,
      },
      {
        month: "November",
        basicSalary: 25000,
        allowances: 15000,
        deductions: 6200,
        netSalary: 33800,
      },
      {
        month: "December",
        basicSalary: 25000,
        allowances: 15000,
        deductions: 6200,
        netSalary: 33800,
      },
    ],
  };

  const totalBasicSalary = salaryData.months.reduce(
    (sum, m) => sum + m.basicSalary,
    0
  );
  const totalAllowances = salaryData.months.reduce(
    (sum, m) => sum + m.allowances,
    0
  );
  const totalDeductions = salaryData.months.reduce(
    (sum, m) => sum + m.deductions,
    0
  );
  const totalNetSalary = salaryData.months.reduce(
    (sum, m) => sum + m.netSalary,
    0
  );

  const handleGenerateReport = () => {
    if (!selectedEmployee || !selectedYear) {
      alert("Please select both employee and year");
      return;
    }
    setReportGenerated(true);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isAuthorized) {
    return (
      <div className="reports-container">
        <div className="reports-card">
          <div className="reports-card-header">
            <h2 className="reports-card-title">Access Denied</h2>
          </div>
          <div className="reports-card-content">
            <p className="access-denied-text">
              You don't have permission to access the Reports module. This
              feature is only available to Admin and Payroll Officers.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reports-container">
      {/* Print View - Hidden on screen, visible only when printing */}
      {reportGenerated && (
        <div id="printable-report" className="print-only">
          <div className="print-content">
            <div className="print-header">
              <h1>WorkZen HRMS</h1>
              <h2>Salary Statement Report</h2>
              <p className="print-year">Year: {selectedYear}</p>
            </div>

            <div className="print-employee-info">
              <div className="info-grid">
                <div className="info-item">
                  <p className="info-label">Employee Name</p>
                  <p className="info-value">{salaryData.employeeName}</p>
                </div>
                <div className="info-item">
                  <p className="info-label">Employee ID</p>
                  <p className="info-value">{salaryData.employeeId}</p>
                </div>
              </div>
            </div>

            <table className="print-table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Basic Salary</th>
                  <th>Allowances</th>
                  <th>Deductions</th>
                  <th>Net Salary</th>
                </tr>
              </thead>
              <tbody>
                {salaryData.months.map((month, index) => (
                  <tr key={index}>
                    <td>{month.month}</td>
                    <td>₹ {month.basicSalary.toLocaleString()}</td>
                    <td>₹ {month.allowances.toLocaleString()}</td>
                    <td className="deduction-cell">
                      ₹ {month.deductions.toLocaleString()}
                    </td>
                    <td className="net-cell">
                      ₹ {month.netSalary.toLocaleString()}
                    </td>
                  </tr>
                ))}
                <tr className="total-row">
                  <td>Total</td>
                  <td>₹ {totalBasicSalary.toLocaleString()}</td>
                  <td>₹ {totalAllowances.toLocaleString()}</td>
                  <td className="deduction-cell">
                    ₹ {totalDeductions.toLocaleString()}
                  </td>
                  <td className="net-total">
                    ₹ {totalNetSalary.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="print-footer">
              <p>
                This is a computer-generated report and does not require a
                signature.
              </p>
              <p>Generated on: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Screen View */}
      <div className="no-print">
        <div className="reports-header">
          <h1 className="reports-title">Reports</h1>
          <p className="reports-description">
            Generate and view salary statement reports
          </p>
        </div>

        <div className="reports-card">
          <div className="reports-card-header">
            <div>
              <h2 className="reports-card-title">Salary Statement Report</h2>
              <p className="reports-card-subtitle">
                Select employee and year to generate the report
              </p>
            </div>
            {reportGenerated && (
              <button className="btn-print" onClick={handlePrint}>
                🖨️ Print
              </button>
            )}
          </div>

          <div className="reports-card-content">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="employee" className="form-label">
                  Employee Name
                </label>
                <select
                  id="employee"
                  className="form-select"
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                >
                  <option value="">Select employee</option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name} ({employee.employeeId})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="year" className="form-label">
                  Year
                </label>
                <select
                  id="year"
                  className="form-select"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  <option value="">Select year</option>
                  {years.map((year) => (
                    <option key={year} value={year.toString()}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button className="btn-generate" onClick={handleGenerateReport}>
              Generate Report
            </button>

            {reportGenerated && (
              <div className="report-preview">
                <div className="preview-header">
                  <h3 className="preview-title">Report Preview</h3>
                  <p className="preview-subtitle">
                    {salaryData.employeeName} ({salaryData.employeeId}) - Year{" "}
                    {selectedYear}
                  </p>
                </div>
                <div className="table-wrapper">
                  <table className="report-table">
                    <thead>
                      <tr>
                        <th>Month</th>
                        <th>Basic Salary</th>
                        <th>Allowances</th>
                        <th>Deductions</th>
                        <th>Net Salary</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salaryData.months.map((month, index) => (
                        <tr key={index}>
                          <td>{month.month}</td>
                          <td>₹ {month.basicSalary.toLocaleString()}</td>
                          <td>₹ {month.allowances.toLocaleString()}</td>
                          <td className="deduction-text">
                            ₹ {month.deductions.toLocaleString()}
                          </td>
                          <td className="net-text">
                            ₹ {month.netSalary.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                      <tr className="total-row">
                        <td>Total</td>
                        <td>₹ {totalBasicSalary.toLocaleString()}</td>
                        <td>₹ {totalAllowances.toLocaleString()}</td>
                        <td className="deduction-text">
                          ₹ {totalDeductions.toLocaleString()}
                        </td>
                        <td className="net-total-text">
                          ₹ {totalNetSalary.toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportsPage;
