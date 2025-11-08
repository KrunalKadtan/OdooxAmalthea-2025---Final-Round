import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Download, Printer, Edit, Save } from 'lucide-react';
import { Separator } from '../ui/separator';

export function Payslip() {
  const [isEditing, setIsEditing] = useState(false);
  const [payslipData, setPayslipData] = useState({
    employeeId: 'WZ-1234',
    employeeName: 'Sarah Johnson',
    designation: 'Senior Software Engineer',
    department: 'Engineering',
    payPeriod: 'November 2025',
    payDate: '2025-11-30',
    bankAccount: 'XXXX-XXXX-1234',
    basicSalary: 5000,
    housingAllowance: 1000,
    transportAllowance: 500,
    bonus: 250,
    providentFund: 500,
    professionalTax: 200,
    leaveDeductions: 0,
  });

  const calculateTotals = () => {
    const totalEarnings = 
      payslipData.basicSalary + 
      payslipData.housingAllowance + 
      payslipData.transportAllowance + 
      payslipData.bonus;
    
    const totalDeductions = 
      payslipData.providentFund + 
      payslipData.professionalTax + 
      payslipData.leaveDeductions;
    
    const netPay = totalEarnings - totalDeductions;
    
    return { totalEarnings, totalDeductions, netPay };
  };

  const { totalEarnings, totalDeductions, netPay } = calculateTotals();

  const handleSave = () => {
    setIsEditing(false);
    alert('Payslip updated successfully!');
  };

  const PayslipView = ({ editable = false }: { editable?: boolean }) => (
    <div className="bg-white">
      <div className="border border-border rounded-lg p-8">
        <div className="text-center border-b border-border pb-6 mb-6">
          <h2 className="text-primary mb-2">WorkZen HRMS</h2>
          <p className="text-muted-foreground">Monthly Payslip</p>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Employee Name</p>
            {editable ? (
              <Input 
                value={payslipData.employeeName} 
                onChange={(e) => setPayslipData({ ...payslipData, employeeName: e.target.value })}
              />
            ) : (
              <p>{payslipData.employeeName}</p>
            )}
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Employee ID</p>
            <p>{payslipData.employeeId}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Designation</p>
            {editable ? (
              <Input 
                value={payslipData.designation} 
                onChange={(e) => setPayslipData({ ...payslipData, designation: e.target.value })}
              />
            ) : (
              <p>{payslipData.designation}</p>
            )}
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Department</p>
            {editable ? (
              <Input 
                value={payslipData.department} 
                onChange={(e) => setPayslipData({ ...payslipData, department: e.target.value })}
              />
            ) : (
              <p>{payslipData.department}</p>
            )}
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Pay Period</p>
            <p>{payslipData.payPeriod}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Pay Date</p>
            <p>{payslipData.payDate}</p>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="mb-4 text-green-700">Earnings</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Basic Salary</span>
                {editable ? (
                  <Input 
                    type="number" 
                    value={payslipData.basicSalary} 
                    onChange={(e) => setPayslipData({ ...payslipData, basicSalary: Number(e.target.value) })}
                    className="w-32 text-right"
                  />
                ) : (
                  <span>${payslipData.basicSalary.toLocaleString()}</span>
                )}
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Housing Allowance</span>
                {editable ? (
                  <Input 
                    type="number" 
                    value={payslipData.housingAllowance} 
                    onChange={(e) => setPayslipData({ ...payslipData, housingAllowance: Number(e.target.value) })}
                    className="w-32 text-right"
                  />
                ) : (
                  <span>${payslipData.housingAllowance.toLocaleString()}</span>
                )}
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Transport Allowance</span>
                {editable ? (
                  <Input 
                    type="number" 
                    value={payslipData.transportAllowance} 
                    onChange={(e) => setPayslipData({ ...payslipData, transportAllowance: Number(e.target.value) })}
                    className="w-32 text-right"
                  />
                ) : (
                  <span>${payslipData.transportAllowance.toLocaleString()}</span>
                )}
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Performance Bonus</span>
                {editable ? (
                  <Input 
                    type="number" 
                    value={payslipData.bonus} 
                    onChange={(e) => setPayslipData({ ...payslipData, bonus: Number(e.target.value) })}
                    className="w-32 text-right"
                  />
                ) : (
                  <span>${payslipData.bonus.toLocaleString()}</span>
                )}
              </div>
              <Separator />
              <div className="flex justify-between">
                <span>Total Earnings</span>
                <span className="text-green-600">${totalEarnings.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-red-700">Deductions</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Provident Fund</span>
                {editable ? (
                  <Input 
                    type="number" 
                    value={payslipData.providentFund} 
                    onChange={(e) => setPayslipData({ ...payslipData, providentFund: Number(e.target.value) })}
                    className="w-32 text-right"
                  />
                ) : (
                  <span>${payslipData.providentFund.toLocaleString()}</span>
                )}
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Professional Tax</span>
                {editable ? (
                  <Input 
                    type="number" 
                    value={payslipData.professionalTax} 
                    onChange={(e) => setPayslipData({ ...payslipData, professionalTax: Number(e.target.value) })}
                    className="w-32 text-right"
                  />
                ) : (
                  <span>${payslipData.professionalTax.toLocaleString()}</span>
                )}
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Leave Deductions</span>
                {editable ? (
                  <Input 
                    type="number" 
                    value={payslipData.leaveDeductions} 
                    onChange={(e) => setPayslipData({ ...payslipData, leaveDeductions: Number(e.target.value) })}
                    className="w-32 text-right"
                  />
                ) : (
                  <span>${payslipData.leaveDeductions.toLocaleString()}</span>
                )}
              </div>
              <Separator />
              <div className="flex justify-between">
                <span>Total Deductions</span>
                <span className="text-red-600">${totalDeductions.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="bg-primary/5 rounded-lg p-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">Net Pay</p>
          <h1 className="text-primary">${netPay.toLocaleString()}</h1>
          <p className="text-xs text-muted-foreground mt-2">
            (In words: {netPay.toLocaleString()} dollars only)
          </p>
        </div>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>This is a computer-generated payslip and does not require a signature.</p>
          <p>For any queries, please contact the HR department.</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Monthly Payslip</h1>
          <p className="text-muted-foreground">View and manage employee payslips</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      <Tabs defaultValue="employee">
        <TabsList>
          <TabsTrigger value="employee">Employee View</TabsTrigger>
          <TabsTrigger value="payroll">Payroll Officer View</TabsTrigger>
        </TabsList>

        <TabsContent value="employee" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Payslip - Employee View</CardTitle>
              <CardDescription>Read-only view for employees</CardDescription>
            </CardHeader>
            <CardContent>
              <PayslipView editable={false} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payroll" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Payslip - Payroll Officer View</CardTitle>
                  <CardDescription>Editable form for payroll officers</CardDescription>
                </div>
                {isEditing ? (
                  <div className="flex gap-2">
                    <Button onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Payslip
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <PayslipView editable={isEditing} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
