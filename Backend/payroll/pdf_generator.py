"""
PDF Generation for Payslips
"""
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from io import BytesIO
from datetime import datetime


def generate_payslip_pdf(payslip):
    """
    Generate PDF payslip with digital signature
    
    Args:
        payslip: Payslip model instance
    
    Returns:
        BytesIO: PDF file buffer
    """
    buffer = BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter
    
    # Company Header
    p.setFont("Helvetica-Bold", 20)
    p.drawString(1 * inch, height - 1 * inch, "WORKZEN HRMS")
    
    p.setFont("Helvetica-Bold", 16)
    p.drawString(1 * inch, height - 1.4 * inch, "PAYSLIP")
    
    # Employee Details
    p.setFont("Helvetica", 11)
    y = height - 2 * inch
    
    p.drawString(1 * inch, y, f"Employee Name: {payslip.employee.get_full_name()}")
    y -= 0.3 * inch
    p.drawString(1 * inch, y, f"Employee ID: {payslip.employee.id}")
    y -= 0.3 * inch
    p.drawString(1 * inch, y, f"Designation: {payslip.employee.designation}")
    y -= 0.3 * inch
    p.drawString(1 * inch, y, f"Department: {payslip.employee.department}")
    y -= 0.3 * inch
    p.drawString(1 * inch, y, f"Month/Year: {payslip.month}/{payslip.year}")
    y -= 0.3 * inch
    p.drawString(1 * inch, y, f"Days Worked: {payslip.days_worked}/26")
    
    # Earnings Section
    y -= 0.6 * inch
    p.setFont("Helvetica-Bold", 12)
    p.drawString(1 * inch, y, "EARNINGS")
    p.line(1 * inch, y - 0.05 * inch, 4 * inch, y - 0.05 * inch)
    
    y -= 0.3 * inch
    p.setFont("Helvetica", 10)
    p.drawString(1.2 * inch, y, "Basic Salary:")
    p.drawString(3 * inch, y, f"₹ {payslip.basic_salary:,.2f}")
    
    y -= 0.25 * inch
    p.drawString(1.2 * inch, y, "HRA (40%):")
    p.drawString(3 * inch, y, f"₹ {payslip.hra:,.2f}")
    
    y -= 0.25 * inch
    p.drawString(1.2 * inch, y, "DA (20%):")
    p.drawString(3 * inch, y, f"₹ {payslip.da:,.2f}")
    
    y -= 0.3 * inch
    p.setFont("Helvetica-Bold", 10)
    p.drawString(1.2 * inch, y, "Gross Salary:")
    p.drawString(3 * inch, y, f"₹ {payslip.gross_salary:,.2f}")
    
    # Deductions Section
    y -= 0.5 * inch
    p.setFont("Helvetica-Bold", 12)
    p.drawString(1 * inch, y, "DEDUCTIONS")
    p.line(1 * inch, y - 0.05 * inch, 4 * inch, y - 0.05 * inch)
    
    y -= 0.3 * inch
    p.setFont("Helvetica", 10)
    p.drawString(1.2 * inch, y, "PF (12%):")
    p.drawString(3 * inch, y, f"₹ {payslip.pf_deduction:,.2f}")
    
    y -= 0.25 * inch
    p.drawString(1.2 * inch, y, "Professional Tax:")
    p.drawString(3 * inch, y, f"₹ {payslip.professional_tax:,.2f}")
    
    y -= 0.3 * inch
    p.setFont("Helvetica-Bold", 10)
    p.drawString(1.2 * inch, y, "Total Deductions:")
    p.drawString(3 * inch, y, f"₹ {payslip.total_deductions:,.2f}")
    
    # Net Salary
    y -= 0.5 * inch
    p.setFont("Helvetica-Bold", 14)
    p.drawString(1 * inch, y, "NET SALARY:")
    p.drawString(3 * inch, y, f"₹ {payslip.net_salary:,.2f}")
    p.line(1 * inch, y - 0.05 * inch, 4.5 * inch, y - 0.05 * inch)
    
    # Digital Signature
    y -= 0.8 * inch
    p.setFont("Helvetica", 8)
    p.drawString(1 * inch, y, f"Digital Signature: {payslip.digital_signature[:32]}...")
    y -= 0.2 * inch
    p.drawString(1 * inch, y, f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Footer
    p.setFont("Helvetica-Oblique", 8)
    p.drawString(1 * inch, 0.5 * inch, "This is a computer-generated payslip and does not require a signature.")
    
    p.showPage()
    p.save()
    
    buffer.seek(0)
    return buffer
