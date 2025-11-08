import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Search, UserPlus, Edit, Mail, Phone } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  jobTitle: string;
  department: string;
  status: 'Active' | 'Inactive';
  joinDate: string;
}

export function EmployeeDirectory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  
  const [employees, setEmployees] = useState<Employee[]>([
    { id: 'WZ-1234', name: 'Sarah Johnson', email: 'sarah.j@workzen.com', phone: '+1 (555) 123-4567', jobTitle: 'Senior Software Engineer', department: 'Engineering', status: 'Active', joinDate: '2023-01-15' },
    { id: 'WZ-1235', name: 'Michael Brown', email: 'michael.b@workzen.com', phone: '+1 (555) 234-5678', jobTitle: 'Sales Manager', department: 'Sales', status: 'Active', joinDate: '2023-02-20' },
    { id: 'WZ-1236', name: 'Emma Wilson', email: 'emma.w@workzen.com', phone: '+1 (555) 345-6789', jobTitle: 'Marketing Specialist', department: 'Marketing', status: 'Active', joinDate: '2023-03-10' },
    { id: 'WZ-1237', name: 'David Lee', email: 'david.l@workzen.com', phone: '+1 (555) 456-7890', jobTitle: 'Financial Analyst', department: 'Finance', status: 'Active', joinDate: '2023-04-05' },
    { id: 'WZ-1238', name: 'Lisa Anderson', email: 'lisa.a@workzen.com', phone: '+1 (555) 567-8901', jobTitle: 'HR Manager', department: 'HR', status: 'Active', joinDate: '2022-12-01' },
    { id: 'WZ-1239', name: 'John Martinez', email: 'john.m@workzen.com', phone: '+1 (555) 678-9012', jobTitle: 'Product Designer', department: 'Design', status: 'Active', joinDate: '2023-05-15' },
  ]);

  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    phone: '',
    jobTitle: '',
    department: '',
  });

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `WZ-${Math.floor(1000 + Math.random() * 9000)}`;
    const employee: Employee = {
      id: newId,
      ...newEmployee,
      status: 'Active',
      joinDate: new Date().toISOString().split('T')[0],
    };
    setEmployees([...employees, employee]);
    setNewEmployee({ name: '', email: '', phone: '', jobTitle: '', department: '' });
    setIsAddDialogOpen(false);
    alert('Employee added successfully!');
  };

  const handleEditEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEmployee) {
      setEmployees(employees.map(emp => 
        emp.id === selectedEmployee.id ? selectedEmployee : emp
      ));
      setIsEditDialogOpen(false);
      alert('Employee updated successfully!');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Employee Directory</h1>
          <p className="text-muted-foreground">Manage all employee profiles and information</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add New Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
              <DialogDescription>Create a new employee profile</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddEmployee} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={newEmployee.phone}
                    onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input
                    id="jobTitle"
                    value={newEmployee.jobTitle}
                    onChange={(e) => setNewEmployee({ ...newEmployee, jobTitle: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select 
                    value={newEmployee.department} 
                    onValueChange={(value) => setNewEmployee({ ...newEmployee, department: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="HR">HR</SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Employee</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees by name, email, department, or job title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Job Title</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>{employee.id}</TableCell>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        {employee.email}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {employee.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{employee.jobTitle}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{employee.department}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {employee.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Dialog open={isEditDialogOpen && selectedEmployee?.id === employee.id} onOpenChange={setIsEditDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedEmployee({ ...employee })}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Edit Employee Profile</DialogTitle>
                          <DialogDescription>Update employee information</DialogDescription>
                        </DialogHeader>
                        {selectedEmployee && (
                          <form onSubmit={handleEditEmployee} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-name">Full Name</Label>
                                <Input
                                  id="edit-name"
                                  value={selectedEmployee.name}
                                  onChange={(e) => setSelectedEmployee({ ...selectedEmployee, name: e.target.value })}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-email">Email</Label>
                                <Input
                                  id="edit-email"
                                  type="email"
                                  value={selectedEmployee.email}
                                  onChange={(e) => setSelectedEmployee({ ...selectedEmployee, email: e.target.value })}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-phone">Phone</Label>
                                <Input
                                  id="edit-phone"
                                  value={selectedEmployee.phone}
                                  onChange={(e) => setSelectedEmployee({ ...selectedEmployee, phone: e.target.value })}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-jobTitle">Job Title</Label>
                                <Input
                                  id="edit-jobTitle"
                                  value={selectedEmployee.jobTitle}
                                  onChange={(e) => setSelectedEmployee({ ...selectedEmployee, jobTitle: e.target.value })}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-department">Department</Label>
                                <Select 
                                  value={selectedEmployee.department} 
                                  onValueChange={(value) => setSelectedEmployee({ ...selectedEmployee, department: value })}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Engineering">Engineering</SelectItem>
                                    <SelectItem value="Sales">Sales</SelectItem>
                                    <SelectItem value="Marketing">Marketing</SelectItem>
                                    <SelectItem value="Finance">Finance</SelectItem>
                                    <SelectItem value="HR">HR</SelectItem>
                                    <SelectItem value="Design">Design</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div className="flex justify-end gap-3">
                              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                Cancel
                              </Button>
                              <Button type="submit">Save Changes</Button>
                            </div>
                          </form>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredEmployees.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No employees found matching your search.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Employees</p>
            <h2 className="mt-2">{employees.length}</h2>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Engineering</p>
            <h2 className="mt-2">{employees.filter(e => e.department === 'Engineering').length}</h2>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Sales & Marketing</p>
            <h2 className="mt-2">{employees.filter(e => e.department === 'Sales' || e.department === 'Marketing').length}</h2>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Active</p>
            <h2 className="mt-2 text-green-600">{employees.filter(e => e.status === 'Active').length}</h2>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
