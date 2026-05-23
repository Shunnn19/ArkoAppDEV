import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { ArrowLeft, User, Mail, Lock, Users, CreditCard, CheckCircle2, Building2 } from 'lucide-react';
import { MUSEUMS_LIST } from '../scheduling/MuseumSelector';
import { useAuth } from '../auth/AuthContext';

export default function LoginRegister() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState('general');
  const [loginMuseum, setLoginMuseum] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  // Membership and Payment States
  const [selectedTier, setSelectedTier] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [billingCity, setBillingCity] = useState('');
  const [billingZip, setBillingZip] = useState('');
  const [gcashNumber, setGcashNumber] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');

  // Membership Tiers - Weekly, Monthly, Yearly
  const membershipTiers = [
    {
      id: 'weekly',
      name: 'Weekly Membership',
      price: 15,
      period: 'week',
      benefits: [
        'Unlimited museum access for 7 days',
        'Digital collection access',
        'Member-only exhibition previews',
        '5% museum store discount'
      ]
    },
    {
      id: 'monthly',
      name: 'Monthly Membership',
      price: 45,
      period: 'month',
      popular: true,
      benefits: [
        'Unlimited museum access for 30 days',
        'All Weekly benefits',
        'Free guided tours',
        '10% museum store discount',
        'Priority event booking'
      ]
    },
    {
      id: 'yearly',
      name: 'Yearly Membership',
      price: 450,
      period: 'year',
      benefits: [
        'Unlimited museum access for 365 days',
        'All Monthly benefits',
        'Free educational workshops',
        '20% museum store discount',
        'Exclusive curator talks',
        'Research library access'
      ]
    }
  ];

  // Payment Methods
  const paymentMethods = [
    { value: 'credit-card', label: 'Credit Card' },
    { value: 'debit-card', label: 'Debit Card' },
    { value: 'gcash', label: 'GCash' },
    { value: 'paypal', label: 'PayPal' }
  ];

  const roleOptions = [
    { value: 'general', label: 'General Public', color: '#4A90E2' },
    { value: 'researcher', label: 'Historical Researcher', color: '#7C3AED' },
    { value: 'educator', label: 'Educator & Student', color: '#10B981' },
    { value: 'curator', label: 'Curator', color: '#8B5CF6' },
    { value: 'staff', label: 'Museum Staff', color: '#1e3a5f' }
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Login Failed', { description: 'Please fill in all fields' });
      return;
    }

    if (!loginMuseum) {
      toast.error('Login Failed', { description: 'Please select a museum' });
      return;
    }

    try {
      const data = await login(email, password, rememberMe);
      localStorage.setItem('selected_museum', loginMuseum);
      toast.success('Login Successful!', { description: `Welcome back, ${data.user.name}` });

      const role = data.user.role;
      if (role === 'curator') {
        navigate('/curator', { state: { museum: loginMuseum } });
      } else if (role === 'staff') {
        navigate('/staff', { state: { museum: loginMuseum } });
      } else {
        navigate('/portal/dashboard');
      }
    } catch (err: any) {
      toast.error('Login Failed', { description: err.message || 'Invalid credentials' });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      toast.error('Registration Failed', {
        description: 'Please fill in all fields'
      });
      return;
    }

    if (!selectedTier) {
      toast.error('Registration Failed', {
        description: 'Please select a membership tier'
      });
      return;
    }

    if (!paymentMethod) {
      toast.error('Registration Failed', {
        description: 'Please select a payment method'
      });
      return;
    }

    // Validate payment method specific fields
    if (paymentMethod === 'credit-card' || paymentMethod === 'debit-card') {
      if (!cardNumber || !cardExpiry || !cardCvv || !cardholderName || !billingAddress || !billingCity || !billingZip) {
        toast.error('Registration Failed', {
          description: 'Please complete all payment information'
        });
        return;
      }
    } else if (paymentMethod === 'gcash') {
      if (!gcashNumber) {
        toast.error('Registration Failed', {
          description: 'Please enter your GCash mobile number'
        });
        return;
      }
    } else if (paymentMethod === 'paypal') {
      if (!paypalEmail) {
        toast.error('Registration Failed', {
          description: 'Please enter your PayPal email'
        });
        return;
      }
    }

    try {
      await register(name, email, password, selectedRole);

      // Auto-login after registration
      const data = await login(email, password, false);
      localStorage.setItem('selected_museum', loginMuseum || '');

      const selectedTierData = membershipTiers.find(t => t.id === selectedTier);
      const paymentMethodLabel = paymentMethods.find(m => m.value === paymentMethod)?.label;
      
      toast.success('Registration & Payment Successful!', {
        description: `Welcome! Your ${selectedTierData?.name} is now active (via ${paymentMethodLabel}).`
      });

      const role = data.user.role;
      if (role === 'curator') navigate('/curator', { state: { museum: loginMuseum } });
      else if (role === 'staff') navigate('/staff', { state: { museum: loginMuseum } });
      else navigate('/portal/dashboard');
    } catch (err: any) {
      toast.error('Registration Failed', { description: err.message || 'Could not create account' });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f6f3] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Back to Landing Button */}
        <button
          onClick={() => navigate('/')}
          className="mb-6 flex items-center gap-2 text-[#1e3a5f] hover:text-[#4A90E2] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Side - Branding */}
          <div className="flex flex-col justify-center space-y-6 p-8 bg-white rounded-lg shadow-sm">
            <div>
              <h1 className="text-4xl mb-4 text-[#1e3a5f]">Museum Membership Portal</h1>
              <p className="text-[#4A5565] text-lg">
                Join our community and unlock exclusive access to cultural treasures, historical archives, and educational resources.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#4A90E2] bg-opacity-10 flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-[#4A90E2]" />
                </div>
                <div>
                  <h3 className="font-medium text-[#1e3a5f]">Exclusive Member Benefits</h3>
                  <p className="text-sm text-[#4A5565]">Access special exhibitions, events, and member-only content</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#7C3AED] bg-opacity-10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-[#7C3AED]" />
                </div>
                <div>
                  <h3 className="font-medium text-[#1e3a5f]">Digital Archives</h3>
                  <p className="text-sm text-[#4A5565]">Explore our extensive collection of historical documents and artifacts</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#10B981] bg-opacity-10 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-[#10B981]" />
                </div>
                <div>
                  <h3 className="font-medium text-[#1e3a5f]">Educational Resources</h3>
                  <p className="text-sm text-[#4A5565]">Access teaching materials and research tools</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <Card className="p-8">
            {/* Tabs */}
            <div className="flex gap-2 mb-8 border-b">
              <button
                onClick={() => setActiveTab('login')}
                className={`pb-3 px-4 font-medium transition-colors relative ${
                  activeTab === 'login'
                    ? 'text-[#4A90E2]'
                    : 'text-[#4A5565] hover:text-[#1e3a5f]'
                }`}
              >
                Login
                {activeTab === 'login' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4A90E2]" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`pb-3 px-4 font-medium transition-colors relative ${
                  activeTab === 'register'
                    ? 'text-[#4A90E2]'
                    : 'text-[#4A5565] hover:text-[#1e3a5f]'
                }`}
              >
                Register
                {activeTab === 'register' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4A90E2]" />
                )}
              </button>
            </div>

            {/* Login Form */}
            {activeTab === 'login' && (
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#1e3a5f] mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4A5565]" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                      required
                    />
                  </div>
                  <p className="mt-1 text-xs text-[#4A5565]">
                    Try: sarah@example.com, maria@example.com, or elizabeth@example.com
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1e3a5f] mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4A5565]" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1e3a5f] mb-2">
                    Assigned Museum{' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4A5565]" />
                    <select
                      value={loginMuseum}
                      onChange={(e) => setLoginMuseum(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                      required
                    >
                      <option value="">Select museum…</option>
                      {MUSEUMS_LIST.map(m => (
                        <option key={m.id} value={m.name}>{m.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-[#4A90E2] border-gray-300 rounded focus:ring-[#4A90E2]"
                    />
                    <span className="text-sm text-[#4A5565]">Remember me</span>
                  </label>
                  <button
                    type="button"
                    className="text-sm text-[#4A90E2] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#4A90E2] hover:bg-[#357ABD] text-white py-2.5"
                >
                  Sign In
                </Button>
              </form>
            )}

            {/* Register Form */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegister} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#1e3a5f] mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4A5565]" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1e3a5f] mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4A5565]" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1e3a5f] mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4A5565]" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                      required
                    />
                  </div>
                  <p className="mt-1 text-xs text-[#4A5565]">
                    Must be at least 8 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1e3a5f] mb-2">
                    Account Type
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4A5565]" />
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent bg-gray-50 appearance-none"
                      disabled
                    >
                      <option value="general">General Public</option>
                    </select>
                  </div>
                  <p className="mt-1 text-xs text-[#4A5565]">
                    New registrations are limited to General public accounts
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1e3a5f] mb-2">
                    Membership Tier
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4A5565]" />
                    <select
                      value={selectedTier}
                      onChange={(e) => setSelectedTier(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                    >
                      <option value="">Select a tier</option>
                      {membershipTiers.map(tier => (
                        <option key={tier.id} value={tier.id}>
                          {tier.name} - ${tier.price} {tier.period}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1e3a5f] mb-2">
                    Payment Method
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4A5565]" />
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                      required
                    >
                      <option value="">Select payment method</option>
                      {paymentMethods.map(method => (
                        <option key={method.value} value={method.value}>
                          {method.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Credit/Debit Card Fields */}
                {(paymentMethod === 'credit-card' || paymentMethod === 'debit-card') && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-[#1e3a5f] mb-2">
                        Card Number
                      </label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4A5565]" />
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="1234 5678 9012 3456"
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#1e3a5f] mb-2">
                          Expiry Date
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="MM/YY"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1e3a5f] mb-2">
                          CVV
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            placeholder="123"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#1e3a5f] mb-2">
                        Cardholder Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4A5565]" />
                        <input
                          type="text"
                          value={cardholderName}
                          onChange={(e) => setCardholderName(e.target.value)}
                          placeholder="John Doe"
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* GCash Fields */}
                {paymentMethod === 'gcash' && (
                  <div>
                    <label className="block text-sm font-medium text-[#1e3a5f] mb-2">
                      GCash Mobile Number
                    </label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4A5565]" />
                      <input
                        type="tel"
                        value={gcashNumber}
                        onChange={(e) => setGcashNumber(e.target.value)}
                        placeholder="09XX XXX XXXX"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                        required
                      />
                    </div>
                    <p className="mt-1 text-xs text-[#4A5565]">
                      Please ensure this number is registered with GCash
                    </p>
                  </div>
                )}

                {/* PayPal Fields */}
                {paymentMethod === 'paypal' && (
                  <div>
                    <label className="block text-sm font-medium text-[#1e3a5f] mb-2">
                      PayPal Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4A5565]" />
                      <input
                        type="email"
                        value={paypalEmail}
                        onChange={(e) => setPaypalEmail(e.target.value)}
                        placeholder="your.paypal@example.com"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                        required
                      />
                    </div>
                    <p className="mt-1 text-xs text-[#4A5565]">
                      You'll be redirected to PayPal to complete payment
                    </p>
                  </div>
                )}

                {/* Billing Address - Only for Card payments */}
                {(paymentMethod === 'credit-card' || paymentMethod === 'debit-card') && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-[#1e3a5f] mb-2">
                        Billing Address
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={billingAddress}
                          onChange={(e) => setBillingAddress(e.target.value)}
                          placeholder="123 Main St"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#1e3a5f] mb-2">
                          City
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={billingCity}
                            onChange={(e) => setBillingCity(e.target.value)}
                            placeholder="Anytown"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1e3a5f] mb-2">
                          Zip Code
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={billingZip}
                            onChange={(e) => setBillingZip(e.target.value)}
                            placeholder="12345"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <Button
                  type="submit"
                  className="w-full bg-[#4A90E2] hover:bg-[#357ABD] text-white py-2.5"
                >
                  Create Account
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}