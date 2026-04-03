import { NextRequest } from "next/server";
import {
  createCustomer,
  findCustomerByEmail,
  savePasswordHash,
} from "@/lib/nuvemshop-customers";

export async function POST(request: NextRequest) {
  try {
    console.log("=== /api/auth/register called ===");

    const body = await request.json();
    const { name, email, password } = body as {
      name?: string;
      email?: string;
      password?: string;
    };

    console.log("Body:", {
      name,
      email,
      password: password ? "[provided]" : "[missing]",
    });

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return Response.json({ error: "Nome é obrigatório" }, { status: 400 });
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return Response.json({ error: "Email inválido" }, { status: 400 });
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return Response.json(
        { error: "A senha deve ter pelo menos 6 caracteres" },
        { status: 400 },
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existing = await findCustomerByEmail(normalizedEmail);
    if (existing) {
      console.log("Customer already exists:", existing.id);
      return Response.json(
        { error: "Este email já está cadastrado" },
        { status: 409 },
      );
    }

    const customer = await createCustomer(name.trim(), normalizedEmail);
    console.log("Customer created with ID:", customer.id);

    await savePasswordHash(customer.id, password);
    console.log("Password saved for customer:", customer.id);

    return Response.json(
      { success: true, message: "Conta criada com sucesso" },
      { status: 201 },
    );
  } catch (err: any) {
    console.error("=== /api/auth/register ERROR ===");
    console.error("Message:", err?.message);
    console.error("Stack:", err?.stack);
    console.error("Full error:", JSON.stringify(err, null, 2));

    return Response.json(
      { error: "Erro interno ao criar conta", detail: err?.message },
      { status: 500 },
    );
  }
}