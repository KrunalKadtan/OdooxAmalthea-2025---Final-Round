import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Calendar, DollarSign, Users, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export function GeneratePayroll() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPeriod, setSelectedPeriod] = useState('');

  const payrollSummary = {
    totalEmployees: 118,
    totalBasicSalary: 590000,
    totalBonuses: 45000,
    totalDeductions: 88500,
    totalPayout: 546500,
  };

  const steps = [
    { number: 1, title: 'Select Pay Period', description: 'Choose the month and year' },
    { number: 2, title: 'Review Summary', description: 'Verify payroll details' },
    { number: 3, title: 'Confirm & Run', description: 'Process the payroll' },
  ];

  const handleNext = () => {
    if (currentStep === 1 && !selectedPeriod) {
      alert('Please select a pay period');
      return;
    }
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRunPayroll = () => {
    alert('Payroll processed successfully! Payslips will be generated and sent to all employees.');
    setCurrentStep(1);
    setSelectedPeriod('');
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>Generate Monthly Payroll</h1>
        <p className="text-muted-foreground">Process monthly salary payments for all employees</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      currentStep >= step.number
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-muted-foreground'
                    }`}
                  >
                    {currentStep > step.number ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <span>{step.number}</span>
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <p className="text-sm">{step.title}</p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-0.5 w-32 mx-4 ${
                      currentStep > step.number ? 'bg-primary' : 'bg-border'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </CardHeader>
      </Card>

      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Select Pay Period</CardTitle>
            <CardDescription>Choose the month and year for payroll processing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="max-w-md space-y-2">
              <label className="text-sm">Pay Period</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select month and year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="november-2025">November 2025</SelectItem>
                  <SelectItem value="october-2025">October 2025</SelectItem>
                  <SelectItem value="september-2025">September 2025</SelectItem>
                  <SelectItem value="august-2025">August 2025</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedPeriod && (
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm">Selected Period</p>
                    <p className="text-primary">
                      {selectedPeriod === 'november-2025' && 'November 2025'}
                      {selectedPeriod === 'october-2025' && 'October 2025'}
                      {selectedPeriod === 'september-2025' && 'September 2025'}
                      {selectedPeriod === 'august-2025' && 'August 2025'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 2: Review Summary</CardTitle>
            <CardDescription>Verify the payroll calculations before processing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-secondary">
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Employees</p>
                    <h3>{payrollSummary.totalEmployees}</h3>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-secondary">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Payout</p>
                    <h3 className="text-green-600">${payrollSummary.totalPayout.toLocaleString()}</h3>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-secondary">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Deductions</p>
                    <h3 className="text-red-600">${payrollSummary.totalDeductions.toLocaleString()}</h3>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-border rounded-lg overflow-hidden">
              <div className="bg-secondary px-4 py-3 border-b border-border">
                <h4>Detailed Breakdown</h4>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Total Basic Salary</span>
                  <span>${payrollSummary.totalBasicSalary.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Total Bonuses & Allowances</span>
                  <span className="text-green-600">+ ${payrollSummary.totalBonuses.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Total Deductions</span>
                  <span className="text-red-600">- ${payrollSummary.totalDeductions.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-3 bg-primary/5 px-4 -mx-4 rounded-lg mt-2">
                  <span>Net Payout</span>
                  <span className="text-primary">${payrollSummary.totalPayout.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
              <p className="text-sm text-yellow-800">
                Please review the summary carefully. Once you proceed to the next step, the payroll will be processed and payslips will be generated.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 3: Confirm and Run Payroll</CardTitle>
            <CardDescription>Final confirmation before processing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center py-8">
              <div className="inline-flex h-20 w-20 rounded-full bg-primary/10 items-center justify-center mb-4">
                <DollarSign className="h-10 w-10 text-primary" />
              </div>
              <h3 className="mb-2">Ready to Process Payroll</h3>
              <p className="text-muted-foreground mb-6">
                You are about to process payroll for {selectedPeriod === 'november-2025' ? 'November 2025' : selectedPeriod}
              </p>

              <div className="max-w-md mx-auto space-y-3 text-left bg-secondary p-6 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="text-sm">Payslips will be generated for all {payrollSummary.totalEmployees} employees</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="text-sm">Email notifications will be sent to all employees</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="text-sm">Total amount: ${payrollSummary.totalPayout.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <Button size="lg" onClick={handleRunPayroll} className="bg-green-600 hover:bg-green-700">
                <CheckCircle2 className="h-5 w-5 mr-2" />
                Confirm and Run Payrun
              </Button>
            </div>

            <div className="p-4 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm text-red-800">
                Warning: This action cannot be undone. Make sure all information is correct before proceeding.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        {currentStep < 3 ? (
          <Button onClick={handleNext}>
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : null}
      </div>
    </div>
  );
}
