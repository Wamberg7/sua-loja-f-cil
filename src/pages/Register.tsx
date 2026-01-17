import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Zap, User, Store, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

type Step = 1 | 2 | 3 | 4;

interface FormData {
  // Step 1 - User
  name: string;
  email: string;
  password: string;
  // Step 2 - Store
  storeName: string;
  storeSlug: string;
  storeCategory: string;
  // Step 3 - Plan
  selectedPlan: string;
}

const categories = [
  "Cursos Online",
  "E-books",
  "Templates",
  "Software",
  "Áudio/Música",
  "Fotografia",
  "Artes Digitais",
  "Outros"
];

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: "0",
    description: "Ideal para começar",
    features: ["10 produtos", "5% + R$0,80 por venda", "Suporte email"]
  },
  {
    id: "pro",
    name: "Pro",
    price: "49",
    description: "Para criadores em crescimento",
    features: ["Produtos ilimitados", "3% + R$0,80 por venda", "Suporte prioritário", "Cupons"],
    popular: true
  },
  {
    id: "business",
    name: "Business",
    price: "149",
    description: "Para negócios em escala",
    features: ["Tudo do Pro", "2% + R$0,80 por venda", "Multi-usuários", "API"]
  }
];

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [step, setStep] = useState<Step>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    storeName: "",
    storeSlug: "",
    storeCategory: "",
    selectedPlan: "pro"
  });

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-generate slug from store name
    if (field === "storeName") {
      const slug = value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFormData(prev => ({ ...prev, storeSlug: slug }));
    }
  };

  const validateStep = (currentStep: Step): boolean => {
    switch (currentStep) {
      case 1:
        if (!formData.name || !formData.email || !formData.password) {
          toast.error("Preencha todos os campos");
          return false;
        }
        if (formData.password.length < 6) {
          toast.error("A senha deve ter pelo menos 6 caracteres");
          return false;
        }
        return true;
      case 2:
        if (!formData.storeName || !formData.storeSlug || !formData.storeCategory) {
          toast.error("Preencha todos os campos da loja");
          return false;
        }
        return true;
      case 3:
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(step)) {
      if (step < 4) {
        setStep((step + 1) as Step);
      }
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep((step - 1) as Step);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    const { success, error } = await register(
      formData.email,
      formData.password,
      formData.name,
      formData.storeName,
      formData.storeSlug
    );
    
    if (success) {
      toast.success("Conta criada com sucesso!");
      navigate("/dashboard");
    } else {
      toast.error(error || "Erro ao criar conta");
    }
    
    setIsLoading(false);
  };

  const stepInfo = [
    { number: 1, title: "Sua Conta", icon: User },
    { number: 2, title: "Sua Loja", icon: Store },
    { number: 3, title: "Seu Plano", icon: CreditCard },
    { number: 4, title: "Confirmação", icon: Check }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 py-12">
        <div className="w-full max-w-md mx-auto">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">DigitalHub</span>
          </Link>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-12">
            {stepInfo.map((s, index) => (
              <div key={s.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      step >= s.number 
                        ? 'bg-gradient-primary text-primary-foreground' 
                        : 'bg-secondary text-muted-foreground'
                    }`}
                  >
                    {step > s.number ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <s.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className={`text-xs mt-2 ${step >= s.number ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {s.title}
                  </span>
                </div>
                {index < stepInfo.length - 1 && (
                  <div className={`w-12 h-0.5 mx-2 transition-colors ${
                    step > s.number ? 'bg-primary' : 'bg-secondary'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Form Steps */}
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold mb-2 text-foreground">Crie sua conta</h2>
                <p className="text-muted-foreground mb-8">Comece sua jornada de vendas digitais</p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Nome completo</label>
                    <Input
                      placeholder="Seu nome"
                      value={formData.name}
                      onChange={(e) => updateFormData("name", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Email</label>
                    <Input
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Senha</label>
                    <Input
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      value={formData.password}
                      onChange={(e) => updateFormData("password", e.target.value)}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold mb-2 text-foreground">Configure sua loja</h2>
                <p className="text-muted-foreground mb-8">Escolha um nome e categoria para sua loja</p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Nome da loja</label>
                    <Input
                      placeholder="Minha Loja Digital"
                      value={formData.storeName}
                      onChange={(e) => updateFormData("storeName", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">URL da loja</label>
                    <div className="flex items-center">
                      <span className="text-sm text-muted-foreground mr-2">digitalhub.com/</span>
                      <Input
                        placeholder="minha-loja"
                        value={formData.storeSlug}
                        onChange={(e) => updateFormData("storeSlug", e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Categoria principal</label>
                    <div className="grid grid-cols-2 gap-2">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => updateFormData("storeCategory", cat)}
                          className={`p-3 rounded-lg text-sm font-medium transition-all ${
                            formData.storeCategory === cat
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold mb-2 text-foreground">Escolha seu plano</h2>
                <p className="text-muted-foreground mb-8">Você pode mudar a qualquer momento</p>

                <div className="space-y-3">
                  {plans.map((plan) => (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => updateFormData("selectedPlan", plan.id)}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        formData.selectedPlan === plan.id
                          ? 'bg-primary/20 border-2 border-primary'
                          : 'bg-secondary border-2 border-transparent hover:border-primary/30'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-foreground flex items-center gap-2">
                            {plan.name}
                            {plan.popular && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground">
                                Popular
                              </span>
                            )}
                          </h3>
                          <p className="text-sm text-muted-foreground">{plan.description}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-foreground">R${plan.price}</span>
                          {plan.price !== "0" && <span className="text-muted-foreground">/mês</span>}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {plan.features.map((feature, i) => (
                          <span key={i} className="text-xs px-2 py-1 rounded-full bg-background text-muted-foreground">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-primary flex items-center justify-center">
                  <Check className="w-10 h-10 text-primary-foreground" />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-foreground">Tudo pronto!</h2>
                <p className="text-muted-foreground mb-8">Revise seus dados e comece a vender</p>

                <div className="glass rounded-xl p-6 text-left space-y-4 mb-8">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nome</span>
                    <span className="font-medium text-foreground">{formData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email</span>
                    <span className="font-medium text-foreground">{formData.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Loja</span>
                    <span className="font-medium text-foreground">{formData.storeName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">URL</span>
                    <span className="font-medium text-primary">digitalhub.com/{formData.storeSlug}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Plano</span>
                    <span className="font-medium text-foreground capitalize">{formData.selectedPlan}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8">
            {step > 1 && (
              <Button variant="outline" onClick={prevStep} className="flex-1">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            )}
            {step < 4 ? (
              <Button variant="hero" onClick={nextStep} className="flex-1">
                Continuar
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button variant="hero" onClick={handleSubmit} className="flex-1" disabled={isLoading}>
                {isLoading ? "Criando..." : "Criar Minha Loja"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>

          {/* Login Link */}
          <p className="text-center mt-8 text-sm text-muted-foreground">
            Já tem uma conta?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Fazer login
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Decorative */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 text-center px-12">
          <h2 className="text-4xl font-bold mb-4 text-foreground">
            Junte-se a mais de{" "}
            <span className="text-gradient">15.000</span>{" "}
            criadores
          </h2>
          <p className="text-lg text-muted-foreground">
            Comece a vender seus produtos digitais hoje mesmo.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
