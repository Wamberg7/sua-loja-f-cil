-- Create disputes/chargebacks table
CREATE TABLE public.disputes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  store_id UUID NOT NULL,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  resolution TEXT,
  evidence_urls TEXT[] DEFAULT '{}',
  amount INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create index for faster lookups
CREATE INDEX idx_disputes_store_id ON public.disputes(store_id);
CREATE INDEX idx_disputes_order_id ON public.disputes(order_id);
CREATE INDEX idx_disputes_status ON public.disputes(status);

-- Enable RLS
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their store disputes"
ON public.disputes
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM stores
  WHERE stores.id = disputes.store_id AND stores.user_id = auth.uid()
));

CREATE POLICY "Users can create disputes for their store orders"
ON public.disputes
FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM stores
  WHERE stores.id = disputes.store_id AND stores.user_id = auth.uid()
));

CREATE POLICY "Users can update their store disputes"
ON public.disputes
FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM stores
  WHERE stores.id = disputes.store_id AND stores.user_id = auth.uid()
));

CREATE POLICY "Admins can view all disputes"
ON public.disputes
FOR SELECT
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'superadmin'));

CREATE POLICY "Admins can update all disputes"
ON public.disputes
FOR UPDATE
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'superadmin'));

-- Add trigger for updated_at
CREATE TRIGGER update_disputes_updated_at
BEFORE UPDATE ON public.disputes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();