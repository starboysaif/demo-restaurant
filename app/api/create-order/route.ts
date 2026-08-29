import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customer_name, customer_phone, customer_address, total, order_type, items } = body;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({ customer_name, customer_phone, customer_address, total, order_type, status: "pending" })
      .select()
      .single();

    if (orderError) throw orderError;

    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      menu_item_id: item.id,
      item_name: item.name,
      quantity: item.qty,
      price_at_purchase: item.price,
    }));

    await supabase.from("order_items").insert(orderItems);

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
