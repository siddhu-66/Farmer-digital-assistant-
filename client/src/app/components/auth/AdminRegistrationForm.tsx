
'use client';

import { useState } from 'react';

// Define the shape of the form data and errors
interface FormData {
  fullName: string;
  email: string;
  mobile: string;
  organization: string;
  location: string;
  username: string;
  password: string;
  confirmPassword: string;
}

interface Errors {
  [key: string]: string;
}

export default function AdminRegistrationForm() {
  // State for form data, errors, and loading status
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    mobile: '',
    organization: '',
    location: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Errors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState('form'); // 'form', 'otp', 'success'
  const [otp, setOtp] = useState('');

  // Handle input changes and update form data
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  // Validate the form data
  const validate = (): Errors => {
    const newErrors: Errors = {};

    // Required fields
    const requiredFields: (keyof FormData)[] = ['fullName', 'email', 'mobile', 'location', 'username', 'password', 'confirmPassword'];
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is not valid';
    }

    // Mobile number validation
    if (formData.mobile && !/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Mobile number must be 10 digits';
    }

    // Password length validation
    if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // Password confirmation validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      // Simulate API call to send OTP
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsLoading(false);
      setStep('otp');
      
    }
  };
  
  const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call to verify OTP
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    if (otp === '123456') { // Simulate correct OTP
      setStep('success');
      
    } else {
      setErrors({ otp: 'Invalid OTP' });
    }
  };


  // Render a form input with an error message
  const renderInput = (name: keyof FormData, placeholder: string, type: string = 'text', required: boolean = false) => (
    <div>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        onChange={handleChange}
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors[name] ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}
        required={required}
      />
      {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>}
    </div>
  );
  
  if (step === 'success') {
    return (
      <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4">Registration Successful!</h2>
        <p>Your registration is pending approval. You will be notified by email once it is approved.</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
      {step === 'form' && (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6">
            {renderInput('fullName', 'Full Name', 'text', true)}
            {renderInput('email', 'Email Address', 'email', true)}
            {renderInput('mobile', 'Mobile Number', 'tel', true)}
            {renderInput('organization', 'Organization / Company Name (Optional)')}
            {renderInput('location', 'Location (State/District)', 'text', true)}
            {renderInput('username', 'Username', 'text', true)}
            {renderInput('password', 'Password', 'password', true)}
            {renderInput('confirmPassword', 'Confirm Password', 'password', true)}
          </div>
          <button
            type="submit"
            className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading && (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isLoading ? 'Sending OTP...' : 'Register'}
          </button>
        </form>
      )}
      
      {step === 'otp' && (
        <form onSubmit={handleOtpSubmit}>
            <h2 className="text-2xl font-bold mb-4 text-center">Enter OTP</h2>
            <p className="text-center mb-4">An OTP has been sent to your email address.</p>
            <input
                type="text"
                name="otp"
                placeholder="Enter OTP"
                onChange={handleOtpChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.otp ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}
                required
            />
            {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp}</p>}
             <button
                type="submit"
                className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                disabled={isLoading}
            >
                {isLoading && (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                )}
                {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>
        </form>
      )}
    </div>
  );
}
