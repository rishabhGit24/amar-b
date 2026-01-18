# Component Props Interface Matching - CRITICAL GUIDE

## 🚨 PROBLEM: Props Type Mismatch Errors

**Common Error**:
```
TS2322: Type '{ onSubmit: (formData: ContactFormData) => Promise<void>; }' is not assignable to type 'IntrinsicAttributes'.
Property 'onSubmit' does not exist on type 'IntrinsicAttributes'.

> 228 |         <ContactForm onSubmit={handleSubmit} />
      |                      ^^^^^^^^
```

**Root Cause**: Component is used WITH props but defined WITHOUT props interface!

## ❌ WRONG: Component Usage Doesn't Match Definition

### Parent Component (uses ContactForm)
```typescript
// Parent passes onSubmit prop
const Contact: React.FC = () => {
  const handleSubmit = async (formData: ContactFormData) => {
    await api.submit(formData);
  };
  
  return (
    <div>
      <ContactForm onSubmit={handleSubmit} />  {/* ← Passing onSubmit prop */}
    </div>
  );
};
```

### Child Component (ContactForm) - WRONG!
```typescript
// ❌ WRONG: No props interface defined!
const ContactForm: React.FC = () => {
  // Component doesn't accept any props
  // But parent is trying to pass onSubmit!
  return <form>...</form>;
};
```

**Result**: TS2322 error - Property 'onSubmit' does not exist!

## ✅ CORRECT: Props Interface Matches Usage

### Step 1: Define Props Interface FIRST
```typescript
// ✅ CORRECT: Define interface with ALL props that will be used
interface ContactFormProps {
  onSubmit?: (data: any) => void | Promise<void>;  // ← Accepts the prop!
  initialValues?: any;
  isLoading?: boolean;
}
```

### Step 2: Component Accepts Props
```typescript
// ✅ CORRECT: Component accepts props
const ContactForm: React.FC<ContactFormProps> = ({ 
  onSubmit = async () => {},  // Default value
  initialValues = {},
  isLoading = false
}) => {
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = { name: '...', email: '...' };
    if (onSubmit) {
      await onSubmit(formData);  // Call the passed function
    }
  };
  
  return <form onSubmit={handleFormSubmit}>...</form>;
};
```

### Step 3: Parent Uses Component
```typescript
// ✅ CORRECT: Now the usage matches!
const Contact: React.FC = () => {
  const handleSubmit = async (formData: any) => {
    await api.submit(formData);
  };
  
  return (
    <div>
      <ContactForm onSubmit={handleSubmit} />  {/* ✅ Works perfectly! */}
    </div>
  );
};
```

## MANDATORY WORKFLOW: Define Before Use

### Rule 1: Look Ahead at Usage
Before generating a component, check the plan to see HOW it will be used:

```typescript
// If the plan shows:
// "Contact page will use ContactForm component and pass submission handler"

// Then ContactForm MUST have:
interface ContactFormProps {
  onSubmit?: (data: any) => void | Promise<void>;  // ← This is required!
}
```

### Rule 2: All Used Props Must Be Defined
```typescript
// ❌ WRONG: Used props not in interface
interface ButtonProps {
  text?: string;
}

// Later used as:
<Button text="Click" onClick={handleClick} disabled={true} />
// ❌ ERROR: onClick and disabled don't exist!

// ✅ CORRECT: All used props in interface
interface ButtonProps {
  text?: string;
  onClick?: () => void;
  disabled?: boolean;
}

<Button text="Click" onClick={handleClick} disabled={true} />
// ✅ Works!
```

### Rule 3: Function Prop Signatures Must Match
```typescript
// Parent function
const handleSubmit = (formData: ContactFormData) => Promise<void>;

// ❌ WRONG: Child expects different signature
interface ContactFormProps {
  onSubmit?: () => void;  // ← Expects NO parameters!
}
// Error: Type '(formData: ContactFormData) => Promise<void>' is not assignable to type '() => void'

// ✅ CORRECT: Signatures match
interface ContactFormProps {
  onSubmit?: (data: any) => void | Promise<void>;  // ← Accepts parameters!
}
```

## Common Component Patterns

### Form Components
```typescript
interface FormProps {
  onSubmit?: (data: any) => void | Promise<void>;  // Submission handler
  initialValues?: any;                              // Initial form data
  isLoading?: boolean;                              // Loading state
  onCancel?: () => void;                           // Cancel handler
  validationSchema?: any;                          // Validation rules
}

const MyForm: React.FC<FormProps> = ({
  onSubmit = async () => {},
  initialValues = {},
  isLoading = false,
  onCancel = () => {},
  validationSchema = {}
}) => {
  return <form>...</form>;
};
```

### Card Components
```typescript
interface CardProps {
  title?: string;
  description?: string;
  image?: string;
  onClick?: () => void;
  actions?: React.ReactNode;
  elevation?: number;
}

const Card: React.FC<CardProps> = ({
  title = '',
  description = '',
  image = '',
  onClick = () => {},
  actions = null,
  elevation = 2
}) => {
  return <div>...</div>;
};
```

### List Components
```typescript
interface ListProps {
  items?: any[];
  onItemClick?: (item: any) => void;
  renderItem?: (item: any) => React.ReactNode;
  emptyMessage?: string;
  isLoading?: boolean;
}

const List: React.FC<ListProps> = ({
  items = [],
  onItemClick = () => {},
  renderItem = (item) => <div>{item}</div>,
  emptyMessage = 'No items',
  isLoading = false
}) => {
  return <div>...</div>;
};
```

## Validation Checklist

Before generating ANY component, verify:

- [ ] **Props interface defined** - Does component have an interface?
- [ ] **All used props included** - Are ALL props used in JSX defined in interface?
- [ ] **Function signatures match** - Do callback types match how they're called?
- [ ] **Optional with defaults** - Are all props optional with default values?
- [ ] **Correct types** - Are types correct (not `function` or `array`)?

## Generation Order

1. **Analyze usage first**: Look at WHERE component is used
2. **List required props**: What props are passed?
3. **Define interface**: Create interface with ALL those props
4. **Set correct signatures**: Use appropriate function types
5. **Add defaults**: Provide default values
6. **Generate component**: Now create the component body

## Example: Complete Flow

### Step 1: See Usage in Plan
```
"Contact page uses ContactForm component.
ContactForm receives onSubmit handler for form submission."
```

### Step 2: Define Props Interface
```typescript
interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => void | Promise<void>;
}
```

### Step 3: Generate Component
```typescript
const ContactForm: React.FC<ContactFormProps> = ({ 
  onSubmit = async () => {}
}) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      await onSubmit(formData);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
    </form>
  );
};

export default ContactForm;
```

### Step 4: Use Component
```typescript
const Contact: React.FC = () => {
  const handleSubmit = async (formData: ContactFormData) => {
    // submit logic
  };
  
  return <ContactForm onSubmit={handleSubmit} />;  // ✅ Works!
};
```

## Key Principles

1. **Interface First**: Always define props interface BEFORE component body
2. **Match Usage**: Ensure interface matches how component is used
3. **Flexible Signatures**: Use `any` or flexible types for callbacks
4. **Always Optional**: Make ALL props optional with defaults
5. **Check Twice**: Verify props match usage before finalizing

## Summary

**The #1 cause of TS2322 errors**: Component used WITH props but defined WITHOUT props interface!

**Solution**: ALWAYS define complete props interface that matches usage BEFORE generating component.

