import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PaymentRequest {
  store_id: string;
  customer_email: string;
  customer_name: string;
  customer_phone?: string;
  items: Array<{
    product_id: string;
    product_name: string;
    quantity: number;
    unit_price: number;
  }>;
  payment_method: string;
  gateway?: string;
}

interface PaymentResponse {
  success: boolean;
  order_id?: string;
  payment_url?: string;
  qr_code?: string;
  error?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Process payment function called");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const paymentData: PaymentRequest = await req.json();
    console.log("Payment data received:", JSON.stringify(paymentData, null, 2));

    // Validate required fields
    if (!paymentData.store_id || !paymentData.customer_email || !paymentData.customer_name || !paymentData.items?.length) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Calculate total
    const total = paymentData.items.reduce(
      (sum, item) => sum + item.unit_price * item.quantity,
      0
    );

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        store_id: paymentData.store_id,
        customer_email: paymentData.customer_email,
        customer_name: paymentData.customer_name,
        customer_phone: paymentData.customer_phone,
        total,
        payment_method: paymentData.payment_method,
        status: "pending",
        payment_status: "pending",
      })
      .select()
      .single();

    if (orderError) {
      console.error("Error creating order:", orderError);
      return new Response(
        JSON.stringify({ success: false, error: "Error creating order" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Order created:", order.id);

    // Create order items
    const orderItems = paymentData.items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total: item.unit_price * item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Error creating order items:", itemsError);
      // Don't fail the whole transaction, order was created
    }

    // Create transaction record
    const { error: transactionError } = await supabase
      .from("transactions")
      .insert({
        store_id: paymentData.store_id,
        order_id: order.id,
        type: "sale",
        amount: total,
        status: "pending",
        payment_gateway: paymentData.gateway || "pix",
      });

    if (transactionError) {
      console.error("Error creating transaction:", transactionError);
    }

    // Generate PIX payment (simulated)
    // In production, integrate with actual payment gateway here
    const pixCode = `00020126580014br.gov.bcb.pix0136${crypto.randomUUID()}5204000053039865406${total.toFixed(2)}5802BR5925${paymentData.customer_name.substring(0, 25)}6009SAO PAULO62140510${order.id.substring(0, 10)}6304`;

    const response: PaymentResponse = {
      success: true,
      order_id: order.id,
      qr_code: pixCode,
      payment_url: `https://pay.digitalhub.com/checkout/${order.id}`,
    };

    console.log("Payment processed successfully:", order.id);

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error processing payment:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
