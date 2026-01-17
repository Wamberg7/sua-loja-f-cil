-- Create withdrawals table for withdrawal requests
CREATE TABLE public.withdrawals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID NOT NULL,
  amount INTEGER NOT NULL DEFAULT 0,
  pix_key TEXT NOT NULL,
  pix_type TEXT NOT NULL DEFAULT 'cpf',
  status TEXT NOT NULL DEFAULT 'pending',
  reject_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes
CREATE INDEX idx_withdrawals_store_id ON public.withdrawals(store_id);
CREATE INDEX idx_withdrawals_status ON public.withdrawals(status);

-- Enable RLS
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for withdrawals
CREATE POLICY "Users can view their store withdrawals"
ON public.withdrawals
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM stores
  WHERE stores.id = withdrawals.store_id AND stores.user_id = auth.uid()
));

CREATE POLICY "Users can create withdrawals for their store"
ON public.withdrawals
FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM stores
  WHERE stores.id = withdrawals.store_id AND stores.user_id = auth.uid()
));

CREATE POLICY "Admins can view all withdrawals"
ON public.withdrawals
FOR SELECT
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'superadmin'));

CREATE POLICY "Admins can update all withdrawals"
ON public.withdrawals
FOR UPDATE
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'superadmin'));

-- Create plans table
CREATE TABLE public.plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price INTEGER NOT NULL DEFAULT 0,
  features TEXT[] DEFAULT '{}',
  max_products INTEGER,
  max_monthly_views INTEGER,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for plans (public read)
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active plans"
ON public.plans
FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage plans"
ON public.plans
FOR ALL
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'superadmin'));

-- Create goals table
CREATE TABLE public.goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  target_amount INTEGER NOT NULL DEFAULT 0,
  reward_type TEXT NOT NULL DEFAULT 'badge',
  reward_description TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for goals
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active goals"
ON public.goals
FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage goals"
ON public.goals
FOR ALL
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'superadmin'));

-- Create user_goals table for tracking progress
CREATE TABLE public.user_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  goal_id UUID REFERENCES public.goals(id) ON DELETE CASCADE NOT NULL,
  current_amount INTEGER NOT NULL DEFAULT 0,
  achieved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, goal_id)
);

-- Enable RLS for user_goals
ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own goals"
ON public.user_goals
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all user goals"
ON public.user_goals
FOR SELECT
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'superadmin'));

-- Add triggers for updated_at
CREATE TRIGGER update_withdrawals_updated_at
BEFORE UPDATE ON public.withdrawals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_plans_updated_at
BEFORE UPDATE ON public.plans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_goals_updated_at
BEFORE UPDATE ON public.goals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_goals_updated_at
BEFORE UPDATE ON public.user_goals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default plans
INSERT INTO public.plans (name, price, features, max_products, max_monthly_views) VALUES
('Starter', 0, ARRAY['5 produtos', '1.000 acessos/mês', 'Suporte por email'], 5, 1000),
('Pro', 4900, ARRAY['50 produtos', '10.000 acessos/mês', 'Cupons ilimitados', 'Suporte prioritário'], 50, 10000),
('Business', 9900, ARRAY['Produtos ilimitados', 'Acessos ilimitados', 'API de integração', 'Gerente dedicado'], NULL, NULL);

-- Insert default goals
INSERT INTO public.goals (name, target_amount, reward_type, reward_description) VALUES
('Primeira Venda', 100, 'badge', 'Badge Iniciante'),
('Vendedor Bronze', 100000, 'credit', 'R$ 50 em créditos'),
('Vendedor Prata', 500000, 'plan', '1 mês Pro grátis'),
('Vendedor Ouro', 1000000, 'discount', 'Desconto de 20% na taxa'),
('Vendedor Platina', 5000000, 'money', 'R$ 500 + Badge Exclusivo');