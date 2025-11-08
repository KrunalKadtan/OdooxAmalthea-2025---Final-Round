# Common Components Guide

## Quick Start

Import components from the common folder:

```jsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./common";
import { Button, Badge, Input, Select, Textarea, Label } from "./common";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "./common";
import { StatusBadge } from "./common";
```

## Components

### Card Components

#### Basic Card
```jsx
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description text</CardDescription>
  </CardHeader>
  <CardContent>
    Your content here
  </CardContent>
</Card>
```

#### Card with Custom Class
```jsx
<Card className="custom-card">
  <CardContent>Content</CardContent>
</Card>
```

### Button Component

#### Variants
```jsx
<Button variant="primary">Primary Button</Button>
<Button variant="secondary">Secondary Button</Button>
<Button variant="success">Success Button</Button>
<Button variant="danger">Danger Button</Button>
<Button variant="outline">Outline Button</Button>
```

#### Sizes
```jsx
<Button size="small">Small</Button>
<Button size="medium">Medium</Button>
<Button size="large">Large</Button>
```

#### With Icon
```jsx
<Button>
  <svg>...</svg>
  Button Text
</Button>
```

#### Props
- `variant`: "primary" | "secondary" | "success" | "danger" | "outline"
- `size`: "small" | "medium" | "large"
- `onClick`: Function
- `type`: "button" | "submit" | "reset"
- `disabled`: boolean
- `className`: string

### Badge Component

#### Variants
```jsx
<Badge variant="approved">Approved</Badge>
<Badge variant="pending">Pending</Badge>
<Badge variant="rejected">Rejected</Badge>
<Badge variant="present">Present</Badge>
<Badge variant="absent">Absent</Badge>
<Badge variant="leave">Leave</Badge>
<Badge variant="default">Default</Badge>
```

#### With Icon
```jsx
<Badge variant="approved">
  <svg>...</svg>
  Approved
</Badge>
```

### StatusBadge Component

Specialized badge for attendance status with built-in icons:

```jsx
<StatusBadge status="Present" />
<StatusBadge status="Absent" />
<StatusBadge status="Leave" />
```

### Form Components

#### Input
```jsx
<Label htmlFor="email">Email</Label>
<Input
  id="email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="Enter email"
  required
/>
```

#### Select
```jsx
<Label htmlFor="type">Type</Label>
<Select
  id="type"
  value={type}
  onChange={(e) => setType(e.target.value)}
  required
>
  <option value="">Select type</option>
  <option value="option1">Option 1</option>
  <option value="option2">Option 2</option>
</Select>
```

#### Textarea
```jsx
<Label htmlFor="reason">Reason</Label>
<Textarea
  id="reason"
  value={reason}
  onChange={(e) => setReason(e.target.value)}
  placeholder="Enter reason"
  rows={4}
  required
/>
```

### Table Components

#### Basic Table
```jsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Column 1</TableHead>
      <TableHead>Column 2</TableHead>
      <TableHead>Column 3</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Data 1</TableCell>
      <TableCell>Data 2</TableCell>
      <TableCell>Data 3</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

#### With Data Mapping
```jsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map((item) => (
      <TableRow key={item.id}>
        <TableCell>{item.name}</TableCell>
        <TableCell>
          <Badge variant={item.status}>{item.status}</Badge>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

## Styling

### Custom Styling

All components accept a `className` prop for custom styling:

```jsx
<Card className="my-custom-card">
  <Button className="my-custom-button">Click Me</Button>
</Card>
```

### CSS Variables

Components use consistent color variables:
- Primary: `#0369a1`
- Success: `#16a34a`
- Danger: `#dc2626`
- Border: `#e2e8f0`
- Text: `#1e293b`
- Muted: `#94a3b8`

## Best Practices

1. **Always use Label with Input/Select/Textarea**
   ```jsx
   <Label htmlFor="field">Field Name</Label>
   <Input id="field" />
   ```

2. **Use semantic HTML**
   - Use `type="submit"` for form submit buttons
   - Use `required` attribute for required fields

3. **Consistent spacing**
   - Use the built-in gap classes
   - Maintain consistent padding

4. **Accessibility**
   - Always provide labels for form fields
   - Use proper button types
   - Include aria-labels where needed

## Examples

### Complete Form Example
```jsx
<Card>
  <CardHeader>
    <CardTitle>User Form</CardTitle>
    <CardDescription>Fill in your details</CardDescription>
  </CardHeader>
  <CardContent>
    <form onSubmit={handleSubmit}>
      <div className="form-field">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      
      <div className="form-field">
        <Label htmlFor="type">Type</Label>
        <Select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        >
          <option value="">Select</option>
          <option value="type1">Type 1</option>
        </Select>
      </div>
      
      <Button type="submit">Submit</Button>
    </form>
  </CardContent>
</Card>
```

### Complete Table Example
```jsx
<Card>
  <CardHeader>
    <CardTitle>Data Table</CardTitle>
    <CardDescription>View all records</CardDescription>
  </CardHeader>
  <CardContent>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {records.map((record) => (
          <TableRow key={record.id}>
            <TableCell>{record.name}</TableCell>
            <TableCell>
              <Badge variant={record.status}>{record.status}</Badge>
            </TableCell>
            <TableCell>
              <Button size="small" onClick={() => handleEdit(record.id)}>
                Edit
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </CardContent>
</Card>
```
